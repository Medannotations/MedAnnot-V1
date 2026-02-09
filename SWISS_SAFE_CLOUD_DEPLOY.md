# 🚀 Déploiement Swiss Safe Cloud - Guide Complet

## 📋 Résumé Exécutif

**Hébergeur**: Swiss Safe Cloud (Genève/Zurich)  
**Architecture**: Docker Compose (2 VMs)  
**Base de données**: PostgreSQL managé ou conteneurisé  
**Domaine**: medannot.ch (chez Infomaniak)  
**SSL**: Let's Encrypt automatique  
**Backup**: Automatique 4x/jour  
**Monitoring**: Inclus  

**Coût mensuel estimé**: 90-100 CHF pour 50+ utilisateurs  
**Scaling**: Jusqu'à 500+ utilisateurs sans changement d'architecture

---

## 🛒 ÉTAPE 1: Commander Swiss Safe Cloud

### 1.1 Créer un compte
🔗 https://www.swiss-safe-cloud.ch/  
Contact: Formulaire ou appel direct  

### 1.2 Commander les ressources

**Produits à demander:**

| Produit | Spécifications | Quantité | Prix estimé |
|---------|---------------|----------|-------------|
| **Compute Instance** | 2 vCPU, 4 GB RAM, 50 GB SSD, Ubuntu 22.04 | 2 | ~40 CHF |
| **Load Balancer** | Layer 7, SSL, Health checks | 1 | ~15 CHF |
| **PostgreSQL Managé** | 2 vCPU, 4 GB RAM, 100 GB, HA | 1 | ~35 CHF |
| **Object Storage** | S3 compatible, 50 GB | 1 | ~5 CHF |
| **IP Publique** | Statique | 1 | Inclus |

**Total**: ~95 CHF/mois

### 1.3 Spécifications techniques à demander

```
Réseau:
  - VPC dédié
  - Subnet privé pour DB
  - Subnet public pour apps
  
Sécurité:
  - Firewall: Ports 22, 80, 443 uniquement
  - DDoS protection
  - WAF optionnel
  
Backup:
  - Snapshots quotidiens VMs
  - Backup PostgreSQL 4x/jour
  
Support:
  - 24/7 (inclus)
```

---

## 🔧 ÉTAPE 2: Configuration Initiale

### 2.1 Recevoir les accès

Swiss Safe Cloud t'envoie par email:
- ✅ IPs des 2 VMs
- ✅ Credentials PostgreSQL
- ✅ IP du Load Balancer
- ✅ Clés SSH

### 2.2 Configurer les VMs

```bash
# Se connecter à VM1
ssh ubuntu@<IP_VM1>

# Mettre à jour
sudo apt update && sudo apt upgrade -y

# Installer Docker
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Ajouter le repo Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker

# Vérifier
docker --version
docker compose version
```

### 2.3 Répéter sur VM2

```bash
# Se connecter à VM2
ssh ubuntu@<IP_VM2>

# Faire exactement les mêmes commandes qu'au-dessus
```

---

## 📦 ÉTAPE 3: Déployer l'Application

### 3.1 Cloner le repo sur VM1

```bash
# Sur VM1
mkdir -p /opt/medannot
cd /opt/medannot

# Cloner
git clone https://github.com/Medannotations/MedAnnot-V1.git .

# Créer le fichier .env
sudo nano .env
```

### 3.2 Configuration .env

```env
# =====================================================
# CONFIGURATION SWISS SAFE CLOUD
# =====================================================

# -----------------------------------------------------
# BASE DE DONNÉES (Swiss Safe Cloud PostgreSQL Managé)
# -----------------------------------------------------
DATABASE_URL=postgresql://medannot_user:votre_mot_de_passe@xxxxx.db.swiss-safe-cloud.ch:5432/medannot
PGHOST=xxxxx.db.swiss-safe-cloud.ch
PGPORT=5432
PGDATABASE=medannot
PGUSER=medannot_user
PGPASSWORD=votre_mot_de_passe_fort

# -----------------------------------------------------
# APPLICATION
# -----------------------------------------------------
NODE_ENV=production
PORT=3000
VITE_APP_URL=https://medannot.ch

# -----------------------------------------------------
# AUTHENTIFICATION
# -----------------------------------------------------
JWT_SECRET=votre_jwt_secret_64_caracteres_minimum
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# -----------------------------------------------------
# STRIPE
# -----------------------------------------------------
STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle
STRIPE_SECRET_KEY=sk_live_votre_cle
STRIPE_WEBHOOK_SECRET=whsec_votre_secret

# -----------------------------------------------------
# EMAIL (Infomaniak Mail)
# ----------------------------------------------------=
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_USER=noreply@medannot.ch
SMTP_PASS=votre_mot_de_passe_email
SMTP_FROM=MedAnnot <noreply@medannot.ch>

# ----------------------------------------------------=
# REDIS (optionnel - laissez vide pour utiliser conteneur)
# ----------------------------------------------------=
# REDIS_URL=redis://redis:6379

# ----------------------------------------------------=
# LOGGING
# ----------------------------------------------------=
LOG_LEVEL=info
```

### 3.3 Premier démarrage

```bash
# Créer le répertoire pour les backups
mkdir -p /opt/medannot/backups

# Démarrer les services
docker compose up -d

# Vérifier les logs
docker compose logs -f app
```

### 3.4 Répéter sur VM2

```bash
# Sur VM2
mkdir -p /opt/medannot
cd /opt/medannot

# Copier depuis VM1 (ou git clone)
scp -r ubuntu@<IP_VM1>:/opt/medannot/* .

# Démarrer
docker compose up -d
```

---

## 🌐 ÉTAPE 4: Configurer le Load Balancer

### 4.1 Swiss Safe Cloud Load Balancer

Dans le panel Swiss Safe Cloud:

```yaml
Frontend:
  - Port: 80
    Protocol: HTTP
    Redirect to HTTPS: true
    
  - Port: 443
    Protocol: HTTPS
    Certificate: Let's Encrypt (auto)
    SSL Policy: TLS 1.2+

Backend Pool:
  - Name: medannot-app
    Health Check: HTTP /health (port 80)
    Interval: 10s
    Timeout: 5s
    Healthy Threshold: 2
    Unhealthy Threshold: 3
    
  - Members:
      - VM1: <IP_VM1>:80
      - VM2: <IP_VM2>:80
      
Algorithm: Round Robin (ou Least Connections)

Sticky Sessions: false (stateless)
```

### 4.2 Vérifier la répartition de charge

```bash
# Tester depuis l'extérieur
curl -s https://medannot.ch/api/health

# Devrait répondre depuis différentes VMs
```

---

## 🔒 ÉTAPE 5: SSL Let's Encrypt

### 5.1 Première configuration SSL

```bash
# Sur VM1 (master)
cd /opt/medannot

# Stopper temporairement
docker compose stop nginx

# Générer le certificat
docker run -it --rm \
  -v /opt/medannot/certbot_data:/etc/letsencrypt \
  -v /opt/medannot/certbot_www:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  -d medannot.ch \
  -d www.medannot.ch \
  --email admin@medannot.ch \
  --agree-tos \
  --non-interactive

# Redémarrer
docker compose up -d
```

### 5.2 Renouvellement automatique

Déjà inclus dans docker-compose.yml:
```yaml
certbot:
  # Renouvelle automatiquement tous les 12h
```

---

## 🗃️ ÉTAPE 6: Migration des Données

### 6.1 Exporter depuis Supabase

```bash
# Sur ton ordinateur local
pg_dump "postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres" \
  --data-only \
  --table=profiles \
  --table=patients \
  --table=annotations \
  --table=auth.users \
  > migration_data.sql
```

### 6.2 Importer dans Swiss Safe Cloud

```bash
# Transférer sur VM1
scp migration_data.sql ubuntu@<IP_VM1>:/tmp/

# Se connecter à la DB Swiss Safe Cloud
psql "$DATABASE_URL" < /tmp/migration_data.sql

# Vérifier
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM profiles;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM patients;"
```

---

## 🔄 ÉTAPE 7: CI/CD (GitHub Actions)

### 7.1 Configurer les secrets GitHub

Dans Settings > Secrets and variables > Actions:

```yaml
SSH_PRIVATE_KEY: # Clé SSH privée pour accès VMs
VM1_HOST: <IP_VM1>
VM2_HOST: <IP_VM2>
VM_USER: ubuntu
ENV_PRODUCTION: # Contenu complet du fichier .env
```

### 7.2 Déploiement automatique

Déjà créé: `.github/workflows/deploy-swiss-safe-cloud.yml`

Push sur `main` = déploiement automatique sur les 2 VMs

---

## 📊 ÉTAPE 8: Monitoring

### 8.1 Swiss Safe Cloud Monitoring

Activer dans le panel:
- CPU/RAM usage
- Disk I/O
- Network traffic
- PostgreSQL metrics

### 8.2 Uptime monitoring externe (recommandé)

```bash
# Uptime Kuma (auto-hébergé sur une petite VM)
docker run -d \
  --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  --restart unless-stopped \
  louislam/uptime-kuma:1
```

Configurer checks:
- https://medannot.ch/api/health (toutes les 60s)
- PostgreSQL connection (toutes les 5 min)

---

## 🧪 ÉTAPE 9: Tests Post-Déploiement

### 9.1 Tests fonctionnels

```bash
# Test 1: Santé
curl https://medannot.ch/api/health

# Test 2: Inscription
curl -X POST https://medannot.ch/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","fullName":"Test User"}'

# Test 3: Login
curl -X POST https://medannot.ch/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### 9.2 Tests de charge (optionnel)

```bash
# Installer k6
brew install k6

# Test de charge
k6 run --vus 50 --duration 30s load-test.js
```

---

## 🚀 ÉTAPE 10: Go Live

### 10.1 Checklist finale

- [ ] DNS medannot.ch pointe vers Load Balancer IP
- [ ] SSL fonctionne (https://)
- [ ] Données migrées
- [ ] Stripe webhooks configurés
- [ ] Emails testés
- [ ] Backups fonctionnels
- [ ] Monitoring actif

### 10.2 Mise à jour Stripe Webhooks

```
Ancien: https://xxxx.supabase.co/functions/v1/stripe-webhook
Nouveau: https://medannot.ch/api/webhooks/stripe
```

### 10.3 Couper l'ancien infrastructure

- [ ] Supprimer projet Vercel
- [ ] Désactiver Supabase (garder 1 mois pour rollback)
- [ ] Archiver les anciens webhooks Stripe

---

## 📈 Scaling Futur

### À 100+ utilisateurs
- Augmenter RAM VMs: 4 GB → 8 GB
- Ajouter VM #3
- Activer Redis cluster

### À 500+ utilisateurs
- Migrer vers Kubernetes managé Swiss Safe Cloud
- PostgreSQL cluster (3 nodes)
- CDN pour assets statiques

---

## 🆘 Dépannage

### Problème: "Connection refused"
```bash
# Vérifier si les conteneurs tournent
docker compose ps

# Voir les logs
docker compose logs app
```

### Problème: "Database connection failed"
```bash
# Tester la connexion DB
psql "$DATABASE_URL" -c "SELECT 1"

# Vérifier les credentials dans .env
```

### Problème: SSL expiré
```bash
# Renouvellement manuel
docker compose run --rm certbot renew

# Redémarrer nginx
docker compose restart nginx
```

---

## 📞 Support

| Problème | Contact |
|----------|---------|
| Infrastructure Swiss Safe Cloud | support@swiss-safe-cloud.ch |
| Application MedAnnot | Créer issue GitHub |
| Urgence production | Téléphone Swiss Safe Cloud 24/7 |

---

## ✅ Prochaine étape

**Commande Swiss Safe Cloud** → Envoie ce devis:

```
Devis MedAnnot - Swiss Safe Cloud

Compute:
  - 2x Instance "Standard" (2 vCPU, 4 GB RAM, 50 GB SSD)
  - OS: Ubuntu 22.04 LTS
  - Localisation: Genève

Database:
  - PostgreSQL 15 Managé
  - 2 vCPU, 4 GB RAM, 100 GB SSD
  - HA: Primary + Standby
  - Backups: 4x/jour, 30 jours rétention

Network:
  - Load Balancer Layer 7
  - SSL Let's Encrypt
  - DDoS protection
  - 1x IP publique

Support:
  - 24/7 inclus

Prix mensuel estimé: ~95 CHF
Durée engagement: Sans engagement / 1 an
```

---

**Dès que tu as les accès Swiss Safe Cloud, je t'aide pour chaque étape !** 🚀
