import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { AppShell } from '@/components/layout/app-shell'
import { Toaster } from '@/components/ui/toaster'
import { ProtectedRoute } from '@/components/protected-route'
import LoginPage from '@/features/auth/login-page'
import SkillsPage from '@/features/skills/page'
import ProjectsPage from '@/features/projects/page'
import DashboardPage from '@/features/dashboard/page'
import EducationPage from '@/features/education/page'
import ExperiencePage from '@/features/experience/page'
import BlogPage from '@/features/blog/page'
import ContactsPage from '@/features/contacts/page'
import BioPage from '@/features/bio/page'
import StoragePage from '@/features/storage/page'
import ProjectExplanationsPage from '@/features/project-explanations/page'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router basename="/portfoliomanagement">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/bio" element={<BioPage />} />
                        <Route path="/skills" element={<SkillsPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/project-explanations" element={<ProjectExplanationsPage />} />
                        <Route path="/education" element={<EducationPage />} />
                        <Route path="/experience" element={<ExperiencePage />} />
                        <Route path="/blog-posts" element={<BlogPage />} />
                        <Route path="/contacts" element={<ContactsPage />} />
                        <Route path="/storage" element={<StoragePage />} />
                      </Routes>
                    </AppShell>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
