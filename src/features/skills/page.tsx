import { useState } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { useSkills, useSkillCategories, useDeleteSkill } from "./use-skills"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SkillForm } from "./skill-form"
import type { Skill } from "./use-skills"

export default function SkillsPage() {
  const { data: skills, isLoading } = useSkills()
  const { data: categories } = useSkillCategories()
  const deleteSkill = useDeleteSkill()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredSkills = skills?.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" ||
      skill.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      deleteSkill.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">
            Manage your technical skills and categories.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSkill(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </DialogTitle>
            </DialogHeader>
            <SkillForm
              skill={editingSkill}
              categories={categories || []}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {filteredSkills?.map((skill) => (
          <Card key={skill.id} className="group relative overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted p-2">
                {skill.image ? (
                  <img
                    src={skill.image}
                    alt={skill.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-primary/10" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <CardTitle className="truncate text-base">{skill.name}</CardTitle>
                <p className="truncate text-xs text-muted-foreground">
                  {/* @ts-ignore - Supabase join type issue */}
                  {skill.skill_categories?.title || "Uncategorized"}
                </p>
              </div>
            </CardHeader>
            <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex bg-background/80 backdrop-blur-sm rounded-md p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setEditingSkill(skill)
                  setIsDialogOpen(true)
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => handleDelete(skill.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
