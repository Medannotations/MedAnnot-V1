# MedAnnot

Application web professionnelle pour la génération d'annotations médicales infirmières par intelligence artificielle.

## 🏥 Description

MedAnnot permet aux infirmiers et infirmières de dicter leurs observations vocalement et de générer automatiquement des annotations professionnelles structurées grâce à l'IA.

### Fonctionnalités principales

- **Dictée vocale** : Transcription automatique via OpenAI Whisper
- **Génération IA** : Rédaction d'annotations structurées via Anthropic Claude
- **Gestion de patients** : Dossiers patients avec historique complet
- **Signes vitaux** : Suivi et intégration dans les annotations
- **Templates personnalisables** : Structures d'annotations et phrases prédéfinies
- **Chiffrement medical-grade** : AES-256-GCM pour toutes les données sensibles
- **Conformité LPD** : Hébergement 100% suisse (Exoscale)

## 🏗️ Architecture

### Frontend
- **Framework** : React 18 + TypeScript + Vite
- **UI** : TailwindCSS + shadcn/ui
- **State Management** : React Query (TanStack Query)
- **Routing** : React Router v6
- **Chiffrement** : CryptoJS (AES-256-GCM)

### Backend
- **Runtime** : Node.js + Express
- **Base de données** : PostgreSQL 15
- **Cache** : Redis 7
- **Authentification** : JWT custom
- **Paiements** : Stripe

### Infrastructure
- **Hébergement** : Exoscale (Genève, Suisse)
- **Container** : Docker + Docker Compose
- **Web Server** : Nginx
- **SSL** : Let's Encrypt (Certbot)

## 📦 Installation

### Prérequis
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (pour production)

### Développement local

1. **Cloner le repository**
```bash
git clone <repository-url>
cd medannot
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos clés API
```

4. **Démarrer la base de données**
```bash
docker-compose up -d postgres redis
```

5. **Lancer le serveur backend**
```bash
cd server
node index.js
```

6. **Lancer le frontend**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🚀 Déploiement

### Production (Docker)

1. **Build de l'application**
```bash
npm run build
```

2. **Déployer avec Docker Compose**
```bash
docker-compose up -d
```

Les services suivants seront démarrés :
- `medannot-nginx` : Frontend + Reverse proxy (ports 80/443)
- `medannot-app` : Backend Node.js (port 3000)
- `medannot-postgres` : Base de données
- `medannot-redis` : Cache
- `medannot-backup` : Sauvegardes automatiques
- `medannot-certbot` : Certificats SSL

## 🔒 Sécurité

### Données médicales
- **Chiffrement** : AES-256-GCM côté client avant envoi
- **Isolation** : Chaque utilisateur a sa propre clé de chiffrement
- **Stockage** : Données chiffrées en base de données PostgreSQL
- **Hébergement** : 100% Suisse (Exoscale Genève)

### Conformité
- **LPD** (Loi fédérale suisse sur la protection des données)
- **Secret médical** : Données chiffrées + hébergement sécurisé
- **HTTPS** : TLS 1.2/1.3 obligatoire
- **Rate limiting** : Protection anti-abus

## 🔑 Variables d'environnement

### Backend (.env dans /server)
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/medannot
REDIS_URL=redis://localhost:6379
JWT_SECRET=<votre-secret-jwt>
ANTHROPIC_API_KEY=<votre-clé-anthropic>
OPENAI_API_KEY=<votre-clé-openai>
STRIPE_SECRET_KEY=<votre-clé-stripe>
STRIPE_WEBHOOK_SECRET=<votre-webhook-secret>
```

### Frontend (.env à la racine)
```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=<votre-clé-publique-stripe>
VITE_STRIPE_PRICE_ID_MONTHLY=<votre-price-id>
```

## 📁 Structure du projet

```
medannot/
├── src/                          # Code source frontend
│   ├── components/              # Composants React
│   ├── contexts/                # Contexts React (Auth, etc.)
│   ├── hooks/                   # Hooks custom
│   ├── pages/                   # Pages de l'application
│   ├── services/                # Services API
│   ├── lib/                     # Utilitaires (encryption, etc.)
│   └── types/                   # Types TypeScript
├── server/                       # Backend Node.js
│   ├── index.js                 # Point d'entrée serveur
│   └── middleware/              # Middleware Express
├── public/                       # Assets statiques
├── nginx/                        # Configuration Nginx
├── docker-compose.yml           # Configuration Docker
├── Dockerfile                   # Image Docker backend
└── package.json                 # Dépendances npm
```

## 🛠️ Scripts disponibles

```bash
npm run dev          # Démarrer en mode développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Linter le code
npm run type-check   # Vérifier les types TypeScript
```

## 📝 API Backend

### Endpoints principaux

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

#### Patients
- `GET /api/patients` - Liste des patients
- `POST /api/patients` - Créer un patient
- `GET /api/patients/:id` - Détails d'un patient
- `PUT /api/patients/:id` - Modifier un patient
- `DELETE /api/patients/:id` - Supprimer un patient

#### Annotations
- `GET /api/annotations` - Liste des annotations
- `POST /api/annotations` - Créer une annotation
- `GET /api/annotations/:id` - Détails d'une annotation
- `PUT /api/annotations/:id` - Modifier une annotation
- `DELETE /api/annotations/:id` - Supprimer une annotation
- `POST /api/transcribe` - Transcrire un fichier audio
- `POST /api/generate-annotation` - Générer une annotation par IA

#### Signes vitaux
- `POST /api/vital-signs` - Sauvegarder des signes vitaux
- `GET /api/vital-signs/:patientId/:date` - Récupérer signes vitaux

## 🧪 Tests

```bash
npm run test         # Lancer les tests
npm run test:watch   # Tests en mode watch
```

## 📊 Monitoring

- **Santé du serveur** : `GET /api/health`
- **Logs** : Consultables via `docker logs medannot-app`

## 🤝 Contribution

Pour contribuer au projet :

1. Créer une branche depuis `main`
2. Faire vos modifications
3. Tester localement
4. Créer une Pull Request

### Standards de code
- **TypeScript** : Types stricts activés
- **ESLint** : Configuration standard
- **Commits** : Messages descriptifs en français

## 📄 Licence

Propriétaire - MedAnnot © 2026

## 📞 Support

- **Email** : support@medannot.ch
- **Documentation** : https://docs.medannot.ch (si disponible)

## 🔄 Changelog

### Version 1.0.0 (Février 2026)
- ✅ Génération d'annotations par IA
- ✅ Gestion complète des patients
- ✅ Signes vitaux intégrés
- ✅ Chiffrement medical-grade
- ✅ Déploiement Exoscale (Suisse)
- ✅ Conformité LPD
