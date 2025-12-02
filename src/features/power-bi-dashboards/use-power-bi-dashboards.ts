import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

export interface PowerBiDashboard {
  id: string
  title: string
  slug: string
  description: string | null
  embed_url: string
  author: string | null
  image_url: string | null
  tags: string[] | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export type PowerBiDashboardInsert = Omit<PowerBiDashboard, "id" | "created_at" | "updated_at" | "is_published"> & { is_published?: boolean }
export type PowerBiDashboardUpdate = Partial<PowerBiDashboardInsert> & { id: string }

export const usePowerBiDashboards = () => {
  return useQuery({
    queryKey: ["dashboards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dashboards")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return data as PowerBiDashboard[]
    },
  })
}

export const useCreatePowerBiDashboard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newDashboard: PowerBiDashboardInsert) => {
      const { data, error } = await supabase
        .from("dashboards")
        // @ts-expect-error - Supabase type inference mismatch
        .insert([newDashboard])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards"] })
      toast({
        title: "Success",
        description: "Dashboard created successfully.",
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

export const useUpdatePowerBiDashboard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dashboard: PowerBiDashboardUpdate) => {
      const { id, ...updates } = dashboard
      const { data, error } = await supabase
        .from("dashboards")
        // @ts-expect-error - Supabase type inference mismatch
        .update(updates)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards"] })
      toast({
        title: "Success",
        description: "Dashboard updated successfully.",
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

export const useDeletePowerBiDashboard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("dashboards")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards"] })
      toast({
        title: "Success",
        description: "Dashboard deleted successfully.",
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
