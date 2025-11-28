import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react"
import { useEducation, useCreateEducation, useUpdateEducation, useDeleteEducation } from "./use-education"
import type { Education } from "./use-education"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
} from "@/components/ui/form"

const formSchema = z.object({
  school: z.string().min(2, "School name is required"),
  degree: z.string().min(2, "Degree is required"),
  date: z.string().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
  img: z.string().url().optional().or(z.literal("")),
})

export default function EducationPage() {
  const { data: education, isLoading } = useEducation()
  const deleteEducation = useDeleteEducation()
  const [editingItem, setEditingItem] = useState<Education | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this education entry?")) {
      deleteEducation.mutate(id)
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
          <h1 className="text-3xl font-bold tracking-tight">Education</h1>
          <p className="text-muted-foreground">
            Manage your educational background.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Education" : "Add Education"}
              </DialogTitle>
            </DialogHeader>
            <EducationForm
              education={editingItem}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {education?.map((item) => (
          <Card key={item.id} className="group relative overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-col sm:flex-row items-start gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 overflow-hidden shrink-0">
                {item.img ? (
                   <img src={item.img} alt={item.school || "School"} className="h-full w-full object-cover" />
                ) : (
                  <GraduationCap className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{item.school}</CardTitle>
                    <CardDescription className="text-base font-medium text-foreground/80">
                      {item.degree}
                    </CardDescription>
                  </div>
                  {/* Mobile Actions */}
                  <div className="flex gap-1 sm:hidden">
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
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {item.date}
                  {item.grade && ` • Grade: ${item.grade}`}
                </div>
                {item.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
              {/* Desktop Actions */}
              <div className="hidden sm:flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
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

function EducationForm({
  education,
  onSuccess,
}: {
  education?: Education | null
  onSuccess: () => void
}) {
  const createEducation = useCreateEducation()
  const updateEducation = useUpdateEducation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      school: education?.school || "",
      degree: education?.degree || "",
      date: education?.date || "",
      grade: education?.grade || "",
      description: education?.description || "",
      img: education?.img || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = {
        school: values.school,
        degree: values.degree,
        date: values.date || null,
        grade: values.grade || null,
        description: values.description || null,
        img: values.img || null,
      }

      if (education) {
        await updateEducation.mutateAsync({ ...data, id: education.id })
      } else {
        await createEducation.mutateAsync(data)
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
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School / University</FormLabel>
              <FormControl>
                <Input placeholder="University of Technology" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="degree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree</FormLabel>
              <FormControl>
                <Input placeholder="Bachelor of Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date / Year</FormLabel>
              <FormControl>
                <Input placeholder="2019 - 2023" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade / GPA</FormLabel>
              <FormControl>
                <Input placeholder="3.8 GPA" {...field} />
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
                <Textarea placeholder="Details about your study..." {...field} />
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
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
