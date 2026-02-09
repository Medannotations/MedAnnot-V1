#!/bin/bash
# =====================================================
# Setup VPS Exoscale - MedAnnot
# Script automatique pour débutant
# =====================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     SETUP EXOSCALE - MedAnnot                           ║"
echo "║     Configuration automatique du serveur                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Vérifier root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Erreur: Exécutez ce script en root (sudo -i)${NC}"
    exit 1
fi

# Questions
echo -e "${YELLOW}Configuration requise:${NC}"
read -p "Nom de domaine (ex: medannot.ch): " DOMAIN
read -p "Email pour SSL Let's Encrypt: " EMAIL
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
# 1. MISE À JOUR SYSTÈME
# =====================================================
echo -e "${YELLOW}[1/10] Mise à jour du système...${NC}"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y
apt-get install -y curl wget git vim htop ufw fail2ban apt-transport-https ca-certificates gnupg lsb-release

# =====================================================
# 2. INSTALLER DOCKER
# =====================================================
echo -e "${YELLOW}[2/10] Installation de Docker...${NC}"
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Vérifier
docker --version
docker compose version

# =====================================================
# 3. CONFIGURER FIREWALL
# =====================================================
echo -e "${YELLOW}[3/10] Configuration du firewall...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable
ufw status

# =====================================================
# 4. INSTALLER FAIL2BAN
# =====================================================
echo -e "${YELLOW}[4/10] Installation de Fail2ban...${NC}"
systemctl enable fail2ban
systemctl start fail2ban

# =====================================================
# 5. CRÉER UTILISATEUR
# =====================================================
echo -e "${YELLOW}[5/10] Création de l'utilisateur $APP_USER...${NC}"
if ! id "$APP_USER" &>/dev/null; then
    adduser --disabled-password --gecos "" $APP_USER
    echo "$APP_USER:$APP_PASSWORD" | chpasswd
    usermod -aG sudo $APP_USER
fi
usermod -aG docker $APP_USER

# =====================================================
# 6. CRÉER RÉPERTOIRES
# =====================================================
echo -e "${YELLOW}[6/10] Création des répertoires...${NC}"
mkdir -p /opt/$APP_USER/{certbot_data,certbot_www,backups}
chown -R $APP_USER:$APP_USER /opt/$APP_USER

# =====================================================
# 7. CONFIGURER DOCKER LOGS
# =====================================================
echo -e "${YELLOW}[7/10] Configuration des logs Docker...${NC}"
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
systemctl restart docker

# =====================================================
# 8. INSTALLER CERTBOT
# =====================================================
echo -e "${YELLOW}[8/10] Installation de Certbot...${NC}"
snap install core
snap refresh core
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

# =====================================================
# 9. CONFIGURATION SSH (sécurité)
# =====================================================
echo -e "${YELLOW}[9/10] Sécurisation SSH...${NC}"
# Désactiver connexion root par mot de passe
sed -i 's/#PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
systemctl restart sshd

# =====================================================
# 10. CRÉER SCRIPT DE DÉMARRAGE
# =====================================================
echo -e "${YELLOW}[10/10] Création du script de démarrage...${NC}"

# Créer un script pour faciliter les redémarrages
cat > /usr/local/bin/medannot-start << EOF
#!/bin/bash
cd /opt/$APP_USER
docker compose up -d
EOF
chmod +x /usr/local/bin/medannot-start

cat > /usr/local/bin/medannot-stop << EOF
#!/bin/bash
cd /opt/$APP_USER
docker compose down
EOF
chmod +x /usr/local/bin/medannot-stop

cat > /usr/local/bin/medannot-logs << EOF
#!/bin/bash
cd /opt/$APP_USER
docker compose logs -f app
EOF
chmod +x /usr/local/bin/medannot-logs

# =====================================================
# RÉSUMÉ
# =====================================================
echo ""
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     ✅ SETUP EXOSCALE TERMINÉ !                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${YELLOW}Prochaines étapes:${NC}"
echo ""
echo "1. ${GREEN}Créer la base de données${NC} sur Exoscale"
echo "   Portal: https://portal.exoscale.com"
echo ""
echo "2. ${GREEN}Se connecter avec l'utilisateur $APP_USER${NC}:"
echo "   ssh $APP_USER@$(hostname -I | awk '{print $1}')"
echo "   Mot de passe: celui que tu as entré"
echo ""
echo "3. ${GREEN}Déployer l'application${NC}:"
echo "   cd /opt/$APP_USER"
echo "   git clone https://github.com/Medannotations/MedAnnot-V1.git ."
echo ""
echo -e "${GREEN}Commandes utiles:${NC}"
echo "  medannot-start    # Démarrer l'application"
echo "  medannot-stop     # Arrêter l'application"
echo "  medannot-logs     # Voir les logs"
echo ""
echo -e "${GREEN}Guide complet: EXOSCALE_COMPLETE_GUIDE.md${NC}"
echo ""
