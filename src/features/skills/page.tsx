import { useState } from "react"
import { Plus, Pencil, Trash2, Search, FolderOpen, Layers, ArrowUp, ArrowDown, GripVertical } from "lucide-react"
import {
  useSkills,
  useSkillCategories,
  useDeleteSkill,
  useDeleteSkillCategory,
  useReorderSkillCategory,
} from "./use-skills"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SkillForm } from "./skill-form"
import { CategoryForm } from "./category-form"
import type { Skill, SkillCategory } from "./use-skills"

export default function SkillsPage() {
  const { data: skills, isLoading: skillsLoading } = useSkills()
  const { data: categories, isLoading: categoriesLoading } = useSkillCategories()
  const deleteSkill = useDeleteSkill()
  const deleteCategory = useDeleteSkillCategory()
  const reorderCategory = useReorderSkillCategory()

  // Skill states
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false)
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null)

  // Category states
  const [categorySearch, setCategorySearch] = useState("")
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)

  const filteredSkills = skills?.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" ||
      skill.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredCategories = categories?.filter((category) =>
    category.title.toLowerCase().includes(categorySearch.toLowerCase())
  )

  // Count skills per category
  const skillCountByCategory = (categoryId: string) =>
    skills?.filter((s) => s.category_id === categoryId).length || 0

  const handleDeleteSkill = (id: string) => {
    deleteSkill.mutate(id, {
      onSettled: () => setDeletingSkillId(null),
    })
  }

  const handleDeleteCategory = (id: string) => {
    deleteCategory.mutate(id, {
      onSettled: () => setDeletingCategoryId(null),
    })
  }

  const handleMoveCategory = async (index: number, direction: "up" | "down") => {
    if (!filteredCategories) return
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= filteredCategories.length) return

    const current = filteredCategories[index]
    const target = filteredCategories[targetIndex]

    // Swap sort_order values
    const currentOrder = current.sort_order ?? index
    const targetOrder = target.sort_order ?? targetIndex

    await reorderCategory.mutateAsync({ id: current.id, newOrder: targetOrder })
    await reorderCategory.mutateAsync({ id: target.id, newOrder: currentOrder })
  }

  const isLoading = skillsLoading || categoriesLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 rounded-lg bg-muted animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
        <p className="text-muted-foreground">
          Manage your technical skills and categories.
        </p>
      </div>

      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList>
          <TabsTrigger value="skills" className="gap-2">
            <Layers className="h-4 w-4" />
            Skills
            {skills && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {skills.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Categories
            {categories && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {categories.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ─── Skills Tab ─────────────────────────────────────── */}
        <TabsContent value="skills" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row flex-1">
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

            <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
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
                  onSuccess={() => setIsSkillDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {filteredSkills?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <Layers className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">No skills found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {search || selectedCategory !== "all"
                  ? "Try adjusting your search or filter."
                  : "Get started by adding your first skill."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {filteredSkills?.map((skill) => (
                <Card
                  key={skill.id}
                  className="group relative overflow-hidden transition-all hover:shadow-md"
                >
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
                      <CardTitle className="truncate text-base">
                        {skill.name}
                      </CardTitle>
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
                        setIsSkillDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeletingSkillId(skill.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ─── Categories Tab ─────────────────────────────────── */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                className="pl-8"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
            </div>

            <Dialog
              open={isCategoryDialogOpen}
              onOpenChange={setIsCategoryDialogOpen}
            >
              <DialogTrigger asChild>
                <Button onClick={() => setEditingCategory(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </DialogTitle>
                </DialogHeader>
                <CategoryForm
                  category={editingCategory}
                  onSuccess={() => setIsCategoryDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {filteredCategories?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">No categories found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {categorySearch
                  ? "Try adjusting your search."
                  : "Create a category to organise your skills."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCategories?.map((category, index) => {
                const count = skillCountByCategory(category.id)
                return (
                  <Card
                    key={category.id}
                    className="group relative overflow-hidden transition-all hover:shadow-md"
                  >
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground disabled:opacity-30"
                          disabled={index === 0 || reorderCategory.isPending}
                          onClick={() => handleMoveCategory(index, "up")}
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <GripVertical className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground disabled:opacity-30"
                          disabled={index === (filteredCategories?.length ?? 0) - 1 || reorderCategory.isPending}
                          onClick={() => handleMoveCategory(index, "down")}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <FolderOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <CardTitle className="truncate text-base">
                          {category.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {count} {count === 1 ? "skill" : "skills"} · Order: {category.sort_order ?? "—"}
                        </p>
                      </div>
                    </CardHeader>
                    <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex bg-background/80 backdrop-blur-sm rounded-md p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingCategory(category)
                          setIsCategoryDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeletingCategoryId(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ─── Delete Skill Confirmation ──────────────────────── */}
      <AlertDialog
        open={!!deletingSkillId}
        onOpenChange={(open) => !open && setDeletingSkillId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Skill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this skill? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingSkillId && handleDeleteSkill(deletingSkillId)}
            >
              {deleteSkill.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Delete Category Confirmation ──────────────────── */}
      <AlertDialog
        open={!!deletingCategoryId}
        onOpenChange={(open) => !open && setDeletingCategoryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Skills assigned to
              this category will become uncategorized. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deletingCategoryId && handleDeleteCategory(deletingCategoryId)
              }
            >
              {deleteCategory.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
