#!/bin/bash
# =====================================================
# Setup VPS Infomaniak - Version Simple
# 1 VPS + 1 PostgreSQL Cloud
# =====================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     SETUP INFOMANIAK - MedAnnot                         ║"
echo "║     Configuration simplifiée                            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Vérifier root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Erreur: Exécutez ce script en root${NC}"
    exit 1
fi

# Questions
read -p "Nom de domaine (ex: medannot.ch): " DOMAIN
read -p "Email pour Let's Encrypt: " EMAIL
read -p "Nom d'utilisateur applicatif [medannot]: " APP_USER
APP_USER=${APP_USER:-medannot}
read -s -p "Mot de passe pour $APP_USER: " APP_PASSWORD
echo

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
# 1. MISE À JOUR
# =====================================================
echo -e "${YELLOW}[1/8] Mise à jour du système...${NC}"
export DEBIAN_FRONTEND=noninteractive
apt update && apt upgrade -y
apt install -y curl wget git vim htop ufw fail2ban software-properties-common

# =====================================================
# 2. NODE.JS
# =====================================================
echo -e "${YELLOW}[2/8] Installation de Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version
npm --version

# =====================================================
# 3. NGINX
# =====================================================
echo -e "${YELLOW}[3/8] Installation de Nginx...${NC}"
apt install -y nginx
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name DOMAIN www.DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF
sed -i "s/DOMAIN/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx

# =====================================================
# 4. CRÉATION UTILISATEUR
# =====================================================
echo -e "${YELLOW}[4/8] Création de l'utilisateur $APP_USER...${NC}"
if ! id "$APP_USER" &>/dev/null; then
    adduser --disabled-password --gecos "" $APP_USER
    echo "$APP_USER:$APP_PASSWORD" | chpasswd
    usermod -aG sudo $APP_USER
fi

# =====================================================
# 5. FIREWALL
# =====================================================
echo -e "${YELLOW}[5/8] Configuration du firewall...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# =====================================================
# 6. FAIL2BAN
# =====================================================
echo -e "${YELLOW}[6/8] Configuration de Fail2ban...${NC}"
systemctl enable fail2ban
systemctl start fail2ban

# =====================================================
# 7. CERTBOT
# =====================================================
echo -e "${YELLOW}[7/8] Installation de Certbot...${NC}"
snap install core
snap refresh core
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

echo -e "${YELLOW}⚠️  SSL sera configuré après le déploiement${NC}"

# =====================================================
# 8. RÉPERTOIRES
# =====================================================
echo -e "${YELLOW}[8/8] Création des répertoires...${NC}"
mkdir -p /var/www/$APP_USER
chown -R $APP_USER:$APP_USER /var/www/$APP_USER

# Créer le fichier de service systemd
cat > /etc/systemd/system/medannot.service << EOF
[Unit]
Description=MedAnnot Application
After=network.target

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=/var/www/$APP_USER
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
echo "║     ✅ SETUP TERMINÉ !                                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${YELLOW}Prochaines étapes:${NC}"
echo ""
echo "1. ${GREEN}Créer la base PostgreSQL${NC} chez Infomaniak"
echo "   https://www.infomaniak.com/fr/hebergement/serveur-cloud"
echo ""
echo "2. ${GREEN}Configurer le DNS${NC} pour $DOMAIN"
echo "   Type A: @ -> $(hostname -I | awk '{print $1}')"
echo "   Type A: www -> $(hostname -I | awk '{print $1}')"
echo ""
echo "3. ${GREEN}Se connecter avec l'utilisateur $APP_USER${NC}:"
echo "   ssh $APP_USER@$(hostname -I | awk '{print $1}')"
echo "   Mot de passe: celui que tu as entré"
echo ""
echo "4. ${GREEN}Déployer l'application${NC} (voir guide complet)"
echo "   cd /var/www/$APP_USER"
echo "   git clone https://github.com/Medannotations/MedAnnot-V1.git ."
echo ""
echo -e "${GREEN}Guide complet: INFOMANIAK_COMPLETE_GUIDE.md${NC}"
echo ""
