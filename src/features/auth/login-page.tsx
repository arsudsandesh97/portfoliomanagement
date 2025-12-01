import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Lock, Mail, Loader2, ArrowRight, User } from "lucide-react"
import { motion } from "framer-motion"
import { useBio } from "@/features/bio/use-bio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { data: bio } = useBio()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      navigate("/")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[100px] animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 p-4"
      >
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                <Avatar className="h-28 w-28 border-4 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                  <AvatarImage src={bio?.Image || ""} alt={bio?.name || "User"} className="object-cover" />
                  <AvatarFallback className="bg-slate-900 text-white text-3xl font-thin">
                    {bio?.name ? bio.name.charAt(0) : <User className="h-12 w-12" />}
                  </AvatarFallback>
                </Avatar>
              </div>
            </motion.div>
            
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-slate-400 tracking-wider uppercase">
                Welcome Back
              </h2>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50">
                {bio?.name || "Admin"}
              </h1>
              <div className="pt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-200 border border-purple-500/20 tracking-widest uppercase">
                  {bio?.roles && bio.roles.length > 0 ? bio.roles[0] : "Portfolio Admin"}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                          <Input 
                            placeholder="name@example.com" 
                            className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all h-11 font-medium" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Password</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all h-11 font-medium" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold tracking-wide shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      SIGNING IN...
                    </>
                  ) : (
                    <span className="flex items-center justify-center uppercase text-sm">
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <p className="text-xs font-medium tracking-widest text-slate-600 uppercase">
              Admin Access
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

