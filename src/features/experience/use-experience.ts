import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"

export type Experience = Database["public"]["Tables"]["experiences"]["Row"]
export type ExperienceInsert = Database["public"]["Tables"]["experiences"]["Insert"]
export type ExperienceUpdate = Database["public"]["Tables"]["experiences"]["Update"]

export const useExperience = () => {
  return useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("date", { ascending: false })
      
      if (error) throw error
      return data as Experience[]
    },
  })
}

export const useCreateExperience = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newExperience: ExperienceInsert) => {
      const { data, error } = await supabase
        .from("experiences")
        // @ts-expect-error - Supabase type inference mismatch
        .insert([newExperience as any])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] })
      toast({
        title: "Success",
        description: "Experience added successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useUpdateExperience = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (experience: ExperienceUpdate & { id: string }) => {
      const { id, ...updates } = experience
      const { data, error } = await supabase
        .from("experiences")
        // @ts-expect-error - Supabase type inference mismatch
        .update(updates as any)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] })
      toast({
        title: "Success",
        description: "Experience updated successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useDeleteExperience = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] })
      toast({
        title: "Success",
        description: "Experience deleted successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
