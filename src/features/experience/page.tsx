import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Pencil, Trash2, Briefcase, X } from "lucide-react"
import { useExperience, useCreateExperience, useUpdateExperience, useDeleteExperience } from "./use-experience"
import type { Experience } from "./use-experience"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  company: z.string().min(2, "Company name is required"),
  role: z.string().min(2, "Role is required"),
  date: z.string().optional(),
  description: z.string().optional(),
  description2: z.string().optional(),
  description3: z.string().optional(),
  // skills will be managed via state, not in form schema
  doc: z.string().url().optional().or(z.literal("")),
  img: z.string().url().optional().or(z.literal("")),
})

export default function ExperiencePage() {
  const { data: experience, isLoading } = useExperience()
  const deleteExperience = useDeleteExperience()
  const [editingItem, setEditingItem] = useState<Experience | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this experience entry?")) {
      deleteExperience.mutate(id)
    }
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
          <p className="text-muted-foreground">
            Manage your professional experience.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Experience" : "Add Experience"}
              </DialogTitle>
            </DialogHeader>
            <ExperienceForm
              experience={editingItem}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {experience?.map((item) => (
          <Card key={item.id} className="group relative overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-start gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 overflow-hidden">
                {item.img ? (
                  <img src={item.img} alt={item.company || "Company"} className="h-full w-full object-cover" />
                ) : (
                  <Briefcase className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{item.role}</CardTitle>
                <CardDescription className="text-base font-medium text-foreground/80">
                  {item.company}
                </CardDescription>
                <div className="mt-1 text-sm text-muted-foreground">
                  {item.date}
                </div>
                {item.description && (
                  <p className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setEditingItem(item)
                    setIsDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ExperienceForm({
  experience,
  onSuccess,
}: {
  experience?: Experience | null
  onSuccess: () => void
}) {
  const createExperience = useCreateExperience()
  const updateExperience = useUpdateExperience()
  const [skills, setSkills] = useState<string[]>(experience?.skills || [])
  const [skillInput, setSkillInput] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: experience?.company || "",
      role: experience?.role || "",
      date: experience?.date || "",
      description: experience?.description || "",
      description2: experience?.description2 || "",
      description3: experience?.description3 || "",
      doc: experience?.doc || "",
      img: experience?.img || "",
    },
  })

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = {
        company: values.company,
        role: values.role,
        date: values.date || null,
        description: values.description || null,
        description2: values.description2 || null,
        description3: values.description3 || null,
        skills: skills.length > 0 ? skills : null,
        doc: values.doc || null,
        img: values.img || null,
      }

      if (experience) {
        await updateExperience.mutateAsync({ ...data, id: experience.id })
      } else {
        await createExperience.mutateAsync(data)
      }
      onSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Tech Corp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date / Duration</FormLabel>
              <FormControl>
                <Input placeholder="Jan 2020 - Present" {...field} />
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
                <Textarea 
                  placeholder="Describe your responsibilities..." 
                  className="min-h-[100px]"
                  {...field} 
                />
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
                <Textarea placeholder="Additional details..." {...field} />
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
                <Textarea placeholder="More details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Skills Chip Input */}
        <FormItem>
          <FormLabel>Skills</FormLabel>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill (e.g., React)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addSkill}
                disabled={!skillInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-2 pr-1 py-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
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
            Press Enter or click + to add a skill
          </FormDescription>
        </FormItem>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="doc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="img"
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
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
