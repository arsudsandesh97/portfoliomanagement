import { useState } from "react"
import { Plus, Pencil, Trash2, Search, ExternalLink } from "lucide-react"
import { usePowerBiDashboards, useDeletePowerBiDashboard } from "./use-power-bi-dashboards"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PowerBiDashboardForm } from "./power-bi-dashboard-form"
import type { PowerBiDashboard } from "./use-power-bi-dashboards"

export default function PowerBiDashboardsPage() {
  const { data: dashboards, isLoading } = usePowerBiDashboards()
  const deleteDashboard = useDeletePowerBiDashboard()
  const [search, setSearch] = useState("")
  const [editingDashboard, setEditingDashboard] = useState<PowerBiDashboard | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredDashboards = dashboards?.filter((dashboard) =>
    (dashboard.title || "").toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this dashboard?")) {
      deleteDashboard.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Power BI Dashboards</h1>
          <p className="text-muted-foreground">
            Manage your Power BI dashboards.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDashboard(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Dashboard
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDashboard ? "Edit Dashboard" : "Add New Dashboard"}
              </DialogTitle>
            </DialogHeader>
            <PowerBiDashboardForm
              dashboard={editingDashboard}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search dashboards..."
          className="pl-8 max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDashboards?.map((dashboard) => (
          <Card key={dashboard.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              {dashboard.image_url ? (
                <img
                  src={dashboard.image_url}
                  alt={dashboard.title || ""}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
              {!dashboard.is_published && (
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    Draft
                  </Badge>
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2 sm:hidden sm:group-hover:flex">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 shadow-sm"
                  onClick={() => {
                    setEditingDashboard(dashboard)
                    setIsDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 shadow-sm"
                  onClick={() => handleDelete(dashboard.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{dashboard.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {dashboard.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2">
                {dashboard.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="gap-2 pt-4">
              {dashboard.embed_url && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={dashboard.embed_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Dashboard
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
