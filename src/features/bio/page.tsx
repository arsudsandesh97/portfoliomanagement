import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Github, Linkedin, Twitter, Instagram, FileText, User, Briefcase, ExternalLink, X, Plus, MapPin, Clock, Eye, EyeOff, Sparkles, Mail, Zap, Target, Calendar } from "lucide-react"
import { useBio, useUpdateBio } from "./use-bio"
import { useOpenToWorkSettings, useUpdateOpenToWorkSettings, useToggleOpenToWork } from "./use-open-to-work"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const openToWorkSchema = z.object({
  custom_message: z.string().optional(),
  location: z.string().optional(),
  experience_type: z.enum(['fresher', 'entry', 'junior', 'mid', 'senior', 'lead', 'custom']).optional(),
  experience_display: z.string().optional(),
  contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  position: z.enum(['bottom-left', 'bottom-right']).optional(),
  availability: z.string().optional(),
})

export default function BioPage() {
  const { data: bio, isLoading } = useBio()
  const updateBio = useUpdateBio()
  const [roles, setRoles] = useState<string[]>([])
  const [roleInput, setRoleInput] = useState("")

  // Open to Work state
  const { data: openToWorkSettings, isLoading: isLoadingOpenToWork } = useOpenToWorkSettings()
  const updateOpenToWork = useUpdateOpenToWorkSettings()
  const toggleOpenToWork = useToggleOpenToWork()
  const [jobTypes, setJobTypes] = useState<string[]>([])
  const [jobTypeInput, setJobTypeInput] = useState("")
  const [preferredRoles, setPreferredRoles] = useState<string[]>([])
  const [preferredRoleInput, setPreferredRoleInput] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")

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

  // Open to Work form
  const openToWorkForm = useForm<z.infer<typeof openToWorkSchema>>({
    resolver: zodResolver(openToWorkSchema),
    defaultValues: {
      custom_message: "",
      location: "",
      experience_type: "fresher",
      experience_display: "",
      contact_email: "",
      linkedin_url: "",
      twitter_url: "",
      position: "bottom-right",
      availability: "",
    },
  })

  // Load Open to Work settings
  useEffect(() => {
    if (openToWorkSettings) {
      openToWorkForm.reset({
        custom_message: openToWorkSettings.custom_message || "",
        location: openToWorkSettings.location || "",
        experience_type: openToWorkSettings.experience_type || "fresher",
        experience_display: openToWorkSettings.experience_display || "",
        contact_email: openToWorkSettings.contact_email || "",
        linkedin_url: openToWorkSettings.linkedin_url || "",
        twitter_url: openToWorkSettings.twitter_url || "",
        position: openToWorkSettings.position || "bottom-right",
        availability: openToWorkSettings.availability || "",
      })
      setJobTypes(openToWorkSettings.job_types || [])
      setPreferredRoles(openToWorkSettings.preferred_roles || [])
      setSkills(openToWorkSettings.skills || [])
    }
  }, [openToWorkSettings, openToWorkForm])

  // Helper functions for Open to Work arrays
  const addJobType = () => {
    if (jobTypeInput.trim() && !jobTypes.includes(jobTypeInput.trim())) {
      setJobTypes([...jobTypes, jobTypeInput.trim()])
      setJobTypeInput("")
    }
  }

  const removeJobType = (item: string) => {
    setJobTypes(jobTypes.filter(t => t !== item))
  }

  const addPreferredRole = () => {
    if (preferredRoleInput.trim() && !preferredRoles.includes(preferredRoleInput.trim())) {
      setPreferredRoles([...preferredRoles, preferredRoleInput.trim()])
      setPreferredRoleInput("")
    }
  }

  const removePreferredRole = (item: string) => {
    setPreferredRoles(preferredRoles.filter(r => r !== item))
  }

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (item: string) => {
    setSkills(skills.filter(s => s !== item))
  }

  const handleArrayKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, addFn: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addFn()
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

  async function onOpenToWorkSubmit(values: z.infer<typeof openToWorkSchema>) {
    try {
      const formattedValues = {
        ...values,
        job_types: jobTypes,
        preferred_roles: preferredRoles,
        skills: skills,
      }
      await updateOpenToWork.mutateAsync(formattedValues)
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading || isLoadingOpenToWork) {
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

      {/* Open to Work Section */}
      <Separator className="my-8" />
      
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-green-500" />
              Open to Work Settings
            </h2>
            <p className="text-muted-foreground">
              Manage your availability status and job preferences for recruiters.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {openToWorkSettings?.is_visible ? "Visible to recruiters" : "Hidden from public"}
            </span>
            <Switch
              checked={openToWorkSettings?.is_visible || false}
              onCheckedChange={(checked) => toggleOpenToWork.mutate(checked)}
              className="data-[state=checked]:bg-green-500"
            />
            {openToWorkSettings?.is_visible ? (
              <Eye className="h-5 w-5 text-green-500" />
            ) : (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Open to Work Preview */}
          <Card className={`lg:col-span-1 ${openToWorkSettings?.is_visible ? 'border-green-500/50 bg-green-500/5' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-500" />
                Status Preview
              </CardTitle>
              <CardDescription>
                How your "Open to Work" widget will appear
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {openToWorkSettings?.is_visible ? (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <span className="mr-1 h-2 w-2 rounded-full bg-white animate-pulse inline-block" />
                    Open to Work
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <EyeOff className="mr-1 h-3 w-3" />
                    Hidden
                  </Badge>
                )}
              </div>

              {/* Location & Experience */}
              {(openToWorkSettings?.location || openToWorkSettings?.experience_display) && (
                <div className="flex flex-wrap gap-2">
                  {openToWorkSettings?.location && (
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {openToWorkSettings.location}
                    </Badge>
                  )}
                  {openToWorkSettings?.experience_display && (
                    <Badge variant="outline" className="gap-1">
                      <Target className="h-3 w-3" />
                      {openToWorkSettings.experience_display}
                    </Badge>
                  )}
                </div>
              )}

              {/* Custom Message */}
              {openToWorkSettings?.custom_message && (
                <p className="text-sm text-muted-foreground italic">
                  "{openToWorkSettings.custom_message}"
                </p>
              )}

              {/* Job Types */}
              {jobTypes.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium mb-2 text-muted-foreground">Job Types</p>
                    <div className="flex flex-wrap gap-1">
                      {jobTypes.map((type, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Preferred Roles */}
              {preferredRoles.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 text-muted-foreground">Preferred Roles</p>
                  <div className="flex flex-wrap gap-1">
                    {preferredRoles.map((role, i) => (
                      <Badge key={i} className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 text-muted-foreground">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              {openToWorkSettings?.availability && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">
                      Available: {openToWorkSettings.availability}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Open to Work Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Job Search Preferences</CardTitle>
              <CardDescription>
                Configure what recruiters see when viewing your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...openToWorkForm}>
                <form onSubmit={openToWorkForm.handleSubmit(onOpenToWorkSubmit)} className="space-y-6">
                  {/* Profile Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile Information
                    </h3>
                    
                    <FormField
                      control={openToWorkForm.control}
                      name="custom_message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="I'm currently available for new opportunities..." 
                              className="h-20 resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            A personal message for recruiters (max 200 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={openToWorkForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Location
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Mumbai, India" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={openToWorkForm.control}
                        name="experience_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Experience Level
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fresher">Fresher</SelectItem>
                                <SelectItem value="entry">Entry Level (0-1 year)</SelectItem>
                                <SelectItem value="junior">Junior (1-2 years)</SelectItem>
                                <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                                <SelectItem value="senior">Senior (5+ years)</SelectItem>
                                <SelectItem value="lead">Lead/Principal</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={openToWorkForm.control}
                      name="experience_display"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Fresher • Ready to Learn" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Custom text shown on the widget (e.g., "Fresher", "2+ Years", "Senior Developer")
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Contact Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={openToWorkForm.control}
                        name="contact_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Contact Email
                            </FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={openToWorkForm.control}
                        name="linkedin_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Linkedin className="h-4 w-4" />
                              LinkedIn URL
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={openToWorkForm.control}
                        name="twitter_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Twitter className="h-4 w-4" />
                              Twitter / X URL
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://twitter.com/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={openToWorkForm.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Widget Position</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-xs">
                              Where the widget appears on your portfolio
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Job Preferences Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Job Preferences
                    </h3>

                    {/* Job Types */}
                    <FormItem>
                      <FormLabel>Job Types</FormLabel>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add job type (e.g., Full-time)"
                            value={jobTypeInput}
                            onChange={(e) => setJobTypeInput(e.target.value)}
                            onKeyDown={(e) => handleArrayKeyDown(e, addJobType)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addJobType}
                            disabled={!jobTypeInput.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {jobTypes.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {jobTypes.map((type, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="pl-2 pr-1 py-1"
                              >
                                {type}
                                <button
                                  type="button"
                                  onClick={() => removeJobType(type)}
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
                        Press Enter or click + to add (e.g., Full-time, Internship, Remote)
                      </FormDescription>
                    </FormItem>

                    {/* Preferred Roles */}
                    <FormItem>
                      <FormLabel>Preferred Roles</FormLabel>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add role (e.g., Data Analyst)"
                            value={preferredRoleInput}
                            onChange={(e) => setPreferredRoleInput(e.target.value)}
                            onKeyDown={(e) => handleArrayKeyDown(e, addPreferredRole)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addPreferredRole}
                            disabled={!preferredRoleInput.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {preferredRoles.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {preferredRoles.map((role, index) => (
                              <Badge
                                key={index}
                                className="pl-2 pr-1 py-1 bg-primary/10 text-primary hover:bg-primary/20"
                              >
                                {role}
                                <button
                                  type="button"
                                  onClick={() => removePreferredRole(role)}
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
                        What roles are you looking for?
                      </FormDescription>
                    </FormItem>

                    {/* Skills */}
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add skill (e.g., Python)"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => handleArrayKeyDown(e, addSkill)}
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
                                variant="outline"
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
                        Your key skills to highlight to recruiters
                      </FormDescription>
                    </FormItem>
                  </div>

                  <Separator />

                  {/* Availability Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Availability
                    </h3>
                    <FormField
                      control={openToWorkForm.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            When can you start?
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Immediate / 2 Weeks / 1 Month" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Let recruiters know your notice period or availability
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit" 
                      disabled={openToWorkForm.formState.isSubmitting} 
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {openToWorkForm.formState.isSubmitting ? "Saving..." : "Save Open to Work Settings"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
