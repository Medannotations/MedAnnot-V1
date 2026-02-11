import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vitalSigns as vitalSignsApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export interface VitalSigns {
  temperature?: number;
  heartRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  bloodSugar?: number;
}

// Récupérer les signes vitaux du jour pour un patient
// On les récupère depuis l'annotation du jour (s'il y en a une avec des signes vitaux)
export function useTodayVitalSigns(patientId: string | undefined, date: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["vital-signs", patientId, date],
    queryFn: async () => {
      if (!patientId || !user) return null;

      const result = await vitalSignsApi.getToday(patientId, date);
      return result as VitalSigns | null;
    },
    enabled: !!patientId && !!user,
  });
}

// Sauvegarder les signes vitaux pour un patient à une date
// Si une annotation existe déjà pour cette date, on met à jour
// Sinon, on crée une annotation "vide" avec juste les signes vitaux
export function useSaveVitalSigns() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      patientId,
      date,
      vitalSigns,
    }: {
      patientId: string;
      date: string;
      vitalSigns: VitalSigns;
    }) => {
      if (!user) throw new Error("User not authenticated");

      await vitalSignsApi.save({ patientId, date, vitalSigns });
      return { patientId, date, vitalSigns };
    },
    onSuccess: (_, variables) => {
      // Invalider les requêtes pertinentes
      queryClient.invalidateQueries({
        queryKey: ["vital-signs", variables.patientId, variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["annotations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["annotations-by-patient", variables.patientId],
      });
    },
  });
}

// Récupérer l'historique des signes vitaux d'un patient
export function useVitalSignsHistory(patientId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["vital-signs-history", patientId],
    queryFn: async () => {
      if (!patientId || !user) return [];

      const data = await vitalSignsApi.getHistory(patientId);
      return data;
    },
    enabled: !!patientId && !!user,
  });
}
