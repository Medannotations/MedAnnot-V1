# 🏥 Nurses Notes AI

**L'assistant IA pour vos annotations infirmières**

Dictez. L'IA rédige. Vous copiez. Simple et professionnel.

---

## 🚀 **Démarrage rapide**

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos vraies valeurs

# 3. Lancer en développement
npm run dev
```

L'application sera accessible sur http://localhost:8080

---

## ⚠️ **ATTENTION SÉCURITÉ - ACTIONS IMMÉDIATES**

**Vous avez partagé vos clés API dans le chat. RÉVOQUEZ-LES IMMÉDIATEMENT :**

1. **OpenAI** → https://platform.openai.com/api-keys
2. **Claude** → https://console.anthropic.com/settings/keys
3. **Stripe** → https://dashboard.stripe.com/test/apikeys

Puis générez de **nouvelles clés** et configurez-les dans Supabase.

---

## 📋 **Prérequis**

- Node.js 18+ et npm
- Compte Supabase (gratuit)
- Clés API :
  - OpenAI (pour Whisper - transcription vocale)
  - Claude (Anthropic - génération d'annotations)
  - Stripe (pour les paiements)

---

## 🔧 **Installation complète**

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Supabase

```bash
# Se connecter à Supabase
supabase login

# Lier le projet
supabase link --project-ref hnlrvlhhimkqezjoslmy
```

### 3. Configurer les secrets Supabase

**⚠️ Générez de NOUVELLES clés API avant !**

Consultez **[SUPABASE_SECRETS_CONFIG.md](SUPABASE_SECRETS_CONFIG.md)** pour les instructions détaillées.

```bash
supabase secrets set OPENAI_API_KEY=sk-proj-VOTRE_NOUVELLE_CLE
supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-VOTRE_NOUVELLE_CLE
supabase secrets set STRIPE_SECRET_KEY=sk_test_VOTRE_NOUVELLE_CLE
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET
supabase secrets set SUPABASE_URL=https://hnlrvlhhimkqezjoslmy.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=VOTRE_SERVICE_ROLE_KEY
```

### 4. Déployer les Edge Functions

```bash
supabase functions deploy transcribe
supabase functions deploy generate-annotation
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook
supabase functions deploy stripe-portal
```

### 5. Configurer Stripe

1. Créer les produits dans Stripe Dashboard
2. Récupérer les Price IDs
3. Configurer le webhook
4. Mettre à jour `.env`

Consultez **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** pour les détails.

---

## 📚 **Documentation**

| Fichier | Description |
|---------|-------------|
| **[MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md)** | Migration Lovable → Autonome |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | Guide de déploiement complet |
| **[SUPABASE_SECRETS_CONFIG.md](SUPABASE_SECRETS_CONFIG.md)** | Configuration des secrets |
| **[AMELIORATIONS_REALISEES.md](AMELIORATIONS_REALISEES.md)** | Historique des améliorations |

---

## 🏗️ **Architecture**

```
nurses-notes-ai/
├── src/                           # Frontend React + TypeScript
│   ├── components/                # Composants React
│   ├── services/                  # Services (API calls)
│   ├── hooks/                     # Custom hooks
│   └── pages/                     # Pages principales
│
├── supabase/
│   └── functions/                 # Edge Functions (Backend)
│       ├── transcribe/            # OpenAI Whisper
│       ├── generate-annotation/   # Claude API
│       └── stripe-*/              # Paiements Stripe
│
├── .env                          # Variables d'environnement
└── package.json                  # Dépendances npm
```

---

## 🔐 **Sécurité**

### ✅ **Protections en place**

- Toutes les clés API sont **côté serveur** (Edge Functions)
- `.env` est dans `.gitignore`
- Webhooks Stripe validés avec signature
- Aucune clé API exposée côté client

---

## 📊 **Stack technique**

- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** + **Shadcn/ui**
- **Supabase** (Auth, Database, Edge Functions)
- **OpenAI Whisper** (Transcription)
- **Claude** (Génération IA)
- **Stripe** (Paiements)

---

## 🌟 **Fonctionnalités**

- ✅ **Enregistrement vocal** - Dictez vos observations
- ✅ **Transcription automatique** - OpenAI Whisper
- ✅ **Génération IA** - Annotations structurées avec Claude
- ✅ **Gestion patients** - Dossiers avec pathologies
- ✅ **Exemples par patient** - L'IA apprend votre style
- ✅ **Export PDF/Word** - Pour facturation et archives
- ✅ **Paiements Stripe** - Abonnements mensuels/annuels
- ✅ **7 jours gratuits** - Sans carte bancaire

---

## 💳 **Pricing**

- **Mensuel** : 149 CHF/mois
- **Annuel** : 989 CHF/an (82 CHF/mois) - Économisez 799 CHF !
- **Essai gratuit** : 7 jours sans carte bancaire

---

## 🆘 **Support**

### Logs et debugging

```bash
# Logs Edge Functions
supabase functions logs transcribe
supabase functions logs generate-annotation
supabase functions logs stripe-webhook

# Vérifier les secrets
supabase secrets list
```

---

## 🎉 **Statut du projet**

✅ **100% autonome** - Aucune dépendance à Lovable
✅ **Sécurisé** - Clés API côté serveur uniquement
✅ **Professionnel** - Branding personnalisé
✅ **Production-ready** - Documentation complète

---

## 🚀 **Prochaines étapes**

1. [x] Migration Lovable → Autonome
2. [x] Sécurisation des API
3. [x] Intégration Stripe
4. [x] Landing page optimisée
5. [ ] Révoquer anciennes clés API ⚠️
6. [ ] Générer nouvelles clés API
7. [ ] Configurer secrets Supabase
8. [ ] Déployer en production

---

**Développé avec ❤️ pour les infirmiers indépendants suisses**

🇨🇭 **Made in Switzerland**
