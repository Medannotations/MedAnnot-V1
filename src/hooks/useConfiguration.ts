import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { configurations as configApi, exampleAnnotations as examplesApi, phraseTemplates as templatesApi, patientTags as tagsApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export type UserConfiguration = {
  id: string;
  user_id: string;
  annotation_structure: string;
  created_at: string;
  updated_at: string;
};

export type ExampleAnnotation = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
};

export type PhraseTemplate = {
  id: string;
  user_id: string;
  category: string;
  label: string;
  content: string;
  shortcut: string | null;
  created_at: string;
};

// ==================== Configuration ====================

export function useUserConfiguration() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-configuration", user?.id],
    queryFn: async () => {
      const data = await configApi.get();
      return data as UserConfiguration | null;
    },
    enabled: !!user,
  });
}

export const DEFAULT_STRUCTURE = `Motif et contexte de la visite
Prescripteur:

Evaluation clinique
Etat général et autonomie (AVQ):
Constantes vitales:
Observations spécifiques:

Soins réalisés
Soins infirmiers (OPAS cat. C):
Soins techniques (OPAS cat. A):
Education thérapeutique (OPAS cat. B):

Evaluation et évolution
Réaction du patient:
Evolution par rapport à la dernière visite:

Coordination et suite
Communication médecin/équipe:
Objectifs pour la prochaine visite:
Prochaine visite prévue:`;

export function useUpdateConfiguration() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (structure: string) => {
      if (!user) throw new Error("User not authenticated");

      const data = await configApi.upsert(structure);
      return data as UserConfiguration;
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
      const data = await examplesApi.list();
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

      const data = await examplesApi.create(example);
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
      const data = await examplesApi.update(id, { title, content });
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
      await examplesApi.delete(id);
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
      const data = await templatesApi.list();
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

      const data = await templatesApi.create(template);
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
      const data = await templatesApi.update(id, updates);
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
      await templatesApi.delete(id);
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

export type PatientTag = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
};

export function usePatientTags() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patient-tags", user?.id],
    queryFn: async () => {
      const data = await tagsApi.list();
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

      const data = await tagsApi.create(tag);
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
      await tagsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-tags"] });
    },
  });
}
