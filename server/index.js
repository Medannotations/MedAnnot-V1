/**
 * MedAnnot API Server
 * Remplace Supabase Edge Functions + héberge le frontend
 * Compatible Infomaniak VPS
 */

const express = require('express');
const { Pool } = require('pg');
const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const multer = require('multer');
const OpenAI = require('openai');
const fs = require('fs');
require('dotenv').config();
const emailService = require('./emailService');
// Initialisation
const app = express();
const port = process.env.PORT || 3000;

// Database - Configuration compatible Exoscale/Aiven DBaaS (certificat auto-signé)
const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

// OpenAI for transcription
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

// Multer configuration for file uploads - préserve l'extension
const storage = multer.diskStorage({
  destination: '/tmp/uploads/',
  filename: (req, file, cb) => {
    // Préserver l'extension pour OpenAI
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/m4a'];
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(webm|wav|mp3|m4a|mp4)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Format audio non supporté'));
    }
  }
});

// Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://*.stripe.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"],
      imgSrc: ["'self'", "data:", "https://*.stripe.com"],
    }
  }
}));

app.use(cors({
  origin: process.env.VITE_APP_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes
});
app.use(limiter);

// Body parsing (sauf pour webhooks Stripe qui ont besoin du raw body)
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use(express.json());

// Auth Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  
  try {
    // Vérifier si c'est un token Supabase ou notre propre JWT
    const decoded = jwt.decode(token);
    
    if (decoded && decoded.sub) {
      // Token Supabase ou compatible
      req.user = {
        id: decoded.sub,
        email: decoded.email
      };
      
      // Récupérer le profil depuis la DB
      const { rows } = await pool.query(
        'SELECT * FROM profiles WHERE user_id = $1',
        [decoded.sub]
      );
      
      if (rows.length > 0) {
        req.profile = rows[0];
      }
    } else {
      // Vérification JWT standard
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
    }
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ error: 'Token invalide' });
  }
};

// ============ ROUTES API ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password, fullName } = req.body;

    // Vérifier si l'email existe déjà
    const { rows: existing } = await client.query(
      'SELECT id FROM auth.users WHERE email = $1',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Transaction pour garantir la cohérence
    await client.query('BEGIN');

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const userId = require('crypto').randomUUID();
    await client.query(
      `INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), $4, NOW(), NOW())`,
      [userId, email, hashedPassword, JSON.stringify({ full_name: fullName })]
    );

    // Créer le profil (avec statut pending_payment)
    await client.query(
      `INSERT INTO profiles (id, user_id, full_name, email, subscription_status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'pending_payment', NOW(), NOW())
       ON CONFLICT (user_id) DO NOTHING`,
      [require('crypto').randomUUID(), userId, fullName, email]
    );

    // Créer la configuration par défaut
    const defaultStructure = `Date et heure de la visite:
Motif et contexte:
Observations cliniques:
- Constantes:
- Etat général:
- Examen physique:
Soins réalisés:
- Traitements administrés:
- Soins infirmiers:
Conseils et éducation:
Prochaine visite:
Signature:`;

    await client.query(
      `INSERT INTO user_configurations (id, user_id, annotation_structure, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (user_id) DO NOTHING`,
      [require('crypto').randomUUID(), userId, defaultStructure]
    );

    await client.query('COMMIT');

    // Générer token
    const token = jwt.sign(
      { sub: userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: userId, email, fullName } });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  } finally {
    client.release();
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Récupérer l'utilisateur
    const { rows } = await pool.query(
      'SELECT * FROM auth.users WHERE email = $1',
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    const user = rows[0];
    
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.encrypted_password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Récupérer le profil
    const { rows: profiles } = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [user.id]
    );
    
    const profile = profiles[0] || {};
    
    // Générer token
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: profile.full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// Stripe Checkout - Créer une session de paiement
app.post('/api/stripe-checkout', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { priceId, successUrl, cancelUrl } = req.body;

    // Récupérer ou créer le customer Stripe
    let customerId;
    const { rows } = await pool.query(
      'SELECT stripe_customer_id, email, full_name FROM profiles WHERE user_id = $1',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profil non trouvé. Veuillez rafraîchir la page et réessayer.' });
    }

    if (rows[0]?.stripe_customer_id) {
      customerId = rows[0].stripe_customer_id;
    } else {
      // Créer un nouveau customer
      const customer = await stripe.customers.create({
        email: rows[0].email,
        name: rows[0].full_name,
        metadata: { user_id: userId }
      });
      customerId = customer.id;

      // Sauvegarder dans la DB
      await pool.query(
        'UPDATE profiles SET stripe_customer_id = $1 WHERE user_id = $2',
        [customerId, userId]
      );
    }

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: userId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId || process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 7,
      },
      success_url: successUrl || `${process.env.VITE_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.VITE_APP_URL}/signup`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Cancel Subscription
app.post('/api/stripe-cancel-subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer le customer et subscription
    const { rows } = await pool.query(
      'SELECT stripe_customer_id, subscription_id FROM profiles WHERE user_id = $1',
      [userId]
    );

    const subscriptionId = rows[0]?.subscription_id;

    if (!subscriptionId) {
      return res.status(404).json({ error: 'Aucun abonnement trouvé' });
    }

    // Annuler l'abonnement à la fin de la période
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Mettre à jour la DB
    await pool.query(
      `UPDATE profiles SET
        subscription_status = 'active',
        subscription_cancel_at = to_timestamp($1),
        updated_at = NOW()
      WHERE user_id = $2`,
      [subscription.cancel_at, userId]
    );

    res.json({
      success: true,
      cancelAt: subscription.cancel_at,
      message: 'Abonnement annulé à la fin de la période actuelle'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Portal
app.post('/api/stripe-portal', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer le customer Stripe
    const { rows } = await pool.query(
      'SELECT stripe_customer_id FROM profiles WHERE user_id = $1',
      [userId]
    );
    
    const customerId = rows[0]?.stripe_customer_id;
    
    if (!customerId) {
      return res.status(404).json({ error: 'Aucun client Stripe trouvé' });
    }
    
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.VITE_APP_URL}/app/settings?portal=return`,
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Transcription Audio (OpenAI Whisper)
app.post('/api/transcribe', authenticateToken, upload.single('audio'), async (req, res) => {
  let tempFilePath = null;

  try {
    if (!openai) {
      return res.status(503).json({
        error: 'Service de transcription non disponible (OPENAI_API_KEY manquante)'
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Fichier audio manquant' });
    }

    tempFilePath = req.file.path;

    console.log('Transcribing audio file:', req.file.originalname);

    // Transcription avec Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
      language: 'fr', // Français pour le médical suisse
      response_format: 'json',
      temperature: 0.2, // Plus précis pour le médical
    });

    // Nettoyer le fichier temporaire
    fs.unlinkSync(tempFilePath);

    res.json({
      text: transcription.text,
      success: true
    });
  } catch (error) {
    console.error('Transcription error:', error);

    // Nettoyer le fichier en cas d'erreur
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    res.status(500).json({
      error: 'Erreur lors de la transcription',
      details: error.message
    });
  }
});

// Generate Annotation with AI (Anthropic Claude)
app.post('/api/generate-annotation', authenticateToken, async (req, res) => {
  try {
    const { transcription, patientName, vitalSigns, configuration } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({
        error: 'Service IA non disponible (ANTHROPIC_API_KEY manquante)'
      });
    }

    if (!transcription) {
      return res.status(400).json({ error: 'Transcription manquante' });
    }

    // Récupérer les phrases templates de l'utilisateur
    const { rows: phraseTemplates } = await pool.query(
      'SELECT category, label, content FROM phrase_templates WHERE user_id = $1 ORDER BY category, label',
      [req.user.id]
    );

    // Formater les phrases par catégorie pour le prompt
    let phrasesContext = '';
    if (phraseTemplates.length > 0) {
      const phrasesByCategory = {};
      phraseTemplates.forEach(p => {
        if (!phrasesByCategory[p.category]) phrasesByCategory[p.category] = [];
        phrasesByCategory[p.category].push(`- ${p.label}: "${p.content}"`);
      });

      phrasesContext = '\n\nPHRASES PRÉDÉFINIES À UTILISER (si approprié):\n';
      Object.entries(phrasesByCategory).forEach(([category, phrases]) => {
        phrasesContext += `${category}:\n${phrases.join('\n')}\n`;
      });
    }

    // Appel à l'API Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: `Tu es un médecin professionnel qui rédige une annotation médicale. Génère une annotation médicale complète et professionnelle en français à partir de cette transcription vocale.

RÈGLES IMPÉRATIVES:
- N'utilise AUCUN formatage markdown (pas de *, #, -, ou autres symboles)
- N'ajoute AUCUN titre ou en-tête (pas de "Annotation médicale", "Consultation", etc.)
- N'utilise AUCUN placeholder comme [À compléter], [Date], [Nom], etc.
- Commence DIRECTEMENT par le contenu médical, sans introduction
- Rédige du texte professionnel complet, comme un vrai médecin l'écrirait à la main
- Utilise uniquement du texte brut avec des retours à la ligne pour structurer
- Si une information n'est pas dans la transcription, ne mentionne pas ce champ du tout
- Sois précis, factuel et concis
- Respecte STRICTEMENT la structure fournie ci-dessous

Patient: ${patientName || 'Non spécifié'}
${vitalSigns ? `Signes vitaux: ${JSON.stringify(vitalSigns)}` : ''}

Transcription vocale: ${transcription}

${configuration ? `STRUCTURE À SUIVRE STRICTEMENT:\n${configuration}\n` : ''}
${phrasesContext}

Génère l'annotation maintenant, prête à être utilisée directement dans un dossier médical. Si des phrases prédéfinies correspondent au contexte, utilise-les pour enrichir l'annotation:`
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Anthropic API error:', error);
      return res.status(500).json({
        error: 'Erreur lors de la génération',
        details: error.error?.message || 'Erreur API'
      });
    }

    const data = await response.json();
    const annotation = data.content[0].text;

    res.json({
      annotation: annotation,
      success: true
    });
  } catch (error) {
    console.error('Generate annotation error:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération de l\'annotation',
      details: error.message
    });
  }
});

// Get Subscription (fresh data from Stripe)
app.post('/api/get-subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer le customer
    const { rows } = await pool.query(
      'SELECT stripe_customer_id FROM profiles WHERE user_id = $1',
      [userId]
    );
    
    const customerId = rows[0]?.stripe_customer_id;
    
    if (!customerId) {
      return res.json({ hasSubscription: false });
    }
    
    // Récupérer depuis Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1,
      expand: ['data.latest_invoice']
    });
    
    const subscription = subscriptions.data[0];
    
    if (!subscription) {
      return res.json({ hasSubscription: false, customerId });
    }
    
    res.json({
      hasSubscription: true,
      customerId,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at,
        endedAt: subscription.ended_at,
        planName: subscription.items.data[0]?.price?.nickname || 'Abonnement MedAnnot',
        amount: subscription.items.data[0]?.price?.unit_amount,
        currency: subscription.currency,
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify Stripe Checkout Session (appelé par le frontend après paiement)
app.post('/api/stripe/verify-session', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID manquant' });
    }

    // Récupérer la session depuis Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Vérifier que la session appartient bien à cet utilisateur
    if (session.client_reference_id !== userId) {
      return res.status(403).json({ error: 'Session non autorisée' });
    }

    // Si le paiement est complété, mettre à jour le profil
    if (session.status === 'complete') {
      await pool.query(
        `UPDATE profiles SET
          subscription_status = 'trialing',
          stripe_customer_id = COALESCE(stripe_customer_id, $1),
          subscription_id = COALESCE(subscription_id, $2),
          updated_at = NOW()
        WHERE user_id = $3 AND subscription_status = 'pending_payment'`,
        [session.customer, session.subscription, userId]
      );

      // Récupérer le profil mis à jour
      const { rows } = await pool.query(
        'SELECT * FROM profiles WHERE user_id = $1',
        [userId]
      );

      return res.json({ verified: true, profile: rows[0] });
    }

    res.json({ verified: false, status: session.status });
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification' });
  }
});

// Stripe Webhook
app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    console.log('Webhook received:', event.type);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        // Mettre à jour le profil
        await pool.query(
          `UPDATE profiles SET
            subscription_status = 'trialing',
            stripe_customer_id = $1,
            subscription_id = $2,
            updated_at = NOW()
          WHERE user_id = $3`,
          [session.customer, session.subscription, session.client_reference_id]
        );

        // Récupérer les infos du profil pour envoyer l'email de bienvenue
        const { rows } = await pool.query(
          'SELECT email, full_name FROM profiles WHERE user_id = $1',
          [session.client_reference_id]
        );

        if (rows.length > 0) {
          // Envoyer l'email de bienvenue maintenant que le paiement est confirmé
          emailService.sendWelcomeEmail(rows[0].email, rows[0].full_name).catch(err => {
            console.error('Erreur envoi email de bienvenue:', err);
          });
        }

        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        await pool.query(
          `UPDATE profiles SET 
            subscription_status = $1,
            subscription_current_period_end = to_timestamp($2),
            updated_at = NOW()
          WHERE stripe_customer_id = $3`,
          [subscription.status, subscription.current_period_end, subscription.customer]
        );
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        await pool.query(
          `UPDATE profiles SET 
            subscription_status = 'past_due',
            updated_at = NOW()
          WHERE stripe_customer_id = $1`,
          [invoice.customer]
        );
        break;
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Patients API
app.get('/api/patients', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM patients WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/patients', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, email, phone, notes } = req.body;
    
    const { rows } = await pool.query(
      `INSERT INTO patients (user_id, first_name, last_name, date_of_birth, email, phone, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [req.user.id, firstName, lastName, dateOfBirth, email, phone, notes]
    );
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/patients/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log('[PATCH /patients/:id] Received:', { id, updates, userId: req.user.id });

    // Construire la requête dynamiquement en fonction des champs fournis
    const allowedFields = ['first_name', 'last_name', 'date_of_birth', 'email', 'phone', 'address', 'city', 'postal_code', 'country', 'notes', 'medical_history', 'allergies', 'current_medications', 'emergency_contact_name', 'emergency_contact_phone', 'insurance_provider', 'insurance_number', 'is_archived'];
    const setClauses = [];
    const values = [];
    let paramCount = 1;

    // Mapper les champs camelCase vers snake_case si nécessaire
    const fieldMap = {
      firstName: 'first_name',
      lastName: 'last_name',
      dateOfBirth: 'date_of_birth',
      isArchived: 'is_archived',
      postalCode: 'postal_code',
      medicalHistory: 'medical_history',
      currentMedications: 'current_medications',
      emergencyContactName: 'emergency_contact_name',
      emergencyContactPhone: 'emergency_contact_phone',
      insuranceProvider: 'insurance_provider',
      insuranceNumber: 'insurance_number'
    };

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMap[key] || key;
      if (allowedFields.includes(dbField)) {
        setClauses.push(`${dbField} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'Aucun champ valide à mettre à jour' });
    }

    values.push(id);
    values.push(req.user.id);

    const { rows } = await pool.query(
      `UPDATE patients
       SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
       RETURNING *`,
      values
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/patients/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Supprimer d'abord les annotations liées
    await pool.query(
      'DELETE FROM annotations WHERE patient_id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    // Puis supprimer le patient
    const { rows } = await pool.query(
      'DELETE FROM patients WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    res.json({ success: true, deletedPatient: rows[0] });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Annotations API
app.get('/api/annotations', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.*, p.first_name as patient_first_name, p.last_name as patient_last_name
       FROM annotations a
       LEFT JOIN patients p ON a.patient_id = p.id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );

    // Transform to match frontend expectations
    const annotations = rows.map(row => {
      const { patient_first_name, patient_last_name, ...annotation } = row;

      // Add nested patients object if patient data exists
      if (patient_first_name || patient_last_name) {
        annotation.patients = {
          first_name: patient_first_name,
          last_name: patient_last_name,
          pathologies: null
        };
      }

      return annotation;
    });

    res.json(annotations);
  } catch (error) {
    console.error('Get annotations error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/annotations', authenticateToken, async (req, res) => {
  try {
    const { patientId, content, type, visit_date, visit_time, visit_duration } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO annotations (user_id, patient_id, content, type, visit_date, visit_time, visit_duration, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [req.user.id, patientId, content, type, visit_date, visit_time, visit_duration]
    );

    const annotation = rows[0];

    // Fetch patient data if patientId exists
    if (patientId) {
      const patientResult = await pool.query(
        'SELECT first_name, last_name FROM patients WHERE id = $1',
        [patientId]
      );

      if (patientResult.rows.length > 0) {
        annotation.patients = {
          first_name: patientResult.rows[0].first_name,
          last_name: patientResult.rows[0].last_name,
          pathologies: null
        };
      }
    }

    res.json(annotation);
  } catch (error) {
    console.error('Create annotation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/annotations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Construire la requête UPDATE dynamiquement
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.content !== undefined) {
      fields.push(`content = $${paramCount++}`);
      values.push(updates.content);
    }
    if (updates.patient_id !== undefined) {
      fields.push(`patient_id = $${paramCount++}`);
      values.push(updates.patient_id);
    }
    if (updates.visit_date !== undefined) {
      fields.push(`visit_date = $${paramCount++}`);
      values.push(updates.visit_date);
    }
    if (updates.visit_time !== undefined) {
      fields.push(`visit_time = $${paramCount++}`);
      values.push(updates.visit_time);
    }
    if (updates.visit_duration !== undefined) {
      fields.push(`visit_duration = $${paramCount++}`);
      values.push(updates.visit_duration);
    }
    if (updates.vital_signs !== undefined) {
      fields.push(`vital_signs = $${paramCount++}`);
      values.push(JSON.stringify(updates.vital_signs));
    }
    if (updates.transcription !== undefined) {
      fields.push(`transcription = $${paramCount++}`);
      values.push(updates.transcription);
    }
    if (updates.was_content_edited !== undefined) {
      fields.push(`was_content_edited = $${paramCount++}`);
      values.push(updates.was_content_edited);
    }
    if (updates.is_archived !== undefined) {
      fields.push(`is_archived = $${paramCount++}`);
      values.push(updates.is_archived);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Aucune mise à jour fournie' });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id, req.user.id);

    const { rows } = await pool.query(
      `UPDATE annotations SET ${fields.join(', ')}
       WHERE id = $${paramCount++} AND user_id = $${paramCount++}
       RETURNING *`,
      values
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Annotation non trouvée' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Update annotation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/annotations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'DELETE FROM annotations WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Annotation non trouvée' });
    }

    res.json({ success: true, deletedAnnotation: rows[0] });
  } catch (error) {
    console.error('Delete annotation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Profile API
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    console.log('[GET /profile] User ID:', req.user.id);
    const { rows } = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [req.user.id]
    );

    if (rows.length === 0) {
      console.error('[GET /profile] Profile not found for user:', req.user.id);
      return res.status(404).json({ error: 'Profil non trouvé' });
    }

    console.log('[GET /profile] Success for user:', req.user.id);
    res.json(rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName } = req.body;
    
    const { rows } = await pool.query(
      `UPDATE profiles SET full_name = $1, updated_at = NOW()
       WHERE user_id = $2
       RETURNING *`,
      [fullName, req.user.id]
    );
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ CONFIGURATIONS ============
app.get('/api/configurations', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM user_configurations WHERE user_id = $1',
      [req.user.id]
    );
    res.json(rows.length > 0 ? rows[0] : null);
  } catch (error) {
    console.error('Get configuration error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/configurations', authenticateToken, async (req, res) => {
  try {
    const { annotationStructure } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO user_configurations (user_id, annotation_structure, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       ON CONFLICT (user_id) DO UPDATE
       SET annotation_structure = $2, updated_at = NOW()
       RETURNING *`,
      [req.user.id, annotationStructure]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Upsert configuration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ EXAMPLE ANNOTATIONS ============
app.get('/api/example-annotations', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM example_annotations WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get example annotations error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/example-annotations', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO example_annotations (user_id, title, content, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [req.user.id, title, content]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Create example annotation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/example-annotations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const { rows } = await pool.query(
      `UPDATE example_annotations SET title = $1, content = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, content, id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Example not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Update example annotation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/example-annotations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'DELETE FROM example_annotations WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Delete example annotation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ PHRASE TEMPLATES ============
app.get('/api/phrase-templates', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM phrase_templates WHERE user_id = $1 ORDER BY category, label',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get phrase templates error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/phrase-templates', authenticateToken, async (req, res) => {
  try {
    const { category, label, content, shortcut } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO phrase_templates (user_id, category, label, content, shortcut, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [req.user.id, category, label, content, shortcut || null]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Create phrase template error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/phrase-templates/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, label, content, shortcut } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (category !== undefined) {
      updates.push(`category = $${paramCount++}`);
      values.push(category);
    }
    if (label !== undefined) {
      updates.push(`label = $${paramCount++}`);
      values.push(label);
    }
    if (content !== undefined) {
      updates.push(`content = $${paramCount++}`);
      values.push(content);
    }
    if (shortcut !== undefined) {
      updates.push(`shortcut = $${paramCount++}`);
      values.push(shortcut);
    }

    values.push(id, req.user.id);

    const { rows } = await pool.query(
      `UPDATE phrase_templates SET ${updates.join(', ')}
       WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
       RETURNING *`,
      values
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Update phrase template error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/phrase-templates/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'DELETE FROM phrase_templates WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Delete phrase template error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ PATIENT TAGS ============
app.get('/api/patient-tags', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM patient_tags WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get patient tags error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/patient-tags', authenticateToken, async (req, res) => {
  try {
    const { name, color } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO patient_tags (user_id, name, color, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [req.user.id, name, color]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Create patient tag error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/patient-tags/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'DELETE FROM patient_tags WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Delete patient tag error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Servir le frontend (React build)
// Supporte à la fois Docker (./dist) et dev local (../dist)
const distPath = fs.existsSync(path.join(__dirname, './dist'))
  ? path.join(__dirname, './dist')
  : path.join(__dirname, '../dist');

app.use(express.static(distPath));


// ============================================
// PASSWORD RESET ENDPOINTS
// ============================================

// Demande de réinitialisation de mot de passe
app.post('/api/auth/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier si l'utilisateur existe
    const { rows: users } = await pool.query(
      'SELECT u.id, u.email, p.full_name FROM auth.users u JOIN profiles p ON u.id = p.user_id WHERE u.email = $1',
      [email]
    );

    // Toujours retourner succès (pour ne pas révéler si l'email existe)
    if (users.length === 0) {
      return res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé' });
    }

    const user = users[0];

    // Générer un token sécurisé
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    // Stocker le token
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, resetToken, expiresAt]
    );

    // Envoyer l'email
    await emailService.sendPasswordResetEmail(user.email, user.full_name, resetToken);

    res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé' });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation' });
  }
});

// Valider le token de réinitialisation
app.post('/api/auth/validate-reset-token', async (req, res) => {
  try {
    const { token } = req.body;

    const { rows } = await pool.query(
      `SELECT t.*, u.email, p.full_name
       FROM password_reset_tokens t
       JOIN auth.users u ON t.user_id = u.id
       JOIN profiles p ON u.id = p.user_id
       WHERE t.token = $1 AND t.used = FALSE AND t.expires_at > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    res.json({ valid: true, email: rows[0].email });
  } catch (error) {
    console.error('Validate reset token error:', error);
    res.status(500).json({ error: 'Erreur lors de la validation du token' });
  }
});

// Réinitialiser le mot de passe avec token
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Vérifier le token
    const { rows } = await pool.query(
      `SELECT t.*, u.id as user_id, u.email, p.full_name
       FROM password_reset_tokens t
       JOIN auth.users u ON t.user_id = u.id
       JOIN profiles p ON u.id = p.user_id
       WHERE t.token = $1 AND t.used = FALSE AND t.expires_at > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    const tokenData = rows[0];

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await pool.query(
      'UPDATE auth.users SET encrypted_password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, tokenData.user_id]
    );

    // Marquer le token comme utilisé
    await pool.query(
      'UPDATE password_reset_tokens SET used = TRUE WHERE id = $1',
      [tokenData.id]
    );

    // Envoyer email de confirmation
    await emailService.sendPasswordChangedEmail(tokenData.email, tokenData.full_name);

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' });
  }
});

// Changer le mot de passe (depuis settings, nécessite authentification)
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Vérifier le mot de passe actuel
    const { rows: users } = await pool.query(
      `SELECT u.*, p.full_name
       FROM auth.users u
       JOIN profiles p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = users[0];

    // Vérifier le mot de passe actuel
    const validPassword = await bcrypt.compare(currentPassword, user.encrypted_password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await pool.query(
      'UPDATE auth.users SET encrypted_password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    // Envoyer email de confirmation
    await emailService.sendPasswordChangedEmail(user.email, user.full_name);

    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Erreur lors du changement de mot de passe' });
  }
});

// ============ VITAL SIGNS ============
// Récupérer les signes vitaux d'un patient pour une date
app.get('/api/vital-signs/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { date } = req.query;

    const { rows } = await pool.query(
      `SELECT vital_signs FROM annotations
       WHERE user_id = $1 AND patient_id = $2 AND visit_date = $3 AND vital_signs IS NOT NULL
       ORDER BY created_at DESC LIMIT 1`,
      [req.user.id, patientId, date]
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    res.json(rows[0].vital_signs);
  } catch (error) {
    console.error('Get vital signs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Sauvegarder les signes vitaux pour un patient
app.post('/api/vital-signs', authenticateToken, async (req, res) => {
  try {
    const { patientId, date, vitalSigns } = req.body;

    // Vérifier si une annotation existe déjà pour cette date
    const { rows: existing } = await pool.query(
      `SELECT id FROM annotations
       WHERE user_id = $1 AND patient_id = $2 AND visit_date = $3`,
      [req.user.id, patientId, date]
    );

    if (existing.length > 0) {
      // Mettre à jour l'annotation existante
      const { rows } = await pool.query(
        `UPDATE annotations SET vital_signs = $1, updated_at = NOW()
         WHERE id = $2 AND user_id = $3
         RETURNING *`,
        [JSON.stringify(vitalSigns), existing[0].id, req.user.id]
      );
      res.json(rows[0]);
    } else {
      // Créer une nouvelle annotation avec seulement les signes vitaux
      const { rows } = await pool.query(
        `INSERT INTO annotations (user_id, patient_id, visit_date, vital_signs, content, created_at, updated_at)
         VALUES ($1, $2, $3, $4, '', NOW(), NOW())
         RETURNING *`,
        [req.user.id, patientId, date, JSON.stringify(vitalSigns)]
      );
      res.json(rows[0]);
    }
  } catch (error) {
    console.error('Save vital signs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Récupérer l'historique des signes vitaux d'un patient
app.get('/api/vital-signs/:patientId/history', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;

    const { rows } = await pool.query(
      `SELECT visit_date as date, vital_signs, visit_time
       FROM annotations
       WHERE user_id = $1 AND patient_id = $2 AND vital_signs IS NOT NULL
       ORDER BY visit_date DESC, visit_time DESC
       LIMIT 30`,
      [req.user.id, patientId]
    );

    res.json(rows.map(row => ({
      date: row.date,
      time: row.visit_time,
      ...row.vital_signs
    })));
  } catch (error) {
    console.error('Get vital signs history error:', error);
    res.status(500).json({ error: error.message });
  }
});


// Fallback pour SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// Démarrage
app.listen(port, () => {
  console.log(`🚀 MedAnnot API server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
});

module.exports = app;
