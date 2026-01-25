-- =====================================================
-- MEDANNOT DATABASE SCHEMA - Medical Annotation SaaS
-- Compliant with LPD/GDPR for Swiss healthcare data
-- =====================================================

-- 1. PROFILES TABLE (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. PATIENTS TABLE
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  pathologies TEXT,
  notes TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. USER CONFIGURATIONS TABLE
CREATE TABLE public.user_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  annotation_structure TEXT NOT NULL DEFAULT '1. Motif de la visite
2. Observations cliniques
   - État général
   - Signes vitaux
   - Observations spécifiques
3. Soins prodigués
4. Évaluation
5. Plan de soins',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. EXAMPLE ANNOTATIONS TABLE (for AI learning)
CREATE TABLE public.example_annotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. ANNOTATIONS TABLE
CREATE TABLE public.annotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  
  -- Visit information
  visit_date DATE NOT NULL,
  visit_time TIME,
  visit_duration INTEGER, -- in minutes
  
  -- Audio data
  audio_file_path TEXT,
  audio_duration INTEGER, -- in seconds
  audio_file_name TEXT,
  
  -- Transcription
  transcription TEXT NOT NULL,
  was_transcription_edited BOOLEAN NOT NULL DEFAULT false,
  
  -- Generated annotation
  content TEXT NOT NULL,
  structure_used TEXT,
  was_content_edited BOOLEAN NOT NULL DEFAULT false,
  
  -- Metadata
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.example_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annotations ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- PATIENTS POLICIES
CREATE POLICY "Users can view their own patients" 
ON public.patients FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own patients" 
ON public.patients FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patients" 
ON public.patients FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patients" 
ON public.patients FOR DELETE USING (auth.uid() = user_id);

-- USER CONFIGURATIONS POLICIES
CREATE POLICY "Users can view their own configuration" 
ON public.user_configurations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own configuration" 
ON public.user_configurations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own configuration" 
ON public.user_configurations FOR UPDATE USING (auth.uid() = user_id);

-- EXAMPLE ANNOTATIONS POLICIES
CREATE POLICY "Users can view their own examples" 
ON public.example_annotations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own examples" 
ON public.example_annotations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own examples" 
ON public.example_annotations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own examples" 
ON public.example_annotations FOR DELETE USING (auth.uid() = user_id);

-- ANNOTATIONS POLICIES
CREATE POLICY "Users can view their own annotations" 
ON public.annotations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own annotations" 
ON public.annotations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own annotations" 
ON public.annotations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own annotations" 
ON public.annotations FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to update timestamps automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
BEFORE UPDATE ON public.patients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_configurations_updated_at
BEFORE UPDATE ON public.user_configurations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_annotations_updated_at
BEFORE UPDATE ON public.annotations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Also create default configuration
  INSERT INTO public.user_configurations (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STORAGE BUCKET FOR AUDIO FILES
-- =====================================================

-- Create private bucket for audio recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-recordings', 'audio-recordings', false);

-- Storage policies for audio files
CREATE POLICY "Users can upload their own audio files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own audio files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'audio-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own audio files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'audio-recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_patients_user_id ON public.patients(user_id);
CREATE INDEX idx_patients_archived ON public.patients(is_archived);
CREATE INDEX idx_annotations_user_id ON public.annotations(user_id);
CREATE INDEX idx_annotations_patient_id ON public.annotations(patient_id);
CREATE INDEX idx_annotations_visit_date ON public.annotations(visit_date);
CREATE INDEX idx_annotations_archived ON public.annotations(is_archived);
CREATE INDEX idx_example_annotations_user_id ON public.example_annotations(user_id);