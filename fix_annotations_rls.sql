-- =============================================================================
-- CORRECTION RLS POUR LA TABLE ANNOTATIONS
-- =============================================================================

-- 1. Activer RLS sur la table annotations
ALTER TABLE IF EXISTS public.annotations ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can insert own annotations" ON public.annotations;
DROP POLICY IF EXISTS "Users can update own annotations" ON public.annotations;
DROP POLICY IF EXISTS "Users can view own annotations" ON public.annotations;
DROP POLICY IF EXISTS "Users can delete own annotations" ON public.annotations;

-- 3. Créer les nouvelles politiques
CREATE POLICY "Users can insert own annotations"
  ON public.annotations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own annotations"
  ON public.annotations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own annotations"
  ON public.annotations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own annotations"
  ON public.annotations
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Vérifier que la table a la bonne structure
-- La colonne visit_duration doit accepter NULL ou avoir une valeur par défaut
ALTER TABLE public.annotations 
  ALTER COLUMN visit_duration SET DEFAULT 30;

-- S'assurer que structure_used peut être NULL
ALTER TABLE public.annotations 
  ALTER COLUMN structure_used DROP NOT NULL;

-- S'assurer que audio_duration peut être NULL
ALTER TABLE public.annotations 
  ALTER COLUMN audio_duration SET DEFAULT 0;

-- 5. Vérifier les politiques créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'annotations';
