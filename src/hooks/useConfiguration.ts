import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type UserConfiguration = Tables<"user_configurations">;
export type ExampleAnnotation = Tables<"example_annotations">;
export type PhraseTemplate = Tables<"phrase_templates">;

// ==================== Configuration ====================

export function useUserConfiguration() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-configuration", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_configurations")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data as UserConfiguration | null;
    },
    enabled: !!user,
  });
}

export const DEFAULT_STRUCTURE = `Date et heure de la visite:
Motif et contexte:
Observations cliniques:
- Constantes:
- Etat général:
- Examen physique:
Soins réalisés:
- Traitements administrés:
- Soins infirmiers:
Conseils et éducation:
Prochaine visite:
Signature:`;

export function useUpdateConfiguration() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (structure: string) => {
      if (!user) throw new Error("User not authenticated");

      // Vérifier si une configuration existe déjà
      const { data: existing } = await supabase
        .from("user_configurations")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let result;
      if (existing) {
        // Mettre à jour
        result = await supabase
          .from("user_configurations")
          .update({ 
            annotation_structure: structure,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user.id)
          .select()
          .single();
      } else {
        // Créer nouvelle configuration
        result = await supabase
          .from("user_configurations")
          .insert({ 
            user_id: user.id,
            annotation_structure: structure,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;
      return result.data as UserConfiguration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-configuration"] });
    },
  });
}

// Hook pour obtenir la configuration avec fallback par défaut
export function useUserConfigurationWithDefault() {
  const { data, isLoading, error } = useUserConfiguration();
  
  return {
    data: data || {
      annotation_structure: DEFAULT_STRUCTURE,
      id: "default",
      user_id: "default",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as UserConfiguration,
    isLoading,
    error,
    isDefault: !data
  };
}

// ==================== Example Annotations ====================

export function useExampleAnnotations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["example-annotations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("example_annotations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ExampleAnnotation[];
    },
    enabled: !!user,
  });
}

export function useCreateExample() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (example: { title: string; content: string }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("example_annotations")
        .insert({ ...example, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data as ExampleAnnotation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["example-annotations"] });
    },
  });
}

export function useUpdateExample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      const { data, error } = await supabase
        .from("example_annotations")
        .update({ title, content })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as ExampleAnnotation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["example-annotations"] });
    },
  });
}

export function useDeleteExample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("example_annotations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["example-annotations"] });
    },
  });
}

// ==================== Phrase Templates ====================

export function usePhraseTemplates() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["phrase-templates", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phrase_templates")
        .select("*")
        .order("category", { ascending: true })
        .order("label", { ascending: true });

      if (error) throw error;
      return data as PhraseTemplate[];
    },
    enabled: !!user,
  });
}

export function useCreatePhraseTemplate() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (template: { 
      category: string; 
      label: string; 
      content: string;
      shortcut?: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("phrase_templates")
        .insert({ ...template, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data as PhraseTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phrase-templates"] });
    },
  });
}

export function useUpdatePhraseTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      ...updates 
    }: { 
      id: string; 
      category?: string; 
      label?: string; 
      content?: string;
      shortcut?: string;
    }) => {
      const { data, error } = await supabase
        .from("phrase_templates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as PhraseTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phrase-templates"] });
    },
  });
}

export function useDeletePhraseTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("phrase_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phrase-templates"] });
    },
  });
}

// Hook pour regrouper les templates par catégorie
export function usePhraseTemplatesByCategory() {
  const { data: templates, ...rest } = usePhraseTemplates();
  
  const byCategory = useMemo(() => {
    if (!templates) return {};
    
    return templates.reduce((acc, template) => {
      const category = template.category || "Autre";
      if (!acc[category]) acc[category] = [];
      acc[category].push(template);
      return acc;
    }, {} as Record<string, PhraseTemplate[]>);
  }, [templates]);

  return { byCategory, templates, ...rest };
}

// ==================== Patient Tags ====================

export type PatientTag = Tables<"patient_tags">;

export function usePatientTags() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patient-tags", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_tags")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as PatientTag[];
    },
    enabled: !!user,
  });
}

export function useCreatePatientTag() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (tag: { name: string; color: string }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("patient_tags")
        .insert({ ...tag, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data as PatientTag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-tags"] });
    },
  });
}

export function useDeletePatientTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("patient_tags")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-tags"] });
    },
  });
}

