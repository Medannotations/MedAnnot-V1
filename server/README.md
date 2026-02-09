# MedAnnot Server

Serveur API Node.js/Express pour MedAnnot - Remplace Supabase Edge Functions et Auth.

## Installation

```bash
cd server
npm install
```

## Configuration

Créer un fichier `.env`:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/medannot
JWT_SECRET=votre_secret_jwt
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_APP_URL=https://medannot.ch
```

## Démarrage

```bash
# Production
npm start

# Développement
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Profile
- `GET /api/profile` - Profil utilisateur
- `PATCH /api/profile` - Mise à jour

### Patients
- `GET /api/patients` - Liste patients
- `POST /api/patients` - Créer patient

### Annotations
- `GET /api/annotations` - Liste annotations
- `POST /api/annotations` - Créer annotation

### Stripe
- `POST /api/stripe-portal` - Portail client
- `POST /api/get-subscription` - Infos abonnement
- `POST /api/webhooks/stripe` - Webhooks Stripe

### Health
- `GET /api/health` - Vérification santé

## Architecture

```
server/
├── index.js          # Point d'entrée
├── package.json      # Dépendances
├── schema.sql        # Schéma PostgreSQL
└── README.md         # Ce fichier
```

## Notes

- Compatible avec les tokens JWT Supabase (migration transparente)
- Peut remplacer complètement Supabase Auth ou fonctionner en parallèle
- Les webhooks Stripe sont gérés nativement
