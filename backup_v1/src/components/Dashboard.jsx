// Packages
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  IconButton,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Psychology as SkillIcon,
  Article as ArticleIcon,
  ContactMail as ContactIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as ViewsIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Services
import {
  bioApi,
  educationApi,
  experienceApi,
  projectsApi,
  skillsApi,
  blogPostsApi,
  contactsApi,
} from "../api/SupabaseData";

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Styled Components
const DashboardCard = styled(Card)(({ theme, gradient }) => ({
  borderRadius: 20,
  padding: "28px",
  background: gradient || (theme.palette.mode === 'light' 
    ? "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)"
    : "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"),
  boxShadow: theme.palette.mode === 'light' 
    ? "0 4px 20px rgba(0,0,0,0.06)" 
    : "0 4px 20px rgba(0,0,0,0.4)",
  border: theme.palette.mode === 'light' 
    ? "1px solid #E2E8F0" 
    : "1px solid #334155",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'light'
      ? "radial-gradient(circle at 100% 0%, rgba(59,130,246,0.03) 0%, transparent 50%)"
      : "radial-gradient(circle at 100% 0%, rgba(96,165,250,0.08) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.palette.mode === 'light'
      ? "0 12px 32px rgba(0,0,0,0.12)"
      : "0 12px 32px rgba(0,0,0,0.6)",
  },
}));

const StatCard = styled(Card)(({ theme, color }) => ({
  borderRadius: 16,
  padding: "24px",
  background: theme.palette.mode === 'light'
    ? `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`
    : `linear-gradient(135deg, ${color}25 0%, ${color}15 100%)`,
  border: theme.palette.mode === 'light'
    ? `1px solid ${color}20`
    : `1px solid ${color}30`,
  boxShadow: theme.palette.mode === 'light'
    ? "0 2px 12px rgba(0,0,0,0.04)"
    : "0 2px 12px rgba(0,0,0,0.3)",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.palette.mode === 'light'
      ? "0 8px 24px rgba(0,0,0,0.08)"
      : "0 8px 24px rgba(0,0,0,0.5)",
  },
}));

const IconWrapper = styled(Box)(({ gradient }) => ({
  width: 56,
  height: 56,
  borderRadius: 14,
  background: gradient,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
  animation: `${float} 3s ease-in-out infinite`,
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    education: 0,
    experience: 0,
    projects: 0,
    skills: 0,
    blogPosts: 0,
    publishedPosts: 0,
    contacts: 0,
    totalViews: 0,
  });
  const [bioData, setBioData] = useState(null);
  const [recentBlogPosts, setRecentBlogPosts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        bio,
        education,
        experience,
        projects,
        skills,
        blogPosts,
        contacts,
      ] = await Promise.all([
        bioApi.fetch().catch(() => null),
        educationApi.fetch().catch(() => []),
        experienceApi.fetch().catch(() => []),
        projectsApi.fetch().catch(() => []),
        skillsApi.fetchAll().catch(() => []),
        blogPostsApi.fetchAll().catch(() => []),
        contactsApi.fetch().catch(() => []),
      ]);

      setBioData(bio);
      
      const publishedPosts = blogPosts.filter(post => post.published);
      const totalViews = publishedPosts.reduce((sum, post) => sum + (post.views || 0), 0);

      setStats({
        education: education.length,
        experience: experience.length,
        projects: projects.length,
        skills: skills.length,
        blogPosts: blogPosts.length,
        publishedPosts: publishedPosts.length,
        contacts: contacts.length,
        totalViews,
      });

      setRecentBlogPosts(blogPosts.slice(0, 3));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    {
      label: "Education",
      value: stats.education,
      icon: <SchoolIcon />,
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
      path: "/education",
    },
    {
      label: "Experience",
      value: stats.experience,
      icon: <WorkIcon />,
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      path: "/experience",
    },
    {
      label: "Projects",
      value: stats.projects,
      icon: <CodeIcon />,
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      path: "/projects",
    },
    {
      label: "Skills",
      value: stats.skills,
      icon: <SkillIcon />,
      color: "#8B5CF6",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      path: "/skills",
    },
    {
      label: "Blog Posts",
      value: stats.blogPosts,
      icon: <ArticleIcon />,
      color: "#EC4899",
      gradient: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
      path: "/blog-posts",
    },
    {
      label: "Contacts",
      value: stats.contacts,
      icon: <ContactIcon />,
      color: "#14B8A6",
      gradient: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
      path: "/contacts",
    },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress
          sx={{
            borderRadius: 2,
            height: 6,
            backgroundColor: (theme) => theme.palette.mode === 'light' ? "#E2E8F0" : "#334155",
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)",
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardCard
          gradient={(theme) => theme.palette.mode === 'light'
            ? "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
            : "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"}
          sx={{ mb: 4, color: "white" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                border: "4px solid rgba(255,255,255,0.2)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Welcome Back, {bioData?.name || "Admin"}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {bioData?.title || "Portfolio Manager"} • Last updated{" "}
                {new Date().toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.totalViews}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Total Blog Views
              </Typography>
            </Box>
          </Box>
        </DashboardCard>
      </motion.div>

      {/* Quick Stats Grid */}
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 700, color: "text.primary" }}
      >
        Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={stat.label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard
                color={stat.color}
                onClick={() => navigate(stat.path)}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <IconWrapper gradient={stat.gradient}>
                    {React.cloneElement(stat.icon, {
                      sx: { fontSize: 28, color: "white" },
                    })}
                  </IconWrapper>
                  <TrendingUpIcon sx={{ color: stat.color, opacity: 0.5 }} />
                </Box>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {stat.label}
                </Typography>
              </StatCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Blog Stats */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                <ArticleIcon sx={{ verticalAlign: "middle", mr: 1, color: "#EC4899" }} />
                Blog Performance
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowIcon />}
                onClick={() => navigate("/blog-posts")}
                sx={{
                  textTransform: "none",
                  color: "#3B82F6",
                  "&:hover": { backgroundColor: "rgba(59,130,246,0.1)" },
                }}
              >
                View All
              </Button>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center", p: 2, backgroundColor: (theme) => theme.palette.mode === 'light' ? "#F8FAFC" : "#0F172A", borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {stats.blogPosts}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Total Posts
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center", p: 2, backgroundColor: (theme) => theme.palette.mode === 'light' ? "#F0FDF4" : "rgba(16, 185, 129, 0.1)", borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#10B981" }}>
                    {stats.publishedPosts}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Published
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center", p: 2, backgroundColor: (theme) => theme.palette.mode === 'light' ? "#FEF3C7" : "rgba(245, 158, 11, 0.1)", borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#F59E0B" }}>
                    {stats.blogPosts - stats.publishedPosts}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Drafts
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {recentBlogPosts.length > 0 ? (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary", fontWeight: 600 }}>
                  Recent Posts
                </Typography>
                <Stack spacing={2}>
                  {recentBlogPosts.map((post) => (
                    <Box
                      key={post.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: (theme) => theme.palette.mode === 'light' ? "#F8FAFC" : "rgba(15, 23, 42, 0.5)",
                        "&:hover": { backgroundColor: (theme) => theme.palette.mode === 'light' ? "#F1F5F9" : "rgba(51, 65, 85, 0.5)" },
                        transition: "all 0.2s",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", mb: 0.5 }}>
                        {post.title}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Chip
                          label={post.published ? "Published" : "Draft"}
                          size="small"
                          color={post.published ? "success" : "default"}
                          sx={{ height: 20, fontSize: "0.7rem" }}
                        />
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          <ViewsIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5 }} />
                          {post.views || 0} views
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <ArticleIcon sx={{ fontSize: 64, color: "#CBD5E1", mb: 2 }} />
                <Typography variant="body2" color="textSecondary">
                  No blog posts yet
                </Typography>
              </Box>
            )}
          </DashboardCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 3 }}>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ArticleIcon />}
                onClick={() => navigate("/blog-posts")}
                sx={{
                  py: 2,
                  background: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    background: "linear-gradient(135deg, #DB2777 0%, #BE185D 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(236,72,153,0.3)",
                  },
                  transition: "all 0.3s",
                }}
              >
                Create New Blog Post
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CodeIcon />}
                onClick={() => navigate("/projects")}
                sx={{
                  py: 2,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderColor: (theme) => theme.palette.mode === 'light' ? "#E2E8F0" : "#334155",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: (theme) => theme.palette.mode === 'light' ? "#CBD5E1" : "#64748B",
                    backgroundColor: (theme) => theme.palette.mode === 'light' ? "#F8FAFC" : "rgba(51, 65, 85, 0.3)",
                  },
                }}
              >
                Add New Project
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<WorkIcon />}
                onClick={() => navigate("/experience")}
                sx={{
                  py: 2,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderColor: (theme) => theme.palette.mode === 'light' ? "#E2E8F0" : "#334155",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: (theme) => theme.palette.mode === 'light' ? "#CBD5E1" : "#64748B",
                    backgroundColor: (theme) => theme.palette.mode === 'light' ? "#F8FAFC" : "rgba(51, 65, 85, 0.3)",
                  },
                }}
              >
                Add Experience
              </Button>
            </Stack>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
