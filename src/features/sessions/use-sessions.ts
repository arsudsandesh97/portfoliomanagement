import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

export interface Session {
  id: string
  created_at: string
  updated_at: string
  user_agent: string
  ip: string
}

export const useSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_my_sessions")
      
      if (error) throw error
      return data as Session[]
    },
  })
}

export const useRevokeSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sessionId: string) => {
      // @ts-expect-error - RPC types not generated yet
      const { error } = await supabase.rpc("revoke_session", { session_id: sessionId })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      toast({
        title: "Session Revoked",
        description: "The session has been successfully revoked.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useRevokeOtherSessions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("No active session")


      // Supabase session object has 'access_token', 'refresh_token', 'user'. 
      // It does NOT explicitly expose the session UUID in the JS client session object in all versions.
      // However, the JWT claim 'sub' is user_id, and 'session_id' claim might exist.
      // Let's check the JWT.
      
      // Actually, for simplicity, let's pass the current session ID if we can find it.
      // If not, we might need a different strategy.
      // Inspecting Supabase session: it usually doesn't have the UUID of the session row directly visible as a property.
      // BUT, we can decode the access token to find the 'session_id' claim if it exists.
      
      // ALTERNATIVE: The 'get_my_sessions' returns IDs. We can compare creation times? No.
      
      // Let's try to get session_id from the JWT.
      const accessToken = session.access_token
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      const currentSessionId = payload.session_id
      
      if (!currentSessionId) throw new Error("Could not determine current session ID")

      // @ts-expect-error - RPC types not generated yet
      const { error: rpcError } = await supabase.rpc("revoke_other_sessions", { current_session_id: currentSessionId })
      if (rpcError) throw rpcError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      toast({
        title: "Success",
        description: "All other sessions have been revoked.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
