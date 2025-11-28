import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FileCode, Trash2, Save, BookOpen, FolderKanban, FileText } from "lucide-react"
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { 
  useProjectExplanations, 
  useProjectExplanation,
  useUpsertProjectExplanation, 
  useDeleteProjectExplanation 
} from "./use-project-explanations"
import { useProjects } from "../projects/use-projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  project_id: z.string().min(1, "Please select a project"),
  markdown_content: z.string().min(10, "Content must be at least 10 characters"),
})

export default function ProjectExplanationsPage() {
  const { data: projects, isLoading: projectsLoading } = useProjects()
  const { data: explanations, isLoading: explanationsLoading } = useProjectExplanations()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const selectedExplanation = useProjectExplanation(selectedProjectId)
  const upsertExplanation = useUpsertProjectExplanation()
  const deleteExplanation = useDeleteProjectExplanation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_id: "",
      markdown_content: "",
    },
  })

  // Update form when a project is selected
  useEffect(() => {
    if (selectedProjectId) {
      form.setValue("project_id", selectedProjectId)
      
      if (selectedExplanation.data) {
        form.setValue("markdown_content", selectedExplanation.data.markdown_content)
      } else if (!selectedExplanation.isLoading) {
        // Only clear if we're not loading (meaning no explanation exists)
        form.setValue("markdown_content", "")
      }
    }
  }, [selectedProjectId, selectedExplanation.data, selectedExplanation.isLoading])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await upsertExplanation.mutateAsync({
        project_id: values.project_id,
        markdown_content: values.markdown_content,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async () => {
    if (!selectedProjectId) return
    if (confirm("Are you sure you want to delete this project explanation?")) {
      try {
        await deleteExplanation.mutateAsync(selectedProjectId)
        setSelectedProjectId(null)
        form.reset()
      } catch (error) {
        console.error(error)
      }
    }
  }

  // Get projects that have explanations
  const projectsWithExplanations = new Set(explanations?.map(e => e.project_id) || [])

  if (projectsLoading || explanationsLoading) {
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
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              Project Explanations
            </h1>
            <p className="text-muted-foreground text-base">
              Write comprehensive markdown documentation for your projects
            </p>
          </div>
          {selectedProjectId && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-medium">Editing Mode</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Enhanced Sidebar */}
        <Card className="lg:col-span-1 border-2 hover:border-primary/30 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded bg-primary/10">
                <FolderKanban className="h-4 w-4 text-primary" />
              </div>
              Your Projects
            </CardTitle>
            <CardDescription className="text-xs">
              {projects?.length || 0} project{projects?.length !== 1 ? 's' : ''} available
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="max-h-[600px] overflow-y-auto pr-2 space-y-1.5">
              {projects?.map((project) => (
                <Button
                  key={project.id}
                  type="button"
                  variant={selectedProjectId === project.id ? "default" : "ghost"}
                  className={`w-full justify-start text-left h-auto py-3 px-3 transition-all ${
                    selectedProjectId === project.id 
                      ? 'shadow-md' 
                      : 'hover:bg-accent hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`shrink-0 h-8 w-8 rounded flex items-center justify-center ${
                      selectedProjectId === project.id ? 'bg-primary-foreground/20' : 'bg-accent'
                    }`}>
                      <FileCode className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-sm">{project.title}</p>
                      {projectsWithExplanations.has(project.id) && (
                        <span className="text-xs text-muted-foreground">Has explanation</span>
                      )}
                    </div>
                    {projectsWithExplanations.has(project.id) && (
                      <Badge variant="secondary" className="ml-auto shrink-0 h-5 px-1.5">
                        <FileCode className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {(!projects || projects.length === 0) && (
              <div className="text-center py-8">
                <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  No projects found
                </p>
                <p className="text-xs text-muted-foreground">
                  Create a project first
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Editor Card */}
        <Card className="lg:col-span-3 border-2 hover:border-primary/20 transition-all">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedProjectId ? 'bg-primary/10' : 'bg-muted'}`}>
                  <FileCode className={`h-5 w-5 ${selectedProjectId ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedProjectId ? "Edit Explanation" : "Select a Project"}
                  </h2>
                  {selectedProjectId && (
                    <p className="text-sm text-muted-foreground font-normal mt-0.5">
                      For: <strong className="text-foreground">
                        {projects?.find(p => p.id === selectedProjectId)?.title}
                      </strong>
                    </p>
                  )}
                </div>
              </div>
              {selectedProjectId && selectedExplanation.data && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteExplanation.isPending}
                  className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!selectedProjectId ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                  <BookOpen className="h-20 w-20 text-muted-foreground/50 relative" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Project Selected</h3>
                <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
                  Choose a project from the sidebar to start writing or editing its detailed explanation
                </p>
              </div>
            ) : selectedExplanation.isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
                  <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-primary/20"></div>
                </div>
                <p className="text-muted-foreground font-medium">Loading explanation...</p>
                <p className="text-xs text-muted-foreground mt-1">Please wait</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Project Selector */}
                  <FormField
                    control={form.control}
                    name="project_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <FolderKanban className="h-4 w-4" />
                          Project
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedProjectId(value)
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projects?.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                <div className="flex items-center gap-2">
                                  <FileCode className="h-3.5 w-3.5 text-muted-foreground" />
                                  {project.title}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Markdown Editor */}
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Markdown Content
                    </FormLabel>
                    <FormDescription className="text-xs flex items-center gap-1.5 bg-muted/50 px-3 py-2 rounded-md border mb-3">
                      <span className="flex items-center gap-1">
                        ✨ <strong>Tip:</strong> Write using Markdown syntax
                      </span>
                      <span className="text-muted-foreground/70">•</span>
                      <span>Live preview updates as you type</span>
                    </FormDescription>
                    <Controller
                      control={form.control}
                      name="markdown_content"
                      render={({ field }) => (
                        <div className="rounded-xl overflow-hidden border-2 border-muted hover:border-primary/30 transition-all shadow-sm">
                          <div data-color-mode="dark" className="bg-background">
                            <MDEditor
                              value={field.value}
                              onChange={(value) => field.onChange(value || "")}
                              preview="live"
                              height={500}
                              visibleDragbar={false}
                              highlightEnable={true}
                            />
                          </div>
                        </div>
                      )}
                    />
                    <FormMessage />
                  </FormItem>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setSelectedProjectId(null)
                        form.reset()
                      }}
                      className="min-w-[100px]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting || upsertExplanation.isPending}
                      size="lg"
                      className="min-w-[150px] shadow-md hover:shadow-lg transition-all"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {form.formState.isSubmitting || upsertExplanation.isPending
                        ? "Saving..."
                        : selectedExplanation.data
                        ? "Update Explanation"
                        : "Create Explanation"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
