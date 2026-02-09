#!/bin/bash
# =====================================================
# Script de déploiement Infomaniak - Version Simple
# Usage: ./deploy-infomaniak.sh
# =====================================================

set -e

VPS_HOST="${VPS_HOST:-}"
VPS_USER="${VPS_USER:-medannot}"

echo "🚀 DEPLOIEMENT MEDANNOT - INFOMANIAK"
echo "===================================="
echo ""

if [ -z "$VPS_HOST" ]; then
    echo "❌ Erreur: VPS_HOST non défini"
    echo "Usage: VPS_HOST=xxx.xxx.xxx.xxx ./deploy-infomaniak.sh"
    exit 1
fi

echo "📡 Serveur: $VPS_USER@$VPS_HOST"
echo ""

# Build local
echo "🔨 Build de l'application..."
npm ci 2>/dev/null || npm install
npm run build
echo "   ✅ Build terminé"
echo ""

# Deploy
echo "📤 Déploiement sur le serveur..."

ssh $VPS_USER@$VPS_HOST << REMOTE_COMMANDS
    set -e
    
    cd /var/www/medannot
    
    echo "   📥 Git pull..."
    git fetch origin
    git reset --hard origin/main
    
    echo "   📦 Installation dépendances..."
    npm ci --production 2>/dev/null || npm install --production
    
    echo "   🔨 Build..."
    npm run build
    
    echo "   📦 Installation serveur..."
    cd server
    npm install --production
    cd ..
    
    echo "   🔄 Redémarrage..."
    sudo systemctl restart medannot
    
    echo "   🏥 Health check..."
    sleep 5
    if curl -sf http://localhost:3000/api/health > /dev/null; then
        echo "   ✅ Application démarrée"
    else
        echo "   ❌ Health check failed"
        exit 1
    fi
REMOTE_COMMANDS

echo ""
echo "===================================="
echo "✅ DÉPLOIEMENT RÉUSSI !"
echo "===================================="
echo ""
echo "🌐 https://medannot.ch"
echo ""
echo "📊 Status: sudo systemctl status medannot"
echo "📜 Logs: sudo journalctl -u medannot -f"
