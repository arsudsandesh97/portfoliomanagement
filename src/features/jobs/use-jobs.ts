import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"

export type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"]
export type JobApplicationInsert = Database["public"]["Tables"]["job_applications"]["Insert"]
export type JobApplicationUpdate = Database["public"]["Tables"]["job_applications"]["Update"]

export const JOB_STATUSES = [
  "Applied",
  "Rejected",
  "Interviewing",
  "Short Listed",
  "Offer Letter Received",
] as const

export type JobStatus = typeof JOB_STATUSES[number]

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("applied_on", { ascending: false })
      
      if (error) throw error
      return data as JobApplication[]
    },
  })
}

export const useCreateJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newJob: JobApplicationInsert) => {
      const { data, error } = await supabase
        .from("job_applications")
        // @ts-expect-error - Supabase type inference mismatch
        .insert([newJob as any])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast({
        title: "Success",
        description: "Job application added successfully.",
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

export const useUpdateJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (job: JobApplicationUpdate & { id: string }) => {
      const { id, ...updates } = job
      const { data, error } = await supabase
        .from("job_applications")
        // @ts-expect-error - Supabase type inference mismatch
        .update(updates as any)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast({
        title: "Success",
        description: "Job application updated successfully.",
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

export const useDeleteJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("job_applications")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast({
        title: "Success",
        description: "Job application deleted successfully.",
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

// Hook to fetch resume folders from the Supabase storage /Resume/ directory
export const useResumeFolders = () => {
  const DEFAULT_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "Portfolio"

  return useQuery({
    queryKey: ["resume-folders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .storage
        .from(DEFAULT_BUCKET)
        .list("Resume")

      if (error) throw error

      // Folders are items WITHOUT an id in Supabase storage
      const folders = data
        .filter((item) => !item.id && item.name !== ".emptyFolderPlaceholder")
        .map((item) => ({
          name: item.name,
        }))

      return folders
    },
  })
}
