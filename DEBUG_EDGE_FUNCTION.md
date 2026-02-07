# 🔧 Debug Edge Function generate-annotation

## Erreur 500 - Causes possibles

### 1. Variable d'environnement manquante

La fonction a besoin de `ANTHROPIC_API_KEY` dans les variables d'environnement Supabase.

**Pour vérifier/corriger :**

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Project Settings > Functions**
4. Vérifiez que `ANTHROPIC_API_KEY` est définie
5. Si non, ajoutez-la :
   - Key: `ANTHROPIC_API_KEY`
   - Value: Votre clé API Anthropic (commence par `sk-ant-...`)

### 2. Déployer la Edge Function

```bash
# Installer Supabase CLI si pas déjà fait
npm install -g supabase

# Se connecter à Supabase
supabase login

# Link le projet (si pas déjà fait)
supabase link --project-ref vbaaohcsmiaxbqcyfhhl

# Déployer la fonction
supabase functions deploy generate-annotation
```

### 3. Vérifier les logs de la fonction

Dans Supabase Dashboard :
1. Allez dans **Edge Functions**
2. Cliquez sur **generate-annotation**
3. Allez dans l'onglet **Logs**
4. Vous verrez l'erreur exacte

---

## Alternative temporaire : Mock de la fonction

Si vous n'avez pas de clé Anthropic, vous pouvez tester avec une fonction mock :