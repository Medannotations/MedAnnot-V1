import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { encryptData, decryptData } from "@/lib/encryption";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Annotation = Tables<"annotations">;
export type AnnotationInsert = TablesInsert<"annotations">;
export type AnnotationUpdate = TablesUpdate<"annotations">;

export interface AnnotationWithPatient extends Annotation {
  patients: {
    first_name: string;
    last_name: string;
    pathologies: string | null;
  };
}

// Helper pour déchiffrer une annotation
const decryptAnnotation = <T extends Annotation>(annotation: T, userId: string): T => ({
  ...annotation,
  content: decryptData(annotation.content, userId),
  transcription: decryptData(annotation.transcription, userId),
});

// Helper pour déchiffrer les données patient jointes (aussi chiffrées)
const decryptPatientData = (
  patient: { first_name: string; last_name: string; pathologies: string | null },
  userId: string
) => ({
  first_name: decryptData(patient.first_name, userId),
  last_name: decryptData(patient.last_name, userId),
  pathologies: patient.pathologies,
});

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

      let query = supabase
        .from("annotations")
        .select(`
          *,
          patients (
            first_name,
            last_name,
            pathologies
          )
        `)
        .eq("is_archived", false)
        .order("visit_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters?.patientId) {
        query = query.eq("patient_id", filters.patientId);
      }

      if (filters?.startDate) {
        query = query.gte("visit_date", filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte("visit_date", filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Déchiffrer les annotations et les données patient jointes
      let result = (data as AnnotationWithPatient[]).map((a) => ({
        ...decryptAnnotation(a, user.id),
        patients: decryptPatientData(a.patients, user.id),
      }));

      // Client-side search in decrypted content/transcription
      if (filters?.searchQuery) {
        const search = filters.searchQuery.toLowerCase();
        result = result.filter(
          (a) =>
            a.content.toLowerCase().includes(search) ||
            a.transcription.toLowerCase().includes(search) ||
            `${a.patients.last_name} ${a.patients.first_name}`.toLowerCase().includes(search)
        );
      }

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

      const { data, error } = await supabase
        .from("annotations")
        .select(`
          *,
          patients (
            first_name,
            last_name,
            pathologies
          )
        `)
        .eq("id", annotationId)
        .single();

      if (error) throw error;

      const annotation = data as AnnotationWithPatient;
      
      // Déchiffrer l'annotation et les données patient
      return {
        ...decryptAnnotation(annotation, user.id),
        patients: decryptPatientData(annotation.patients, user.id),
      };
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

      const { data, error } = await supabase
        .from("annotations")
        .select("*")
        .eq("patient_id", patientId)
        .eq("is_archived", false)
        .order("visit_date", { ascending: false });

      if (error) throw error;

      // Déchiffrer les annotations
      return (data as Annotation[]).map((a) => decryptAnnotation(a, user.id));
    },
    enabled: !!user && !!patientId,
  });
}

export function useCreateAnnotation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (annotation: Omit<AnnotationInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");

      // Chiffrer les données PII avant insertion
      const encryptedContent = encryptData(annotation.content, user.id);
      const encryptedTranscription = encryptData(annotation.transcription, user.id);

      const { data, error } = await supabase
        .from("annotations")
        .insert({ 
          ...annotation, 
          user_id: user.id,
          content: encryptedContent,
          transcription: encryptedTranscription,
        })
        .select()
        .single();

      if (error) throw error;

      // Retourner les données déchiffrées
      return decryptAnnotation(data as Annotation, user.id);
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

      // Chiffrer les champs PII si présents dans la mise à jour
      const encryptedUpdates: Record<string, unknown> = { ...updates };
      
      if (updates.content !== undefined) {
        encryptedUpdates.content = encryptData(updates.content, user.id);
      }
      if (updates.transcription !== undefined) {
        encryptedUpdates.transcription = encryptData(updates.transcription, user.id);
      }

      const { data, error } = await supabase
        .from("annotations")
        .update(encryptedUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Retourner les données déchiffrées
      return decryptAnnotation(data as Annotation, user.id);
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
      const { error } = await supabase
        .from("annotations")
        .update({ is_archived: true })
        .eq("id", id);

      if (error) throw error;
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
      // Get current month's annotations
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlyAnnotations, error: monthlyError } = await supabase
        .from("annotations")
        .select("id, created_at")
        .eq("is_archived", false)
        .gte("created_at", startOfMonth.toISOString());

      if (monthlyError) throw monthlyError;

      // Get total annotations
      const { count: totalCount, error: totalError } = await supabase
        .from("annotations")
        .select("id", { count: "exact", head: true })
        .eq("is_archived", false);

      if (totalError) throw totalError;

      // Get active patients count
      const { count: patientsCount, error: patientsError } = await supabase
        .from("patients")
        .select("id", { count: "exact", head: true })
        .eq("is_archived", false);

      if (patientsError) throw patientsError;

      // Get last annotation
      const { data: lastAnnotation, error: lastError } = await supabase
        .from("annotations")
        .select("created_at")
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastError) throw lastError;

      return {
        monthlyCount: monthlyAnnotations?.length || 0,
        totalCount: totalCount || 0,
        patientsCount: patientsCount || 0,
        lastAnnotationDate: lastAnnotation?.created_at || null,
        // Estimate: 10 minutes saved per annotation
        timeSavedMinutes: (monthlyAnnotations?.length || 0) * 10,
      };
    },
    enabled: !!user,
  });
}
