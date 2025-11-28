import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Github, Linkedin, Twitter, Instagram, FileText, User, Briefcase, ExternalLink, X, Plus } from "lucide-react"
import { useBio, useUpdateBio } from "./use-bio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  name: z.string().optional(),
  description: z.string().optional(),
  github: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  insta: z.string().url("Invalid URL").optional().or(z.literal("")),
  resume: z.string().url("Invalid URL").optional().or(z.literal("")),
  Image: z.string().url("Invalid URL").optional().or(z.literal("")),
})

export default function BioPage() {
  const { data: bio, isLoading } = useBio()
  const updateBio = useUpdateBio()
  const [roles, setRoles] = useState<string[]>([])
  const [roleInput, setRoleInput] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      github: "",
      linkedin: "",
      twitter: "",
      insta: "",
      resume: "",
      Image: "",
    },
  })

  const watchedValues = form.watch()

  useEffect(() => {
    if (bio) {
      form.reset({
        name: bio.name || "",
        description: bio.description || "",
        github: bio.github || "",
        linkedin: bio.linkedin || "",
        twitter: bio.twitter || "",
        insta: bio.insta || "",
        resume: bio.resume || "",
        Image: bio.Image || "",
      })
      setRoles(bio.roles || [])
    }
  }, [bio, form])

  const addRole = () => {
    if (roleInput.trim() && !roles.includes(roleInput.trim())) {
      setRoles([...roles, roleInput.trim()])
      setRoleInput("")
    }
  }

  const removeRole = (roleToRemove: string) => {
    setRoles(roles.filter(role => role !== roleToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addRole()
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formattedValues = {
        ...values,
        roles: roles,
      }
      await updateBio.mutateAsync(formattedValues)
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return <div className="h-96 rounded-xl bg-muted animate-pulse" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bio & Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and social links.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Preview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Preview
            </CardTitle>
            <CardDescription>
              How your profile will appear
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Image */}
            {watchedValues.Image && (
              <div className="flex justify-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary/10">
                  <img
                    src={watchedValues.Image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect width='128' height='128' fill='%23666'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23fff' font-size='48'%3E?%3C/text%3E%3C/svg%3E"
                    }}
                  />
                </div>
              </div>
            )}

            {/* Name */}
            {watchedValues.name && (
              <div className="text-center">
                <h3 className="text-xl font-semibold">{watchedValues.name}</h3>
              </div>
            )}

            {/* Roles */}
            {roles.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {roles.map((role, index) => (
                  <Badge key={index} variant="secondary">
                    <Briefcase className="mr-1 h-3 w-3" />
                    {role}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description */}
            {watchedValues.description && (
              <p className="text-center text-sm text-muted-foreground">
                {watchedValues.description}
              </p>
            )}

            {/* Social Links */}
            {(watchedValues.github || watchedValues.linkedin || watchedValues.twitter || watchedValues.insta) && (
              <>
                <Separator />
                <div className="flex flex-wrap justify-center gap-2">
                  {watchedValues.github && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={watchedValues.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {watchedValues.linkedin && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={watchedValues.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {watchedValues.twitter && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={watchedValues.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {watchedValues.insta && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={watchedValues.insta} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </>
            )}

            {/* Resume */}
            {watchedValues.resume && (
              <>
                <Separator />
                <Button variant="outline" className="w-full" asChild>
                  <a href={watchedValues.resume} target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    View Resume
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Update your personal information and social media links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Basic Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Roles Chip Input */}
                    <FormItem>
                      <FormLabel>Roles</FormLabel>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a role (e.g., Developer)"
                            value={roleInput}
                            onChange={(e) => setRoleInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addRole}
                            disabled={!roleInput.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {roles.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {roles.map((role, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="pl-2 pr-1 py-1"
                              >
                                {role}
                                <button
                                  type="button"
                                  onClick={() => removeRole(role)}
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
                        Press Enter or click + to add a role
                      </FormDescription>
                    </FormItem>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio / Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell visitors about yourself..." 
                            className="h-24 resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Upload an image to Storage and paste the URL here
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Social Links Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Social Media Links</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="github"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            GitHub
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Twitter className="h-4 w-4" />
                            Twitter / X
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://twitter.com/username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="insta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Instagram className="h-4 w-4" />
                            Instagram
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://instagram.com/username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Resume Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Resume & Documents
                  </h3>
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resume URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/resume.pdf" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Link to your resume or CV (PDF, Google Drive, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
                    <Save className="mr-2 h-4 w-4" />
                    {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
