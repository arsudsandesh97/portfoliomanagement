import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type DashboardStats = {
  education: number
  experience: number
  projects: number
  skills: number
  blogPosts: number
  publishedPosts: number
  contacts: number
  totalViews: number
}

export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"]
export type Bio = Database["public"]["Tables"]["bio"]["Row"]

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      const [
        { count: educationCount },
        { count: experienceCount },
        { count: projectsCount },
        { count: skillsCount },
        { data: blogPosts },
        { count: contactsCount },
        { data: bioData },
      ] = await Promise.all([
        supabase.from("education").select("*", { count: "exact", head: true }),
        supabase.from("experience").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("skills").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("published, views"),
        supabase.from("contacts").select("*", { count: "exact", head: true }),
        supabase.from("bio").select("*").single(),
      ])

      const publishedPosts = (blogPosts as BlogPost[])?.filter((p) => p.published) || []
      const totalViews = publishedPosts.reduce((sum, p) => sum + (p.views || 0), 0)

      return {
        stats: {
          education: educationCount || 0,
          experience: experienceCount || 0,
          projects: projectsCount || 0,
          skills: skillsCount || 0,
          blogPosts: blogPosts?.length || 0,
          publishedPosts: publishedPosts.length,
          contacts: contactsCount || 0,
          totalViews,
        },
        bio: bioData as Bio | null,
      }
    },
  })
}

export const useRecentBlogPosts = () => {
  return useQuery({
    queryKey: ["recent_blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3)

      if (error) throw error
      return data as BlogPost[]
    },
  })
}
