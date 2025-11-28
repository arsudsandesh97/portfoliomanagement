import { useState } from "react"
import { 
  Upload, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Image as ImageIcon,
  FileText,
  File,
  Search,
  Download,
  Grid3x3,
  List,
  Pencil
} from "lucide-react"
import { useStorage, useUploadFile, useDeleteFile, useRenameFile } from "./use-storage"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const getFileType = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image'
  if (['pdf', 'doc', 'docx'].includes(ext || '')) return 'document'
  return 'other'
}

const getFileIcon = (filename: string) => {
  const type = getFileType(filename)
  if (type === 'image') return <ImageIcon className="h-4 w-4" />
  if (type === 'document') return <FileText className="h-4 w-4" />
  return <File className="h-4 w-4" />
}



const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export default function StoragePage() {
  const { data: files, isLoading, error } = useStorage()
  const uploadFile = useUploadFile()
  const deleteFile = useDeleteFile()
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "image" | "document" | "other">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)

  const renameFile = useRenameFile()
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [fileToRename, setFileToRename] = useState<string | null>(null)
  const [newName, setNewName] = useState("")

  const handleRenameClick = (name: string) => {
    setFileToRename(name)
    setNewName(name)
    setRenameDialogOpen(true)
  }

  const confirmRename = async () => {
    if (fileToRename && newName && newName !== fileToRename) {
      await renameFile.mutateAsync({ oldName: fileToRename, newName })
      setRenameDialogOpen(false)
      setFileToRename(null)
      setNewName("")
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      await uploadFile.mutateAsync({ file })
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handleDeleteClick = (name: string) => {
    setFileToDelete(name)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (fileToDelete) {
      deleteFile.mutate(fileToDelete)
      setDeleteDialogOpen(false)
      setFileToDelete(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    })
  }

  const downloadFile = async (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }

  // Filter and search files
  const filteredFiles = files?.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || getFileType(file.name) === filterType
    return matchesSearch && matchesType
  })

  const stats = {
    total: files?.length || 0,
    images: files?.filter(f => getFileType(f.name) === 'image').length || 0,
    documents: files?.filter(f => getFileType(f.name) === 'document').length || 0,
    others: files?.filter(f => !['image', 'document'].includes(getFileType(f.name))).length || 0,
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-xl bg-muted animate-pulse" />
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 rounded-full bg-destructive/10 mb-4">
          <Trash2 className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-xl font-bold mb-2">Error Loading Files</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          {(error as Error).message || "There was a problem connecting to Firebase Storage."}
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              <div className="p-2 rounded-lg bg-primary/10">
                <ImageIcon className="h-7 w-7 text-primary" />
              </div>
              Storage
            </h1>
            <p className="text-muted-foreground text-base">
              Manage your uploaded images, documents, and other files
            </p>
          </div>
          <Button disabled={isUploading} asChild size="lg" className="shadow-md w-full sm:w-auto">
            <label className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload File"}
              <input
                type="file"
                className="hidden"
                onChange={handleUpload}
                disabled={isUploading}
              />
            </label>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-2 hover:border-primary/30 transition-all">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-medium">Total Files</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2 hover:border-primary/30 transition-all">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-medium flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> Images
              </CardDescription>
              <CardTitle className="text-3xl">{stats.images}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2 hover:border-primary/30 transition-all">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-medium flex items-center gap-1">
                <FileText className="h-3 w-3" /> Documents
              </CardDescription>
              <CardTitle className="text-3xl">{stats.documents}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2 hover:border-primary/30 transition-all">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-medium flex items-center gap-1">
                <File className="h-3 w-3" /> Others
              </CardDescription>
              <CardTitle className="text-3xl">{stats.others}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11"
            />
          </div>
          <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)} className="w-auto">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="image" className="text-xs">Images</TabsTrigger>
              <TabsTrigger value="document" className="text-xs">Docs</TabsTrigger>
              <TabsTrigger value="other" className="text-xs">Other</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="shrink-0"
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Files Display */}
      {filteredFiles?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-16 text-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <ImageIcon className="h-20 w-20 text-muted-foreground/50 relative" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            {searchQuery || filterType !== "all" ? "No files found" : "No files uploaded"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-4">
            {searchQuery || filterType !== "all"
              ? "Try adjusting your search or filter"
              : "Upload files to see them here"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFiles?.map((file) => {
            const publicUrl = file.url
            const fileType = getFileType(file.name)
            
            return (
              <Card key={file.id} className="group overflow-hidden border-2 hover:border-primary/30 transition-all hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {fileType === 'image' ? (
                    <img
                      src={publicUrl}
                      alt={file.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <div className="text-center">
                        {getFileIcon(file.name)}
                        <p className="mt-2 text-xs font-medium">{file.name.split('.').pop()?.toUpperCase()}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/70 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm sm:opacity-0 sm:group-hover:opacity-100 flex-wrap p-2 content-center">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => window.open(publicUrl, "_blank")}
                      className="shadow-md"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => downloadFile(publicUrl, file.name)}
                      className="shadow-md"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => copyToClipboard(publicUrl)}
                      className="shadow-md"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleRenameClick(file.name)}
                      className="shadow-md"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(file.name)}
                      className="shadow-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Mobile Actions Overlay (Always visible on mobile if we want, or maybe just rely on tap? 
                      Actually, for grid view on mobile, hover doesn't exist. 
                      Let's make the overlay visible on tap or always visible? 
                      Always visible might obscure the image. 
                      Let's use a different approach for mobile: maybe a 3-dot menu or just make the overlay visible on focus/active?
                      For now, let's keep the overlay hidden on mobile but maybe add a "actions" button?
                      Actually, the user asked to make it mobile friendly. 
                      Let's make the overlay always visible on mobile (hidden on sm) but with a semi-transparent background so image is still somewhat visible?
                      Or better, let's add a small "actions" button on mobile that opens a drawer/dialog?
                      Simplest fix for now: Make overlay flex on mobile (always visible) but maybe at bottom?
                      Let's try making it always visible on mobile.
                  */}
                   <div className="absolute inset-0 flex sm:hidden items-center justify-center gap-2 bg-black/40 backdrop-blur-[1px]">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => window.open(publicUrl, "_blank")}
                      className="shadow-md h-8 w-8"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                     <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(file.name)}
                      className="shadow-md h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                   </div>

                  <Badge className="absolute top-2 right-2 text-xs shadow-md">
                    {getFileIcon(file.name)}
                  </Badge>
                </div>
                <CardFooter className="p-3 flex-col items-start gap-1">
                  <p className="w-full truncate text-sm font-medium" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(file.created_at)}
                  </p>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles?.map((file) => {
            const publicUrl = file.url
            
            return (
              <Card key={file.id} className="p-4 hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(file.created_at)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {file.name.split('.').pop()?.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(publicUrl, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadFile(publicUrl, file.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(publicUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRenameClick(file.name)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(file.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{fileToDelete}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
            <DialogDescription>
              Enter a new name for the file.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new filename"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRename} disabled={!newName || newName === fileToRename}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
