#!/bin/bash
# =====================================================
# Script de déploiement Swiss Safe Cloud
# Usage: ./deploy-swiss-safe-cloud.sh [vm1|vm2|all]
# =====================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VM1_HOST="${VM1_HOST:-}"
VM2_HOST="${VM2_HOST:-}"
VM_USER="${VM_USER:-ubuntu}"
DEPLOY_TARGET="${1:-all}"

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     DEPLOIEMENT SWISS SAFE CLOUD - MedAnnot             ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Validation
if [[ "$DEPLOY_TARGET" != "vm1" && "$DEPLOY_TARGET" != "vm2" && "$DEPLOY_TARGET" != "all" ]]; then
    echo -e "${RED}❌ Usage: $0 [vm1|vm2|all]${NC}"
    exit 1
fi

if [[ "$DEPLOY_TARGET" == "vm1" || "$DEPLOY_TARGET" == "all" ]] && [[ -z "$VM1_HOST" ]]; then
    echo -e "${RED}❌ VM1_HOST non défini${NC}"
    echo "Usage: VM1_HOST=xxx.xxx.xxx.xxx $0 vm1"
    exit 1
fi

if [[ "$DEPLOY_TARGET" == "vm2" || "$DEPLOY_TARGET" == "all" ]] && [[ -z "$VM2_HOST" ]]; then
    echo -e "${RED}❌ VM2_HOST non défini${NC}"
    exit 1
fi

# Fonction de déploiement
deploy_vm() {
    local VM_HOST=$1
    local VM_NAME=$2
    
    echo -e "${YELLOW}🚀 Déploiement sur $VM_NAME ($VM_HOST)...${NC}"
    
    ssh $VM_USER@$VM_HOST << 'REMOTE_COMMANDS'
        set -e
        
        echo "📂 Navigation vers /opt/medannot..."
        cd /opt/medannot
        
        echo "📥 Pull du code..."
        git fetch origin
        git reset --hard origin/main
        
        echo "🐳 Pull de l'image Docker..."
        docker compose pull app
        
        echo "🔄 Redémarrage des services..."
        docker compose up -d --no-deps app
        
        echo "🧹 Cleanup..."
        docker image prune -af --filter "until=168h" || true
        docker system prune -f || true
        
        echo "🏥 Health check..."
        sleep 10
        if curl -sf http://localhost:3000/api/health; then
            echo -e "${GREEN}✅ $VM_NAME opérationnel${NC}"
        else
            echo -e "${RED}❌ Health check failed${NC}"
            exit 1
        fi
    REMOTE_COMMANDS
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $VM_NAME déployé avec succès${NC}"
    else
        echo -e "${RED}❌ Échec du déploiement sur $VM_NAME${NC}"
        return 1
    fi
}

# Déploiement
case $DEPLOY_TARGET in
    vm1)
        deploy_vm $VM1_HOST "VM1"
        ;;
    vm2)
        deploy_vm $VM2_HOST "VM2"
        ;;
    all)
        echo -e "${BLUE}🔄 Déploiement sur les 2 VMs...${NC}"
        deploy_vm $VM1_HOST "VM1"
        deploy_vm $VM2_HOST "VM2"
        
        echo ""
        echo -e "${GREEN}🎉 Déploiement complet sur Swiss Safe Cloud !${NC}"
        echo ""
        echo "URLs de vérification:"
        echo "  - https://medannot.ch/api/health"
        echo "  - https://medannot.ch"
        ;;
esac
