export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface PatientExampleAnnotation {
  id: string;
  content: string;
  visitDate: string;
  context?: string;
  isLearningExample: boolean;
  createdAt: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  pathologies: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  exampleAnnotations?: PatientExampleAnnotation[];
  postalCode?: string;
  city?: string;
}

export interface Annotation {
  id: string;
  patientId: string;
  date: Date;
  time?: string;
  content: string;
  audioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserConfiguration {
  id: string;
  userId: string;
  annotationStructure: string;
  exampleAnnotations: ExampleAnnotation[];
}

export interface ExampleAnnotation {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}
