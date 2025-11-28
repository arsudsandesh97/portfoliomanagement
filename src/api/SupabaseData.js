import { supabase } from "../config/supabase";

// Bio API
export const bioApi = {
  fetch: async () => {
    const { data, error } = await supabase.from("bio").select("*").single();
    if (error) throw error;
    return data;
  },

  update: async (bioData) => {
    const { error } = await supabase.from("bio").upsert(bioData);
    if (error) throw error;
  },
};

// Copyright API
export const copyrightApi = {
  fetch: async () => {
    const { data, error } = await supabase
      .from("copyright")
      .select("id, copyright")
      .single();

    if (error) throw error;
    return data;
  },

  update: async (copyrightText) => {
    const { error } = await supabase
      .from("copyright")
      .update({ copyright: copyrightText })
      .eq("id", 1);

    if (error) throw error;
    return true;
  },
};

// Education API
export const educationApi = {
  fetch: async () => {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("id");
    if (error) throw error;
    return data;
  },

  create: async (educationData) => {
    const { data, error } = await supabase
      .from("education")
      .insert([educationData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, updateData) => {
    const { data, error } = await supabase
      .from("education")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) throw error;
  },
};

// Experience API
export const experienceApi = {
  fetch: async () => {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("id");
    if (error) throw error;
    return data;
  },

  create: async (experienceData) => {
    const { data, error } = await supabase
      .from("experiences")
      .insert([experienceData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (experienceData) => {
    const { id, ...updateData } = experienceData;
    const { data, error } = await supabase
      .from("experiences")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) throw error;
  },
};

// Skills API
export const skillsApi = {
  fetchAll: async () => {
    const { data, error } = await supabase
      .from("skills")
      .select(
        `
        *,
        skill_categories (
          id,
          title
        )
      `
      )
      .order("name");
    if (error) throw error;
    return data;
  },

  fetchWithCategories: async () => {
    const { data, error } = await supabase
      .from("skills")
      .select(
        `
        *,
        skill_categories (
          id,
          title
        )
      `
      )
      .order("name");
    if (error) throw error;
    return data;
  },

  create: async (skillData) => {
    const { data, error } = await supabase
      .from("skills")
      .insert([skillData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (skillData) => {
    const { id, ...updateData } = skillData;
    const { data, error } = await supabase
      .from("skills")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw error;
  },

  updateCategoryNull: async (categoryId) => {
    const { error } = await supabase
      .from("skills")
      .update({ category_id: null })
      .eq("category_id", categoryId);
    if (error) throw error;
  },
};

// Skill Categories API
export const skillCategoriesApi = {
  fetchAll: async () => {
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*")
      .order("title");
    if (error) throw error;
    return data;
  },

  fetch: async () => {
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*")
      .order("title");
    if (error) throw error;
    return data;
  },

  create: async (categoryData) => {
    const { data, error } = await supabase
      .from("skill_categories")
      .insert([categoryData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (categoryData) => {
    const { id, ...updateData } = categoryData;
    const { data, error } = await supabase
      .from("skill_categories")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from("skill_categories")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

// Projects API
export const projectsApi = {
  fetch: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id");
    if (error) throw error;
    return data;
  },

  create: async (projectData) => {
    const { data, error } = await supabase
      .from("projects")
      .insert([projectData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (projectData) => {
    const { id, ...updateData } = projectData;
    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  },
};

// Project Members API
export const projectMembersApi = {
  fetchByProjectId: async (projectId) => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("project_id", projectId);
    if (error) throw error;
    return data;
  },

  createMany: async (members) => {
    const { data, error } = await supabase
      .from("members")
      .insert(members)
      .select();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) throw error;
  },

  deleteByProjectId: async (projectId) => {
    const { error } = await supabase
      .from("members")
      .delete()
      .eq("project_id", projectId);
    if (error) throw error;
  },
};

// Project Associations API
export const projectAssociationsApi = {
  fetchByProjectId: async (projectId) => {
    const { data, error } = await supabase
      .from("associations")
      .select("*")
      .eq("project_id", projectId);
    if (error) throw error;
    return data;
  },

  createMany: async (associations) => {
    const { data, error } = await supabase
      .from("associations")
      .insert(associations)
      .select();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("associations").delete().eq("id", id);
    if (error) throw error;
  },

  deleteByProjectId: async (projectId) => {
    const { error } = await supabase
      .from("associations")
      .delete()
      .eq("project_id", projectId);
    if (error) throw error;
  },
};

// Contacts API
export const contactsApi = {
  fetch: async () => {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  create: async (contactData) => {
    const { data, error } = await supabase
      .from("contacts")
      .insert([contactData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (contactData) => {
    const { id, created_at, ...updateData } = contactData;
    const { data, error } = await supabase
      .from("contacts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) throw error;
  },
};

// Project Category API
export const projectCategoryApi = {
  fetch: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("category")
      .not("category", "is", null);
    if (error) throw error;
    return data;
  },

  create: async (category) => {
    const { data, error } = await supabase
      .from("projects")
      .insert([{ category }]);
    if (error) throw error;
    return data;
  },

  update: async ({ oldCategory, newCategory }) => {
    const { data, error } = await supabase
      .from("projects")
      .update({ category: newCategory })
      .eq("category", oldCategory);
    if (error) throw error;
    return data;
  },

  delete: async (category) => {
    const { error } = await supabase
      .from("projects")
      .update({ category: null })
      .eq("category", category);
    if (error) throw error;
  },
};

// Project Explanations API
export const projectExplanationsApi = {
  fetchByProjectId: async (projectId) => {
    const { data, error } = await supabase
      .from("project_explanations")
      .select("*")
      .eq("project_id", projectId)
      .single();
    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found" error
    return data;
  },

  fetchAll: async () => {
    const { data, error } = await supabase
      .from("project_explanations")
      .select("*");
    if (error) throw error;
    return data;
  },

  upsert: async (explanationData) => {
    const { data, error } = await supabase
      .from("project_explanations")
      .upsert(explanationData, { onConflict: "project_id" })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (projectId) => {
    const { error } = await supabase
      .from("project_explanations")
      .delete()
      .eq("project_id", projectId);
    if (error) throw error;
  },
};

// Blog Posts API
export const blogPostsApi = {
  // Fetch all published blog posts (for public view)
  fetchPublished: async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  // Fetch all blog posts (for admin)
  fetchAll: async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  // Fetch featured blog posts
  fetchFeatured: async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .eq("is_featured", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  // Fetch blog post by slug
  fetchBySlug: async (slug) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return data;
  },

  // Fetch blog post by ID
  fetchById: async (id) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  // Fetch posts by category
  fetchByCategory: async (category) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .eq("category", category)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  // Fetch posts by tag
  fetchByTag: async (tag) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .contains("tags", [tag])
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  // Search blog posts
  search: async (query) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  // Create new blog post
  create: async (postData) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .insert([postData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update blog post
  update: async (postData) => {
    const { id, ...updateData } = postData;
    const { data, error } = await supabase
      .from("blog_posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Delete blog post
  delete: async (id) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) throw error;
  },

  // Increment view count
  incrementViews: async (id) => {
    const { error } = await supabase.rpc("increment_post_views", {
      post_id: id,
    });
    if (error) {
      // Fallback if RPC function doesn't exist
      const { data: post } = await supabase
        .from("blog_posts")
        .select("views")
        .eq("id", id)
        .single();
      
      if (post) {
        await supabase
          .from("blog_posts")
          .update({ views: (post.views || 0) + 1 })
          .eq("id", id);
      }
    }
  },

  // Get all unique categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("category")
      .not("category", "is", null);
    if (error) throw error;
    
    // Return unique categories
    const categories = [...new Set(data.map(item => item.category))];
    return categories.filter(Boolean);
  },

  // Get all unique tags
  getTags: async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("tags");
    if (error) throw error;
    
    // Flatten and get unique tags
    const allTags = data.reduce((acc, item) => {
      if (item.tags && Array.isArray(item.tags)) {
        return [...acc, ...item.tags];
      }
      return acc;
    }, []);
    
    return [...new Set(allTags)];
  },
};
