import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"

export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"]
export type Member = Database["public"]["Tables"]["members"]["Row"]
export type MemberInsert = Database["public"]["Tables"]["members"]["Insert"]
export type Association = Database["public"]["Tables"]["associations"]["Row"]
export type AssociationInsert = Database["public"]["Tables"]["associations"]["Insert"]

export type ProjectWithDetails = Project & {
  members: Member[]
  associations: Association[]
}

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, members(*), associations(*)")
      
      if (error) throw error
      return data as ProjectWithDetails[]
    },
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newProject: ProjectInsert & { members?: MemberInsert[], associations?: AssociationInsert[] }) => {
      const { members, associations, ...projectData } = newProject
      
      // 1. Insert Project
      const { data, error: projectError } = await supabase
        .from("projects")
        // @ts-expect-error - Supabase type inference mismatch
        .insert([projectData])
        .select()
        .single()
      
      if (projectError) throw projectError
      
      const project = data as Project

      // 2. Insert Members if any
      if (members && members.length > 0) {
        const membersWithProjectId = members.map(m => ({ ...m, project_id: project.id }))
        const { error: membersError } = await supabase
          .from("members")
          .insert(membersWithProjectId as any)
        
        if (membersError) throw membersError
      }

      // 3. Insert Associations if any
      if (associations && associations.length > 0) {
        const associationsWithProjectId = associations.map(a => ({ ...a, project_id: project.id }))
        const { error: associationsError } = await supabase
          .from("associations")
          .insert(associationsWithProjectId as any)
        
        if (associationsError) throw associationsError
      }

      return project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast({
        title: "Success",
        description: "Project created successfully.",
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

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (project: ProjectUpdate & { id: string, members?: MemberInsert[], associations?: AssociationInsert[] }) => {
      const { id, members, associations, ...updates } = project
      
      // 1. Update Project
      const { data: updatedProject, error: projectError } = await supabase
        .from("projects")
        // @ts-expect-error - Supabase type inference mismatch
        .update(updates as any)
        .eq("id", id)
        .select()
        .single()
      
      if (projectError) throw projectError

      // 2. Handle Members (Delete all and re-insert)
      if (members) {
        // Delete existing
        const { error: deleteMembersError } = await supabase
          .from("members")
          .delete()
          .eq("project_id", id)
        
        if (deleteMembersError) throw deleteMembersError

        // Insert new
        if (members.length > 0) {
          const membersWithProjectId = members.map(m => ({ ...m, project_id: id }))
          const { error: insertMembersError } = await supabase
            .from("members")
            .insert(membersWithProjectId as any)
          
          if (insertMembersError) throw insertMembersError
        }
      }

      // 3. Handle Associations (Delete all and re-insert)
      if (associations) {
        // Delete existing
        const { error: deleteAssociationsError } = await supabase
          .from("associations")
          .delete()
          .eq("project_id", id)
        
        if (deleteAssociationsError) throw deleteAssociationsError

        // Insert new
        if (associations.length > 0) {
          const associationsWithProjectId = associations.map(a => ({ ...a, project_id: id }))
          const { error: insertAssociationsError } = await supabase
            .from("associations")
            .insert(associationsWithProjectId as any)
          
          if (insertAssociationsError) throw insertAssociationsError
        }
      }

      return updatedProject
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast({
        title: "Success",
        description: "Project updated successfully.",
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

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast({
        title: "Success",
        description: "Project deleted successfully.",
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
