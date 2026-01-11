import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"

export type OpenToWorkSettings = Database["public"]["Tables"]["open_to_work_settings"]["Row"]
export type OpenToWorkSettingsInsert = Database["public"]["Tables"]["open_to_work_settings"]["Insert"]
export type OpenToWorkSettingsUpdate = Database["public"]["Tables"]["open_to_work_settings"]["Update"]

export const useOpenToWorkSettings = () => {
  return useQuery({
    queryKey: ["open_to_work_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("open_to_work_settings")
        .select("*")
        .single()
      
      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "The result contains 0 rows"
      return data as OpenToWorkSettings | null
    },
  })
}

export const useUpdateOpenToWorkSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (settings: OpenToWorkSettingsUpdate) => {
      // Check if settings exist first
      const { data: existingSettings } = await supabase
        .from("open_to_work_settings")
        .select("id")
        .single()

      let result
      if (existingSettings) {
        result = await supabase
          .from("open_to_work_settings")
          // @ts-expect-error - Supabase type inference mismatch
          .update(settings as any)
          .eq("id", (existingSettings as any).id)
          .select()
          .single()
      } else {
        result = await supabase
          .from("open_to_work_settings")
          // @ts-expect-error - Supabase type inference mismatch
          .insert([settings as any])
          .select()
          .single()
      }
      
      if (result.error) throw result.error
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["open_to_work_settings"] })
      toast({
        title: "Success",
        description: "Open to Work settings updated successfully.",
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

export const useToggleOpenToWork = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (isVisible: boolean) => {
      // Check if settings exist first
      const { data: existingSettings } = await supabase
        .from("open_to_work_settings")
        .select("id")
        .single()

      let result
      if (existingSettings) {
        result = await supabase
          .from("open_to_work_settings")
          .update({ is_visible: isVisible })
          .eq("id", (existingSettings as any).id)
          .select()
          .single()
      } else {
        result = await supabase
          .from("open_to_work_settings")
          // @ts-expect-error - Supabase type inference mismatch
          .insert([{ is_visible: isVisible }])
          .select()
          .single()
      }
      
      if (result.error) throw result.error
      return result.data
    },
    onSuccess: (_, isVisible) => {
      queryClient.invalidateQueries({ queryKey: ["open_to_work_settings"] })
      toast({
        title: isVisible ? "You're now visible!" : "Widget hidden",
        description: isVisible 
          ? "Recruiters can now see that you're open to work." 
          : "The Open to Work widget has been hidden.",
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
