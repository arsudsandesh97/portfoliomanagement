export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      associations: {
        Row: {
          id: string
          project_id: string
          name: string
          img: string | null
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          img?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          img?: string | null
        }
      }
      bio: {
        Row: {
          id: string
          name: string | null
          roles: string[] | null
          description: string | null
          github: string | null
          resume: string | null
          linkedin: string | null
          twitter: string | null
          insta: string | null
          Image: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          roles?: string[] | null
          description?: string | null
          github?: string | null
          resume?: string | null
          linkedin?: string | null
          twitter?: string | null
          insta?: string | null
          Image?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          roles?: string[] | null
          description?: string | null
          github?: string | null
          resume?: string | null
          linkedin?: string | null
          twitter?: string | null
          insta?: string | null
          Image?: string | null
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          cover_image: string | null
          author: string | null
          published: boolean | null
          published_at: string | null
          created_at: string | null
          updated_at: string | null
          reading_time: number | null
          views: number | null
          tags: string[] | null
          category: string | null
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          is_featured: boolean | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          cover_image?: string | null
          author?: string | null
          published?: boolean | null
          published_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          reading_time?: number | null
          views?: number | null
          tags?: string[] | null
          category?: string | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          is_featured?: boolean | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          cover_image?: string | null
          author?: string | null
          published?: boolean | null
          published_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          reading_time?: number | null
          views?: number | null
          tags?: string[] | null
          category?: string | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          is_featured?: boolean | null
        }
      }
      contacts: {
        Row: {
          id: string
          email: string
          name: string
          subject: string
          message: string
          created_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          subject: string
          message: string
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          subject?: string
          message?: string
          created_at?: string | null
        }
      }
      copyright: {
        Row: {
          id: number
          copyright: string
        }
        Insert: {
          id: number
          copyright: string
        }
        Update: {
          id?: number
          copyright?: string
        }
      }
      education: {
        Row: {
          id: string
          img: string | null
          school: string | null
          date: string | null
          grade: string | null
          description: string | null
          degree: string | null
          is_published: boolean
        }
        Insert: {
          id?: string
          img?: string | null
          school?: string | null
          date?: string | null
          grade?: string | null
          description?: string | null
          degree?: string | null
          is_published?: boolean
        }
        Update: {
          id?: string
          img?: string | null
          school?: string | null
          date?: string | null
          grade?: string | null
          description?: string | null
          degree?: string | null
          is_published?: boolean
        }
      }
      experiences: {
        Row: {
          id: string
          img: string | null
          role: string | null
          company: string | null
          date: string | null
          description: string | null
          description2: string | null
          description3: string | null
          skills: string[] | null
          doc: string | null
          is_published: boolean
        }
        Insert: {
          id?: string
          img?: string | null
          role?: string | null
          company?: string | null
          date?: string | null
          description?: string | null
          description2?: string | null
          description3?: string | null
          skills?: string[] | null
          doc?: string | null
          is_published?: boolean
        }
        Update: {
          id?: string
          img?: string | null
          role?: string | null
          company?: string | null
          date?: string | null
          description?: string | null
          description2?: string | null
          description3?: string | null
          skills?: string[] | null
          doc?: string | null
          is_published?: boolean
        }
      }
      members: {
        Row: {
          id: string
          project_id: string
          name: string
          img: string | null
          github: string | null
          linkedin: string | null
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          img?: string | null
          github?: string | null
          linkedin?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          img?: string | null
          github?: string | null
          linkedin?: string | null
        }
      }
      project_explanations: {
        Row: {
          project_id: string
          markdown_content: string
        }
        Insert: {
          project_id: string
          markdown_content: string
        }
        Update: {
          project_id?: string
          markdown_content?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string | null
          description: string | null
          description2: string | null
          description3: string | null
          image: string | null
          tags: string[] | null
          category: string | null
          github: string | null
          dashboard: string | null
          is_published: boolean
        }
        Insert: {
          id?: string
          title?: string | null
          description?: string | null
          description2?: string | null
          description3?: string | null
          image?: string | null
          tags?: string[] | null
          category?: string | null
          github?: string | null
          dashboard?: string | null
          is_published?: boolean
        }
        Update: {
          id?: string
          title?: string | null
          description?: string | null
          description2?: string | null
          description3?: string | null
          image?: string | null
          tags?: string[] | null
          category?: string | null
          github?: string | null
          dashboard?: string | null
          is_published?: boolean
        }
      }
      skill_categories: {
        Row: {
          id: string
          title: string
        }
        Insert: {
          id?: string
          title: string
        }
        Update: {
          id?: string
          title?: string
        }
      }
      skills: {
        Row: {
          id: string
          category_id: string | null
          name: string
          image: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          image?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          image?: string | null
        }
      }
      open_to_work_settings: {
        Row: {
          id: string
          is_visible: boolean
          custom_message: string | null
          location: string | null
          experience_type: 'fresher' | 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'custom' | null
          experience_display: string | null
          contact_email: string | null
          linkedin_url: string | null
          twitter_url: string | null
          position: 'bottom-left' | 'bottom-right' | null
          job_types: string[] | null
          preferred_roles: string[] | null
          skills: string[] | null
          availability: string | null
          available_from: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          is_visible?: boolean
          custom_message?: string | null
          location?: string | null
          experience_type?: 'fresher' | 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'custom' | null
          experience_display?: string | null
          contact_email?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          position?: 'bottom-left' | 'bottom-right' | null
          job_types?: string[] | null
          preferred_roles?: string[] | null
          skills?: string[] | null
          availability?: string | null
          available_from?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          is_visible?: boolean
          custom_message?: string | null
          location?: string | null
          experience_type?: 'fresher' | 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'custom' | null
          experience_display?: string | null
          contact_email?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          position?: 'bottom-left' | 'bottom-right' | null
          job_types?: string[] | null
          preferred_roles?: string[] | null
          skills?: string[] | null
          availability?: string | null
          available_from?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
