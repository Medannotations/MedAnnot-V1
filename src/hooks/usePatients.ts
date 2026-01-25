import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Patient = Tables<"patients">;
export type PatientInsert = TablesInsert<"patients">;
export type PatientUpdate = TablesUpdate<"patients">;

export function usePatients(includeArchived = false) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patients", user?.id, includeArchived],
    queryFn: async () => {
      let query = supabase
        .from("patients")
        .select("*")
        .order("last_name", { ascending: true });

      if (!includeArchived) {
        query = query.eq("is_archived", false);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform JSONB example_annotations to TypeScript array
      const patientsWithExamples = (data as any[]).map((p) => ({
        ...p,
        exampleAnnotations: p.example_annotations || [],
      }));

      return patientsWithExamples as Patient[];
    },
    enabled: !!user,
  });
}

export function usePatient(patientId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (!patientId) return null;

      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();

      if (error) throw error;

      // Transform JSONB example_annotations to TypeScript array
      const patientWithExamples = {
        ...data,
        exampleAnnotations: data.example_annotations || [],
      };

      return patientWithExamples as Patient;
    },
    enabled: !!user && !!patientId,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (patient: Omit<PatientInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("patients")
        .insert({ ...patient, user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      // Transform JSONB example_annotations to TypeScript array
      const patientWithExamples = {
        ...data,
        exampleAnnotations: data.example_annotations || [],
      };

      return patientWithExamples as Patient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, exampleAnnotations, ...updates }: PatientUpdate & { id: string; exampleAnnotations?: any[] }) => {
      // Transform exampleAnnotations to example_annotations for database
      const dbUpdates: any = {
        ...updates,
        ...(exampleAnnotations !== undefined && {
          example_annotations: exampleAnnotations,
        }),
      };

      const { data, error } = await supabase
        .from("patients")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Transform JSONB example_annotations back to TypeScript array
      const patientWithExamples = {
        ...data,
        exampleAnnotations: data.example_annotations || [],
      };

      return patientWithExamples as Patient;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", data.id] });
    },
  });
}

export function useArchivePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isArchived }: { id: string; isArchived: boolean }) => {
      const { data, error } = await supabase
        .from("patients")
        .update({ is_archived: isArchived })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Transform JSONB example_annotations to TypeScript array
      const patientWithExamples = {
        ...data,
        exampleAnnotations: data.example_annotations || [],
      };

      return patientWithExamples as Patient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
