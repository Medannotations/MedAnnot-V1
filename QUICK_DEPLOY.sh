#!/bin/bash

echo "🚀 DÉPLOIEMENT RAPIDE MEDANNOT"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if supabase CLI is available
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx n'est pas installé${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Étape 1/3: Connexion à Supabase...${NC}"
echo "Si une page s'ouvre, autorise l'accès et reviens ici."
echo ""

npx supabase login

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur de connexion à Supabase${NC}"
    echo "Assure-toi d'avoir autorisé l'accès dans le navigateur."
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Connecté à Supabase${NC}"
echo ""

echo -e "${YELLOW}📤 Étape 2/3: Déploiement de stripe-checkout...${NC}"
npx supabase functions deploy stripe-checkout --project-ref vbaaohcsmiaxbqcyfhhl --no-verify-jwt

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du déploiement${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ stripe-checkout déployée${NC}"
echo ""

echo -e "${YELLOW}📤 Étape 3/3: Déploiement de stripe-webhook...${NC}"
npx supabase functions deploy stripe-webhook --project-ref vbaaohcsmiaxbqcyfhhl --no-verify-jwt

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du déploiement${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ stripe-webhook déployée${NC}"
echo ""

echo "================================"
echo -e "${GREEN}🎉 DÉPLOIEMENT TERMINÉ !${NC}"
echo ""
echo "Prochaines étapes:"
echo "1. ⚙️  Configure les secrets Stripe dans Supabase Dashboard"
echo "   https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/settings/functions"
echo ""
echo "2. 📧 Désactive la vérification email dans Supabase"
echo "   https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/auth/providers"
echo ""
echo "3. 🧪 Teste avec: open test-stripe-checkout.html"
echo ""
