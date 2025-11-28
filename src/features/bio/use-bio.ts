import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"

export type Bio = Database["public"]["Tables"]["bio"]["Row"]
export type BioInsert = Database["public"]["Tables"]["bio"]["Insert"]
export type BioUpdate = Database["public"]["Tables"]["bio"]["Update"]

export const useBio = () => {
  return useQuery({
    queryKey: ["bio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bio")
        .select("*")
        .single()
      
      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "The result contains 0 rows"
      return data as Bio | null
    },
  })
}

export const useUpdateBio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bio: BioUpdate) => {
      // Check if bio exists first
      const { data: existingBio } = await supabase.from("bio").select("id").single()

      let result
      if (existingBio) {
        result = await supabase
          .from("bio")
          // @ts-expect-error - Supabase type inference mismatch
          .update(bio as any)
          .eq("id", (existingBio as any).id)
          .select()
          .single()
      } else {
        result = await supabase
          .from("bio")
          // @ts-expect-error - Supabase type inference mismatch
          .insert([bio as any])
          .select()
          .single()
      }
      
      if (result.error) throw result.error
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bio"] })
      toast({
        title: "Success",
        description: "Bio updated successfully.",
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
