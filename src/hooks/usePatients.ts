import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { encryptData, decryptData } from "@/lib/encryption";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Patient = Tables<"patients">;
export type PatientInsert = TablesInsert<"patients">;
export type PatientUpdate = TablesUpdate<"patients">;

// Helper pour déchiffrer un patient
const decryptPatient = (patient: Patient, userId: string): Patient => ({
  ...patient,
  first_name: decryptData(patient.first_name, userId),
  last_name: decryptData(patient.last_name, userId),
  address: patient.address ? decryptData(patient.address, userId) : null,
});

export function usePatients(includeArchived = false) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patients", user?.id, includeArchived],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      let query = supabase
        .from("patients")
        .select("*")
        .order("last_name", { ascending: true });

      if (!includeArchived) {
        query = query.eq("is_archived", false);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Déchiffrer et transformer les données
      const patientsWithExamples = (data as Patient[]).map((p) => ({
        ...decryptPatient(p, user.id),
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
      if (!patientId || !user) return null;

      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();

      if (error) throw error;

      // Déchiffrer et transformer
      const patientWithExamples = {
        ...decryptPatient(data as Patient, user.id),
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

      // Chiffrer les données PII avant insertion
      const encryptedFirstName = encryptData(patient.first_name, user.id);
      const encryptedLastName = encryptData(patient.last_name, user.id);
      const encryptedAddress = patient.address 
        ? encryptData(patient.address, user.id) 
        : null;

      const { data, error } = await supabase
        .from("patients")
        .insert({ 
          ...patient, 
          user_id: user.id,
          first_name: encryptedFirstName,
          last_name: encryptedLastName,
          address: encryptedAddress,
        })
        .select()
        .single();

      if (error) throw error;

      // Retourner les données déchiffrées
      const patientWithExamples = {
        ...decryptPatient(data as Patient, user.id),
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, exampleAnnotations, ...updates }: PatientUpdate & { id: string; exampleAnnotations?: unknown[] }) => {
      if (!user) throw new Error("User not authenticated");

      // Chiffrer les champs PII si présents dans la mise à jour
      const encryptedUpdates: Record<string, unknown> = { ...updates };
      
      if (updates.first_name !== undefined) {
        encryptedUpdates.first_name = encryptData(updates.first_name, user.id);
      }
      if (updates.last_name !== undefined) {
        encryptedUpdates.last_name = encryptData(updates.last_name, user.id);
      }
      if (updates.address !== undefined) {
        encryptedUpdates.address = updates.address 
          ? encryptData(updates.address, user.id) 
          : null;
      }

      // Transform exampleAnnotations to example_annotations for database
      const dbUpdates = {
        ...encryptedUpdates,
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

      // Retourner les données déchiffrées
      const patientWithExamples = {
        ...decryptPatient(data as Patient, user.id),
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, isArchived }: { id: string; isArchived: boolean }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("patients")
        .update({ is_archived: isArchived })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Retourner les données déchiffrées
      const patientWithExamples = {
        ...decryptPatient(data as Patient, user.id),
        exampleAnnotations: data.example_annotations || [],
      };

      return patientWithExamples as Patient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
