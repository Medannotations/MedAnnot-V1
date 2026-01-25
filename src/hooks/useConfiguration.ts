import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type UserConfiguration = Tables<"user_configurations">;
export type ExampleAnnotation = Tables<"example_annotations">;

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

export function useUpdateConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (structure: string) => {
      const { data, error } = await supabase
        .from("user_configurations")
        .update({ annotation_structure: structure })
        .select()
        .single();

      if (error) throw error;
      return data as UserConfiguration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-configuration"] });
    },
  });
}

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
