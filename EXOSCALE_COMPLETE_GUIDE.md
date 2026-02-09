# 🚀 Guide Complet Exoscale - MedAnnot
## De A à Z pour débutant absolu

---

## 📋 SOMMAIRE

1. [Créer un compte Exoscale](#étape-1--créer-un-compte-exoscale-5-min)
2. [Commander les services](#étape-2--commander-les-services-10-min)
3. [Préparer ton ordinateur](#étape-3--préparer-ton-ordinateur-10-min)
4. [Configurer le serveur](#étape-4--configurer-le-serveur-20-min)
5. [Configurer la base de données](#étape-5--configurer-la-base-de-données-15-min)
6. [Déployer l'application](#étape-6--déployer-lapplication-20-min)
7. [Configurer le domaine (Infomaniak)](#étape-7--configurer-le-domaine-infomaniak-10-min)
8. [Configurer SSL](#étape-8--configurer-ssl-10-min)
9. [Migrer les données](#étape-9--migrer-les-données-20-min)
10. [Configurer Stripe](#étape-10--configurer-stripe-10-min)
11. [Tests finaux](#étape-11--tests-finaux-15-min)

---

## 🎯 CE QU'ON VA CRÉER

```
┌─────────────────────────────────────────────────────────────┐
│                    EXOSCALE (Suisse)                        │
│                    Genève / Zurich                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🌐 medannot.ch (chez Infomaniak)                          │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Instance Exoscale (VPS)                            │   │
│  │  • Standard Small (2 vCPU, 4 GB RAM, 50 GB)        │   │
│  │  • Ubuntu 22.04 LTS                                 │   │
│  │  • Zone: ch-gva-2 (Genève) ou ch-dk-2 (Zurich)     │   │
│  │                                                     │   │
│  │  Docker Compose :                                   │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  • Nginx (reverse proxy + SSL)              │   │   │
│  │  │  • Node.js (API MedAnnot)                   │   │   │
│  │  │  • Redis (cache/sessions)                   │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │  DBaaS PostgreSQL (Exoscale)                        │   │
│  │  • PostgreSQL 15                                    │   │
│  │  • Hobbyist (2 vCPU, 4 GB RAM, 20 GB)              │   │
│  │  • Backup quotidien                                 │   │
│  │  • SSL obligatoire                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  💰 Coût total: ~40-45 CHF/mois                            │
│  📍 Localisation: 100% Suisse                              │
│  🔒 Certifications: ISO 27001, FINMA, LPD                  │
└─────────────────────────────────────────────────────────────┘
```

---

## ÉTAPE 1 : Créer un compte Exoscale (5 min)

### 1.1 Aller sur le site
🔗 https://www.exoscale.com/

### 1.2 Créer un compte
1. Clique sur **"Sign Up"** (en haut à droite)
2. Remplis le formulaire :
   ```
   Email: ton-email@exemple.com
   Password: [crée un mot de passe fort]
   Company: MedAnnot (ou ton nom)
   Country: Switzerland
   ```
3. Coche la case "I agree to the Terms of Service"
4. Clique **"Create Account"**

### 1.3 Vérifier l'email
1. Va dans ta boîte mail
2. Trouve l'email de Exoscale
3. Clique sur le lien de confirmation

### 1.4 Ajouter un moyen de paiement
1. Connecte-toi au portal : https://portal.exoscale.com
2. Va dans **"Account"** → **"Billing"**
3. Clique **"Add Credit Card"**
4. Remplis les infos de ta carte
5. Clique **"Save"**

💰 **Ton compte est créé !** Tu as un crédit de démarrage (souvent 10-20 CHF)

---

## ÉTAPE 2 : Commander les services (10 min)

### 2.1 Créer une instance (VPS)

1. Dans le portal Exoscale, clique sur **"Compute"** → **"Instances"**
2. Clique le bouton bleu **"Add"** (en haut à droite)

#### Configuration :

**General**
```
Name: medannot-server
Zone: ch-gva-2 (Genève) ou ch-dk-2 (Zurich)
```

**Template**
```
OS: Linux
Distribution: Ubuntu
Version: Ubuntu 22.04 LTS (64-bit)
```

**Instance Type**
```
Family: Standard
Type: Small
  • 2 vCPU
  • 4 GB RAM
  • 50 GB SSD
```

**Disk Volume**
```
Size: 50 GB (déjà sélectionné)
```

**Network**
```
IPv4: Enabled (coché par défaut)
IPv6: Optionnel (tu peux cocher)
```

**SSH Key** (IMPORTANT !)
```
Si tu as déjà une clé SSH: Sélectionne-la
Sinon: Clique "Add SSH Key" et colle ta clé publique
```

Pour créer une clé SSH (sur ton Mac/Terminal) :
```bash
ssh-keygen -t ed25519 -C "ton-email@exemple.com"
# Appuie sur Entrée 3 fois (pour les valeurs par défaut)
cat ~/.ssh/id_ed25519.pub
# Copie le résultat (ça commence par ssh-ed25519...)
```

**Security Groups**
```
Sélectionne: "default" (on va le configurer après)
```

**User Data** (laisse vide pour l'instant)

3. Clique **"Create"**

⏱️ Attends 1-2 minutes que l'instance soit créée.

💰 **Coût**: ~25 CHF/mois

### 2.2 Créer la base de données PostgreSQL

1. Dans le portal, clique sur **"Database"** → **"PostgreSQL"**
2. Clique **"Add"**

#### Configuration :

**General**
```
Name: medannot-db
Zone: ch-gva-2 (même que ton serveur)
```

**Plan**
```
Type: Hobbyist
  • 2 vCPU
  • 4 GB RAM
  • 20 GB Storage
  • Backup quotidien inclus
```

**Database Configuration**
```
Version: 15
Admin Username: medannot_admin
Admin Password: [CRÉE UN MOT DE PASSE FORT - note-le bien !]
Database Name: medannot
```

**IP Access** (IMPORTANT !)
```
Laisse vide pour l'instant, on va configurer après
```

3. Clique **"Create"**

⏱️ Attends 3-5 minutes que la DB soit créée.

💰 **Coût**: ~15 CHF/mois

### 2.3 Vérifier les créations

Tu dois voir dans le portal :
- ✅ Une instance "medannot-server" (statut: Running)
- ✅ Une base "medannot-db" (statut: Available)

**Note ces informations** (dans un fichier texte) :
- IP de l'instance (ex: 194.182.168.XXX)
- Host de la DB (ex: abc123-0.db.exoscale.com)
- Username DB: medannot_admin
- Password DB: (celui que tu as créé)

---

## ÉTAPE 3 : Préparer ton ordinateur (10 min)

### 3.1 Installer les outils nécessaires

**Sur Mac :**

#### Option A : Installer Homebrew (recommandé)

Homebrew est l'outil de gestion de paquets pour Mac. Ouvre Terminal et tape :

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Suivi les instructions à l'écran (appuie sur Entrée quand on te demande).

**Après installation, ferme et rouvre Terminal**, puis vérifie :
```bash
brew --version
```

Puis installe PostgreSQL client :
```bash
brew install postgresql@15
```

#### Option B : Sans Homebrew (alternative)

Si tu ne veux pas installer Homebrew :
1. Télécharge **PostgreSQL.app** : https://postgresapp.com/
2. Déplace-le dans Applications
3. Lance-le (icône éléphant dans la barre de menu)
4. Clique sur l'icône → "Open psql"

#### Vérifier SSH (déjà sur Mac)
```bash
ssh -V
```
Doit afficher une version.

**Sur Windows :**
1. Télécharge **PuTTY** : https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html
2. Installe-le
3. Télécharge aussi **pgAdmin** : https://www.pgadmin.org/download/

**Sur Linux :**
```bash
sudo apt update
sudo apt install openssh-client postgresql-client
```

### 3.2 Tester la connexion SSH

**Sur Mac/Linux :**
```bash
ssh ubuntu@IP_DE_TON_INSTANCE
# Remplace IP_DE_TON_INSTANCE par l'IP de ton instance Exoscale
```

**Sur Windows (PuTTY) :**
1. Ouvre PuTTY
2. Host Name: `ubuntu@IP_DE_TON_INSTANCE`
3. Port: 22
4. Connection type: SSH
5. Clique "Open"

Si on te demande "Are you sure you want to continue connecting?", tape `yes`

Tu devrais voir :
```
Welcome to Ubuntu 22.04.3 LTS
ubuntu@medannot-server:~$
```

🎉 **Tu es connecté à ton serveur Exoscale !**

Tape `exit` pour te déconnecter (on reviendra après).

---

## ÉTAPE 4 : Configurer le serveur (20 min)

### 4.1 Se connecter et devenir root

```bash
ssh ubuntu@IP_DE_TON_INSTANCE

# Passer root
sudo -i
# Tape le mot de passe (celui fourni par Exoscale, ou si tu as mis une clé SSH, tu es déjà connecté)
```

### 4.2 Lancer le script de configuration automatique

Copie-colle cette commande entière :

```bash
curl -fsSL https://raw.githubusercontent.com/Medannotations/MedAnnot-V1/main/scripts/setup-exoscale.sh | bash
```

Le script va :
- Mettre à jour Ubuntu
- Installer Docker
- Installer Docker Compose
- Configurer le firewall
- Créer l'utilisateur medannot
- Préparer les répertoires

⏱️ Attends environ 5-10 minutes...

### 4.3 Répondre aux questions du script

Le script va te demander :

```
Nom de domaine: medannot.ch
Email pour SSL: ton-email@exemple.com
Utilisateur: medannot
```

### 4.4 Vérifier que tout est OK

À la fin, tu devrais voir :
```
✅ SETUP EXOSCALE TERMINÉ !
```

### 4.5 Se déconnecter et se reconnecter avec le nouvel utilisateur

```bash
# Se déconnecter
exit
exit

# Se reconnecter avec le nouvel utilisateur
ssh medannot@IP_DE_TON_INSTANCE
```

Le mot de passe est celui que tu as défini pendant le setup.

---

## ÉTAPE 5 : Configurer la base de données (15 min)

### 5.1 Configurer l'accès IP (Security Group)

Dans le portal Exoscale :

1. Va dans **"Network"** → **"Security Groups"**
2. Clique sur **"default"**
3. Clique **"Add Rule"**

Règle 1 - SSH :
```
Type: SSH
Protocol: TCP
Port: 22
CIDR: 0.0.0.0/0 (ou ton IP personnelle pour plus de sécurité)
```

Règle 2 - HTTP :
```
Type: HTTP
Protocol: TCP
Port: 80
CIDR: 0.0.0.0/0
```

Règle 3 - HTTPS :
```
Type: HTTPS
Protocol: TCP
Port: 443
CIDR: 0.0.0.0/0
```

Règle 4 - PostgreSQL (pour la DB) :
```
Type: Custom TCP
Port: 5432
CIDR: IP_DE_TON_INSTANCE/32 (l'IP de ton serveur uniquement !)
```

### 5.2 Créer l'utilisateur applicatif dans PostgreSQL

Dans le portal Exoscale :

1. Va dans **"Database"** → **"PostgreSQL"**
2. Clique sur **"medannot-db"**
3. Va dans l'onglet **"Users"**
4. Clique **"Add User"**

```
Username: medannot_app
Password: [crée un mot de passe fort]
Roles: Login, Createdb
```

Clique **"Add"**

### 5.3 Créer la base de données

1. Dans l'onglet **"Databases"**
2. Clique **"Add Database"**
3. Name: `medannot`
4. Owner: `medannot_app`
5. Clique **"Add"**

### 5.4 Autoriser l'IP du serveur

1. Dans l'onglet **"Access Control"**
2. Clique **"Add Source"**
3. IP Address: `IP_DE_TON_INSTANCE` (l'IP de ton serveur)
4. Description: `medannot-server`
5. Clique **"Add"**

### 5.5 Tester la connexion

Sur ton ordinateur (pas sur le serveur) :

```bash
psql "postgresql://medannot_app:MOT_DE_PASSE@HOST.exoscale.com:5432/medannot"
```

Remplace :
- `MOT_DE_PASSE` par le mot de passe de medannot_app
- `HOST` par l'host de ta DB (dans le portal, onglet "Overview")

Tu devrais voir :
```
psql (15.x)
SSL connection (protocol: TLSv1.3)
Type "help" for help.

medannot=>
```

Tape `\q` pour quitter.

🎉 **La base de données est configurée !**

### 5.6 Importer le schéma

```bash
# Télécharger le schéma
curl -o schema.sql https://raw.githubusercontent.com/Medannotations/MedAnnot-V1/main/server/schema.sql

# Importer
psql "postgresql://medannot_app:MOT_DE_PASSE@HOST.exoscale.com:5432/medannot" < schema.sql
```

Vérifie :
```bash
psql "postgresql://medannot_app:MOT_DE_PASSE@HOST.exoscale.com:5432/medannot" -c "\dt"
```

Tu devrais voir les tables `annotations`, `patients`, `profiles`...

---

## ÉTAPE 6 : Déployer l'application (20 min)

### 6.1 Se connecter au serveur

```bash
ssh medannot@IP_DE_TON_INSTANCE
```

### 6.2 Cloner le repository

```bash
cd /opt/medannot
git clone https://github.com/Medannotations/MedAnnot-V1.git .
```

### 6.3 Créer le fichier de configuration

```bash
cp .env.exoscale.example .env
nano .env
```

Remplis avec tes vraies informations :

```env
# =====================================================
# EXOSCALE CONFIGURATION
# =====================================================

# Database (Exoscale DBaaS)
DATABASE_URL=postgresql://medannot_app:MOT_DE_PASSE@HOST.exoscale.com:5432/medannot
PGHOST=HOST.exoscale.com
PGPORT=5432
PGDATABASE=medannot
PGUSER=medannot_app
PGPASSWORD=MOT_DE_PASSE

# Application
NODE_ENV=production
PORT=3000
VITE_APP_URL=https://medannot.ch

# JWT Secret (génère : openssl rand -base64 64)
JWT_SECRET=COLLE_ICI_LE_RESULTAT

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_TA_CLE
STRIPE_SECRET_KEY=sk_live_TA_CLE
STRIPE_WEBHOOK_SECRET=whsec_A_DEFINIR

# Email (optionnel)
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_USER=noreply@medannot.ch
SMTP_PASS=MOT_DE_PASSE
```

**Pour générer le JWT_SECRET :**

Sur ton Mac, dans un autre terminal, exécute l'une de ces commandes :

```bash
# Option 1 : Avec openssl (généralement déjà installé)
openssl rand -base64 64

# Option 2 : Si openssl n'est pas installé
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Option 3 : Générer manuellement (aller sur https://www.grc.com/passwords.htm)
# Copie 64 caractères aléatoires
```

Copie le résultat dans le fichier.

Sauvegarde : Ctrl+O, Entrée, Ctrl+X

### 6.4 Lancer l'application avec Docker

```bash
# Construire et démarrer
docker compose up -d

# Vérifier que tout tourne
docker ps
```

Tu devrais voir 3 conteneurs :
- medannot-app
- medannot-nginx
- medannot-redis

### 6.5 Tester l'application

```bash
# Test local
curl http://localhost:3000/api/health
```

Tu devrais voir :
```json
{"status":"ok","timestamp":"...","version":"1.0.0"}
```

🎉 **L'application tourne sur le serveur !**

---

## ÉTAPE 7 : Configurer le domaine (Infomaniak) (10 min)

### 7.1 Aller dans le Manager Infomaniak

🔗 https://manager.infomaniak.com

### 7.2 Configurer les DNS

1. Va dans **"Domain"** → **"medannot.ch"**
2. Clique sur **"DNS Zone"**
3. Supprime les entrées A existantes (s'il y en a)
4. Ajoute ces entrées :

**Entrée 1 - Domaine principal :**
```
Type: A
Nom: @
Cible: IP_DE_TON_INSTANCE_EXOSCALE
TTL: 3600
```

**Entrée 2 - WWW :**
```
Type: A
Nom: www
Cible: IP_DE_TON_INSTANCE_EXOSCALE
TTL: 3600
```

5. Clique **"Sauvegarder"**

### 7.3 Attendre la propagation

⏱️ Attends 5 à 30 minutes que les DNS se propagent.

### 7.4 Vérifier

Sur ton ordinateur :
```bash
ping medannot.ch
```

Tu devrais voir l'IP de ton serveur Exoscale.

---

## ÉTAPE 8 : Configurer SSL (10 min)

### 8.1 Générer le certificat SSL

Sur le serveur (connecté en SSH) :

```bash
# Arrêter temporairement nginx pour libérer le port 80
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
  --email ton-email@exemple.com \
  --agree-tos \
  --non-interactive

# Redémarrer nginx
docker compose up -d nginx
```

### 8.2 Tester HTTPS

Sur ton ordinateur :
```bash
curl https://medannot.ch/api/health
```

Tu devrais voir le JSON de santé, et le certificat doit être valide !

🔒 **SSL est configuré !**

---

## ÉTAPE 9 : Migrer les données (20 min)

### 9.1 Récupérer les infos Supabase

1. Va sur https://supabase.com/dashboard
2. Clique sur ton projet
3. Va dans **Settings** → **Database**
4. Sous "Connection string", choisis "PSQL"
5. Note ces informations :
   - Host (ex: `db.XXX.supabase.co`)
   - Port (généralement `5432`)
   - Database (`postgres`)
   - User (`postgres`)
   - Password (clique sur "Show password")

### 9.2 Option A : Migration depuis le serveur (plus simple)

Connecte-toi au serveur Exoscale et fais tout depuis là :

```bash
# Se connecter au serveur
ssh medannot@IP_EXOSCALE

# Créer un fichier avec les variables (remplace les valeurs)
export SUPABASE_HOST="db.XXX.supabase.co"
export SUPABASE_USER="postgres"
export SUPABASE_PASS="TON_MOT_DE_PASSE_SUPABASE"
export EXO_HOST="abc123-0.db.exoscale.com"
export EXO_USER="medannot_app"
export EXO_PASS="TON_MOT_DE_PASSE_EXOSCALE"

# Exporter depuis Supabase
docker run --rm -v /tmp:/tmp postgres:15-alpine pg_dump \
  "postgresql://$SUPABASE_USER:$SUPABASE_PASS@$SUPABASE_HOST:5432/postgres" \
  --data-only \
  --table=profiles \
  --table=patients \
  --table=annotations \
  > /tmp/migration.sql

# Vérifier que le fichier existe
ls -lh /tmp/migration.sql

# Importer dans Exoscale
docker run --rm -v /tmp:/tmp postgres:15-alpine psql \
  "postgresql://$EXO_USER:$EXO_PASS@$EXO_HOST:5432/medannot" \
  -f /tmp/migration.sql

# Vérifier
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM profiles;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM patients;"
```

### 9.3 Option B : Migration depuis ton Mac (si tu as Homebrew)

Si tu as installé Homebrew et PostgreSQL sur ton Mac :

```bash
# Exporter depuis Supabase
pg_dump "postgresql://postgres:MDP_SUPABASE@db.XXX.supabase.co:5432/postgres" \
  --data-only \
  --table=profiles \
  --table=patients \
  --table=annotations \
  > migration.sql

# Transférer sur le serveur
scp migration.sql medannot@IP_EXOSCALE:/tmp/

# Se connecter et importer
ssh medannot@IP_EXOSCALE
psql "$DATABASE_URL" < /tmp/migration.sql
```

### 9.3 Vérifier

```bash
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM profiles;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM patients;"
```

Tu devrais voir les mêmes nombres que dans Supabase.

🎉 **Données migrées !**

---

## ÉTAPE 10 : Configurer Stripe (10 min)

### 10.1 Mettre à jour le webhook

1. Va sur https://dashboard.stripe.com/webhooks
2. Supprime l'ancien webhook (celui de Supabase)
3. Clique **"Add endpoint"**

```
Endpoint URL: https://medannot.ch/api/webhooks/stripe
Description: MedAnnot Exoscale Production
```

Sélectionne ces événements :
- ✅ checkout.session.completed
- ✅ customer.subscription.updated
- ✅ customer.subscription.deleted
- ✅ invoice.payment_failed

Clique **"Add endpoint"**

### 10.2 Récupérer le secret

Clique sur le nouveau webhook créé.

À droite, clique **"Reveal"** sous **"Signing secret"**

Copie la valeur (commence par `whsec_`)

### 10.3 Mettre à jour la configuration

Sur le serveur :
```bash
ssh medannot@IP_EXOSCALE
cd /opt/medannot
nano .env
```

Remplace :
```env
STRIPE_WEBHOOK_SECRET=whsec_TON_NOUVEAU_SECRET
```

Sauvegarde et redémarre :
```bash
docker compose restart app
```

---

## ÉTAPE 11 : Tests finaux (15 min)

### 11.1 Checklist des tests

Ouvre ton navigateur et teste :

- [ ] **Page d'accueil** : https://medannot.ch charge correctement
- [ ] **SSL valide** : Cadenas vert dans la barre d'adresse
- [ ] **Inscription** : Crée un compte test
- [ ] **Connexion** : Connecte-toi avec le compte
- [ ] **Créer un patient** : Ajoute un patient fictif
- [ ] **Créer une annotation** : Écris une annotation
- [ ] **Paiement test** : (En mode TEST Stripe d'abord !)
  - Utilise la carte : `4242 4242 4242 4242`
  - Date : `12/25`
  - CVC : `123`
- [ ] **Portail Stripe** : Dans Paramètres > Abonnement, clique "Gérer sur Stripe"

### 11.2 Tester la charge (optionnel)

Si tout fonctionne, teste avec plusieurs onglets ouverts simultanément.

### 11.3 Vérifier les logs

Sur le serveur :
```bash
docker compose logs -f app
```

Tu ne devrais voir aucune erreur rouge.

---

## 🎉 GO LIVE !

Si tous les tests passent :

1. **Passe Stripe en LIVE**
   - Dans Stripe Dashboard, active le compte
   - Remplace les clés test par les clés LIVE dans `.env`
   - Redémarre : `docker compose restart app`

2. **Annonce le lancement !**

3. **Surveille les premiers jours**
   - Logs : `docker compose logs -f app`
   - Métriques Exoscale dans le portal

---

## 🔧 MAINTENANCE QUOTIDIENNE

### Voir les logs
```bash
ssh medannot@IP_EXOSCALE
cd /opt/medannot
docker compose logs -f app
```

### Redémarrer l'application
```bash
docker compose restart app
```

### Mettre à jour l'application
```bash
git pull
docker compose down
docker compose up -d --build
```

### Backup manuel de la DB
```bash
docker exec -t medannot-db pg_dump -U medannot_app medannot > backup-$(date +%Y%m%d).sql
```

### Voir l'espace disque
```bash
df -h
docker system df
```

---

## 🆘 DÉPANNAGE

### "Connection refused"
```bash
docker ps
# Vérifie que les conteneurs tournent

docker compose logs app
# Voir les erreurs
```

### "Database connection failed"
- Vérifie l'IP dans Security Group (port 5432)
- Vérifie les credentials dans `.env`
- Vérifie que la DB est "Running" dans le portal Exoscale

### "502 Bad Gateway"
```bash
docker compose restart nginx app
```

### Certificat SSL expiré
Renouvellement automatique, mais si besoin :
```bash
docker compose run --rm certbot renew
docker compose restart nginx
```

### Pas assez d'espace disque
```bash
docker system prune -a
# Supprime les images inutilisées
```

---

## 📞 SUPPORT

| Problème | Contact |
|----------|---------|
| Exoscale (infrastructure) | support@exoscale.com ou ticket dans le portal |
| Application MedAnnot | Moi / GitHub Issues |
| Domaine Infomaniak | support.infomaniak.com |
| Stripe | support.stripe.com |

---

## ✅ CHECKLIST FINALE

Avant de dire "c'est bon", vérifie :

- [ ] https://medannot.ch accessible
- [ ] Cadenas SSL vert
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Création patient fonctionne
- [ ] Création annotation fonctionne
- [ ] Paiement Stripe fonctionne (test)
- [ ] Portail Stripe fonctionne
- [ ] Données migrées (vérifie quelques patients)
- [ ] Backup configuré (vérifié dans Exoscale portal)
- [ ] Email de confirmation reçu (si SMTP configuré)

---

## 💰 COÛTS MENSUELS

| Service | Prix |
|---------|------|
| Exoscale Instance (2vCPU/4GB) | ~25 CHF |
| Exoscale DBaaS PostgreSQL | ~15 CHF |
| Infomaniak Domaine | ~1 CHF |
| **Total** | **~41 CHF/mois** |

**Pour 50 utilisateurs** : ~0.82 CHF/utilisateur/mois

---

## 🎉 FÉLICITATIONS !

Tu as déployé MedAnnot sur **Exoscale** avec :
- ✅ Infrastructure 100% Suisse
- ✅ ISO 27001 / FINMA / LPD compliant
- ✅ Haute disponibilité
- ✅ Backup automatique
- ✅ SSL gratuit
- ✅ Scalabilité (upgrade facile)

**Ton SaaS médical est en ligne et prêt à accueillir des clients !** 🚀

---

Besoin d'aide ? Envoie-moi :
1. Le numéro de l'étape où tu bloques
2. Le message d'erreur exact
3. Une capture d'écran si possible

Je suis là pour t'aider à chaque étape ! 💪
