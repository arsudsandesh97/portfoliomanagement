import { useState, useEffect } from "react"
import { Laptop, Globe, LogOut, Shield, Key } from "lucide-react"
import { useSessions, useRevokeSession, useRevokeOtherSessions } from "./use-sessions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SessionsPage() {
  const { data: sessions, isLoading } = useSessions()
  const revokeSession = useRevokeSession()
  const revokeOtherSessions = useRevokeOtherSessions()
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const payload = JSON.parse(atob(session.access_token.split('.')[1]))
        setCurrentSessionId(payload.session_id)
      }
    }
    getSession()
  }, [])

  const handleRevoke = (id: string) => {
    revokeSession.mutate(id)
  }

  const handleRevokeOthers = () => {
    revokeOtherSessions.mutate()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Session Management</h1>
          <p className="text-muted-foreground">
            View and manage your active login sessions.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Shield className="mr-2 h-4 w-4" /> Revoke All Other Sessions
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will log you out of all other devices and browsers. You will remain logged in on this device.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRevokeOthers}>
                Yes, revoke others
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions?.map((session) => {
          const isCurrent = session.id === currentSessionId
          return (
            <Card key={session.id} className={`relative overflow-hidden transition-all ${isCurrent ? 'border-primary/50 bg-primary/5' : 'hover:shadow-md'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isCurrent ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <Laptop className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {isCurrent ? "Current Session" : "Other Session"}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {new Date(session.created_at).toLocaleDateString()} at {new Date(session.created_at).toLocaleTimeString()}
                      </CardDescription>
                    </div>
                  </div>
                  {isCurrent && (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>IP: {session.ip !== 'Unknown' ? session.ip : 'Hidden'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    <span className="font-mono text-xs">{session.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                {!isCurrent && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRevoke(session.id)}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Revoke Access
                  </Button>
                )}
                {isCurrent && (
                  <p className="text-xs text-center w-full text-muted-foreground italic">
                    This is your current device
                  </p>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
      
      {sessions?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No active sessions found (this is unexpected).
        </div>
      )}
    </div>
  )
}
