import { useState } from "react"
import { useForm } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
import { useCreateProject, useUpdateProject } from "./use-projects"
import type { Project } from "./use-projects"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  description2: z.string().optional(),
  description3: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  dashboard: z.string().url().optional().or(z.literal("")),
  // tags will be managed via state, not in form schema
  category: z.string().optional(),
})

type ProjectFormProps = {
  project?: Project | null
  onSuccess: () => void
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const [tags, setTags] = useState<string[]>(project?.tags || [])
  const [tagInput, setTagInput] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      description2: project?.description2 || "",
      description3: project?.description3 || "",
      image: project?.image || "",
      github: project?.github || "",
      dashboard: project?.dashboard || "",
      category: project?.category || "",
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
      const projectData = {
        title: values.title,
        description: values.description,
        description2: values.description2 || null,
        description3: values.description3 || null,
        image: values.image || null,
        github: values.github || null,
        dashboard: values.dashboard || null,
        tags: tags.length > 0 ? tags : [],
        category: values.category || null,
      }

      if (project) {
        await updateProject.mutateAsync({ ...projectData, id: project.id })
      } else {
        await createProject.mutateAsync(projectData)
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
                <Input placeholder="Project Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Project Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description 2 (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description3"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description 3 (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Web App, Mobile, etc." {...field} />
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
                placeholder="Add a tag (e.g., React)"
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
        <FormField
          control={form.control}
          name="image"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dashboard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
