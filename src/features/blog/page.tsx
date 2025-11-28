import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Pencil, Trash2, Eye, Calendar, Edit3, Sparkles, Globe, Search, Grid3x3, List } from "lucide-react"
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from "./use-blog"
import type { BlogPost } from "./use-blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  excerpt: z.string().min(10, "Excerpt is required"),
  content: z.string().optional(),
  cover_image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tags: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  published: z.boolean().default(false),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
})

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export default function BlogPage() {
  const { data: posts, isLoading } = useBlogPosts()
  const deletePost = useDeleteBlogPost()
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost.mutate(id)
    }
  }

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (post.excerpt?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" 
      ? true 
      : filterStatus === "published" 
        ? post.published 
        : !post.published
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: posts?.length || 0,
    published: posts?.filter(p => p.published).length || 0,
    drafts: posts?.filter(p => !p.published).length || 0,
    views: posts?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
            <p className="text-muted-foreground">
              Write and manage your blog content with markdown.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)} size="lg">
                <Plus className="mr-2 h-4 w-4" /> Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  {editingItem ? "Edit Post" : "Create New Post"}
                </DialogTitle>
              </DialogHeader>
              <BlogForm
                post={editingItem}
                onSuccess={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Posts</CardDescription>
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Published</CardDescription>
              <CardTitle className="text-2xl text-green-500">{stats.published}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Drafts</CardDescription>
              <CardTitle className="text-2xl text-yellow-500">{stats.drafts}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Views</CardDescription>
              <CardTitle className="text-2xl text-blue-500">{stats.views}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search posts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center border rounded-lg p-1 bg-muted/50">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
        {filteredPosts?.map((post) => (
          <Card key={post.id} className={`group relative overflow-hidden transition-all hover:shadow-lg border-l-4 ${post.published ? 'border-l-green-500/50 hover:border-l-green-500' : 'border-l-yellow-500/50 hover:border-l-yellow-500'}`}>
            <CardContent className="p-0">
              <div className={`flex ${viewMode === "list" ? "flex-row items-center" : "flex-col"}`}>
                {post.cover_image && viewMode === "grid" && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={post.published ? "default" : "secondary"}
                          className={post.published ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}
                        >
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.created_at || "").toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt || "No excerpt available"}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views || 0} views
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingItem(post)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPosts?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No posts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function BlogForm({
  post,
  onSuccess,
}: {
  post?: BlogPost | null
  onSuccess: () => void
}) {
  const createPost = useCreateBlogPost()
  const updatePost = useUpdateBlogPost()

  const form = useForm<z.infer<typeof formSchema>>({
    // @ts-expect-error - Resolver type mismatch
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      cover_image: post?.cover_image || "",
      tags: post?.tags?.join(", ") || "",
      category: post?.category || "",
      author: post?.author || "",
      published: (post?.published ?? false) as boolean,
      seo_title: post?.seo_title || "",
      seo_description: post?.seo_description || "",
      seo_keywords: post?.seo_keywords?.join(", ") || "",
    },
  })

  const generateSEO = () => {
    const title = form.getValues("title")
    const excerpt = form.getValues("excerpt")
    const tags = form.getValues("tags")

    if (title) form.setValue("seo_title", title)
    if (excerpt) form.setValue("seo_description", excerpt)
    if (tags) form.setValue("seo_keywords", tags)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        content: values.content || "",
        cover_image: values.cover_image || null,
        tags: values.tags ? values.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        category: values.category || null,
        author: values.author || null,
        published: (values.published ?? false) as boolean,
        seo_title: values.seo_title || null,
        seo_description: values.seo_description || null,
        seo_keywords: values.seo_keywords ? values.seo_keywords.split(",").map(t => t.trim()).filter(Boolean) : [],
      }

      if (post) {
        await updatePost.mutateAsync({ ...data, id: post.id })
      } else {
        await createPost.mutateAsync(data)
      }
      onSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      {/* @ts-expect-error - Submit handler type mismatch */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6 py-4">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                // @ts-expect-error - Control type mismatch
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter post title" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e)
                          if (!post && !form.getValues("slug")) {
                            form.setValue("slug", slugify(e.target.value))
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // @ts-expect-error - Control type mismatch
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="url-friendly-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              // @ts-expect-error - Control type mismatch
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief summary of the post (displayed in cards and search results)" 
                      className="resize-none h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // @ts-expect-error - Control type mismatch
              control={form.control}
              name="cover_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormItem>
              <FormLabel>Content (Markdown)</FormLabel>
              <FormDescription className="text-xs flex items-center gap-2 mb-2">
                Write your content using Markdown. Preview updates in real-time.
              </FormDescription>
              <Controller
                control={form.control}
                name="content"
                render={({ field }) => (
                  <div data-color-mode="dark" className="rounded-lg overflow-hidden border">
                    <MDEditor
                      value={field.value || ""}
                      onChange={(value) => field.onChange(value || "")}
                      preview="live"
                      height={400}
                      visibleDragbar={false}
                      highlightEnable={true}
                    />
                  </div>
                )}
              />
            </FormItem>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-6 py-4">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                // @ts-expect-error - Control type mismatch
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tech, Lifestyle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // @ts-expect-error - Control type mismatch
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma separated tags (e.g. react, nextjs)" {...field} />
                    </FormControl>
                    <FormDescription>Used for filtering and SEO keywords</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                // @ts-expect-error - Control type mismatch
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <FormField
              // @ts-expect-error - Control type mismatch
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold">Publish Status</FormLabel>
                    <FormDescription>
                      {field.value 
                        ? "This post is visible to the public" 
                        : "Save as draft - not visible to the public"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="seo" className="space-y-6 py-4">
            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
              <div className="space-y-1">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Auto-Generate SEO
                </h4>
                <p className="text-xs text-muted-foreground">
                  Generate SEO metadata from your content
                </p>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={generateSEO}>
                Generate
              </Button>
            </div>

            <FormField
              // @ts-expect-error - Control type mismatch
              control={form.control}
              name="seo_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-9" placeholder="Title for search engines" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>Defaults to post title if empty</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // @ts-expect-error - Control type mismatch
              control={form.control}
              name="seo_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description for search results" 
                      className="resize-none h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Defaults to excerpt if empty</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // @ts-expect-error - Control type mismatch
              control={form.control}
              name="seo_keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Keywords</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-9" placeholder="keyword1, keyword2, keyword3" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>Comma separated keywords</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            size="lg"
          >
            {form.formState.isSubmitting ? "Saving..." : post ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
