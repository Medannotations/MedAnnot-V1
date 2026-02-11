/**
 * Types principaux de l'application MedAnnot
 * Alignés avec le schéma de la base de données PostgreSQL
 */

// Re-export des types depuis les hooks
export type { Patient, PatientInsert, PatientUpdate } from '@/hooks/usePatients';
export type {
  Annotation,
  AnnotationWithPatient,
  AnnotationInsert,
  AnnotationUpdate
} from '@/hooks/useAnnotations';
export type { UserConfiguration, PatientTag } from '@/hooks/useConfiguration';

// Types étendus pour l'UI
export interface PatientExampleAnnotation {
  id: string;
  content: string;
  visitDate: string;
  context?: string;
  isLearningExample: boolean;
  createdAt: string;
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
