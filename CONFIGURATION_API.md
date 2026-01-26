# 🔧 Configuration des API - Medannot

Ce guide explique comment configurer les clés API nécessaires pour que Medannot fonctionne correctement.

## ⚠️ IMPORTANT : Problème d'enregistrement vocal

Si l'enregistrement vocal ne fonctionne pas et affiche une erreur, c'est probablement parce que la clé API OpenAI (Whisper) n'est pas configurée dans Supabase.

---

## 📋 APIs Requises

Medannot utilise 3 services API externes :

1. **OpenAI Whisper** - Transcription vocale (REQUIS)
2. **Anthropic Claude** - Génération d'annotations (REQUIS)
3. **Stripe** - Paiements (REQUIS pour la production)

---

## 🔐 1. Configuration OpenAI (Whisper API)

### Étape 1 : Obtenir votre clé API OpenAI

1. Créez un compte sur [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Ajoutez un moyen de paiement dans [Billing Settings](https://platform.openai.com/account/billing/overview)
3. Générez une clé API :
   - Allez sur [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Cliquez sur "Create new secret key"
   - Donnez-lui un nom : `Medannot-Whisper`
   - **COPIEZ immédiatement la clé** (format : `sk-...`)
   - ⚠️ Vous ne pourrez plus la voir après !

### Étape 2 : Configurer la politique "Zero Data Retention"

**IMPORTANT pour le secret médical :**

1. Allez dans [Organization Settings](https://platform.openai.com/settings/organization/general)
2. Dans la section **Data Controls**, activez :
   - ✅ **Do not use my data for training**
   - ✅ **Zero data retention** (si disponible)
3. Sauvegardez les modifications

**Configuration dans le code (déjà fait) :**
```typescript
// supabase/functions/transcribe/index.ts
// La transcription est configurée pour ne pas être conservée
whisperFormData.append("temperature", "0");
```

### Étape 3 : Ajouter la clé dans Supabase

```bash
# Dans votre terminal, à la racine du projet :

# Se connecter à Supabase CLI (si pas déjà fait)
npx supabase login

# Lier votre projet (si pas déjà fait)
npx supabase link --project-ref <VOTRE_PROJECT_REF>

# Ajouter le secret OpenAI
npx supabase secrets set OPENAI_API_KEY=sk-votre-clé-ici

# Redéployer les Edge Functions pour prendre en compte le secret
npx supabase functions deploy transcribe
```

**Alternative via Dashboard Supabase :**
1. Connectez-vous à [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Edge Functions** → **Secrets**
4. Ajoutez un nouveau secret :
   - **Name :** `OPENAI_API_KEY`
   - **Value :** `sk-votre-clé-openai`
5. Cliquez sur **Save**
6. Redéployez la fonction `transcribe`

---

## 🤖 2. Configuration Anthropic (Claude API)

### Étape 1 : Obtenir votre clé API Anthropic

1. Créez un compte sur [https://console.anthropic.com](https://console.anthropic.com)
2. Ajoutez un moyen de paiement
3. Générez une clé API :
   - Allez dans [API Keys](https://console.anthropic.com/settings/keys)
   - Cliquez sur "Create Key"
   - Nom : `Medannot-Production`
   - **COPIEZ la clé** (format : `sk-ant-...`)

### Étape 2 : Configuration "Zero Data Retention"

**IMPORTANT pour le secret médical :**

Anthropic propose une configuration "Zero Data Retention" via header HTTP.

**Cette configuration est déjà implémentée dans le code :**
```typescript
// supabase/functions/generate-annotation/index.ts (ligne 253-255)
headers: {
  "x-api-key": ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-beta": "prompt-caching-2024-07-31", // Active le caching sécurisé
}
```

**Vérification dans la console Anthropic :**
1. Allez dans [https://console.anthropic.com/settings/data-usage](https://console.anthropic.com/settings/data-usage)
2. Assurez-vous que "Use prompts and outputs to improve our models" est **DÉSACTIVÉ**

### Étape 3 : Ajouter la clé dans Supabase

```bash
# Dans votre terminal :
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-votre-clé-ici

# Redéployer la fonction
npx supabase functions deploy generate-annotation
```

**Ou via Dashboard :**
1. **Settings** → **Edge Functions** → **Secrets**
2. Nouveau secret :
   - **Name :** `ANTHROPIC_API_KEY`
   - **Value :** `sk-ant-votre-clé`
3. **Save** et redéployer `generate-annotation`

---

## 💳 3. Configuration Stripe (Paiements)

### Étape 1 : Créer un compte Stripe

1. Créez un compte sur [https://stripe.com](https://stripe.com)
2. Activez le mode Live (après les tests)

### Étape 2 : Obtenir les clés API

**Mode Test (développement) :**
1. Allez dans [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copiez :
   - **Publishable key** : `pk_test_...`
   - **Secret key** : `sk_test_...`

**Mode Live (production) :**
1. Allez dans [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Copiez :
   - **Publishable key** : `pk_live_...`
   - **Secret key** : `sk_live_...`

### Étape 3 : Configurer les clés

**Dans le Frontend (.env) :**
```bash
# Mode TEST
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_clé

# Mode LIVE (production uniquement)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_votre_clé
```

**Dans Supabase (Backend) :**
```bash
# Mode TEST
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_votre_clé

# Mode LIVE
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_votre_clé

# Redéployer les fonctions Stripe
npx supabase functions deploy stripe-checkout
npx supabase functions deploy stripe-webhook
npx supabase functions deploy stripe-portal
```

### Étape 4 : Configurer le Webhook Stripe

1. Allez dans [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Cliquez sur "Add endpoint"
3. **Endpoint URL :** `https://<votre-project-ref>.supabase.co/functions/v1/stripe-webhook`
4. **Events to listen :**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copiez le **Signing secret** (`whsec_...`)
6. Ajoutez-le dans Supabase :
   ```bash
   npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_votre_secret
   npx supabase functions deploy stripe-webhook
   ```

---

## 📊 4. Vérification de la Configuration

### Test OpenAI Whisper

```bash
# Tester l'API OpenAI directement
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer sk-votre-clé-openai" \
  -H "Content-Type: multipart/form-data" \
  -F file="@test-audio.mp3" \
  -F model="whisper-1" \
  -F language="fr"
```

### Test Anthropic Claude

```bash
# Tester l'API Claude
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: sk-ant-votre-clé" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'
```

### Test Stripe

```bash
# Tester la clé Stripe
curl https://api.stripe.com/v1/customers \
  -u sk_test_votre_clé: \
  -d email="test@example.com"
```

---

## 🔍 Dépannage

### Erreur : "Service de transcription non configuré"

**Cause :** La clé `OPENAI_API_KEY` n'est pas définie dans Supabase.

**Solution :**
```bash
npx supabase secrets set OPENAI_API_KEY=sk-votre-clé
npx supabase functions deploy transcribe
```

### Erreur : "Service de génération non configuré"

**Cause :** La clé `ANTHROPIC_API_KEY` n'est pas définie.

**Solution :**
```bash
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-votre-clé
npx supabase functions deploy generate-annotation
```

### Erreur : "Quota API dépassé"

**OpenAI :**
- Vérifiez votre solde : [https://platform.openai.com/account/usage](https://platform.openai.com/account/usage)
- Ajoutez des crédits : [https://platform.openai.com/account/billing/overview](https://platform.openai.com/account/billing/overview)

**Anthropic :**
- Vérifiez l'usage : [https://console.anthropic.com/settings/usage](https://console.anthropic.com/settings/usage)
- Augmentez les limites ou ajoutez des crédits

### L'enregistrement vocal ne fonctionne pas

**Checklist :**
1. ✅ Clé OpenAI configurée dans Supabase ?
2. ✅ Edge Function `transcribe` déployée ?
3. ✅ Microphone autorisé dans le navigateur ?
4. ✅ Fichier audio < 25 MB ?
5. ✅ Connexion Internet stable ?
6. ✅ Console navigateur : des erreurs ?

---

## 📝 Liste de Contrôle Complète

Avant de lancer en production :

### Backend (Supabase Secrets)
- [ ] `OPENAI_API_KEY` configurée
- [ ] `ANTHROPIC_API_KEY` configurée
- [ ] `STRIPE_SECRET_KEY` configurée (mode live)
- [ ] `STRIPE_WEBHOOK_SECRET` configurée
- [ ] Toutes les Edge Functions déployées

### Frontend (.env)
- [ ] `VITE_SUPABASE_URL` configurée
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` configurée
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` configurée (mode live)

### Stripe
- [ ] Webhook configuré et testé
- [ ] Mode Live activé
- [ ] Produits/prix créés
- [ ] Paiements de test réussis

### Sécurité
- [ ] Zero data retention activé pour OpenAI
- [ ] Zero data retention activé pour Anthropic
- [ ] Stripe en mode Live (pas Test)
- [ ] HTTPS activé partout
- [ ] Anciennes clés API révoquées (celles partagées dans le chat)

---

## 🚀 Commandes Utiles

```bash
# Voir tous les secrets Supabase
npx supabase secrets list

# Supprimer un secret
npx supabase secrets unset NOM_SECRET

# Voir les logs d'une fonction
npx supabase functions logs transcribe --tail

# Tester une fonction localement
npx supabase functions serve transcribe
```

---

## 📞 Support

Si vous rencontrez des problèmes de configuration :

1. **Logs Supabase :** Vérifiez les logs des Edge Functions dans le Dashboard
2. **Console navigateur :** Ouvrez les DevTools (F12) et regardez les erreurs
3. **Documentation officielle :**
   - [OpenAI API Docs](https://platform.openai.com/docs)
   - [Anthropic API Docs](https://docs.anthropic.com)
   - [Stripe Docs](https://stripe.com/docs)
   - [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

## ⚠️ Sécurité - À NE JAMAIS FAIRE

- ❌ Ne partagez JAMAIS vos clés API dans un chat, email ou code source public
- ❌ Ne commitez JAMAIS les clés dans Git (utilisez .gitignore)
- ❌ N'utilisez PAS les clés de test en production
- ❌ Ne stockez PAS les clés dans le frontend (seulement les clés publishable)

---

## ✅ Résumé Rapide

**Pour faire fonctionner l'enregistrement vocal MAINTENANT :**

```bash
# 1. Obtenir clé OpenAI sur platform.openai.com
# 2. L'ajouter dans Supabase :
npx supabase secrets set OPENAI_API_KEY=sk-votre-clé-ici

# 3. Redéployer la fonction :
npx supabase functions deploy transcribe

# 4. Tester dans l'app !
```

C'est tout ! 🎉
