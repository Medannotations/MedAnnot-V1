/**
 * Patients Hooks - Version API Maison (Infomaniak)
 * Remplace Supabase par notre API
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { patients as patientsApi } from "@/services/api";
import { encryptData, decryptData } from "@/lib/encryption";

export interface Patient {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string;
  notes?: string | null;
  medical_history?: string | null;
  allergies?: string | null;
  current_medications?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  insurance_provider?: string | null;
  insurance_number?: string | null;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
  // UI fields
  exampleAnnotations?: unknown[];
}

export type PatientInsert = Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type PatientUpdate = Partial<PatientInsert>;

// Vérifie si une chaîne est chiffrée
const isEncrypted = (data: string): boolean => {
  return data?.startsWith('U2FsdGVkX1') || data?.startsWith('U2F');
};

// Helper pour déchiffrer en toute sécurité
const safeDecrypt = (data: string | null, userId: string): string | null => {
  if (!data) return null;
  if (!isEncrypted(data)) return data;
  try {
    return decryptData(data, userId);
  } catch {
    return data;
  }
};

// Déchiffrer un patient
const decryptPatient = (patient: Patient, userId: string): Patient => ({
  ...patient,
  first_name: decryptData(patient.first_name, userId),
  last_name: decryptData(patient.last_name, userId),
  address: safeDecrypt(patient.address, userId),
  city: safeDecrypt(patient.city, userId),
});

// Chiffrer un patient avant envoi
const encryptPatient = (patient: Partial<Patient>, userId: string): Partial<Patient> => {
  const encrypted: Partial<Patient> = { ...patient };
  
  if (patient.first_name) {
    encrypted.first_name = encryptData(patient.first_name, userId);
  }
  if (patient.last_name) {
    encrypted.last_name = encryptData(patient.last_name, userId);
  }
  if (patient.address) {
    encrypted.address = encryptData(patient.address, userId);
  }
  if (patient.city) {
    encrypted.city = encryptData(patient.city, userId);
  }
  
  return encrypted;
};

export function usePatients(includeArchived = false) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patients", user?.id, includeArchived],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const data = await patientsApi.list();
      
      // Déchiffrer les données
      const decryptedPatients = data
        .map((p: Patient) => decryptPatient(p, user.id))
        .filter((p: Patient) => includeArchived || !p.is_archived);
      
      return decryptedPatients;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePatient(patientId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (!patientId || !user) return null;

      // Pour l'instant, on récupère tous les patients et on filtre
      // TODO: Ajouter endpoint /patients/:id côté serveur
      const allPatients = await patientsApi.list();
      const patient = allPatients.find((p: Patient) => p.id === patientId);
      
      if (!patient) throw new Error("Patient not found");
      
      return decryptPatient(patient, user.id);
    },
    enabled: !!user && !!patientId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (patientData: PatientInsert) => {
      if (!user) throw new Error("Vous devez être connecté");

      // Chiffrer les données sensibles
      const encryptedPatient = encryptPatient(patientData, user.id);
      
      const newPatient = await patientsApi.create(encryptedPatient as PatientInsert);
      
      // Retourner déchiffré pour l'UI
      return decryptPatient(newPatient, user.id);
    },
    onSuccess: (newPatient) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }: PatientUpdate & { id: string }) => {
      if (!user) throw new Error("User not authenticated");

      // Chiffrer les données sensibles
      const encryptedUpdates = encryptPatient(updates, user.id);
      
      const updated = await patientsApi.update(id, encryptedUpdates);
      
      // Retourner déchiffré pour l'UI
      return decryptPatient(updated, user.id);
    },
    onSuccess: (updatedPatient) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.setQueryData(["patient", updatedPatient.id], updatedPatient);
    },
  });
}

export function useArchivePatient() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, isArchived }: { id: string; isArchived: boolean }) => {
      if (!user) throw new Error("User not authenticated");

      return patientsApi.update(id, { is_archived: isArchived });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");
      return patientsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
