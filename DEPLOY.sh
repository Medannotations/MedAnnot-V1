#!/bin/bash

echo "🚀 Déploiement de la fonction Supabase stripe-checkout"
echo ""
echo "Étape 1/2: Connexion à Supabase..."
npx supabase login

echo ""
echo "Étape 2/2: Déploiement de la fonction..."
npx supabase functions deploy stripe-checkout --project-ref vbaaohcsmiaxbqcyfhhl

echo ""
echo "✅ Déploiement terminé !"
