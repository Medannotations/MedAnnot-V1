# 🚀 Migration Infomaniak - MedAnnot

Ce document guide la migration complète de MedAnnot vers Infomaniak.

## 📦 Contenu créé pour la migration

```
📁 MedAnnot-V1/
├── 📄 MIGRATION_INFOMANIAK_GUIDE.md    # Guide complet étape par étape
├── 📄 README_INFOMANIAK.md             # Ce fichier
├── 📁 server/                          # Serveur Node.js (remplace Supabase)
│   ├── index.js                        # API Express complète
│   └── schema.sql                      # Schéma PostgreSQL
├── 📁 scripts/                         # Scripts d'automatisation
│   ├── backup-complete.sh              # Backup avant migration
│   ├── setup-vps.sh                    # Setup automatique VPS
│   └── deploy-infomaniak.sh            # Déploiement continu
├── 📄 .env.infomaniak.example          # Template configuration
```

## 🎯 Architecture cible

```
┌─────────────────────────────────────────────┐
│  Utilisateur                                │
└────┬────────────────────────────────────────┘
     │ HTTPS
     ▼
┌─────────────────────────────────────────────┐
│  Infomaniak Cloud                           │
│  ┌─────────────────────────────────────┐   │
│  │  medannot.ch (Domaine + SSL)        │   │
│  └────────────────┬────────────────────┘   │
│                   │                         │
│  ┌────────────────▼────────────────────┐   │
│  │  VPS Cloud                          │   │
│  │  ┌─────────────────────────────┐   │   │
│  │  │  Nginx (Reverse Proxy)      │   │   │
│  │  │  • SSL Let's Encrypt        │   │   │
│  │  │  • Load balancing           │   │   │
│  │  └───────────┬─────────────────┘   │   │
│  │              │                      │   │
│  │  ┌───────────▼─────────────────┐   │   │
│  │  │  Node.js + Express          │   │   │
│  │  │  • API REST                 │   │   │
│  │  │  • Auth JWT                 │   │   │
│  │  │  • Stripe Integration       │   │   │
│  │  │  • Frontend React (dist)    │   │   │
│  │  └───────────┬─────────────────┘   │   │
│  │              │                      │   │
│  │  ┌───────────▼─────────────────┐   │   │
│  │  │  PostgreSQL 15              │   │   │
│  │  │  • Données patients         │   │   │
│  │  │  • Auth users               │   │   │
│  │  │  • Annotations              │   │   │
│  │  └─────────────────────────────┘   │   │
│  └────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## 🚀 Démarrage rapide

### Étape 1: Commander chez Infomaniak

1. **VPS Cloud** (Ubuntu 22.04 LTS)
   - 2 vCores / 4 GB RAM / 50 GB SSD
   - Localisation: Genève
   - ~15 CHF/mois

2. **PostgreSQL Cloud** (Option A recommandée)
   - Version 15
   - 1 vCore / 2 GB RAM / 20 GB SSD
   - ~10 CHF/mois

3. **Domaine** (déjà possédé: medannot.ch)

**Total estimé: ~26 CHF/mois** (vs ~50$ actuellement)

### Étape 2: Setup automatique du VPS

```bash
# Se connecter au VPS fraîchement créé
ssh root@<ip-du-vps>

# Télécharger et exécuter le script d'installation
curl -fsSL https://raw.githubusercontent.com/Medannotations/MedAnnot-V1/main/scripts/setup-vps.sh | bash

# Ou manuellement
wget https://raw.githubusercontent.com/Medannotations/MedAnnot-V1/main/scripts/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

Le script installe automatiquement:
- ✅ Node.js 20.x
- ✅ Nginx
- ✅ PostgreSQL
- ✅ PM2
- ✅ Firewall (UFW)
- ✅ Fail2ban
- ✅ Certbot (SSL)

### Étape 3: Configuration base de données

```bash
# Option A: Si PostgreSQL Cloud Infomaniak
# Récupérez les credentials dans l'email Infomaniak

# Option B: Si PostgreSQL local
sudo -u postgres psql

CREATE USER medannot WITH PASSWORD 'votre_mot_de_passe_fort';
CREATE DATABASE medannot OWNER medannot;
\q

# Importer le schéma
psql -U medannot -d medannot -f server/schema.sql
```

### Étape 4: Déploiement de l'application

```bash
# Se connecter en tant qu'utilisateur medannot
su - medannot

# Cloner le repo
cd /var/www/medannot
git clone https://github.com/Medannotations/MedAnnot-V1.git .

# Configuration
cp .env.infomaniak.example .env
nano .env  # Remplir vos credentials

# Installation
npm ci
npm run build

# Démarrage
sudo systemctl start medannot
# ou avec PM2
pm2 start server/index.js --name "medannot-api"
pm2 save
```

### Étape 5: SSL et domaine

```bash
# Configurer le DNS pour pointer vers le VPS
# Type A: medannot.ch -> IP du VPS
# Type A: www.medannot.ch -> IP du VPS

# Attendre la propagation DNS (peut prendre 24-48h)
# Puis générer le certificat SSL:

sudo certbot --nginx -d medannot.ch -d www.medannot.ch
```

### Étape 6: Migration des données

```bash
# Exporter depuis Supabase (sur votre machine locale)
pg_dump "postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres" \
  --data-only --table=profiles --table=patients --table=annotations > data.sql

# Transférer sur le VPS
scp data.sql medannot@<ip-vps>:/tmp/

# Importer dans Infomaniak
ssh medannot@<ip-vps>
psql "$DATABASE_URL" < /tmp/data.sql
```

### Étape 7: Mise à jour Stripe

Dans le [Dashboard Stripe](https://dashboard.stripe.com/webhooks):

1. Supprimer l'ancien endpoint Supabase
2. Créer un nouveau endpoint: `https://medannot.ch/api/webhooks/stripe`
3. Sélectionner les événements:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copier le secret webhook dans `.env`

## 📁 Structure du nouveau serveur

Le fichier `server/index.js` remplace:
- ✅ Supabase Edge Functions
- ✅ Supabase Auth (optionnel, peut être gardé)
- ✅ API REST pour patients/annotations

Routes disponibles:
```
POST   /api/auth/register          → Inscription
POST   /api/auth/login             → Connexion
GET    /api/profile                → Profil utilisateur
PATCH  /api/profile                → Mise à jour profil
GET    /api/patients               → Liste patients
POST   /api/patients               → Créer patient
GET    /api/annotations            → Liste annotations
POST   /api/annotations            → Créer annotation
POST   /api/stripe-portal          → Portail Stripe
POST   /api/get-subscription       → Infos abonnement
POST   /api/webhooks/stripe        → Webhooks Stripe
```

## 🔧 Maintenance

### Redémarrer l'application
```bash
# Via systemd
sudo systemctl restart medannot

# Via PM2
pm2 restart medannot-api
```

### Voir les logs
```bash
# Application
sudo journalctl -u medannot -f
# ou
pm2 logs medannot-api

# Nginx
sudo tail -f /var/log/nginx/error.log
```

### Backup base de données
```bash
# Créer un backup
pg_dump "$DATABASE_URL" > backup-$(date +%Y%m%d).sql

# Automatiser avec cron (quotidien)
0 2 * * * pg_dump "$DATABASE_URL" | gzip > /backups/medannot-$(date +\%Y\%m\%d).sql.gz
```

### Mise à jour de l'application
```bash
# Sur le VPS
cd /var/www/medannot
git pull
npm ci
npm run build
sudo systemctl restart medannot
```

## 🛟 Support et dépannage

### Problèmes courants

**L'application ne démarre pas:**
```bash
# Vérifier les logs
pm2 logs

# Vérifier la configuration
node -e "console.log(require('./server/index.js'))"
```

**Erreur de connexion DB:**
```bash
# Tester la connexion
psql "$DATABASE_URL" -c "SELECT 1"

# Vérifier que PostgreSQL écoute
sudo ss -tlnp | grep 5432
```

**Certificat SSL expiré:**
```bash
# Renouvellement manuel
sudo certbot renew

# Vérifier le renouvellement auto
sudo systemctl status certbot.timer
```

## 📊 Comparaison des coûts

| Service | Actuel (Vercel/Supabase) | Infomaniak | Économie |
|---------|-------------------------|------------|----------|
| Hébergement | ~20$/mois | ~15 CHF | 25% |
| Base de données | ~25$/mois | ~10 CHF | 60% |
| Domaine | Inclus | ~1 CHF | - |
| **Total** | **~45$/mois** | **~26 CHF** | **~50%** |

**Avantages Infomaniak:**
- 🇨🇭 Données en Suisse (RGPD médical)
- 🔒 Souveraineté des données
- 💰 Coût réduit de moitié
- ⚡ Performance équivalente

## 📞 Support

- **Documentation Infomaniak**: https://www.infomaniak.com/fr/support
- **Issues GitHub**: https://github.com/Medannotations/MedAnnot-V1/issues
- **Guide complet**: Voir `MIGRATION_INFOMANIAK_GUIDE.md`

---

**Prochaine étape**: Commande tes produits Infomaniak et je t'aide pour la configuration !
