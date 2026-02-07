# 🔧 Diagnostic des Erreurs Structure/Annotation

## Problèmes signalés

1. **"Veuillez choisir une structure"** - lors de la création d'annotation
2. **"Impossible de sauvegarder la structure"** - lors de la sauvegarde en configuration

---

## 🔍 Causes identifiées

### 1. Problème de RLS (Row Level Security) sur Supabase

Les politiques RLS de la table `user_configurations` peuvent empêcher l'insertion de nouvelles configurations.

### 2. Vérification incorrecte dans CreateAnnotationPage

Le code vérifiait `!config` mais quand `useUserConfigurationWithDefault` retourne une valeur par défaut, `config` n'est jamais null - c'est `config.annotation_structure` qu'il faut vérifier.

---

## ✅ Solutions appliquées dans le code

### 1. Hook `useUserConfigurationWithDefault`

```typescript
export function useUserConfigurationWithDefault() {
  const { data, isLoading, error } = useUserConfiguration();
  return {
    data: data || {
      annotation_structure: DEFAULT_STRUCTURE,
      id: "default",
      user_id: "default",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as UserConfiguration,
    isLoading,
    error,
    isDefault: !data
  };
}
```

### 2. CreateAnnotationPage vérifie correctement

```typescript
// AVANT (incorrect):
if (!selectedPatient || !config) {
  // "Veuillez configurer votre structure"
}

// APRÈS (correct):
const handleGenerateAnnotation = async (editedTranscription: string) => {
  if (!selectedPatient) {
    toast({ title: "Patient requis", variant: "destructive" });
    return;
  }
  if (!config?.annotation_structure?.trim()) {
    toast({ title: "Configuration requise", variant: "destructive" });
    return;
  }
  // ... suite
};
```

---

## 🚨 ÉTAPES CRITIQUES À FAIRE SUR SUPABASE

### Étape 1 : Exécuter le script SQL de correction RLS

Dans l'éditeur SQL de Supabase, exécutez :

```sql
-- Activer RLS sur la table
ALTER TABLE IF EXISTS public.user_configurations ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can insert own configuration" ON public.user_configurations;
DROP POLICY IF EXISTS "Users can update own configuration" ON public.user_configurations;
DROP POLICY IF EXISTS "Users can view own configuration" ON public.user_configurations;
DROP POLICY IF EXISTS "Users can delete own configuration" ON public.user_configurations;

-- Créer les nouvelles politiques
CREATE POLICY "Users can insert own configuration"
  ON public.user_configurations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own configuration"
  ON public.user_configurations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own configuration"
  ON public.user_configurations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own configuration"
  ON public.user_configurations
  FOR DELETE
  USING (auth.uid() = user_id);
```

### Étape 2 : Vérifier que la colonne existe

```sql
-- Vérifier la structure de la table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_configurations';
```

Vous devriez voir une colonne `annotation_structure` de type `text`.

### Étape 3 : Redéployer

Après avoir exécuté le SQL ci-dessus :

```bash
git push origin main
# Ou déployer via Vercel
```

---

## 🧪 Pour déboguer localement

Ajoutez ces logs dans `useUpdateConfiguration` :

```typescript
export function useUpdateConfiguration() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (structure: string) => {
      if (!user) throw new Error("User not authenticated");

      console.log("[useUpdateConfiguration] Saving structure for user:", user.id);

      // Vérifier si existe
      const { data: existing, error: checkError } = await supabase
        .from("user_configurations")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (checkError) {
        console.error("[useUpdateConfiguration] Check error:", checkError);
        throw checkError;
      }

      console.log("[useUpdateConfiguration] Existing:", existing);

      let result;
      if (existing) {
        result = await supabase
          .from("user_configurations")
          .update({ 
            annotation_structure: structure,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("user_configurations")
          .insert({ 
            user_id: user.id,
            annotation_structure: structure,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
      }

      console.log("[useUpdateConfiguration] Result:", result);

      if (result.error) {
        console.error("[useUpdateConfiguration] Error:", result.error);
        throw result.error;
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-configuration"] });
    },
  });
}
```

---

## 📋 Checklist de vérification

- [ ] SQL RLS exécuté sur Supabase
- [ ] Commit `8e2664d` déployé sur Vercel
- [ ] Vider le cache navigateur (Ctrl+Shift+R)
- [ ] Tester la sauvegarde de structure dans Configuration
- [ ] Tester la création d'annotation

---

## 🔄 Si les erreurs persistent

1. **Vérifier les logs de la console navigateur** (F12 → Console)
2. **Vérifier les logs Vercel** (dans le dashboard)
3. **Vérifier les requêtes réseau** (F12 → Network → filtrer par "configurations")
4. **Tester la requête directement dans Supabase SQL Editor** :

```sql
-- Tester l'insertion (à exécuter en tant qu'utilisateur authentifié)
INSERT INTO user_configurations (user_id, annotation_structure)
VALUES (auth.uid(), 'Test structure')
RETURNING *;
```

Si cette requête échoue avec une erreur de permission, le problème vient bien des RLS.
