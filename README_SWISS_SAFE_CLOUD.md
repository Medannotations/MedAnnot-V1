# 🚀 MedAnnot sur Swiss Safe Cloud

## 📋 Vue d'ensemble

Déploiement production-grade de MedAnnot sur **Swiss Safe Cloud** avec:
- ✅ Haute disponibilité (2 VMs + Load Balancer)
- ✅ Auto-scaling ready
- ✅ Zero-downtime deployment
- ✅ Backup automatisé
- ✅ Monitoring complet

## 🏗️ Architecture

```
                    Internet
                       │
                       ▼
              ┌─────────────────┐
              │  CloudFlare/    │
              │  DNS Infomaniak │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Swiss Safe     │
              │  Load Balancer  │
              │  (SSL/TLS)      │
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            │            ▼
   ┌────────────┐      │    ┌────────────┐
   │   VM #1    │◄─────┴───►│   VM #2    │
   │  (Docker)  │           │  (Docker)  │
   │            │           │            │
   │ • Nginx    │           │ • Nginx    │
   │ • Node.js  │           │ • Node.js  │
   │ • App      │           │ • App      │
   └──────┬─────┘           └──────┬─────┘
          │                        │
          └────────────┬───────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  PostgreSQL     │
              │  Managé SSC     │
              │  (HA)           │
              └─────────────────┘
```

## 📦 Contenu du Package

### Fichiers créés

| Fichier | Description |
|---------|-------------|
| `Dockerfile` | Multi-stage build (frontend + backend) |
| `docker-compose.yml` | Stack complète avec Nginx, Redis, Backup |
| `nginx/nginx.conf` | Configuration optimisée performances |
| `scripts/deploy-swiss-safe-cloud.sh` | Déploiement manuel |
| `.github/workflows/deploy-swiss-safe-cloud.yml` | CI/CD automatique |
| `SWISS_SAFE_CLOUD_DEPLOY.md` | Guide complet pas à pas |
| `SWISS_SAFE_CLOUD_ARCHITECTURE.md` | Détails architecture |

### Structure

```
MedAnnot-V1/
├── Dockerfile
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
├── scripts/
│   ├── setup-vps.sh
│   ├── deploy-swiss-safe-cloud.sh
│   └── backup-complete.sh
├── .github/
│   └── workflows/
│       └── deploy-swiss-safe-cloud.yml
├── server/
│   ├── index.js
│   ├── schema.sql
│   └── package.json
├── SWISS_SAFE_CLOUD_DEPLOY.md
├── SWISS_SAFE_CLOUD_ARCHITECTURE.md
└── README_SWISS_SAFE_CLOUD.md
```

## 🚀 Démarrage Rapide

### 1. Commander Swiss Safe Cloud

Envoyer ce devis à Swiss Safe Cloud:

```
Devis MedAnnot - Mise en production

COMPUTE:
  - 2x Instance "Standard" 
    • 2 vCPU, 4 GB RAM, 50 GB SSD
    • Ubuntu 22.04 LTS
    • Localisation: Genève
    • ~40 CHF/mois

DATABASE:
  - PostgreSQL 15 Managé
    • 2 vCPU, 4 GB RAM, 100 GB SSD
    • HA: Primary + Standby
    • Backup: 4x/jour, 30 jours rétention
    • ~35 CHF/mois

NETWORK:
  - Load Balancer Layer 7
    • SSL Let's Encrypt
    • Health checks HTTP
    • DDoS protection
    • ~15 CHF/mois

OBJECT STORAGE (optionnel):
  - S3 Compatible
    • 50 GB
    • ~5 CHF/mois

TOTAL: ~95 CHF/mois
SUPPORT: 24/7 inclus
ENGAGEMENT: Sans engagement
```

### 2. Configuration VMs

```bash
# Sur chaque VM (VM1 et VM2)
ssh ubuntu@<IP_VM>

# Installer Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Créer répertoire
sudo mkdir -p /opt/medannot
sudo chown $USER:$USER /opt/medannot
cd /opt/medannot

# Cloner repo
git clone https://github.com/Medannotations/MedAnnot-V1.git .

# Configurer environnement
cp .env.infomaniak.example .env
nano .env  # Remplir les valeurs

# Démarrer
docker compose up -d
```

### 3. Configuration DNS (Infomaniak)

```
Type A: @     -> <IP_LOAD_BALANCER>
Type A: www   -> <IP_LOAD_BALANCER>
```

### 4. SSL Let's Encrypt

```bash
# Sur VM1
cd /opt/medannot

# Générer certificat
docker compose run --rm certbot certonly \
  --standalone \
  -d medannot.ch \
  -d www.medannot.ch \
  --email admin@medannot.ch \
  --agree-tos \
  --non-interactive

# Redémarrer
docker compose restart nginx
```

## 🔄 Déploiement CI/CD

### Configuration GitHub Secrets

Dans Settings > Secrets and variables > Actions:

```yaml
SSH_PRIVATE_KEY:    # Clé SSH privée
VM1_HOST:           # IP VM1
VM2_HOST:           # IP VM2
VM_USER:            # ubuntu
ENV_PRODUCTION:     # Contenu fichier .env
VITE_API_URL:       # https://medannot.ch/api
```

### Déploiement automatique

Push sur `main` → Déploiement auto sur VM1 + VM2

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# Attendre 2-3 minutes
# Vérifier: https://medannot.ch/api/health
```

## 📊 Monitoring

### Health Checks

```bash
# Application
curl https://medannot.ch/api/health

# Database
psql "$DATABASE_URL" -c "SELECT 1"

# Load Balancer (via Swiss Safe Cloud panel)
```

### Logs

```bash
# Sur les VMs
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f postgres
```

### Métriques Swiss Safe Cloud

Accéder au panel pour voir:
- CPU/RAM usage
- Disk I/O
- Network traffic
- PostgreSQL metrics

## 💰 Coûts

| Composant | Coût mensuel |
|-----------|-------------|
| 2x Compute (2vCPU/4GB) | ~40 CHF |
| PostgreSQL Managé | ~35 CHF |
| Load Balancer | ~15 CHF |
| Object Storage (opt) | ~5 CHF |
| **Total** | **~95 CHF** |

Comparaison:
- Avant (Vercel + Supabase): ~50$/mois
- Après (Swiss Safe Cloud): ~95 CHF/mois (~100$)
- **Différence**: +100% mais avec:
  - ✅ Haute disponibilité
  - ✅ Souveraineté totale
  - ✅ Scalabilité
  - ✅ Support 24/7

## 🆘 Support

### Problèmes courants

**Application ne démarre pas:**
```bash
docker compose logs app
# Vérifier .env
# Vérifier connexion DB
```

**Erreur 502 Bad Gateway:**
```bash
# Vérifier si app écoute sur port 3000
docker compose ps
# Redémarrer
docker compose restart
```

**SSL expiré:**
```bash
docker compose run --rm certbot renew
docker compose restart nginx
```

### Contacts

| Problème | Contact |
|----------|---------|
| Infrastructure SSC | support@swiss-safe-cloud.ch |
| Application | GitHub Issues |
| Urgence | Tél: +41 XX XXX XX XX |

## 📈 Scaling

### À 100+ utilisateurs

Augmenter les specs:
```yaml
# docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 4G
```

### À 500+ utilisateurs

Migrer vers Kubernetes:
- Swiss Safe Cloud Kubernetes managé
- 3+ nodes
- PostgreSQL cluster
- CDN

## 🎉 Prochaines étapes

1. [ ] Commander Swiss Safe Cloud
2. [ ] Recevoir accès VMs
3. [ ] Configurer VMs (Docker)
4. [ ] Déployer application
5. [ ] Configurer DNS + SSL
6. [ ] Migrer données
7. [ ] Tester production
8. [ ] 🚀 Go Live!

---

**Besoin d'aide?** Je suis là pour chaque étape! 🚀
