#!/bin/bash

echo "🚀 Déploiement Edge Functions via npx"
echo "======================================"
echo ""

PROJECT_REF="vbaaohcsmiaxbqcyfhhl"

echo "⚠️  Si c'est la première fois, cela peut prendre du temps"
echo "   (téléchargement de Supabase CLI...)"
echo ""

# Vérifier si déjà loggé
if [ ! -f "$HOME/.supabase/access-token" ]; then
    echo "🔐 Étape 1/4: Login (va ouvrir un navigateur)"
    echo "   Appuyez sur Entrée quand vous avez terminé le login..."
    npx supabase login
else
    echo "✅ Déjà connecté à Supabase"
fi

echo ""
echo "🔗 Étape 2/4: Lien avec le projet $PROJECT_REF"
npx supabase link --project-ref $PROJECT_REF

echo ""
echo "📤 Étape 3/4: Déploiement generate-annotation"
npx supabase functions deploy generate-annotation

echo ""
echo "📤 Étape 4/4: Déploiement generate-annotation-simple"
npx supabase functions deploy generate-annotation-simple

echo ""
echo "======================================"
echo "✅ Déploiement terminé !"
echo ""
echo "Vérifiez dans: https://supabase.com/dashboard/project/$PROJECT_REF/functions"
echo ""
