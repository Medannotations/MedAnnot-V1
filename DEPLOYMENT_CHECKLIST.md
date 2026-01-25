# 🚀 MEDANNOT - GUIDE COMPLET DE FINALISATION

## ✅ CE QUI A ÉTÉ FAIT

- ✅ Code poussé sur GitHub : https://github.com/Medannotations/MedAnnot-V1
- ✅ Déployé sur Vercel (en production)
- ✅ Landing page mise à jour avec les nouveaux prix :
  - **189 CHF/mois** (mensuel)
  - **1499 CHF/an** (annuel)
- ✅ Migration SQL créée pour Supabase
- ✅ Environment variables configurées dans Vercel

---

## 📋 CE QUI RESTE À FAIRE (MANUEL - 15 MINUTES)

### **1️⃣ EXÉCUTER LA MIGRATION SQL SUPABASE**

Ceci ajoute les colonnes pour gérer les abonnements Stripe.

**Va dans:** Supabase Dashboard → https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/sql

**Clique "New Query" et copie-colle :**

```sql
-- Ajouter les colonnes de paiement à la table users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP WITH TIME ZONE;

-- Créer un index pour les recherches rapides
CREATE INDEX IF NOT EXISTS users_stripe_customer_id_idx
ON users(stripe_customer_id);
```

**Clique "RUN"** ✓

---

### **2️⃣ CONFIGURER LES SECRETS SUPABASE**

**Va dans:** Settings → Edge Functions → Secrets

**Ajoute ces 4 secrets :**

| Clé | Valeur |
|-----|--------|
| `STRIPE_SECRET_KEY` | `sk_test_51StDyP6OhZ2TN4iPkinhtiCQ6lVYxrLi4NwJKyb6Khw7aElzTh2udjmegA5OzIfJqxl6T7vnkmyhztPillQPMy3J00Da4ART64` |
| `STRIPE_WEBHOOK_SECRET` | **À récupérer dans Stripe** (voir étape 3) |
| `SUPABASE_URL` | `https://vbaaohcsmiaxbqcyfhhl.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYWFvaGNzbWlheGJxY3lmaGhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM0MTMzMCwiZXhwIjoyMDg0OTE3MzMwfQ.qOOWFdPOCYxRIHlqM1KV3JJmhNuLBP-zZRhiSHJ4z-8` |

---

### **3️⃣ CONFIGURER LE WEBHOOK STRIPE**

**Va dans:** Stripe Dashboard → Developers → Webhooks

**Clique "Add Endpoint"**

**Endpoint URL :**
```
https://vbaaohcsmiaxbqcyfhhl.supabase.co/functions/v1/stripe-webhook
```

**Événements à sélectionner :**
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_failed`

**Clique "Add Endpoint"**

**Puis récupère le "Signing Secret"** (commence par `whsec_`)
- Mets-le dans Supabase Secrets (étape 2, clé `STRIPE_WEBHOOK_SECRET`)

---

### **4️⃣ DÉPLOYER LES EDGE FUNCTIONS**

Depuis ton terminal :

```bash
cd /Users/bmk/Desktop/"Medannot V1"

# Déployer les fonctions Stripe
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook
supabase functions deploy stripe-portal
```

---

### **5️⃣ TESTER LE FLUX COMPLET**

**Test 1 - Landing Page :**
- Va sur ton URL Vercel
- Vérifie que les prix affichent **189 CHF** (mensuel) et **1499 CHF** (annuel)
- ✓ Test réussi

**Test 2 - Inscription :**
- Clique "Essayer gratuitement"
- Crée un compte
- ✓ Test réussi

**Test 3 - Paiement Stripe :**
- Sélectionne un plan
- Clique le bouton de paiement
- Carte de test : `4242 4242 4242 4242`
- Date : `12/25`
- CVC : `123`
- Valide le paiement
- ✓ Vous devriez être redirigé vers `/subscription/success`

**Test 4 - Vérifier Supabase :**
- Dans Supabase Dashboard → Table Editor → users
- Cherche ton utilisateur
- Vérifie que les colonnes ont été remplies :
  - `stripe_customer_id` : doit avoir une valeur `cus_...`
  - `subscription_status` : doit être `'active'`
  - `subscription_current_period_end` : doit avoir une date future
- ✓ Test réussi

---

## 🔗 URLS & INFOS IMPORTANTES

| Service | URL |
|---------|-----|
| **GitHub** | https://github.com/Medannotations/MedAnnot-V1 |
| **Vercel** | `https://medannot-v1.vercel.app` (ou ton URL) |
| **Supabase** | https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl |
| **Stripe** | https://dashboard.stripe.com/test/dashboard |

---

## 💰 PRIX CONFIGURÉS

✅ **Abonnement Mensuel** : 189 CHF/mois
  - Essai gratuit 7 jours
  - ID prix Stripe : `price_1StWgr6OhZ2TN4iPIwcnJEqp`

✅ **Abonnement Annuel** : 1499 CHF/an
  - Essai gratuit 7 jours
  - Économise 769 CHF/an
  - ID prix Stripe : `price_1StWu76OhZ2TN4iPchmtTRty`

---

## 🔐 SÉCURITÉ

✅ `.env` et `mcp.json` pas commités (dans `.gitignore`)
✅ Secrets stockés dans Supabase (pas en dur)
✅ Webhooks Stripe sécurisés avec signature
✅ RLS (Row Level Security) activé dans Supabase

---

## 📞 EN CAS DE PROBLÈME

**Webhook ne fonctionne pas :**
1. Vérifie que le secret `STRIPE_WEBHOOK_SECRET` est correct dans Supabase
2. Regarde les logs : Supabase → Logs → Edge Functions → stripe-webhook

**Paiement ne fonctionne pas :**
1. Vérifie que les prix existent dans Stripe
2. Vérifie que `STRIPE_SECRET_KEY` est correct dans Supabase Secrets
3. Regarde la console du navigateur (F12)

**Landing page ne charge pas :**
1. Vérifie que les env vars sont dans Vercel
2. Vérifie que `VITE_SUPABASE_URL` et `VITE_STRIPE_PUBLISHABLE_KEY` sont corrects

---

## ✨ PRÊT POUR LES CLIENTS !

Une fois les étapes 1-4 complétées et les tests réussis, la plateforme est **100% fonctionnelle** et prête à accueillir des utilisateurs payants ! 🎉
