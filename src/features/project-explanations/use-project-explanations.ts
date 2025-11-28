import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type ProjectExplanation = Database["public"]["Tables"]["project_explanations"]["Row"]
export type ProjectExplanationInsert = Database["public"]["Tables"]["project_explanations"]["Insert"]
export type ProjectExplanationUpdate = Database["public"]["Tables"]["project_explanations"]["Update"]

// Get all project explanations
export function useProjectExplanations() {
  return useQuery({
    queryKey: ["project-explanations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_explanations")
        .select("*")
      
      if (error) throw error
      return data as ProjectExplanation[]
    },
  })
}

// Get explanation for a specific project
export function useProjectExplanation(projectId: string | null) {
  return useQuery({
    queryKey: ["project-explanations", projectId],
    queryFn: async () => {
      if (!projectId) return null
      
      const { data, error} = await supabase
        .from("project_explanations")
        .select("*")
        .eq("project_id", projectId)
        .single()
      
      if (error && error.code !== "PGRST116") throw error // PGRST116 = no rows returned
      return data as ProjectExplanation | null
    },
    enabled: !!projectId,
  })
}

// Upsert (create or update) project explanation
export function useUpsertProjectExplanation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: ProjectExplanationInsert) => {

      const { data: result, error } = await supabase
        .from("project_explanations")
        .upsert(data as any)
        .select()
        .single()
      
      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-explanations"] })
    },
  })
}

// Delete project explanation
export function useDeleteProjectExplanation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from("project_explanations")
        .delete()
        .eq("project_id", projectId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-explanations"] })
    },
  })
}
