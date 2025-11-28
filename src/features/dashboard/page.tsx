import { Link } from "react-router-dom"
import {
  GraduationCap,
  Briefcase,
  Code,
  Zap,
  FileText,
  Mail,
  Eye,
  ArrowRight,
  Plus,
} from "lucide-react"
import { useDashboardStats, useRecentBlogPosts } from "./use-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { data: dashboardData, isLoading: isStatsLoading } = useDashboardStats()
  const { data: recentPosts, isLoading: isPostsLoading } = useRecentBlogPosts()

  const stats = dashboardData?.stats
  const bio = dashboardData?.bio

  const statCards = [
    {
      label: "Education",
      value: stats?.education,
      icon: GraduationCap,
      color: "text-blue-500",
      path: "/education",
    },
    {
      label: "Experience",
      value: stats?.experience,
      icon: Briefcase,
      color: "text-green-500",
      path: "/experience",
    },
    {
      label: "Projects",
      value: stats?.projects,
      icon: Code,
      color: "text-orange-500",
      path: "/projects",
    },
    {
      label: "Skills",
      value: stats?.skills,
      icon: Zap,
      color: "text-purple-500",
      path: "/skills",
    },
    {
      label: "Blog Posts",
      value: stats?.blogPosts,
      icon: FileText,
      color: "text-pink-500",
      path: "/blog-posts",
    },
    {
      label: "Contacts",
      value: stats?.contacts,
      icon: Mail,
      color: "text-teal-500",
      path: "/contacts",
    },
  ]

  if (isStatsLoading || isPostsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 rounded-xl bg-muted animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
          <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
            <AvatarImage src={bio?.Image || ""} alt={bio?.name || ""} />
            <AvatarFallback>{bio?.name?.charAt(0) || "A"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome Back, {bio?.name || "Admin"}!
            </h1>
            <p className="text-muted-foreground mt-1">
              {bio?.roles?.[0] || "Portfolio Manager"} • Last updated{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-center bg-background/50 p-4 rounded-xl backdrop-blur-sm border shadow-sm">
            <div className="text-3xl font-bold">{stats?.totalViews}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Total Blog Views
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.path}>
            <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value || 0}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Blog Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-pink-500" />
              Blog Performance
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/blog-posts">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats?.blogPosts}</div>
                <div className="text-xs text-muted-foreground">Total Posts</div>
              </div>
              <div className="text-center p-3 bg-green-500/10 text-green-600 rounded-lg">
                <div className="text-2xl font-bold">{stats?.publishedPosts}</div>
                <div className="text-xs opacity-80">Published</div>
              </div>
              <div className="text-center p-3 bg-yellow-500/10 text-yellow-600 rounded-lg">
                <div className="text-2xl font-bold">
                  {(stats?.blogPosts || 0) - (stats?.publishedPosts || 0)}
                </div>
                <div className="text-xs opacity-80">Drafts</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Recent Posts
              </h4>
              {recentPosts?.length ? (
                recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge
                          variant={post.published ? "default" : "secondary"}
                          className="h-5 px-1.5"
                        >
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {post.views || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No blog posts yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" size="lg" asChild>
              <Link to="/blog-posts">
                <Plus className="mr-2 h-5 w-5" /> Manage Blog Posts
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="lg"
              asChild
            >
              <Link to="/projects">
                <Code className="mr-2 h-5 w-5" /> Add New Project
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="lg"
              asChild
            >
              <Link to="/experience">
                <Briefcase className="mr-2 h-5 w-5" /> Add Experience
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
