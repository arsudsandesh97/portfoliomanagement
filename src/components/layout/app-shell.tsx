import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  Code2,
  FileText,
  Mail,
  HardDrive,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
  BookOpen,
  BarChart,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Bio", href: "/bio", icon: User },
  { name: "Education", href: "/education", icon: GraduationCap },
  { name: "Experience", href: "/experience", icon: Briefcase },
  { name: "Projects", href: "/projects", icon: Code2 },
  { name: "Project Explanations", href: "/project-explanations", icon: BookOpen },
  { name: "Skills", href: "/skills", icon: FileText },
  { name: "Blog Posts", href: "/blog-posts", icon: FileText },
  { name: "Contacts", href: "/contacts", icon: Mail },
  { name: "Storage", href: "/storage", icon: HardDrive },
  { name: "Power BI Dashboards", href: "/power-bi-dashboards", icon: BarChart },
  { name: "Sessions", href: "/sessions", icon: Shield },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <span className="text-lg font-bold">Portfolio Admin</span>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b px-6 bg-card">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="ml-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
