-- =============================================================================
-- AJOUT DES FONCTIONNALITÉS : SIGNES VITAUX + GPS
-- =============================================================================

-- 1. AJOUT DES CHAMPS D'ADRESSE DÉTAILLÉE POUR LE PATIENT
-- =============================================================================

ALTER TABLE public.patients
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Suisse';

-- Index pour recherche rapide par ville
CREATE INDEX IF NOT EXISTS patients_city_idx ON public.patients(city);
CREATE INDEX IF NOT EXISTS patients_postal_code_idx ON public.patients(postal_code);

-- 2. AJOUT DES SIGNES VITAUX DANS LES ANNOTATIONS
-- =============================================================================

ALTER TABLE public.annotations
ADD COLUMN IF NOT EXISTS vital_signs JSONB DEFAULT NULL;

COMMENT ON COLUMN public.annotations.vital_signs IS 
'Signes vitaux enregistrés lors de la visite (JSON: {temperature, heartRate, systolicBP, diastolicBP, respiratoryRate, oxygenSaturation, bloodSugar, painLevel, consciousness, weight, height})';

-- Index pour rechercher les annotations avec signes vitaux
CREATE INDEX IF NOT EXISTS annotations_vital_signs_idx ON public.annotations((vital_signs IS NOT NULL));

-- 3. MISE À JOUR DES RLS POUR LES NOUVELLES COLONNES
-- =============================================================================

-- Les politiques existantes devraient déjà couvrir les nouvelles colonnes
-- car elles utilisent auth.uid() = user_id

-- 4. VÉRIFICATION
-- =============================================================================

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name IN ('patients', 'annotations') 
AND column_name IN ('street', 'postal_code', 'city', 'country', 'vital_signs')
ORDER BY table_name, column_name;
