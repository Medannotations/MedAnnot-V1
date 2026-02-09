#!/bin/bash
# Script d'installation automatique du VPS Infomaniak
# À exécuter sur le VPS fraîchement créé
# Usage: curl -fsSL https://raw.githubusercontent.com/.../setup-vps.sh | bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     SETUP VPS MEDANNOT - Infomaniak Cloud                ║"
echo "║     Configuration automatique du serveur                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Vérifier root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Erreur: Exécutez ce script en root${NC}"
    exit 1
fi

# Demander les informations
read -p "Nom de domaine (ex: medannot.ch): " DOMAIN
read -p "Email pour Let's Encrypt: " EMAIL
read -p "Nom d'utilisateur applicatif [medannot]: " APP_USER
APP_USER=${APP_USER:-medannot}

echo ""
echo -e "${YELLOW}📋 Récapitulatif:${NC}"
echo "  Domaine: $DOMAIN"
echo "  Email: $EMAIL"
echo "  Utilisateur: $APP_USER"
echo ""
read -p "Continuer? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo -e "${GREEN}🚀 Démarrage de l'installation...${NC}"
echo ""

# =====================================================
# 1. MISE À JOUR DU SYSTÈME
# =====================================================
echo -e "${YELLOW}[1/10] Mise à jour du système...${NC}"
apt update && apt upgrade -y
apt install -y curl wget git vim htop ufw fail2ban

# =====================================================
# 2. NODE.JS 20.x
# =====================================================
echo -e "${YELLOW}[2/10] Installation de Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version
npm --version

# =====================================================
# 3. NGINX
# =====================================================
echo -e "${YELLOW}[3/10] Installation de Nginx...${NC}"
apt install -y nginx
cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx

# =====================================================
# 4. POSTGRESQL (Option B - Local)
# =====================================================
echo -e "${YELLOW}[4/10] Installation de PostgreSQL...${NC}"
apt install -y postgresql postgresql-contrib

systemctl start postgresql
systemctl enable postgresql

# =====================================================
# 5. CRÉATION UTILISATEUR
# =====================================================
echo -e "${YELLOW}[5/10] Création de l'utilisateur $APP_USER...${NC}"
if ! id "$APP_USER" &>/dev/null; then
    adduser --disabled-password --gecos "" $APP_USER
    usermod -aG sudo $APP_USER
fi

# =====================================================
# 6. FIREWALL
# =====================================================
echo -e "${YELLOW}[6/10] Configuration du firewall...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable
ufw status

# =====================================================
# 7. FAIL2BAN
# =====================================================
echo -e "${YELLOW}[7/10] Configuration de Fail2ban...${NC}"
systemctl enable fail2ban
systemctl start fail2ban

# =====================================================
# 8. CERTBOT SSL
# =====================================================
echo -e "${YELLOW}[8/10] Installation de Certbot...${NC}"
apt install -y certbot python3-certbot-nginx

# On attend d'avoir le DNS configuré pour générer le certificat
echo -e "${YELLOW}⚠️  Important: Configurez votre DNS pour pointer vers ce serveur:${NC}"
ip addr show | grep "inet " | head -1 | awk '{print "     IP: " $2}' | cut -d/ -f1
echo "     Type A: $DOMAIN -> IP du serveur"
echo "     Type A: www.$DOMAIN -> IP du serveur"
echo ""
echo -e "${GREEN}Puis exécutez:${NC}"
echo "     certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""

# =====================================================
# 9. PM2
# =====================================================
echo -e "${YELLOW}[9/10] Installation de PM2...${NC}"
npm install -g pm2
pm2 startup systemd -u $APP_USER --hp /home/$APP_USER

# =====================================================
# 10. RÉPERTOIRE APPLICATION
# =====================================================
echo -e "${YELLOW}[10/10] Création des répertoires...${NC}"
mkdir -p /var/www/medannot
chown -R $APP_USER:$APP_USER /var/www/medannot

# Créer le fichier de service systemd
cat > /etc/systemd/system/medannot.service << EOF
[Unit]
Description=MedAnnot API Server
After=network.target

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=/var/www/medannot
ExecStart=/usr/bin/node server/index.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable medannot

# =====================================================
# RÉSUMÉ
# =====================================================
echo ""
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     ✅ SETUP TERMINÉ                                     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${YELLOW}Prochaines étapes:${NC}"
echo ""
echo "1. ${GREEN}Configurer le DNS${NC} pour pointer $DOMAIN vers ce serveur"
echo "   IP: $(ip addr show | grep 'inet ' | head -1 | awk '{print $2}' | cut -d/ -f1)"
echo ""
echo "2. ${GREEN}Générer le certificat SSL:${NC}"
echo "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "3. ${GREEN}Configurer la base de données:${NC}"
echo "   sudo -u postgres psql"
echo "   CREATE USER medannot WITH PASSWORD 'votre_mot_de_passe';"
echo "   CREATE DATABASE medannot OWNER medannot;"
echo ""
echo "4. ${GREEN}Cloner l'application:${NC}"
echo "   su - $APP_USER"
echo "   cd /var/www/medannot"
echo "   git clone https://github.com/Medannotations/MedAnnot-V1.git ."
echo ""
echo "5. ${GREEN}Configurer l'environnement:${NC}"
echo "   cp .env.example .env"
echo "   nano .env"
echo ""
echo "6. ${GREEN}Démarrer l'application:${NC}"
echo "   npm ci"
echo "   npm run build"
echo "   sudo systemctl start medannot"
echo ""
echo -e "${GREEN}Documentation complète: MIGRATION_INFOMANIAK_GUIDE.md${NC}"
echo ""
