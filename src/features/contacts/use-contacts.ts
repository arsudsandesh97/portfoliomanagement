import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"

export type Contact = Database["public"]["Tables"]["contacts"]["Row"]

export const useContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return data as Contact[]
    },
  })
}

export const useDeleteContact = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      console.log("Attempting to delete contact:", id)
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", id)
      
      if (error) {
        console.error("Error deleting contact:", error)
        throw error
      }
      console.log("Contact deleted successfully")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] })
      toast({
        title: "Success",
        description: "Contact deleted successfully.",
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
