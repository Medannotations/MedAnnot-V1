/**
 * Annotations Hooks - Version API Maison (Infomaniak)
 * Remplace Supabase par notre API
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { annotations as annotationsApi } from "@/services/api";
import { encryptData, decryptData } from "@/lib/encryption";

export interface Annotation {
  id: string;
  user_id: string;
  patient_id?: string | null;
  content: string;
  type?: string;
  audio_url?: string | null;
  transcription?: string | null;
  tags?: string[];
  metadata?: Record<string, unknown>;
  vital_signs?: Record<string, unknown>;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  patient_first_name?: string;
  patient_last_name?: string;
}

export interface AnnotationWithPatient extends Annotation {
  patients?: {
    first_name: string;
    last_name: string;
    pathologies: string | null;
  };
}

export type AnnotationInsert = Omit<Annotation, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type AnnotationUpdate = Partial<AnnotationInsert>;

// Helper pour déchiffrer une annotation
const decryptAnnotation = (annotation: Annotation, userId: string): Annotation => {
  let content = annotation.content;
  let transcription = annotation.transcription;

  try {
    if (content) content = decryptData(content, userId);
  } catch {
    // Données non chiffrées - garder le texte brut
  }

  try {
    if (transcription) transcription = decryptData(transcription, userId);
  } catch {
    // Données non chiffrées - garder le texte brut
  }

  return { ...annotation, content, transcription };
};

// Helper pour chiffrer une annotation
const encryptAnnotation = (annotation: Partial<Annotation>, userId: string): Partial<Annotation> => {
  const encrypted: Partial<Annotation> = { ...annotation };
  
  if (annotation.content) {
    encrypted.content = encryptData(annotation.content, userId);
  }
  if (annotation.transcription) {
    encrypted.transcription = encryptData(annotation.transcription, userId);
  }
  
  return encrypted;
};

export function useAnnotations(filters?: {
  patientId?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["annotations", user?.id, filters],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const data = await annotationsApi.list();
      
      // Déchiffrer et filtrer
      let result = data
        .filter((a: Annotation) => !a.is_archived)
        .map((a: Annotation) => decryptAnnotation(a, user.id));
      
      // Filtre par patient
      if (filters?.patientId) {
        result = result.filter((a: Annotation) => a.patient_id === filters.patientId);
      }
      
      // Filtre par date
      if (filters?.startDate) {
        result = result.filter((a: Annotation) => a.created_at >= filters.startDate!);
      }
      if (filters?.endDate) {
        result = result.filter((a: Annotation) => a.created_at <= filters.endDate!);
      }
      
      // Recherche texte
      if (filters?.searchQuery) {
        const search = filters.searchQuery.toLowerCase();
        result = result.filter(
          (a: Annotation) =>
            a.content?.toLowerCase().includes(search) ||
            a.transcription?.toLowerCase().includes(search) ||
            `${a.patient_last_name} ${a.patient_first_name}`.toLowerCase().includes(search)
        );
      }
      
      // Trier par date
      result.sort((a: Annotation, b: Annotation) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return result;
    },
    enabled: !!user,
  });
}

export function useAnnotation(annotationId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["annotation", annotationId],
    queryFn: async () => {
      if (!annotationId || !user) return null;

      const allAnnotations = await annotationsApi.list();
      const annotation = allAnnotations.find((a: Annotation) => a.id === annotationId);
      
      if (!annotation) throw new Error("Annotation not found");
      
      return decryptAnnotation(annotation, user.id);
    },
    enabled: !!user && !!annotationId,
  });
}

export function useAnnotationsByPatient(patientId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["annotations", "patient", patientId],
    queryFn: async () => {
      if (!patientId || !user) return [];

      const data = await annotationsApi.list();
      
      return data
        .filter((a: Annotation) => a.patient_id === patientId && !a.is_archived)
        .map((a: Annotation) => decryptAnnotation(a, user.id))
        .sort((a: Annotation, b: Annotation) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    },
    enabled: !!user && !!patientId,
  });
}

export function useCreateAnnotation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (annotation: AnnotationInsert) => {
      if (!user) throw new Error("User not authenticated");

      // Chiffrer les données sensibles
      const encryptedAnnotation = encryptAnnotation(annotation, user.id);
      
      const newAnnotation = await annotationsApi.create(encryptedAnnotation as AnnotationInsert);
      
      // Retourner déchiffré pour l'UI
      return decryptAnnotation(newAnnotation, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotations"] });
    },
  });
}

export function useUpdateAnnotation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }: AnnotationUpdate & { id: string }) => {
      if (!user) throw new Error("User not authenticated");

      // Chiffrer les données sensibles
      const encryptedUpdates = encryptAnnotation(updates, user.id);
      
      const updated = await annotationsApi.update(id, encryptedUpdates);
      
      // Retourner déchiffré pour l'UI
      return decryptAnnotation(updated, user.id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["annotations"] });
      queryClient.invalidateQueries({ queryKey: ["annotation", data.id] });
    },
  });
}

export function useDeleteAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Soft delete (archive)
      return annotationsApi.update(id, { is_archived: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotations"] });
    },
  });
}

export function useAnnotationStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["annotation-stats", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const annotations = await annotationsApi.list();
      const activeAnnotations = annotations.filter((a: Annotation) => !a.is_archived);
      
      // Get current month's annotations
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const monthlyAnnotations = activeAnnotations.filter(
        (a: Annotation) => new Date(a.created_at) >= startOfMonth
      );
      
      // Get last annotation date
      const sortedAnnotations = [...activeAnnotations].sort(
        (a: Annotation, b: Annotation) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return {
        monthlyCount: monthlyAnnotations.length,
        totalCount: activeAnnotations.length,
        patientsCount: new Set(activeAnnotations.map((a: Annotation) => a.patient_id)).size,
        lastAnnotationDate: sortedAnnotations[0]?.created_at || null,
        timeSavedMinutes: monthlyAnnotations.length * 10,
      };
    },
    enabled: !!user,
  });
}
