#!/bin/bash
# =====================================================
# Script de déploiement MedAnnot - Exoscale (Production)
# IP: 185.19.28.170
# =====================================================

set -e

SERVER_IP="185.19.28.170"
SERVER_USER="root"
REMOTE_DIR="/opt/medannot"

echo "🚀 Déploiement MedAnnot sur Exoscale ($SERVER_IP)"
echo "=================================================="

# Vérifier la connexion SSH
echo "🔍 Vérification de la connexion SSH..."
if ! ssh -o ConnectTimeout=5 "$SERVER_USER@$SERVER_IP" "echo 'OK'" > /dev/null 2>&1; then
    echo "❌ Erreur: Impossible de se connecter à $SERVER_IP"
    echo "Vérifiez que votre clé SSH est configurée"
    exit 1
fi
echo "✅ Connexion SSH OK"

# Exécuter le déploiement
echo ""
echo "📦 Déploiement en cours..."
ssh "$SERVER_USER@$SERVER_IP" << EOF
    set -e
    
    cd $REMOTE_DIR
    
    echo "⬇️  1. Récupération du code..."
    git pull origin main
    
    echo "🔧 2. Rebuild du backend..."
    docker compose build --no-cache app
    docker compose up -d app
    
    echo "🎨 3. Mise à jour du frontend..."
    # Vérifier si dist existe, sinon le build
    if [ ! -d "dist" ] || [ -z "\$(ls -A dist)" ]; then
        echo "⚠️  dist/ manquant ou vide - Build du frontend..."
        npm ci
        npm run build
    fi
    
    docker cp dist/. medannot-nginx:/usr/share/nginx/html/
    docker exec medannot-nginx nginx -s reload
    
    echo ""
    echo "✅ Déploiement terminé avec succès !"
    echo "🌐 Site: https://medannot.ch"
EOF

echo ""
echo "=================================================="
echo "🎉 Déploiement terminé !"
echo ""
echo "Vérifications :"
echo "  • Site: https://medannot.ch"
echo "  • API Health: https://medannot.ch/api/health"
echo ""
