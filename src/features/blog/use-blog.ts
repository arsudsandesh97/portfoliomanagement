import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"

export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"]
export type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"]
export type BlogPostUpdate = Database["public"]["Tables"]["blog_posts"]["Update"]

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return data as BlogPost[]
    },
  })
}

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newPost: BlogPostInsert) => {
      const { data, error } = await supabase
        .from("blog_posts")
        // @ts-expect-error - Supabase type inference mismatch
        .insert([newPost as any])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] })
      toast({
        title: "Success",
        description: "Blog post created successfully.",
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

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: BlogPostUpdate & { id: string }) => {
      const { id, ...updates } = post
      const { data, error } = await supabase
        .from("blog_posts")
        // @ts-expect-error - Supabase type inference mismatch
        .update(updates as any)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] })
      toast({
        title: "Success",
        description: "Blog post updated successfully.",
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

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] })
      toast({
        title: "Success",
        description: "Blog post deleted successfully.",
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
