// Packages
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Alert,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tooltip,
  Fade,
  Zoom,
  Collapse,
  Badge,
  Switch,
  FormControlLabel,
  Autocomplete,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Visibility as PreviewIcon,
  Code as CodeIcon,
  Article as ArticleIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Publish as PublishIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Schedule as ScheduleIcon,
  CloudDone as CloudDoneIcon,
  Image as ImageIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon,
  ViewList as ViewListIcon,
  ViewSidebar as ViewSidebarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { Toaster, toast } from "react-hot-toast";
import { styled, keyframes } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";

// Components & Services
import { blogPostsApi } from "../../Api/SupabaseData";

// Animations
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.98); }
`;

const slideIn = keyframes`
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 20,
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
}));

const GradientHeader = styled(Box)(({ theme }) => ({
  padding: "40px 32px",
  background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
  color: "white",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)",
    pointerEvents: "none",
  },
}));

const MarkdownEditor = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    fontFamily: '"Fira Code", "Courier New", monospace',
    fontSize: "14px",
    lineHeight: 1.8,
    backgroundColor: "#F8FAFC",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#F1F5F9",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    "&.Mui-focused": {
      backgroundColor: "#FFFFFF",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    },
  },
}));

const PreviewBox = styled(Box)(({ theme }) => ({
  padding: 32,
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  border: "1px solid #E2E8F0",
  minHeight: 500,
  maxHeight: 600,
  overflowY: "auto",
  transition: "all 0.3s ease",
  "&::-webkit-scrollbar": {
    width: 8,
  },
  "&::-webkit-scrollbar-track": {
    background: "#F1F5F9",
    borderRadius: 4,
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#CBD5E1",
    borderRadius: 4,
    "&:hover": {
      background: "#94A3B8",
    },
  },
  "& h1": {
    fontSize: "2.5em",
    fontWeight: 700,
    marginBottom: 20,
    color: "#1E293B",
    borderBottom: "3px solid #E2E8F0",
    paddingBottom: 12,
  },
  "& h2": {
    fontSize: "2em",
    fontWeight: 600,
    marginBottom: 16,
    marginTop: 32,
    color: "#334155",
    borderLeft: "4px solid #3B82F6",
    paddingLeft: 16,
  },
  "& h3": {
    fontSize: "1.5em",
    fontWeight: 600,
    marginBottom: 12,
    marginTop: 24,
    color: "#475569",
  },
  "& p": {
    marginBottom: 16,
    lineHeight: 1.8,
    color: "#64748B",
    fontSize: "1.05em",
  },
  "& ul, & ol": {
    marginBottom: 16,
    paddingLeft: 32,
    "& li": {
      marginBottom: 8,
      color: "#64748B",
      lineHeight: 1.7,
    },
  },
  "& code": {
    backgroundColor: "#F1F5F9",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: "0.9em",
    fontFamily: '"Fira Code", "Courier New", monospace',
    color: "#DC2626",
    border: "1px solid #E2E8F0",
  },
  "& pre": {
    backgroundColor: "#1E293B",
    color: "#E2E8F0",
    padding: 20,
    borderRadius: 12,
    overflow: "auto",
    marginBottom: 16,
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2)",
    "& code": {
      backgroundColor: "transparent",
      color: "#E2E8F0",
      padding: 0,
      border: "none",
    },
  },
  "& img": {
    maxWidth: "100%",
    height: "auto",
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  animation: `${pulse} 2s infinite`,
  fontWeight: 600,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: "none",
  fontWeight: 600,
  padding: "12px 24px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

const toastConfig = {
  position: "top-center",
  style: {
    background: "rgba(15, 23, 42, 0.95)",
    color: "white",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "16px 24px",
    maxWidth: "500px",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "14px",
    fontWeight: 500,
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  duration: 2000,
};

const BlogPostForm = () => {
  // State Management
  const [blogPosts, setBlogPosts] = useState([]);
  const [view, setView] = useState("list"); // 'list' or 'form'
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    author: "Sandesh Arsud",
    published: false,
    published_at: null,
    reading_time: 0,
    tags: [],
    category: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: [],
    is_featured: false,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [filterPublished, setFilterPublished] = useState("all"); // 'all', 'published', 'draft'
  const [filterFeatured, setFilterFeatured] = useState("all"); // 'all', 'featured',  'not_featured'
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Load blog posts on mount
  useEffect(() => {
    fetchBlogPosts();
    fetchCategoriesAndTags();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.id) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, formData.id]);

  // Calculate reading time
  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(words / 200); // Average reading speed
    setFormData((prev) => ({ ...prev, reading_time: readingTime }));
  }, [formData.content]);

  // Auto-generate SEO title from title
  useEffect(() => {
    if (formData.title && !formData.seo_title  && !formData.id) {
      setFormData((prev) => ({
        ...prev,
        seo_title: `${formData.title} | Sandesh Arsud`,
      }));
    }
  }, [formData.title, formData.seo_title, formData.id]);

  // Auto-generate SEO description from excerpt
  useEffect(() => {
    if (formData.excerpt && !formData.seo_description && !formData.id) {
      setFormData((prev) => ({
        ...prev,
        seo_description: formData.excerpt.substring(0, 160),
      }));
    }
  }, [formData.excerpt, formData.seo_description, formData.id]);

  const fetchBlogPosts = async () => {
    try {
      const data = await blogPostsApi.fetchAll();
      setBlogPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to load blog posts", toastConfig);
    }
  };

  const fetchCategoriesAndTags = async () => {
    try {
      const [categories, tags] = await Promise.all([
        blogPostsApi.getCategories(),
        blogPostsApi.getTags(),
      ]);
      setAvailableCategories(categories);
      setAvailableTags(tags);
    } catch (error) {
      console.error("Error fetching categories and tags:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleNewPost = () => {
    setFormData({
      id: null,
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image: "",
      author: "Sandesh Arsud",
      published: false,
      published_at: null,
      reading_time: 0,
      tags: [],
      category: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: [],
      is_featured: false,
    });
    setHasChanges(false);
    setView("form");
  };

  const handleEditPost = (post) => {
    setFormData({
      ...post,
      tags: post.tags || [],
      seo_keywords: post.seo_keywords || [],
    });
    setHasChanges(false);
    setView("form");
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a title", toastConfig);
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Please enter a slug", toastConfig);
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Please enter content", toastConfig);
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading(
      formData.id ? "Updating post..." : "Creating post...",
      toastConfig
    );

    try {
      const dataToSave = { ...formData };
      
      // Set published_at if publishing
      if (dataToSave.published && !dataToSave.published_at) {
        dataToSave.published_at = new Date().toISOString();
      }
      
      // Remove published_at if unpublishing
      if (!dataToSave.published) {
        dataToSave.published_at = null;
      }

      if (formData.id) {
        await blogPostsApi.update(dataToSave);
        toast.success("Post updated successfully!", {
          ...toastConfig,
          id: loadingToast,
        });
      } else {
        await blogPostsApi.create(dataToSave);
        toast.success("Post created successfully!", {
          ...toastConfig,
          id: loadingToast,
        });
      }

      setHasChanges(false);
      fetchBlogPosts();
      fetchCategoriesAndTags();
      setView("list");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(
        error.message || "Failed to save post",
        { ...toastConfig, id: loadingToast }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const loadingToast = toast.loading("Deleting post...", toastConfig);

    try {
      await blogPostsApi.delete(postToDelete.id);
      toast.success("Post deleted successfully!", {
        ...toastConfig,
        id: loadingToast,
      });
      fetchBlogPosts();
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      if (formData.id === postToDelete.id) {
        setView("list");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post", {
        ...toastConfig,
        id: loadingToast,
      });
    }
  };

  const renderMarkdownPreview = (markdown) => {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/_(.+?)_/g, "<em>$1</em>");

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Line breaks
    html = html.replace(/\n\n/g, "</p><p>");
    html = html.replace(/\n/g, "<br>");

    // Wrap in paragraphs
    html = "<p>" + html + "</p>";

    return html;
  };

  const filteredPosts = blogPosts.filter((post) => {
    // Filter by published status
    if (filterPublished === "published" && !post.published) return false;
    if (filterPublished === "draft" && post.published) return false;

    // Filter by featured status
    if (filterFeatured === "featured" && !post.is_featured) return false;
    if (filterFeatured === "not_featured" && post.is_featured) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.category?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const paginatedPosts = filteredPosts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Render List View
  const renderListView = () => (
    <Box>
      <GradientHeader>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.25rem" },
                fontWeight: 700,
                background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <ArticleIcon sx={{ fontSize: 40, color: "#E2E8F0" }} />
              Blog Posts
            </Typography>
            <Typography variant="body1" sx={{ color: "#94A3B8", ml: 7 }}>
              Manage your blog content, articles, and publications
            </Typography>
          </Box>

          <ActionButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewPost}
            sx={{
              background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
              color: "white",
              boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              },
            }}
          >
            New Post
          </ActionButton>
        </Box>
      </GradientHeader>

      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        {/* Filters and Search */}
        <Card
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterPublished}
                  label="Status"
                  onChange={(e) => setFilterPublished(e.target.value)}
                >
                  <MenuItem value="all">All Posts</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="draft">Drafts</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Featured</InputLabel>
                <Select
                  value={filterFeatured}
                  label="Featured"
                  onChange={(e) => setFilterFeatured(e.target.value)}
                >
                  <MenuItem value="all">All Posts</MenuItem>
                  <MenuItem value="featured">Featured Only</MenuItem>
                  <MenuItem value="not_featured">Not Featured</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* Posts Table */}
        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Views</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Published</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <ArticleIcon
                        sx={{ fontSize: 64, color: "#CBD5E1", mb: 2 }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        No blog posts found
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Create your first blog post to get started
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPosts.map((post) => (
                    <TableRow
                      key={post.id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "#F8FAFC",
                        },
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600, color: "#1E293B" }}
                            >
                              {post.title}
                            </Typography>
                            {post.is_featured && (
                              <Tooltip title="Featured Post">
                                <StarIcon sx={{ fontSize: 18, color: "#F59E0B" }} />
                              </Tooltip>
                            )}
                          </Box>
                          <Typography variant="caption" color="textSecondary">
                            {post.slug}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={post.published ? "Published" : "Draft"}
                          size="small"
                          color={post.published ? "success" : "default"}
                          icon={
                            post.published ? (
                              <CheckCircleIcon />
                            ) : (
                              <ScheduleIcon />
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {post.category && (
                          <Chip
                            label={post.category}
                            size="small"
                            sx={{
                              backgroundColor: "#F1F5F9",
                              color: "#475569",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <VisibilityIcon sx={{ fontSize: 16, color: "#64748B" }} />
                          <Typography variant="body2">{post.views || 0}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditPost(post)}
                              sx={{
                                color: "#3B82F6",
                                "&:hover": { backgroundColor: "rgba(59,130,246,0.1)" },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(post)}
                              sx={{
                                color: "#EF4444",
                                "&:hover": { backgroundColor: "rgba(239,68,68,0.1)" },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredPosts.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </StyledPaper>
      </Box>
    </Box>
  );

  // Render Form View
  const renderFormView = () => (
    <Box>
      <GradientHeader>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.25rem" },
                fontWeight: 700,
                background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <EditIcon sx={{ fontSize: 40, color: "#E2E8F0" }} />
              {formData.id ? "Edit Post" : "New Post"}
            </Typography>
            <Typography variant="body1" sx={{ color: "#94A3B8", ml: 7 }}>
              {formData.id
                ? "Update your blog post content"
                : "Create a new blog post"}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            {hasChanges && (
              <Zoom in={hasChanges}>
                <StatusChip
                  icon={<CodeIcon />}
                  label="Unsaved"
                  color="warning"
                  size="small"
                />
              </Zoom>
            )}
            {!hasChanges && formData.id && (
              <Zoom in={!hasChanges}>
                <StatusChip
                  icon={<CloudDoneIcon />}
                  label="Saved"
                  color="success"
                  size="small"
                />
              </Zoom>
            )}
          </Stack>
        </Box>
      </GradientHeader>

      {isSaving && <LinearProgress />}

      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        {/* Action Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
          flexWrap="wrap"
        >
          <ActionButton
            variant="contained"
            startIcon={isSaving ? <RefreshIcon className="spin" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={isSaving}
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 auto" },
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              color: "white",
              boxShadow: "0 4px 12px rgba(15,23,42,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
              },
            }}
          >
            {formData.id ? "Update" : "Create"} Post
          </ActionButton>

          <ActionButton
            variant="outlined"
            startIcon={splitView ? <CodeIcon /> : <ViewSidebarIcon />}
            onClick={() => setSplitView(!splitView)}
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 auto" },
              borderColor: splitView ? "#3B82F6" : "#E2E8F0",
              color: splitView ? "#3B82F6" : "#475569",
              backgroundColor: splitView
                ? "rgba(59, 130, 246, 0.05)"
                : "transparent",
              "&:hover": {
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
              },
            }}
          >
            Split View
          </ActionButton>

          <ActionButton
            variant="outlined"
            startIcon={showPreview ? <CodeIcon /> : <PreviewIcon />}
            onClick={() => setShowPreview(!showPreview)}
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 auto" },
              borderColor: "#E2E8F0",
              color: "#475569",
              "&:hover": {
                borderColor: "#CBD5E1",
                backgroundColor: "#F8FAFC",
              },
            }}
          >
            {showPreview ? "Edit" : "Preview"}
          </ActionButton>

          <ActionButton
            variant="outlined"
            startIcon={<ViewListIcon />}
            onClick={() => setView("list")}
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 auto" },
              borderColor: "#E2E8F0",
              color: "#475569",
              "&:hover": {
                borderColor: "#CBD5E1",
                backgroundColor: "#F8FAFC",
              },
            }}
          >
            Back to List
          </ActionButton>
        </Stack>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} lg={splitView ? 6 : 12}>
            <Stack spacing={3}>
              {/* Basic Information */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Basic Information
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    label="Title"
                    fullWidth
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />

                  <TextField
                    label="Slug"
                    fullWidth
                    required
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    helperText="URL-friendly version of the title"
                  />

                  <TextField
                    label="Excerpt"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    helperText="Short description shown in post listings"
                  />

                  <TextField
                    label="Cover Image URL"
                    fullWidth
                    value={formData.cover_image}
                    onChange={(e) =>
                      handleInputChange("cover_image", e.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ImageIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {formData.cover_image && (
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <img
                        src={formData.cover_image}
                        alt="Cover preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              </Card>

              {/* Content Editor */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Content
                </Typography>

                {!showPreview || splitView ? (
                  <MarkdownEditor
                    fullWidth
                    multiline
                    rows={20}
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Write your blog post content in Markdown..."
                  />
                ) : (
                  <PreviewBox
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdownPreview(formData.content),
                    }}
                  />
                )}

                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="textSecondary">
                    {formData.content.trim().split(/\s+/).filter(Boolean).length} words
                    • {formData.reading_time} min read
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Markdown supported
                  </Typography>
                </Box>
              </Card>

              {/* SEO Settings */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  SEO Settings
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    label="SEO Title"
                    fullWidth
                    value={formData.seo_title}
                    onChange={(e) =>
                      handleInputChange("seo_title", e.target.value)
                    }
                    helperText="Title that appears in search results"
                  />

                  <TextField
                    label="SEO Description"
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.seo_description}
                    onChange={(e) =>
                      handleInputChange("seo_description", e.target.value)
                    }
                    helperText="Description for search engines (160 chars max)"
                  />

                  <Autocomplete
                    multiple
                    freeSolo
                    options={availableTags}
                    value={formData.seo_keywords}
                    onChange={(e, newValue) =>
                      handleInputChange("seo_keywords", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="SEO Keywords"
                        placeholder="Add keywords..."
                      />
                    )}
                  />
                </Stack>
              </Card>
            </Stack>
          </Grid>

          {/* Sidebar or Preview */}
          <Grid item xs={12} lg={splitView ? 6 : 12}>
            <Stack spacing={3}>
              {splitView && (
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Preview
                  </Typography>
                  <PreviewBox
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdownPreview(formData.content),
                    }}
                  />
                </Card>
              )}

              {/* Metadata */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Metadata
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    label="Author"
                    fullWidth
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                  />

                  <Autocomplete
                    freeSolo
                    options={availableCategories}
                    value={formData.category}
                    onChange={(e, newValue) =>
                      handleInputChange("category", newValue || "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <CategoryIcon />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />

                  <Autocomplete
                    multiple
                    freeSolo
                    options={availableTags}
                    value={formData.tags}
                    onChange={(e, newValue) => handleInputChange("tags", newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Add tags..."
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <TagIcon />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Stack>
              </Card>

              {/* Publishing Options */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Publishing
                </Typography>

                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.published}
                        onChange={(e) =>
                          handleInputChange("published", e.target.checked)
                        }
                        color="success"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Publish Post
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Make this post visible to the public
                        </Typography>
                      </Box>
                    }
                  />

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_featured}
                        onChange={(e) =>
                          handleInputChange("is_featured", e.target.checked)
                        }
                        color="warning"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Featured Post
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Highlight this post on your blog
                        </Typography>
                      </Box>
                    }
                  />

                  {formData.published && formData.published_at && (
                    <Alert severity="info" icon={<ScheduleIcon />}>
                      Published on{" "}
                      {new Date(formData.published_at).toLocaleString()}
                    </Alert>
                  )}
                </Stack>
              </Card>

              {/* Stats */}
              {formData.id && (
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Statistics
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" fontWeight={700} color="primary">
                          {formData.views || 0}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Total Views
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" fontWeight={700} color="primary">
                          {formData.reading_time}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Min Read
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: "100%", margin: "0 auto" }}>
      <Toaster position="top-center" toastOptions={toastConfig} />

      <StyledPaper>
        {view === "list" ? renderListView() : renderFormView()}
      </StyledPaper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WarningIcon color="error" />
            <Typography variant="h6" fontWeight={600}>
              Delete Blog Post
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{postToDelete?.title}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogPostForm;
