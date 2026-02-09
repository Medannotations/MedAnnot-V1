# 🚀 Guide Complet : Migration MedAnnot vers Infomaniak

## 📋 Vue d'ensemble

Ce guide te permettra de migrer ton SaaS MedAnnot de Vercel/Supabase vers Infomaniak avec :
- **VPS Cloud** pour l'hébergement
- **PostgreSQL** pour la base de données
- **Nom de domaine** medannot.ch
- **SSL** Let's Encrypt
- **Toutes les fonctionnalités** opérationnelles

---

## 🛒 ÉTAPE 1 : Commander chez Infomaniak

### 1.1 VPS Cloud (Serveur)
**Produit recommandé :** VPS Cloud - Ubuntu 22.04 LTS

**Configuration minimale pour lancement :**
```
CPU: 2 vCores
RAM: 4 GB
SSD: 50 GB
Localisation: Genève (CH)
Backup: Activer (quotidien)
```

**Prix estimé :** ~15-20 CHF/mois

**Commande :** https://www.infomaniak.com/fr/hebergement/vps-cloud

### 1.2 Base de données PostgreSQL
**Option A :** Serveur Cloud PostgreSQL (recommandé)
- Version : PostgreSQL 15
- Configuration : 1 vCore, 2 GB RAM, 20 GB SSD
- Prix : ~10 CHF/mois

**Option B :** PostgreSQL sur le VPS (économique)
- Installer PostgreSQL directement sur le VPS
- Gratuit mais moins performant

**Commande :** https://www.infomaniak.com/fr/hebergement/serveur-cloud

### 1.3 Domaine (déjà possédé)
Tu as déjà medannot.ch

---

## 🔧 ÉTAPE 2 : Configuration Initiale VPS

### 2.1 Connexion SSH
```bash
# Une fois le VPS créé, Infomaniak t'envoie les identifiants
ssh root@<ip-du-vps>
```

### 2.2 Mise à jour du système
```bash
apt update && apt upgrade -y
```

### 2.3 Création utilisateur dédié
```bash
adduser medannot
usermod -aG sudo medannot
su - medannot
```

### 2.4 Installation des dépendances
```bash
# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx
sudo apt install -y nginx

# PM2 (gestion processus Node.js)
sudo npm install -g pm2

# Git
sudo apt install -y git

# Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

---

## 🐘 ÉTAPE 3 : Configuration PostgreSQL

### 3.1 Si tu as pris l'Option A (Serveur Cloud DB)
Infomaniak te fournit :
- Host : `xxxxx.postgresql.infomaniak.ch`
- Port : `5432`
- Database : `medannot`
- Username : `medannot_user`
- Password : `********`

**Test de connexion :**
```bash
psql "postgresql://medannot_user:password@xxxxx.postgresql.infomaniak.ch:5432/medannot"
```

### 3.2 Si tu as pris l'Option B (PostgreSQL sur VPS)
```bash
# Installation
sudo apt install -y postgresql postgresql-contrib

# Configuration
sudo -u postgres psql -c "CREATE DATABASE medannot;"
sudo -u postgres psql -c "CREATE USER medannot_user WITH PASSWORD 'ton_mot_de_passe_fort';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE medannot TO medannot_user;"

# Autoriser les connexions externes (si besoin)
sudo nano /etc/postgresql/15/main/postgresql.conf
# Décommenter : listen_addresses = '*'

sudo nano /etc/postgresql/15/main/pg_hba.conf
# Ajouter : host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

---

## 📦 ÉTAPE 4 : Déploiement de l'Application

### 4.1 Cloner le repository
```bash
cd /var/www
sudo mkdir medannot
sudo chown medannot:medannot medannot
cd medannot
git clone https://github.com/Medannotations/MedAnnot-V1.git .
```

### 4.2 Configuration environnement
```bash
cp .env.example .env
nano .env
```

**Contenu du .env :**
```env
# Database (Infomaniak PostgreSQL)
DATABASE_URL=postgresql://medannot_user:password@host.infomaniak.ch:5432/medannot
PGHOST=host.infomaniak.ch
PGPORT=5432
PGDATABASE=medannot
PGUSER=medannot_user
PGPASSWORD=your-password

# Application
VITE_APP_URL=https://medannot.ch
NODE_ENV=production
PORT=3000

# Supabase (on garde pour l'auth ou on migre vers auth maison)
# Option 1: Garder Supabase Auth (cloud)
VITE_SUPABASE_URL=https://vbaaohcsmiaxbqcyfhhl.supabase.co
VITE_SUPABASE_ANON_KEY=ton-anon-key
SUPABASE_SERVICE_ROLE_KEY=ton-service-key

# Option 2: Auth maison (recommandé pour la souveraineté)
# JWT_SECRET=super-secret-key-min-32-chars

# Stripe (déjà configuré)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Infomaniak Mail)
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_USER=noreply@medannot.ch
SMTP_PASS=ton-mot-de-passe-email
SMTP_FROM="MedAnnot <noreply@medannot.ch>"
```

### 4.3 Installation et build
```bash
# Installation dépendances
npm ci

# Build production
npm run build

# Les fichiers statiques sont dans ./dist
```

### 4.4 Migration des Edge Functions → API Node.js

Les Edge Functions Supabase doivent être migrées en routes Express.

**Création du serveur API :**

Créer `server.js` à la racine :

```javascript
const express = require('express');
const { Pool } = require('pg');
const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Frontend

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes
app.post('/api/stripe-portal', authenticateToken, async (req, res) => {
  // Migration de supabase/functions/stripe-portal
  try {
    const userId = req.user.sub;
    
    // Récupérer le customer Stripe depuis la DB
    const { rows } = await pool.query(
      'SELECT stripe_customer_id FROM profiles WHERE user_id = $1',
      [userId]
    );
    
    if (!rows[0]?.stripe_customer_id) {
      return res.status(404).json({ error: 'No Stripe customer found' });
    }
    
    const session = await stripe.billingPortal.sessions.create({
      customer: rows[0].stripe_customer_id,
      return_url: `${process.env.VITE_APP_URL}/app/settings`,
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/get-subscription', authenticateToken, async (req, res) => {
  // Migration de supabase/functions/get-subscription
  try {
    const userId = req.user.sub;
    
    const { rows } = await pool.query(
      'SELECT stripe_customer_id FROM profiles WHERE user_id = $1',
      [userId]
    );
    
    if (!rows[0]?.stripe_customer_id) {
      return res.json({ hasSubscription: false });
    }
    
    const subscriptions = await stripe.subscriptions.list({
      customer: rows[0].stripe_customer_id,
      limit: 1,
    });
    
    if (!subscriptions.data[0]) {
      return res.json({ hasSubscription: false });
    }
    
    const sub = subscriptions.data[0];
    res.json({
      hasSubscription: true,
      subscription: {
        status: sub.status,
        currentPeriodEnd: sub.current_period_end,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      }
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  // Migration de supabase/functions/stripe-webhook
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Gérer les événements
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await pool.query(
          `UPDATE profiles SET 
            subscription_status = $1,
            subscription_current_period_end = to_timestamp($2)
          WHERE stripe_customer_id = $3`,
          [subscription.status, subscription.current_period_end, subscription.customer]
        );
        break;
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Fallback pour SPA (React Router)
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Installation des dépendances serveur :**
```bash
npm install express pg stripe jsonwebtoken cors dotenv
```

**Démarrage avec PM2 :**
```bash
pm2 start server.js --name "medannot-api"
pm2 startup
pm2 save
```

---

## 🌐 ÉTAPE 5 : Configuration Nginx + SSL

### 5.1 Configuration Nginx
```bash
sudo nano /etc/nginx/sites-available/medannot
```

**Contenu :**
```nginx
server {
    listen 80;
    server_name medannot.ch www.medannot.ch;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/medannot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5.2 SSL Let's Encrypt
```bash
sudo certbot --nginx -d medannot.ch -d www.medannot.ch

# Renouvellement auto
sudo systemctl enable certbot.timer
```

---

## 🔄 ÉTAPE 6 : Migration des Données

### 6.1 Export depuis Supabase
**Option 1 :** Via l'interface Supabase Dashboard
- Aller dans Database → Backup
- Télécharger le dump SQL

**Option 2 :** Via pg_dump
```bash
# Sur ton ordinateur local
pg_dump "postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres" \
  --schema-only > schema.sql
  
pg_dump "postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres" \
  --data-only --table=profiles --table=patients --table=annotations > data.sql
```

### 6.2 Import dans Infomaniak
```bash
# Sur le VPS
psql "postgresql://user:pass@host.infomaniak.ch:5432/medannot" < schema.sql
psql "postgresql://user:pass@host.infomaniak.ch:5432/medannot" < data.sql
```

---

## 🧪 ÉTAPE 7 : Tests Post-Migration

### 7.1 Tests fonctionnels
- [ ] Page d'accueil accessible sur https://medannot.ch
- [ ] Inscription utilisateur
- [ ] Connexion
- [ ] Création d'un patient
- [ ] Création d'une annotation
- [ ] Dictée vocale (si applicable)

### 7.2 Tests Stripe
- [ ] Paiement test (mode test d'abord !)
- [ ] Webhook reçu (vérifier dans les logs)
- [ ] Portail client accessible
- [ ] Résiliation / Réactivation

### 7.3 Vérifier les logs
```bash
# Logs application
pm2 logs medannot-api

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔒 ÉTAPE 8 : Sécurité & Monitoring

### 8.1 Firewall
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 8.2 Fail2ban
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 8.3 Monitoring (optionnel)
```bash
# Installation Uptime Kuma (monitoring)
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

---

## 📧 ÉTAPE 9 : Mise à jour Stripe & DNS

### 9.1 Mettre à jour les webhooks Stripe
Aller dans Stripe Dashboard → Developers → Webhooks

**Ancienne URL :** `https://xxxx.supabase.co/functions/v1/stripe-webhook`
**Nouvelle URL :** `https://medannot.ch/api/webhooks/stripe`

### 9.2 DNS (si pas déjà fait)
Dans Infomaniak Manager :
- Type A : `@` → IP du VPS
- Type A : `www` → IP du VPS
- Type A : `api` → IP du VPS (si sous-domaine API)

---

## ✅ CHECKLIST FINALE

Avant de couper Vercel/Supabase :

- [ ] Toutes les fonctionnalités testées
- [ ] Données migrées et vérifiées
- [ ] Backups automatiques configurés
- [ ] SSL fonctionnel
- [ ] Emails configurés et testés
- [ ] Webhooks Stripe mis à jour
- [ ] DNS propagé (24-48h)
- [ ] Documentation équipe à jour

---

## 💰 COÛT MENSUEL ESTIMÉ (Infomaniak)

| Service | Prix |
|---------|------|
| VPS Cloud 2vCPU/4GB | ~15 CHF |
| PostgreSQL Cloud | ~10 CHF |
| Domaine medannot.ch | ~1 CHF/mois (15 CHF/an) |
| **Total** | **~26 CHF/mois** |

Compare à Vercel Pro + Supabase :
- Vercel Pro : 20$ + bande passante
- Supabase Pro : 25$
- **Total ~45-50$** → **Économie ~50%** + souveraineté des données 🇨🇭

---

## 🆘 Support

Si tu bloques :
1. Vérifier les logs : `pm2 logs` et `sudo tail -f /var/log/nginx/error.log`
2. Documentation Infomaniak : https://www.infomaniak.com/fr/support
3. Redisponible ici pour t'aider sur chaque étape !

---

**Prochaine action requise :** 
1. Confirme tes produits Infomaniak commandés
2. Je te génère les scripts de déploiement automatique
3. On fait la migration ensemble étape par étape
