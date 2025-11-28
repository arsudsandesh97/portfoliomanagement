import { useState } from "react"
import { Trash2, Mail, MessageSquare, Search, Reply, Clock, ArrowUpDown, Inbox } from "lucide-react"
import { useContacts, useDeleteContact } from "./use-contacts"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function timeAgo(dateString: string) {
  if (!dateString) return "Unknown date"
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + "y ago"
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + "mo ago"
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + "d ago"
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + "h ago"
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + "m ago"
  return "Just now"
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function ContactsPage() {
  const { data: contacts, isLoading } = useContacts()
  const deleteContact = useDeleteContact()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  const handleDeleteClick = (id: string) => {
    setContactToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (contactToDelete) {
      deleteContact.mutate(contactToDelete)
      setDeleteDialogOpen(false)
      setContactToDelete(null)
    }
  }

  const filteredContacts = contacts
    ?.filter((contact) => {
      const query = searchQuery.toLowerCase()
      return (
        contact.name?.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.message?.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || "").getTime()
      const dateB = new Date(b.created_at || "").getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

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
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Manage inquiries and messages from your contact form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm px-3 py-1 h-9">
            {contacts?.length || 0} Total Messages
          </Badge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-lg border">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or content..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={sortOrder} onValueChange={(v: "newest" | "oldest") => setSortOrder(v)}>
            <SelectTrigger className="w-[180px] bg-background">
              <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredContacts?.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Inbox className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search query" : "Your inbox is empty"}
              </p>
            </CardContent>
          </Card>
        )}

        {filteredContacts?.map((contact) => (
          <Card key={contact.id} className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
            <CardHeader className="flex flex-col sm:flex-row items-start gap-4 p-6">
              <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(contact.name || "?")}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      {contact.name}
                      <span className="text-xs font-normal text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full">
                        <Clock className="h-3 w-3" />
                        {timeAgo(contact.created_at || "")}
                      </span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-sm font-medium text-primary/80">
                      <Mail className="h-3.5 w-3.5" />
                      {contact.email}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9"
                      asChild
                    >
                      <a href={`mailto:${contact.email}?subject=Re: Inquiry from Portfolio`}>
                        <Reply className="mr-2 h-4 w-4" />
                        Reply
                      </a>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleDeleteClick(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-lg bg-muted/50 text-sm leading-relaxed border border-border/50">
                  <MessageSquare className="h-4 w-4 inline-block mr-2 text-muted-foreground translate-y-0.5" />
                  {contact.message}
                </div>
                
                <div className="text-xs text-muted-foreground pt-2 flex justify-end">
                  Received on {new Date(contact.created_at || "").toLocaleString()}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message from <strong>{contacts?.find(c => c.id === contactToDelete)?.name}</strong>? 
              <br /><br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
