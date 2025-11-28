import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"

export type Education = Database["public"]["Tables"]["education"]["Row"]
export type EducationInsert = Database["public"]["Tables"]["education"]["Insert"]
export type EducationUpdate = Database["public"]["Tables"]["education"]["Update"]

export const useEducation = () => {
  return useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("date", { ascending: false })
      
      if (error) throw error
      return data as Education[]
    },
  })
}

export const useCreateEducation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newEducation: EducationInsert) => {
      const { data, error } = await supabase
        .from("education")
        // @ts-expect-error - Supabase type inference mismatch
        .insert([newEducation as any])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] })
      toast({
        title: "Success",
        description: "Education added successfully.",
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

export const useUpdateEducation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (education: EducationUpdate & { id: string }) => {
      const { id, ...updates } = education
      const { data, error } = await supabase
        .from("education")
        // @ts-expect-error - Supabase type inference mismatch
        .update(updates as any)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] })
      toast({
        title: "Success",
        description: "Education updated successfully.",
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

export const useDeleteEducation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("education")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] })
      toast({
        title: "Success",
        description: "Education deleted successfully.",
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
