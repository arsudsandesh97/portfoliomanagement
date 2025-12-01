import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { useCreatePowerBiDashboard, useUpdatePowerBiDashboard } from "./use-power-bi-dashboards"
import type { PowerBiDashboard } from "./use-power-bi-dashboards"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  description: z.string().optional(),
  embed_url: z.string().url({
    message: "Please enter a valid URL.",
  }),
  author: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
})

type PowerBiDashboardFormProps = {
  dashboard?: PowerBiDashboard | null
  onSuccess: () => void
}

export function PowerBiDashboardForm({ dashboard, onSuccess }: PowerBiDashboardFormProps) {
  const createDashboard = useCreatePowerBiDashboard()
  const updateDashboard = useUpdatePowerBiDashboard()
  const [tags, setTags] = useState<string[]>(dashboard?.tags || [])
  const [tagInput, setTagInput] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: dashboard?.title || "",
      slug: dashboard?.slug || "",
      description: dashboard?.description || "",
      embed_url: dashboard?.embed_url || "",
      author: dashboard?.author || "",
      image_url: dashboard?.image_url || "",
    },
  })

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const dashboardData = {
        title: values.title,
        slug: values.slug,
        description: values.description || null,
        embed_url: values.embed_url,
        author: values.author || null,
        image_url: values.image_url || null,
        tags: tags.length > 0 ? tags : [],
      }

      if (dashboard) {
        await updateDashboard.mutateAsync({ ...dashboardData, id: dashboard.id })
      } else {
        await createDashboard.mutateAsync(dashboardData)
      }
      onSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Dashboard Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="dashboard-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <div data-color-mode="dark" className="rounded-lg overflow-hidden border">
              <Controller
                control={form.control}
                name="description"
                render={({ field }) => (
                  <MDEditor
                    value={field.value || ""}
                    onChange={(value) => field.onChange(value || "")}
                    preview="live"
                    height={200}
                    visibleDragbar={false}
                    highlightEnable={true}
                  />
                )}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormField
          control={form.control}
          name="embed_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Embed URL</FormLabel>
              <FormControl>
                <Input placeholder="https://app.powerbi.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Author Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Tags Chip Input */}
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag (e.g., Sales)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addTag}
                disabled={!tagInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-2 pr-1 py-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <FormDescription className="text-xs">
            Press Enter or click + to add a tag
          </FormDescription>
        </FormItem>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
