# 🔐 Configuration des Secrets Supabase

## ⚠️ **ATTENTION - À FAIRE IMMÉDIATEMENT**

Avant de configurer ces secrets, vous **DEVEZ** :

1. **RÉVOQUER** les clés API que vous avez partagées dans le chat
2. **GÉNÉRER** de nouvelles clés
3. **NE JAMAIS** partager ces clés

---

## 📋 **Configuration des secrets**

### 1. Se connecter à Supabase

```bash
# Se connecter à votre compte Supabase
supabase login

# Lier le projet
supabase link --project-ref hnlrvlhhimkqezjoslmy
```

### 2. Configurer TOUS les secrets

```bash
# ========================================
# OpenAI API (Whisper - transcription)
# ========================================
# Générer une NOUVELLE clé sur : https://platform.openai.com/api-keys
supabase secrets set OPENAI_API_KEY=sk-proj-VOTRE_NOUVELLE_CLE_OPENAI

# ========================================
# Claude API (Anthropic - génération)
# ========================================
# Générer une NOUVELLE clé sur : https://console.anthropic.com/settings/keys
supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-VOTRE_NOUVELLE_CLE_CLAUDE

# ========================================
# Stripe API (Paiements)
# ========================================
# Générer une NOUVELLE clé sur : https://dashboard.stripe.com/test/apikeys
supabase secrets set STRIPE_SECRET_KEY=sk_test_VOTRE_NOUVELLE_CLE_STRIPE

# APRÈS avoir configuré le webhook Stripe (voir ci-dessous)
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET

# ========================================
# Supabase (pour webhooks)
# ========================================
supabase secrets set SUPABASE_URL=https://hnlrvlhhimkqezjoslmy.supabase.co

# Récupérer la clé service role depuis : Settings > API
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=VOTRE_SERVICE_ROLE_KEY
```

### 3. Vérifier que les secrets sont configurés

```bash
supabase secrets list
```

Vous devriez voir :
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔑 **Comment générer les clés**

### OpenAI

1. Aller sur https://platform.openai.com/api-keys
2. Cliquer sur **"Create new secret key"**
3. Nommer la clé : "Nurses Notes AI - Production"
4. **COPIER** la clé (elle commence par `sk-proj-...`)
5. La coller dans la commande `supabase secrets set OPENAI_API_KEY=...`

### Claude (Anthropic)

1. Aller sur https://console.anthropic.com/settings/keys
2. Cliquer sur **"Create Key"**
3. Nommer la clé : "Nurses Notes AI - Production"
4. **COPIER** la clé (elle commence par `sk-ant-api03-...`)
5. La coller dans la commande `supabase secrets set ANTHROPIC_API_KEY=...`

### Stripe

1. Aller sur https://dashboard.stripe.com/test/apikeys (ou `/live/apikeys` pour production)
2. Révéler la **Secret key** (commence par `sk_test_...` ou `sk_live_...`)
3. **COPIER** la clé
4. La coller dans la commande `supabase secrets set STRIPE_SECRET_KEY=...`

### Stripe Webhook Secret

1. Aller sur https://dashboard.stripe.com/test/webhooks
2. Créer un endpoint avec l'URL : `https://hnlrvlhhimkqezjoslmy.supabase.co/functions/v1/stripe-webhook`
3. Sélectionner les événements :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Révéler le **Signing secret** (commence par `whsec_...`)
5. **COPIER** et le coller dans `supabase secrets set STRIPE_WEBHOOK_SECRET=...`

### Supabase Service Role Key

1. Aller sur https://supabase.com/dashboard/project/hnlrvlhhimkqezjoslmy/settings/api
2. Copier la **service_role key** (elle est masquée par défaut)
3. La coller dans `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...`

---

## ✅ **Checklist finale**

Avant de déployer, vérifiez :

- [ ] Anciennes clés révoquées (OpenAI, Claude, Stripe)
- [ ] Nouvelles clés générées
- [ ] Tous les secrets configurés dans Supabase (`supabase secrets list`)
- [ ] Fichier `.env` mis à jour (Stripe public key + price IDs)
- [ ] Edge Functions déployées (`supabase functions deploy`)
- [ ] Webhook Stripe configuré et actif
- [ ] Tests effectués en mode test Stripe

---

## 🚨 **Sécurité**

### ✅ **Bonnes pratiques**

- **JAMAIS** commiter `.env` dans Git (déjà dans `.gitignore`)
- **JAMAIS** partager vos clés API
- **TOUJOURS** utiliser des variables d'environnement
- **RÉVOQUER** immédiatement toute clé compromise
- **UTILISER** des clés différentes pour test et production

### ⚠️ **Rotation des clés**

Si vous suspectez qu'une clé a été compromise :

1. **Générer** une nouvelle clé
2. **Mettre à jour** le secret Supabase
3. **Redéployer** les Edge Functions
4. **Révoquer** l'ancienne clé

---

## 📞 **Support**

En cas de problème :

1. Vérifier les logs : `supabase functions logs FONCTION_NAME`
2. Vérifier les secrets : `supabase secrets list`
3. Tester les Edge Functions localement
4. Consulter la documentation Supabase : https://supabase.com/docs

---

## ✨ **Une fois configuré**

Après avoir configuré tous les secrets :

```bash
# Déployer toutes les Edge Functions
supabase functions deploy transcribe
supabase functions deploy generate-annotation
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook
supabase functions deploy stripe-portal

# Tester l'application
npm run dev
```

Votre application est maintenant **100% fonctionnelle et sécurisée** ! 🎉
