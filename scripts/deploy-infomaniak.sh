#!/bin/bash
# Script de déploiement automatique sur Infomaniak
# Usage: ./deploy-infomaniak.sh

set -e

VPS_HOST="${VPS_HOST:-}"
VPS_USER="${VPS_USER:-medannot}"
APP_DIR="/var/www/medannot"

echo "🚀 DEPLOIEMENT MEDANNOT - INFOMANIAK"
echo "===================================="
echo ""

if [ -z "$VPS_HOST" ]; then
    echo "❌ Erreur: VPS_HOST non défini"
    echo "Usage: VPS_HOST=xxx.xxx.xxx.xxx ./deploy-infomaniak.sh"
    exit 1
fi

echo "📡 Serveur cible: $VPS_USER@$VPS_HOST"
echo "📁 Répertoire: $APP_DIR"
echo ""

# 1. Build local
echo "🔨 1. Build de l'application..."
npm ci
npm run build
echo "   ✅ Build terminé"
echo ""

# 2. Créer l'archive
echo "📦 2. Création de l'archive..."
tar -czf deploy.tar.gz \
    dist/ \
    server/ \
    package.json \
    package-lock.json \
    .env.production \
    scripts/
echo "   ✅ Archive créée"
echo ""

# 3. Upload sur le serveur
echo "📤 3. Upload sur le serveur..."
scp deploy.tar.gz $VPS_USER@$VPS_HOST:/tmp/
echo "   ✅ Upload terminé"
echo ""

# 4. Déploiement sur le serveur
echo "🚀 4. Déploiement sur le serveur..."
ssh $VPS_USER@$VPS_HOST << 'REMOTE_COMMANDS'
    APP_DIR="/var/www/medannot"
    
    # Backup avant déploiement
    if [ -d "$APP_DIR" ]; then
        echo "   💾 Backup de la version actuelle..."
        sudo cp -r "$APP_DIR" "${APP_DIR}-backup-$(date +%Y%m%d-%H%M%S)"
    fi
    
    # Extraction
    echo "   📂 Extraction des fichiers..."
    sudo mkdir -p "$APP_DIR"
    cd "$APP_DIR"
    sudo tar -xzf /tmp/deploy.tar.gz
    
    # Installation dépendances
    echo "   📥 Installation des dépendances..."
    sudo npm ci --production
    
    # Redémarrage PM2
    echo "   🔄 Redémarrage du serveur..."
    if pm2 list | grep -q "medannot-api"; then
        pm2 restart medannot-api
    else
        pm2 start server/index.js --name "medannot-api"
        pm2 save
    fi
    
    # Nettoyage
    sudo rm /tmp/deploy.tar.gz
    
    echo "   ✅ Déploiement terminé !"
REMOTE_COMMANDS

echo ""

# 5. Nettoyage local
echo "🧹 5. Nettoyage..."
rm deploy.tar.gz
echo ""

echo "===================================="
echo "✅ DEPLOIEMENT RÉUSSI !"
echo "===================================="
echo ""
echo "🌐 Application accessible sur:"
echo "   https://medannot.ch"
echo ""
echo "📊 Vérifier le statut:"
echo "   ssh $VPS_USER@$VPS_HOST 'pm2 status'"
echo ""
echo "📜 Voir les logs:"
echo "   ssh $VPS_USER@$VPS_HOST 'pm2 logs medannot-api'"
