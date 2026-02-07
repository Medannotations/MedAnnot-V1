#!/bin/bash

# =============================================================================
# SCRIPT DE DÉPLOIEMENT FINAL - CORRECTIONS STRUCTURE/ANNOTATION
# =============================================================================

echo "🚀 DÉPLOIEMENT FINAL - Corrections Structure et Annotation"
echo "=========================================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: package.json non trouvé. Exécutez ce script depuis la racine du projet.${NC}"
    exit 1
fi

echo "📋 État actuel des commits:"
git log --oneline -3
echo ""

echo "📤 Étape 1/3: Push des commits vers GitHub..."
echo "----------------------------------------------"

# Essayer de pousser
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Commits poussés avec succès!${NC}"
else
    echo -e "${YELLOW}⚠️  Push GitHub échoué${NC}"
    echo ""
    echo "Options pour résoudre:"
    echo "1. Si vous utilisez un token GitHub, vérifiez qu'il n'a pas expiré"
    echo "2. Sinon, exécutez manuellement: git push origin main"
    echo "3. Ou utilisez GitHub Desktop / VS Code pour pousser"
    echo ""
    
    # Proposer de continuer avec le build local
    read -p "Voulez-vous continuer avec un build local? (o/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🔨 Étape 2/3: Build du projet..."
echo "----------------------------------------------"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Build
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build échoué${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build réussi!${NC}"
echo ""

echo "🌐 Étape 3/3: Déploiement Vercel..."
echo "----------------------------------------------"

# Vérifier si Vercel CLI est installé
if command -v vercel &> /dev/null; then
    echo "Déploiement via Vercel CLI..."
    vercel --prod
else
    echo -e "${YELLOW}⚠️  Vercel CLI non installé${NC}"
    echo ""
    echo "Options de déploiement:"
    echo ""
    echo "1. ${GREEN}Déploiement Git (RECOMMANDÉ)${NC}:"
    echo "   - Allez sur https://github.com/Medannotations/MedAnnot-V1"
    echo "   - Vérifiez que vos commits sont bien là"
    echo "   - Le déploiement Vercel se fera automatiquement"
    echo ""
    echo "2. ${GREEN}Déploiement manuel Vercel${NC}:"
    echo "   - Allez sur https://vercel.com/dashboard"
    echo "   - Sélectionnez votre projet"
    echo "   - Cliquez sur 'Redeploy' sur le dernier commit"
    echo ""
    echo "3. ${GREEN}Installer Vercel CLI${NC}:"
    echo "   npm i -g vercel"
    echo "   vercel --prod"
    echo ""
fi

echo ""
echo "=========================================================="
echo "📝 RAPPEL: Actions déjà effectuées par vous"
echo "=========================================================="
echo "✅ SQL RLS exécuté sur Supabase"
echo "✅ Corrections code appliquées:"
echo "   - CreateAnnotationPage: logique de validation corrigée"
echo "   - DEFAULT_STRUCTURE exportée"
echo ""
echo "🧪 POUR TESTER APRÈS DÉPLOIEMENT:"
echo "----------------------------------------------"
echo "1. Vider le cache: Ctrl+Shift+R"
echo "2. Aller dans Configuration → Structure d'annotation"
echo "3. Essayer de modifier et sauvegarder une structure"
echo "4. Aller dans Annotations → Nouvelle annotation"
echo "5. Créer un patient (s'il n'existe pas)"
echo "6. Créer une annotation et vérifier qu'elle fonctionne"
echo ""
echo "🆘 EN CAS DE PROBLÈME:"
echo "   Consulter DEBUG_ERREURS_STRUCTURE.md"
echo "=========================================================="
