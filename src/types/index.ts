// Types alignés avec la base de données Supabase
// Ces types sont des alias pour faciliter l'import, mais utilisez préférablement ceux de @/integrations/supabase/types

import type { Tables } from "@/integrations/supabase/types";

// Re-export des types principaux depuis Supabase
export type User = Tables<"profiles">;
export type Patient = Tables<"patients">;
export type Annotation = Tables<"annotations">;
export type UserConfiguration = Tables<"user_configurations">;
export type ExampleAnnotation = Tables<"example_annotations">;

// Types étendus pour l'UI
export interface PatientExampleAnnotation {
  id: string;
  content: string;
  visitDate: string;
  context?: string;
  isLearningExample: boolean;
  createdAt: string;
}

// Type pour les annotations avec les infos patient (pour l'affichage)
export interface AnnotationWithPatient extends Annotation {
  patients: {
    first_name: string;
    last_name: string;
    pathologies: string | null;
  };
}

// Type pour le mode batch/soirée
export interface BatchAction {
  id: string;
  label: string;
  icon: string;
  action: (selectedIds: string[]) => void;
}

// Type pour les templates de phrases
export interface PhraseTemplate {
  id: string;
  category: string;
  label: string;
  content: string;
  shortcut?: string;
}

// Type pour les tags patients
export interface PatientTag {
  id: string;
  name: string;
  color: string;
}
