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
  Pencil,
  Folder,
  FolderPlus,
  ChevronRight,
  Home
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
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
import type { StorageItem } from "./use-storage"

const getFileType = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image'
  if (['pdf', 'doc', 'docx'].includes(ext || '')) return 'document'
  return 'other'
}

const getFileIcon = (item: StorageItem) => {
  if (item.type === 'folder') return <Folder className="h-4 w-4 fill-primary/20 text-primary" />
  
  const type = getFileType(item.name)
  if (type === 'image') return <ImageIcon className="h-4 w-4" />
  if (type === 'document') return <FileText className="h-4 w-4" />
  return <File className="h-4 w-4" />
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "-"
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}

interface StorageViewProps {
  items?: StorageItem[]
  isLoading: boolean
  error: Error | null
  onUpload: (file: File) => Promise<void>
  onDelete: (name: string) => Promise<void>
  onRename?: (oldName: string, newName: string) => Promise<void>
  onCreateFolder?: (name: string) => Promise<void>
  providerName: string
  path: string
  onPathChange: (path: string) => void
}

export function StorageView({ 
  items, 
  isLoading, 
  error, 
  onUpload, 
  onDelete, 
  onRename,
  onCreateFolder,
  providerName,
  path,
  onPathChange
}: StorageViewProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "image" | "document" | "other">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)

  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [fileToRename, setFileToRename] = useState<string | null>(null)
  const [newName, setNewName] = useState("")

  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  const handleRenameClick = (name: string) => {
    if (!onRename) return
    setFileToRename(name)
    setNewName(name)
    setRenameDialogOpen(true)
  }

  const confirmRename = async () => {
    if (fileToRename && newName && newName !== fileToRename && onRename) {
      await onRename(fileToRename, newName)
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
      await onUpload(file)
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handleDeleteClick = (name: string) => {
    setFileToDelete(name)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (fileToDelete) {
      await onDelete(fileToDelete)
      setDeleteDialogOpen(false)
      setFileToDelete(null)
    }
  }

  const handleCreateFolder = async () => {
    if (newFolderName && onCreateFolder) {
      await onCreateFolder(newFolderName)
      setCreateFolderDialogOpen(false)
      setNewFolderName("")
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
    link.target = "_blank"
    link.click()
  }

  // Filter and search files
  const filteredItems = items?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || 
                        (item.type === 'folder' && (filterType as string) === 'all') || 
                        (item.type === 'file' && getFileType(item.name) === filterType)
    return matchesSearch && matchesType
  })

  // Sort: Folders first, then files
  const sortedItems = filteredItems?.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name)
    return a.type === 'folder' ? -1 : 1
  })

  const breadcrumbs = path.split('/').filter(Boolean)

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
          {(error as Error).message || `There was a problem connecting to ${providerName} Storage.`}
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
              {providerName} Storage
            </h1>
            <p className="text-muted-foreground text-base">
              Manage your uploaded images, documents, and other files in {providerName}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {onCreateFolder && (
              <Button variant="outline" onClick={() => setCreateFolderDialogOpen(true)} className="flex-1 sm:flex-none">
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            )}
            <Button disabled={isUploading} asChild size="lg" className="shadow-md flex-1 sm:flex-none">
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
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground overflow-x-auto pb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2" 
            onClick={() => onPathChange("")}
          >
            <Home className="h-4 w-4" />
          </Button>
          {breadcrumbs.map((part, index) => {
            const currentPath = breadcrumbs.slice(0, index + 1).join('/')
            return (
              <div key={currentPath} className="flex items-center">
                <ChevronRight className="h-4 w-4 mx-1" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2" 
                  onClick={() => onPathChange(currentPath)}
                >
                  {part}
                </Button>
              </div>
            )
          })}
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
      {sortedItems?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-16 text-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <ImageIcon className="h-20 w-20 text-muted-foreground/50 relative" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            {searchQuery || filterType !== "all" ? "No files found" : "Folder is empty"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-4">
            {searchQuery || filterType !== "all"
              ? "Try adjusting your search or filter"
              : "Upload files or create folders to see them here"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedItems?.map((item) => {
            const publicUrl = item.url || ""
            const isFolder = item.type === 'folder'
            
            if (isFolder) {
              return (
                <Card 
                  key={item.id} 
                  className="group cursor-pointer border-2 border-muted/40 bg-card/50 hover:bg-accent/5 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                  onClick={() => onPathChange(path ? `${path}/${item.name}` : item.name)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="aspect-[4/3] flex flex-col items-center justify-center p-6 relative z-10">
                    <div className="relative mb-4 transition-transform duration-300 group-hover:scale-110">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Folder className="h-20 w-20 text-primary/40 fill-primary/10 group-hover:text-primary group-hover:fill-primary/20 transition-all duration-300" />
                    </div>
                    
                    <div className="text-center w-full space-y-1">
                      <h3 className="font-semibold text-lg truncate w-full px-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Folder
                      </p>
                    </div>
                  </div>

                  {/* Folder Actions (Delete/Rename) - Only visible on hover/focus */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                     {onRename && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRenameClick(item.name)
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(item.name)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                  </div>
                </Card>
              )
            }

            // File Rendering
            const fileType = getFileType(item.name)
            return (
              <Card 
                key={item.id} 
                className="group overflow-hidden border-2 hover:border-primary/30 transition-all hover:shadow-lg bg-card"
              >
                <div className="relative aspect-square overflow-hidden bg-muted/30">
                  {fileType === 'image' ? (
                    <img
                      src={publicUrl}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
                      <div className="text-center p-4">
                        <div className="flex justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                          {getFileIcon(item)}
                        </div>
                        <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">{fileType}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px] p-4 content-center">
                    <div className="flex flex-wrap justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => window.open(publicUrl, "_blank")}
                        className="shadow-lg hover:scale-105 transition-transform"
                        title="Open"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => downloadFile(publicUrl, item.name)}
                        className="shadow-lg hover:scale-105 transition-transform"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => copyToClipboard(publicUrl)}
                        className="shadow-lg hover:scale-105 transition-transform"
                        title="Copy URL"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {onRename && (
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleRenameClick(item.name)}
                          className="shadow-lg hover:scale-105 transition-transform"
                          title="Rename"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteClick(item.name)}
                        className="shadow-lg hover:scale-105 transition-transform"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                   {/* Mobile Actions Overlay */}
                   <div className="absolute inset-0 flex sm:hidden items-center justify-center gap-2 bg-black/40 backdrop-blur-[1px]" onClick={(e) => e.stopPropagation()}>
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
                      onClick={() => handleDeleteClick(item.name)}
                      className="shadow-md h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                   </div>

                  <Badge className="absolute top-2 right-2 text-[10px] shadow-sm uppercase tracking-wider opacity-90">
                    {fileType}
                  </Badge>
                </div>
                <CardFooter className="p-3 flex-col items-start gap-1 bg-card border-t">
                  <p className="w-full truncate text-sm font-medium leading-none" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {formatDate(item.created_at)}
                  </p>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedItems?.map((item) => {
            const publicUrl = item.url || ""
            
            return (
              <Card 
                key={item.id} 
                className={`p-4 hover:border-primary/30 transition-all ${item.type === 'folder' ? 'cursor-pointer bg-muted/20' : ''}`}
                onClick={() => {
                  if (item.type === 'folder') {
                    onPathChange(path ? `${path}/${item.name}` : item.name)
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
                    {getFileIcon(item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {item.type === 'folder' ? 'FOLDER' : item.name.split('.').pop()?.toUpperCase()}
                  </Badge>
                  {item.type === 'file' && (
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
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
                        onClick={() => downloadFile(publicUrl, item.name)}
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
                      {onRename && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRenameClick(item.name)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(item.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
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

      <Dialog open={createFolderDialogOpen} onOpenChange={setCreateFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for the new folder.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
