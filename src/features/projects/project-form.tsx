import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, X, Pencil } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { useCreateProject, useUpdateProject } from "./use-projects"
import type { MemberInsert, AssociationInsert, ProjectWithDetails } from "./use-projects"

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
  is_published: z.boolean().default(true),
})

type ProjectFormProps = {
  project?: ProjectWithDetails | null
  onSuccess: () => void
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const [tags, setTags] = useState<string[]>(project?.tags || [])
  const [tagInput, setTagInput] = useState("")

  // Members state
  const [members, setMembers] = useState<MemberInsert[]>(project?.members || [])
  const [newMember, setNewMember] = useState<MemberInsert>({
    name: "",
    img: "",
    github: "",
    linkedin: "",
    project_id: "", // Will be set on submit
  })


  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null)

  // Associations state
  const [associations, setAssociations] = useState<AssociationInsert[]>(project?.associations || [])
  const [newAssociation, setNewAssociation] = useState<AssociationInsert>({
    name: "",
    img: "",
    project_id: "", // Will be set on submit
  })
  const [editingAssociationIndex, setEditingAssociationIndex] = useState<number | null>(null)

  const addMember = () => {
    if (newMember.name) {
      if (editingMemberIndex !== null) {
        const updatedMembers = [...members]
        updatedMembers[editingMemberIndex] = newMember
        setMembers(updatedMembers)
        setEditingMemberIndex(null)
      } else {
        setMembers([...members, newMember])
      }
      setNewMember({ name: "", img: "", github: "", linkedin: "", project_id: "" })
    }
  }

  const editMember = (index: number) => {
    setNewMember(members[index])
    setEditingMemberIndex(index)
  }

  const cancelEditMember = () => {
    setNewMember({ name: "", img: "", github: "", linkedin: "", project_id: "" })
    setEditingMemberIndex(null)
  }

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const addAssociation = () => {
    if (newAssociation.name) {
      if (editingAssociationIndex !== null) {
        const updatedAssociations = [...associations]
        updatedAssociations[editingAssociationIndex] = newAssociation
        setAssociations(updatedAssociations)
        setEditingAssociationIndex(null)
      } else {
        setAssociations([...associations, newAssociation])
      }
      setNewAssociation({ name: "", img: "", project_id: "" })
    }
  }

  const editAssociation = (index: number) => {
    setNewAssociation(associations[index])
    setEditingAssociationIndex(index)
  }

  const cancelEditAssociation = () => {
    setNewAssociation({ name: "", img: "", project_id: "" })
    setEditingAssociationIndex(null)
  }

  const removeAssociation = (index: number) => {
    setAssociations(associations.filter((_, i) => i !== index))
  }

  const form = useForm({
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
      is_published: project?.is_published ?? true,
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
        is_published: values.is_published,
        members,
        associations,
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

        {/* Members Section */}
        <div className="space-y-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Team Members</h3>
            <p className="text-sm text-muted-foreground">Add team members who contributed to this project.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
              <h4 className="text-sm font-medium leading-none mb-4">
                {editingMemberIndex !== null ? "Edit Member" : "Add New Member"}
              </h4>
              <div className="grid gap-3">
                <Input
                  placeholder="Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="bg-background"
                />
                <Input
                  placeholder="Image URL"
                  value={newMember.img || ""}
                  onChange={(e) => setNewMember({ ...newMember, img: e.target.value })}
                  className="bg-background"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="GitHub URL"
                    value={newMember.github || ""}
                    onChange={(e) => setNewMember({ ...newMember, github: e.target.value })}
                    className="bg-background"
                  />
                  <Input
                    placeholder="LinkedIn URL"
                    value={newMember.linkedin || ""}
                    onChange={(e) => setNewMember({ ...newMember, linkedin: e.target.value })}
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" onClick={addMember} disabled={!newMember.name} className="flex-1">
                  {editingMemberIndex !== null ? <><Pencil className="mr-2 h-4 w-4" /> Update Member</> : <><Plus className="mr-2 h-4 w-4" /> Add Member</>}
                </Button>
                {editingMemberIndex !== null && (
                  <Button type="button" variant="outline" onClick={cancelEditMember}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium leading-none mb-4">Current Members</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {members.map((member, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 ${editingMemberIndex === index ? "border-primary bg-primary/5" : "bg-card"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex items-center justify-center border">
                        {member.img ? (
                          <img src={member.img} alt={member.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground">{member.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="grid gap-0.5">
                        <span className="text-sm font-medium leading-none">{member.name}</span>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          {member.github && <span>GitHub</span>}
                          {member.linkedin && <span>LinkedIn</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editMember(index)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeMember(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                    No members added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Associations Section */}
        <div className="space-y-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-lg font-semibold leading-none tracking-tight">Associations</h3>
            <p className="text-sm text-muted-foreground">Add organizations or companies associated with this project.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
              <h4 className="text-sm font-medium leading-none mb-4">
                {editingAssociationIndex !== null ? "Edit Association" : "Add New Association"}
              </h4>
              <div className="grid gap-3">
                <Input
                  placeholder="Name"
                  value={newAssociation.name}
                  onChange={(e) => setNewAssociation({ ...newAssociation, name: e.target.value })}
                  className="bg-background"
                />
                <Input
                  placeholder="Image URL"
                  value={newAssociation.img || ""}
                  onChange={(e) => setNewAssociation({ ...newAssociation, img: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" onClick={addAssociation} disabled={!newAssociation.name} className="flex-1">
                  {editingAssociationIndex !== null ? <><Pencil className="mr-2 h-4 w-4" /> Update Association</> : <><Plus className="mr-2 h-4 w-4" /> Add Association</>}
                </Button>
                {editingAssociationIndex !== null && (
                  <Button type="button" variant="outline" onClick={cancelEditAssociation}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium leading-none mb-4">Current Associations</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {associations.map((association, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 ${editingAssociationIndex === index ? "border-primary bg-primary/5" : "bg-card"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex items-center justify-center border">
                        {association.img ? (
                          <img src={association.img} alt={association.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground">{association.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-sm font-medium leading-none">{association.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editAssociation(index)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeAssociation(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {associations.length === 0 && (
                  <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                    No associations added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Published</FormLabel>
                <FormDescription>
                  Make this project visible to the public.
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
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
