import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { encryptData } from "@/lib/encryption";

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

      // Chercher une annotation du jour avec des signes vitaux
      const { data, error } = await supabase
        .from("annotations")
        .select("id, vital_signs, visit_date")
        .eq("patient_id", patientId)
        .eq("visit_date", date)
        .not("vital_signs", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        throw error;
      }

      return data?.vital_signs as VitalSigns | null;
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

      // Vérifier si une annotation existe déjà pour cette date
      const { data: existingAnnotation, error: fetchError } = await supabase
        .from("annotations")
        .select("id, content")
        .eq("patient_id", patientId)
        .eq("visit_date", date)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (existingAnnotation) {
        // Mettre à jour l'annotation existante avec les nouveaux signes vitaux
        const { error } = await supabase
          .from("annotations")
          .update({ vital_signs: vitalSigns })
          .eq("id", existingAnnotation.id);

        if (error) throw error;
      } else {
        // Créer une annotation "placeholder" avec juste les signes vitaux
        const { error } = await supabase.from("annotations").insert({
          patient_id: patientId,
          visit_date: date,
          visit_time: new Date().toTimeString().slice(0, 5),
          content: encryptData("Signes vitaux enregistrés - Annotation à compléter", user.id),
          transcription: encryptData("", user.id),
          vital_signs: vitalSigns,
          user_id: user.id,
        });

        if (error) throw error;
      }

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

      const { data, error } = await supabase
        .from("annotations")
        .select("id, visit_date, vital_signs")
        .eq("patient_id", patientId)
        .not("vital_signs", "is", null)
        .order("visit_date", { ascending: false })
        .limit(30);

      if (error) throw error;

      return data.map((d) => ({
        id: d.id,
        date: d.visit_date,
        vitalSigns: d.vital_signs as VitalSigns,
      }));
    },
    enabled: !!patientId && !!user,
  });
}
