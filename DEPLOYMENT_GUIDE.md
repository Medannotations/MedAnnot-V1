# 🚀 Guide de Déploiement - Medannot

## 📋 Table des matières

1. [Configuration Supabase](#-configuration-supabase)
2. [Configuration Stripe](#-configuration-stripe)
3. [Variables d'environnement](#-variables-denvironnement)
4. [Déploiement Edge Functions](#-déploiement-des-edge-functions)
5. [Tests locaux](#-tests-locaux)
6. [Déploiement Frontend](#-déploiement-frontend)
7. [Checklist finale](#-checklist-finale)

---

## 🗄️ Configuration Supabase

### 1. Préparer la base de données

Allez dans **Supabase Dashboard > SQL Editor** et exécutez ce script :

```sql
-- Ajouter les colonnes de paiement à la table users
-- Ces colonnes stockent les informations d'abonnement de chaque utilisateur

ALTER TABLE users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP WITH TIME ZONE;

-- Créer un index pour trouver rapidement un utilisateur par son ID client Stripe
CREATE INDEX IF NOT EXISTS users_stripe_customer_id_idx
ON users(stripe_customer_id);
```

**Explication de chaque colonne :**

- **`stripe_customer_id`** : L'identifiant unique du client dans Stripe. Exemple : `cus_12345...`. C'est la clé qui relie Stripe à votre base de données.
- **`subscription_status`** : L'état actuel de l'abonnement. Peut être : `'none'` (pas d'abonnement), `'active'` (abonnement actif), `'past_due'` (paiement en retard), `'canceled'` (annulé).
- **`subscription_current_period_end`** : La date d'expiration de l'abonnement actuel. Utilisée pour vérifier si l'accès doit être maintenu.

### 2. Obtenir vos identifiants Supabase

1. Allez dans **Supabase Dashboard > Project Settings > API**
2. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Allez dans **Settings > Secrets** pour plus tard

---

## 💳 Configuration Stripe

### Étape 1 : Créer un compte Stripe

1. Allez sur [stripe.com](https://stripe.com)
2. Créez un compte ou connectez-vous
3. Activez le **mode test** (vous verrez un bouton en haut du dashboard)

### Étape 2 : Créer un produit

1. Allez dans **Products > Add product**
2. Remplissez :
   - **Name** : `Medannot - Subscription`
   - **Description** : `Abonnement pour utiliser Medannot`
   - **Pricing model** : `Standard pricing`
   - Cliquez **Save product**

### Étape 3 : Créer les prix

**Créer le prix mensuel :**

1. Cliquez **Add price** sur votre produit
2. Remplissez :
   - **Price** : `189` (ou votre prix)
   - **Billing period** : `Monthly`
   - **Currency** : `CHF`
   - Scroll down et cochez **Enable trial period** : `7 days`
3. Cliquez **Save** et copiez l'ID du prix (commence par `price_`)
   - Mettez-le dans `.env` : `VITE_STRIPE_PRICE_ID_MONTHLY=price_...`

**Créer le prix annuel :**

1. Cliquez **Add price** à nouveau
2. Remplissez :
   - **Price** : `1890` (ou votre prix annuel)
   - **Billing period** : `Yearly`
   - **Currency** : `CHF`
   - Scroll down et cochez **Enable trial period** : `7 days`
3. Cliquez **Save** et copiez l'ID
   - Mettez-le dans `.env` : `VITE_STRIPE_PRICE_ID_YEARLY=price_...`

### Étape 4 : Obtenir vos clés API Stripe

1. Allez dans **Developers > API keys**
2. Vous verrez deux clés :

   **Publishable key** (commence par `pk_test_...`)
   - Mettez-la dans `.env` : `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
   - Cette clé est **PUBLIQUE**, pas de souci si elle est visible

   **Secret key** (commence par `sk_test_...`)
   - Vous la mettrez dans Supabase Secrets plus tard
   - Cette clé est **PRIVÉE**, ne jamais la partager

### Étape 5 : Configurer le webhook Stripe

Un webhook est un moyen pour Stripe de notifier votre application quand quelque chose se passe (paiement réussi, abonnement annulé, etc.).

1. Dans **Developers > Webhooks**, cliquez **Add endpoint**
2. Remplissez :
   - **Endpoint URL** : `https://votre-projet.supabase.co/functions/v1/stripe-webhook`
     - Remplacez `votre-projet` par votre vrai projet Supabase
   
3. Sous **Events**, sélectionnez :
   - `checkout.session.completed` (le client a payé)
   - `customer.subscription.updated` (l'abonnement a changé)
   - `customer.subscription.deleted` (l'abonnement a été annulé)
   - `invoice.payment_failed` (le paiement a échoué)

4. Cliquez **Add endpoint**

5. Cliquez sur l'endpoint que vous venez de créer
6. Scroll down et copiez le **Signing Secret** (commence par `whsec_`)
   - Vous la mettrez dans Supabase Secrets

### Étape 6 : Configurer le Customer Portal

Le Customer Portal permet aux clients de gérer leur abonnement (changer le plan, annuler, mettre à jour le paiement).

1. Allez dans **Settings > Billing > Customer portal**
2. Activez-le et configurez :
   - ✅ **Allow customers to update their payment methods**
   - ✅ **Allow customers to cancel subscriptions**
   - ✅ **Allow customers to switch plans**
3. Cliquez **Save**

---

## 🔐 Variables d'environnement

Créez un fichier `.env` à la racine de votre projet (au même niveau que `package.json`) :

```env
# ========================================
# SUPABASE (clés publiques - sûr en frontend)
# ========================================
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# ========================================
# STRIPE (clés publiques - sûr en frontend)
# ========================================
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_ID_MONTHLY=price_...
VITE_STRIPE_PRICE_ID_YEARLY=price_...
```

**⚠️ Important :**
- Ne mettez JAMAIS de clés secrètes (`sk_...` ou service role keys) dans `.env`
- Ajoutez `.env` à `.gitignore` pour ne pas le committer sur GitHub

---

## ⚙️ Déploiement des Edge Functions

Les Edge Functions sont des fonctions qui s'exécutent sur les serveurs Supabase. Elles gèrent les webhooks Stripe et autres opérations sensibles.

### Prérequis

Installez Supabase CLI :

```bash
npm install -g supabase
```

### Connexion

```bash
# Se connecter à Supabase
supabase login

# Lier le projet local au projet cloud
supabase link --project-ref votre-projet-id
```

Pour trouver `votre-projet-id`, allez dans **Supabase Dashboard > Project Settings** et copiez le Project ID.

### Configurer les secrets

Ces secrets sont les clés secrètes qui permettent aux Edge Functions de communiquer avec Stripe et Supabase :

```bash
# Stripe Secret Key
supabase secrets set STRIPE_SECRET_KEY=sk_test_...

# Stripe Webhook Secret
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Service Role (pour accéder à la base de données)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

Pour trouver **SUPABASE_SERVICE_ROLE_KEY** :
1. Allez dans **Supabase Dashboard > Project Settings > API**
2. Copiez **Service Role Secret** (très long, commence par `eyJ...`)

### Déployer les Edge Functions

```bash
# Déployer la fonction de transcription
supabase functions deploy transcribe

# Déployer la fonction de génération d'annotations
supabase functions deploy generate-annotation

# Déployer les fonctions Stripe
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook
supabase functions deploy stripe-portal
```

---

## 🧪 Tests locaux

### 1. Tester la connexion à Supabase

Vérifiez que votre application peut se connecter à Supabase :

```bash
# Démarrer le serveur de développement
npm run dev
```

Allez sur `http://localhost:5173` et essayez de vous inscrire. Si ça fonctionne, Supabase est bien configuré.

### 2. Tester le paiement avec Stripe

Stripe fournit des **numéros de carte de test** :

**Carte qui réussit :**
- Numéro : `4242 4242 4242 4242`
- Date : N'importe quelle date future (ex : `12/25`)
- CVC : N'importe quel 3 chiffres (ex : `123`)

**Test complet du flux de paiement :**

1. Allez sur la landing page et cliquez **"Essayer gratuitement"**
2. Choisissez un plan (mensuel ou annuel)
3. Cliquez le bouton de paiement
4. Vous êtes redirigé vers Stripe Checkout
5. Entrez les infos de la carte de test
6. Validez le paiement
7. Vous êtes redirigé vers `/subscription/success`
8. Allez dans **Supabase Dashboard > Table Editor > users** et vérifiez que votre utilisateur a maintenant :
   - `stripe_customer_id` : rempli
   - `subscription_status` : `'active'`
   - `subscription_current_period_end` : une date dans 7 jours + 1 mois/an

### 3. Vérifier les webhooks

Dans **Stripe Dashboard > Developers > Webhooks** :
- Cliquez sur votre endpoint
- Vous devriez voir des événements avec un statut **200** (succès)
- Si vous voyez des erreurs, regardez les **logs** en cliquant sur l'événement

**Pour déboguer les logs Supabase :**

```bash
supabase functions logs stripe-webhook
```

---

## 🌐 Déploiement Frontend

### Option 1 : Vercel (Recommandé pour Next.js/Vite)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### Option 2 : Netlify

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy --prod
```

### Option 3 : GitHub Pages (basique)

```bash
npm run build
# Puis uploadez le dossier dist/ sur GitHub Pages
```

**Après le déploiement :**

Dans le dashboard de votre plateforme (Vercel, Netlify, etc.), allez dans **Settings > Environment Variables** et ajoutez :

```
VITE_SUPABASE_URL = https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable_...
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_...
VITE_STRIPE_PRICE_ID_MONTHLY = price_...
VITE_STRIPE_PRICE_ID_YEARLY = price_...
```

---

## 📝 Checklist finale

### Avant de lancer en production

- [ ] `.env` est dans `.gitignore`
- [ ] Les variables d'environnement sont définies dans `.env`
- [ ] Supabase est configurée (colonnes ajoutées à la table users)
- [ ] Les Edge Functions sont déployées et ont les secrets configurés
- [ ] Stripe est configuré (produit, prix, webhook, customer portal)
- [ ] Le frontend est déployé

### Tests à faire

- [ ] Inscription/Connexion fonctionne
- [ ] Le paiement avec une carte de test réussit
- [ ] L'abonnement apparaît dans la base de données
- [ ] Le customer portal fonctionne (gestion d'abonnement)
- [ ] Les annotations fonctionnent
- [ ] Les exports PDF/Word fonctionnent

### Passage en production

Quand vous êtes prêt :

1. **Sur Stripe :**
   - Basculez en **mode Live** (pas Test)
   - Récupérez les nouvelles clés (`pk_live_...` et `sk_live_...`)
   - Reconfigurez le webhook avec l'URL de production

2. **Dans Supabase :**
   - Mettez à jour les secrets avec les clés Live
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_live_...
   ```

3. **Dans votre `.env` :**
   - Mettez à jour avec les clés Live (`pk_live_...`)

4. **Redéployez** le frontend

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| "Invalid Supabase URL" | Vérifiez `VITE_SUPABASE_URL` dans `.env` |
| "Stripe key is invalid" | Vérifiez `VITE_STRIPE_PUBLISHABLE_KEY` (doit commencer par `pk_`) |
| "Webhook failed (error 500)" | Regardez les logs : `supabase functions logs stripe-webhook` |
| "User not found after payment" | Vérifiez que `subscription_status` existe dans la table users |
| "Payment succeeded but no subscription" | Vérifiez le webhook Stripe et les logs Edge Functions |

---

## 📧 Support

En cas de problème :

1. **Logs Supabase** : `supabase functions logs stripe-webhook`
2. **Logs Stripe** : Stripe Dashboard > Developers > Webhooks
3. **Console navigateur** : F12 ou Cmd+Option+I
4. **Vérifiez les variables** : `.env` et Supabase Secrets

Bon lancement ! 🚀
