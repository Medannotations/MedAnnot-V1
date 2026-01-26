import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { encryptPatientData, decryptPatientData } from "@/services/encryptionService";

export type Patient = Tables<"patients">;
export type PatientInsert = TablesInsert<"patients">;
export type PatientUpdate = TablesUpdate<"patients">;

export function usePatients(includeArchived = false) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patients", user?.id, includeArchived],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from("patients")
        .select("*")
        .order("last_name", { ascending: true });

      if (!includeArchived) {
        query = query.eq("is_archived", false);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Decrypt patient data and transform JSONB example_annotations
      const patientsWithExamples = await Promise.all(
        (data as any[]).map(async (p) => {
          const decryptedData = await decryptPatientData(
            {
              first_name: p.first_name,
              last_name: p.last_name,
              address: p.address,
              postal_code: p.postal_code,
              city: p.city,
              pathologies: p.pathologies,
              notes: p.notes,
            },
            user.id
          );

          return {
            ...p,
            ...decryptedData,
            exampleAnnotations: p.example_annotations || [],
          };
        })
      );

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

      // Decrypt patient data
      const decryptedData = await decryptPatientData(
        {
          first_name: data.first_name,
          last_name: data.last_name,
          address: data.address,
          postal_code: data.postal_code,
          city: data.city,
          pathologies: data.pathologies,
          notes: data.notes,
        },
        user.id
      );

      // Transform JSONB example_annotations to TypeScript array
      const patientWithExamples = {
        ...data,
        ...decryptedData,
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

      // Encrypt sensitive patient data before saving
      const encryptedData = await encryptPatientData(
        {
          first_name: patient.first_name,
          last_name: patient.last_name,
          address: patient.address,
          postal_code: patient.postal_code,
          city: patient.city,
          pathologies: patient.pathologies,
          notes: patient.notes,
        },
        user.id
      );

      const { data, error } = await supabase
        .from("patients")
        .insert({
          ...patient,
          ...encryptedData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Decrypt for local use
      const decryptedData = await decryptPatientData(
        {
          first_name: data.first_name,
          last_name: data.last_name,
          address: data.address,
          postal_code: data.postal_code,
          city: data.city,
          pathologies: data.pathologies,
          notes: data.notes,
        },
        user.id
      );

      // Transform JSONB example_annotations to TypeScript array
      const patientWithExamples = {
        ...data,
        ...decryptedData,
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
    mutationFn: async ({ id, exampleAnnotations, ...updates }: PatientUpdate & { id: string; exampleAnnotations?: any[] }) => {
      if (!user) throw new Error("User not authenticated");

      // Encrypt sensitive fields if they are being updated
      const sensitiveFields = ["first_name", "last_name", "address", "postal_code", "city", "pathologies", "notes"];
      const hasEncryptableFields = Object.keys(updates).some(key => sensitiveFields.includes(key));

      let encryptedUpdates: any = { ...updates };

      if (hasEncryptableFields) {
        const dataToEncrypt: any = {};
        sensitiveFields.forEach(field => {
          if (field in updates) {
            dataToEncrypt[field] = (updates as any)[field];
          }
        });

        if (Object.keys(dataToEncrypt).length > 0) {
          const encrypted = await encryptPatientData(
            {
              first_name: dataToEncrypt.first_name ?? "",
              last_name: dataToEncrypt.last_name ?? "",
              address: dataToEncrypt.address,
              postal_code: dataToEncrypt.postal_code,
              city: dataToEncrypt.city,
              pathologies: dataToEncrypt.pathologies ?? "",
              notes: dataToEncrypt.notes,
            },
            user.id
          );

          // Only update fields that were in the original update
          Object.keys(dataToEncrypt).forEach(field => {
            encryptedUpdates[field] = (encrypted as any)[field];
          });
        }
      }

      // Transform exampleAnnotations to example_annotations for database
      const dbUpdates: any = {
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

      // Decrypt for local use
      const decryptedData = await decryptPatientData(
        {
          first_name: data.first_name,
          last_name: data.last_name,
          address: data.address,
          postal_code: data.postal_code,
          city: data.city,
          pathologies: data.pathologies,
          notes: data.notes,
        },
        user.id
      );

      // Transform JSONB example_annotations back to TypeScript array
      const patientWithExamples = {
        ...data,
        ...decryptedData,
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
