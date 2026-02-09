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
require('dotenv').config();

// Initialisation
const app = express();
const port = process.env.PORT || 3000;

// Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
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
  try {
    const { email, password, fullName } = req.body;
    
    // Vérifier si l'email existe déjà
    const { rows: existing } = await pool.query(
      'SELECT * FROM auth.users WHERE email = $1',
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur
    const userId = require('crypto').randomUUID();
    await pool.query(
      `INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW(), NOW())`,
      [userId, email, hashedPassword]
    );
    
    // Créer le profil
    await pool.query(
      `INSERT INTO profiles (user_id, full_name, email, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [userId, fullName, email]
    );
    
    // Générer token
    const token = jwt.sign(
      { sub: userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token, user: { id: userId, email, fullName } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
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
            subscription_status = 'active',
            stripe_customer_id = $1,
            subscription_id = $2,
            updated_at = NOW()
          WHERE user_id = $3`,
          [session.customer, session.subscription, session.client_reference_id]
        );
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
    res.json(rows);
  } catch (error) {
    console.error('Get annotations error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/annotations', authenticateToken, async (req, res) => {
  try {
    const { patientId, content, type } = req.body;
    
    const { rows } = await pool.query(
      `INSERT INTO annotations (user_id, patient_id, content, type, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [req.user.id, patientId, content, type]
    );
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Create annotation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Profile API
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profil non trouvé' });
    }
    
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

// Servir le frontend (React build)
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback pour SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
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
