import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  ExternalLink,
  Search,
  FileText,
  Calendar as CalendarIcon,
  Filter,
  Folder,
} from "lucide-react"
import {
  useJobs,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
  useResumeFolders,
  JOB_STATUSES,
} from "./use-jobs"
import type { JobApplication, JobStatus } from "./use-jobs"
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
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<JobStatus, { color: string; bgClass: string; textClass: string }> = {
  Applied: {
    color: "blue",
    bgClass: "bg-blue-100 dark:bg-blue-900/30",
    textClass: "text-blue-700 dark:text-blue-300",
  },
  Rejected: {
    color: "red",
    bgClass: "bg-red-100 dark:bg-red-900/30",
    textClass: "text-red-700 dark:text-red-300",
  },
  Interviewing: {
    color: "amber",
    bgClass: "bg-amber-100 dark:bg-amber-900/30",
    textClass: "text-amber-700 dark:text-amber-300",
  },
  "Short Listed": {
    color: "purple",
    bgClass: "bg-purple-100 dark:bg-purple-900/30",
    textClass: "text-purple-700 dark:text-purple-300",
  },
  "Offer Letter Received": {
    color: "green",
    bgClass: "bg-green-100 dark:bg-green-900/30",
    textClass: "text-green-700 dark:text-green-300",
  },
}

const formSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  company: z.string().optional(),
  application_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  applied_on: z.string().optional(),
  resume_used: z.string().optional(),
  status: z.enum(["Applied", "Rejected", "Interviewing", "Short Listed", "Offer Letter Received"]),
  notes: z.string().optional(),
})

export default function JobsPage() {
  const { data: jobs, isLoading } = useJobs()
  const deleteJob = useDeleteJob()
  const [editingItem, setEditingItem] = useState<JobApplication | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this job application?")) {
      deleteJob.mutate(id)
    }
  }

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats
  const statCounts = jobs?.reduce(
    (acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1
      acc.total += 1
      return acc
    },
    { total: 0 } as Record<string, number>
  )

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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Tracker</h1>
          <p className="text-muted-foreground">
            Track and manage your job applications.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Application" : "Add Application"}
              </DialogTitle>
            </DialogHeader>
            <JobForm
              job={editingItem}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {statCounts && statCounts.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="p-3 border-2">
            <div className="text-2xl font-bold">{statCounts.total}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</div>
          </Card>
          {JOB_STATUSES.map((status) => {
            const config = STATUS_CONFIG[status]
            return (
              <Card key={status} className={`p-3 border-2 ${config.bgClass}`}>
                <div className={`text-2xl font-bold ${config.textClass}`}>
                  {statCounts[status] || 0}
                </div>
                <div className={`text-xs font-medium uppercase tracking-wider ${config.textClass} opacity-80`}>
                  {status}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
          <TabsList className="h-11">
            <TabsTrigger value="all" className="text-xs">
              <Filter className="h-3 w-3 mr-1" />
              All
            </TabsTrigger>
            {JOB_STATUSES.map((status) => (
              <TabsTrigger key={status} value={status} className="text-xs hidden sm:inline-flex">
                {status}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {/* Mobile filter dropdown */}
        <div className="sm:hidden">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {JOB_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Job List */}
      {filteredJobs?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-16 text-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <Briefcase className="h-20 w-20 text-muted-foreground/50 relative" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            {searchQuery || statusFilter !== "all" ? "No matching applications" : "No applications yet"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-4">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter"
              : "Start tracking your job applications by clicking 'Add Application'"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs?.map((job) => {
            const config = STATUS_CONFIG[job.status]
            return (
              <Card
                key={job.id}
                className="group relative overflow-hidden transition-all hover:shadow-md border-l-4"
                style={{
                  borderLeftColor: `var(--${config.color}-indicator, currentColor)`,
                }}
              >
                <CardHeader className="flex flex-col sm:flex-row items-start gap-4 p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg shrink-0 ${config.bgClass}`}>
                    <Briefcase className={`h-6 w-6 ${config.textClass}`} />
                  </div>
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-xl truncate">{job.title}</CardTitle>
                          <Badge
                            className={`${config.bgClass} ${config.textClass} border-0 shrink-0`}
                          >
                            {job.status}
                          </Badge>
                        </div>
                        {job.company && (
                          <CardDescription className="text-base font-medium text-foreground/80 mt-0.5">
                            {job.company}
                          </CardDescription>
                        )}
                      </div>
                      {/* Mobile Actions */}
                      <div className="flex gap-1 sm:hidden shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingItem(job)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Meta Info Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                      {job.applied_on && (
                        <span className="flex items-center gap-1.5">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {new Date(job.applied_on).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      {job.resume_used && job.resume_used !== "none" && (
                        <span className="flex items-center gap-1.5">
                          <Folder className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[200px]">{job.resume_used}</span>
                        </span>
                      )}
                      {job.application_link && (
                        <a
                          href={job.application_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Application Link
                        </a>
                      )}
                    </div>

                    {job.notes && (
                      <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap line-clamp-2">
                        {job.notes}
                      </p>
                    )}
                  </div>

                  {/* Desktop Actions */}
                  <div className="hidden sm:flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingItem(job)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(job.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function JobForm({
  job,
  onSuccess,
}: {
  job?: JobApplication | null
  onSuccess: () => void
}) {
  const createJob = useCreateJob()
  const updateJob = useUpdateJob()
  const { data: resumeFolders, isLoading: isLoadingResumes } = useResumeFolders()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job?.title || "",
      company: job?.company || "",
      application_link: job?.application_link || "",
      applied_on: job?.applied_on
        ? new Date(job.applied_on).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      resume_used: job?.resume_used || "",
      status: job?.status || "Applied",
      notes: job?.notes || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = {
        title: values.title,
        company: values.company || null,
        application_link: values.application_link || null,
        applied_on: values.applied_on || null,
        resume_used: values.resume_used || null,
        status: values.status,
        notes: values.notes || null,
      }

      if (job) {
        await updateJob.mutateAsync({ ...data, id: job.id })
      } else {
        await createJob.mutateAsync(data)
      }
      onSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Frontend Developer" {...field} />
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
                <FormLabel>Company (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Google, Microsoft..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="application_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Link</FormLabel>
              <FormControl>
                <Input placeholder="https://careers.company.com/job/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="applied_on"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Applied On</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(parseISO(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? parseISO(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(
                          date ? format(date, "yyyy-MM-dd") : ""
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {JOB_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        <span className="flex items-center gap-2">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${STATUS_CONFIG[status].bgClass.replace(
                              /dark:[^\s]*/g,
                              ""
                            )}`}
                            style={{
                              backgroundColor:
                                status === "Applied"
                                  ? "#3b82f6"
                                  : status === "Rejected"
                                  ? "#ef4444"
                                  : status === "Interviewing"
                                  ? "#f59e0b"
                                  : status === "Short Listed"
                                  ? "#a855f7"
                                  : "#22c55e",
                            }}
                          />
                          {status}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="resume_used"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume Used</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingResumes ? "Loading folders..." : "Select a resume folder"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No resume selected</SelectItem>
                  {resumeFolders?.map((folder) => (
                    <SelectItem key={folder.name} value={folder.name}>
                      <span className="flex items-center gap-2">
                        <Folder className="h-3.5 w-3.5 text-primary/70" />
                        {folder.name}
                      </span>
                    </SelectItem>
                  ))}
                  {resumeFolders?.length === 0 && (
                    <SelectItem value="_empty" disabled>
                      No folders found in /Resume/
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes about this application..."
                  className="min-h-[80px]"
                  {...field}
                />
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
