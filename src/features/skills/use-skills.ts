import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"

export type Skill = Database["public"]["Tables"]["skills"]["Row"] & {
  skill_categories?: Database["public"]["Tables"]["skill_categories"]["Row"] | null
}
export type SkillCategory = Database["public"]["Tables"]["skill_categories"]["Row"]
export type SkillCategoryInsert = Database["public"]["Tables"]["skill_categories"]["Insert"]
export type SkillCategoryUpdate = Database["public"]["Tables"]["skill_categories"]["Update"]
export type SkillInsert = Database["public"]["Tables"]["skills"]["Insert"]
export type SkillUpdate = Database["public"]["Tables"]["skills"]["Update"]

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select(`
          *,
          skill_categories (
            id,
            title
          )
        `)
        .order("name")
      
      if (error) throw error
      return data as Skill[]
    },
  })
}

export const useSkillCategories = () => {
  return useQuery({
    queryKey: ["skill_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skill_categories")
        .select("*")
        .order("title")
      
      if (error) throw error
      return data as SkillCategory[]
    },
  })
}

// ─── Skill CRUD ───────────────────────────────────────────────

export const useCreateSkill = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newSkill: SkillInsert) => {
      const { data, error } = await supabase
        .from("skills")
        // @ts-expect-error - Supabase type inference mismatch
        .insert([newSkill as any])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] })
      toast({
        title: "Success",
        description: "Skill created successfully.",
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

export const useUpdateSkill = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (skill: SkillUpdate & { id: string }) => {
      const { id, ...updates } = skill
      const { data, error } = await supabase
        .from("skills")
        // @ts-expect-error - Supabase type inference mismatch
        .update(updates as any)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] })
      toast({
        title: "Success",
        description: "Skill updated successfully.",
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

export const useDeleteSkill = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] })
      toast({
        title: "Success",
        description: "Skill deleted successfully.",
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

// ─── Skill Category CRUD ──────────────────────────────────────

export const useCreateSkillCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newCategory: SkillCategoryInsert) => {
      const { data, error } = await supabase
        .from("skill_categories")
        // @ts-expect-error - Supabase type inference mismatch
        .insert([newCategory as any])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skill_categories"] })
      toast({
        title: "Success",
        description: "Category created successfully.",
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

export const useUpdateSkillCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (category: SkillCategoryUpdate & { id: string }) => {
      const { id, ...updates } = category
      const { data, error } = await supabase
        .from("skill_categories")
        // @ts-expect-error - Supabase type inference mismatch
        .update(updates as any)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skill_categories"] })
      queryClient.invalidateQueries({ queryKey: ["skills"] }) // skills join on categories
      toast({
        title: "Success",
        description: "Category updated successfully.",
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

export const useDeleteSkillCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("skill_categories")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skill_categories"] })
      queryClient.invalidateQueries({ queryKey: ["skills"] })
      toast({
        title: "Success",
        description: "Category deleted successfully.",
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
