-- =====================================================
-- Add example_annotations column to patients table
-- Stores patient-specific annotation examples for AI learning
-- =====================================================

-- Add JSONB column for patient-specific examples
ALTER TABLE public.patients
ADD COLUMN example_annotations JSONB DEFAULT '[]'::jsonb;

-- Add GIN index for better performance on JSONB queries
CREATE INDEX idx_patients_example_annotations
ON public.patients USING GIN (example_annotations);

-- Add comment for documentation
COMMENT ON COLUMN public.patients.example_annotations IS
'Patient-specific annotation examples for AI learning. Each example includes: id, content, visitDate, context, isLearningExample, createdAt';
