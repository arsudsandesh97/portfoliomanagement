import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { storage } from "@/lib/firebase"
import { ref, listAll, uploadBytes, deleteObject, getDownloadURL, getMetadata } from "firebase/storage"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid'

export interface StorageFile {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: Record<string, any>
  url: string
}

export const useStorage = (bucket: string = "") => {
  return useQuery({
    queryKey: ["storage", bucket],
    queryFn: async () => {
      console.log(`Listing files in path: "${bucket}"`)
      const listRef = ref(storage, bucket)
      const res = await listAll(listRef)
      console.log("List result:", { 
        items: res.items.length, 
        prefixes: res.prefixes.map(p => p.name).join(', ') 
      })
      
      const files = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef)
          const metadata = await getMetadata(itemRef)
          
          return {
            name: itemRef.name,
            id: itemRef.fullPath,
            updated_at: metadata.updated,
            created_at: metadata.timeCreated,
            last_accessed_at: metadata.timeCreated,
            metadata: {
              size: metadata.size,
              contentType: metadata.contentType,
              ...metadata.customMetadata
            },
            url: url
          } as StorageFile
        })
      )
      
      return files
    },
  })
}

export const useUploadFile = (bucket: string = "") => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file, path }: { file: File; path?: string }) => {
      // Create a unique filename if not provided
      const fileName = path || `${Date.now()}-${uuidv4()}-${file.name}`
      const storageRef = ref(storage, bucket ? `${bucket}/${fileName}` : fileName)
      
      const snapshot = await uploadBytes(storageRef, file)
      const url = await getDownloadURL(snapshot.ref)
      
      return { snapshot, url }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storage", bucket] })
      toast({
        title: "Success",
        description: "File uploaded successfully.",
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

export const useDeleteFile = (bucket: string = "") => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      const storageRef = ref(storage, bucket ? `${bucket}/${name}` : name)
      await deleteObject(storageRef)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storage", bucket] })
      toast({
        title: "Success",
        description: "File deleted successfully.",
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

export const useRenameFile = (bucket: string = "") => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ oldName, newName }: { oldName: string; newName: string }) => {
      const oldRef = ref(storage, bucket ? `${bucket}/${oldName}` : oldName)
      const newRef = ref(storage, bucket ? `${bucket}/${newName}` : newName)

      // 1. Get download URL
      const url = await getDownloadURL(oldRef)
      
      // 2. Fetch the file
      const response = await fetch(url)
      const blob = await response.blob()
      
      // 3. Upload to new path
      await uploadBytes(newRef, blob)
      
      // 4. Delete old file
      await deleteObject(oldRef)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storage", bucket] })
      toast({
        title: "Success",
        description: "File renamed successfully.",
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
