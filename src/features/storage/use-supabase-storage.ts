import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid'
import type { StorageItem } from "./use-storage"

const DEFAULT_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "Portfolio"

export const useSupabaseStorage = (path: string = "", bucket: string = DEFAULT_BUCKET) => {
  return useQuery({
    queryKey: ["supabase-storage", bucket, path],
    queryFn: async () => {
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .list(path)

      if (error) throw error

      const items: StorageItem[] = await Promise.all(
        data.map(async (item) => {
          let url = ""
          if (item.id) { // It's a file
             const { data: { publicUrl } } = supabase
              .storage
              .from(bucket)
              .getPublicUrl(path ? `${path}/${item.name}` : item.name)
              url = publicUrl
          }

          return {
            name: item.name,
            id: item.id || item.name, // Use name as ID for folders if ID is null
            type: item.id ? 'file' : 'folder',
            updated_at: item.updated_at,
            created_at: item.created_at,
            last_accessed_at: item.last_accessed_at,
            metadata: item.metadata || {},
            url: url
          }
        })
      )
      
      return items
    },
  })
}

export const useSupabaseUploadFile = (bucket: string = DEFAULT_BUCKET) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file, path }: { file: File; path?: string }) => {
      const fileName = path || `${Date.now()}-${uuidv4()}-${file.name}`
      
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(fileName)
      
      return { data, url: publicUrl }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase-storage", bucket] })
      toast({
        title: "Success",
        description: "File uploaded successfully to Supabase.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useSupabaseDeleteFile = (bucket: string = DEFAULT_BUCKET) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .storage
        .from(bucket)
        .remove([name])

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase-storage", bucket] })
      toast({
        title: "Success",
        description: "File deleted successfully from Supabase.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
