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
} from "@mui/material";
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Visibility as PreviewIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  ViewSidebar as ViewSidebarIcon,
  CalendarToday as CalendarIcon,
  TextFields as TextFieldsIcon,
  Help as HelpIcon,
  CloudDone as CloudDoneIcon,
  Info as InfoIcon,
  Folder as FolderIcon,
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
  "& blockquote": {
    borderLeft: "4px solid #3B82F6",
    paddingLeft: 20,
    marginLeft: 0,
    marginBottom: 16,
    color: "#64748B",
    fontStyle: "italic",
    backgroundColor: "#F8FAFC",
    padding: "16px 20px",
    borderRadius: "0 8px 8px 0",
  },
  "& a": {
    color: "#3B82F6",
    textDecoration: "none",
    fontWeight: 500,
    transition: "all 0.2s ease",
    "&:hover": {
      textDecoration: "underline",
      color: "#2563EB",
    },
  },
  "& img": {
    maxWidth: "100%",
    height: "auto",
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  "& table": {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    borderRadius: 8,
    overflow: "hidden",
    "& th, & td": {
      border: "1px solid #E2E8F0",
      padding: 12,
      textAlign: "left",
    },
    "& th": {
      backgroundColor: "#F1F5F9",
      fontWeight: 600,
      color: "#1E293B",
    },
    "& tr:hover": {
      backgroundColor: "#F8FAFC",
    },
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

const ProjectExplanationForm = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [existingExplanation, setExistingExplanation] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectExplanation(selectedProjectId);
    } else {
      setMarkdownContent("");
      setExistingExplanation(null);
      setHasChanges(false);
      setLastSaved(null);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    // Update word and character count
    const words = markdownContent.trim().split(/\s+/).filter(Boolean).length;
    const chars = markdownContent.length;
    setWordCount(words);
    setCharCount(chars);
  }, [markdownContent]);

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.fetch();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects", toastConfig);
    }
  };

  const fetchProjectExplanation = async (projectId) => {
    try {
      const data = await projectExplanationsApi.fetchByProjectId(projectId);
      if (data) {
        setMarkdownContent(data.markdown_content || "");
        setExistingExplanation(data);
        setHasChanges(false);
        setLastSaved(new Date());
      } else {
        setMarkdownContent("");
        setExistingExplanation(null);
        setHasChanges(false);
        setLastSaved(null);
      }
    } catch (error) {
      console.error("Error fetching explanation:", error);
      setMarkdownContent("");
      setExistingExplanation(null);
      setHasChanges(false);
      setLastSaved(null);
    }
  };

  const handleSave = async () => {
    if (!selectedProjectId) {
      toast.error("Please select a project", toastConfig);
      return;
    }

    if (!markdownContent.trim()) {
      toast.error("Please enter some content", toastConfig);
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Saving explanation...", toastConfig);

    try {
      await projectExplanationsApi.upsert({
        project_id: selectedProjectId,
        markdown_content: markdownContent,
      });

      toast.success(
        existingExplanation
          ? "Explanation updated successfully!"
          : "Explanation created successfully!",
        { ...toastConfig, id: loadingToast }
      );
      
      setHasChanges(false);
      setLastSaved(new Date());
      fetchProjectExplanation(selectedProjectId);
    } catch (error) {
      console.error("Error saving explanation:", error);
      toast.error("Failed to save explanation", { ...toastConfig, id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    if (!selectedProjectId || !existingExplanation) {
      return;
    }
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const loadingToast = toast.loading("Deleting explanation...", toastConfig);

    try {
      await projectExplanationsApi.delete(selectedProjectId);
      toast.success("Explanation deleted successfully!", {
        ...toastConfig,
        id: loadingToast,
      });
      setMarkdownContent("");
      setExistingExplanation(null);
      setHasChanges(false);
      setDeleteDialogOpen(false);
      setLastSaved(null);
    } catch (error) {
      console.error("Error deleting explanation:", error);
      toast.error("Failed to delete explanation", {
        ...toastConfig,
        id: loadingToast,
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleContentChange = (e) => {
    setMarkdownContent(e.target.value);
    setHasChanges(true);
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
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Line breaks
    html = html.replace(/\n\n/g, "</p><p>");
    html = html.replace(/\n/g, "<br>");

    // Wrap in paragraphs
    html = "<p>" + html + "</p>";

    return html;
  };

  const formatLastSaved = () => {
    if (!lastSaved) return "";
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000); // seconds
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return lastSaved.toLocaleDateString();
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <Box
      sx={{
        maxWidth: isFullscreen ? "100%" : 1400,
        margin: "0 auto",
        p: { xs: 2, sm: 3 },
        minHeight: isFullscreen ? "100vh" : "auto",
      }}
    >
      <Toaster position="top-center" toastOptions={toastConfig} />

      <StyledPaper>
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
                <DescriptionIcon sx={{ fontSize: 40, color: "#E2E8F0" }} />
                Project Explanations
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", ml: 7 }}>
                Create beautiful markdown documentation for your projects
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
              {!hasChanges && existingExplanation && (
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
          {/* Project Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: "1px solid #E2E8F0",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
                <FolderIcon sx={{ color: "#64748B" }} />
                <Typography
                  variant="h6"
                  sx={{ color: "#1E293B", fontWeight: 600 }}
                >
                  Select Project
                </Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  value={selectedProjectId}
                  label="Project"
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#E2E8F0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#CBD5E1",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select a project...</em>
                  </MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <DescriptionIcon sx={{ fontSize: 20, color: "#64748B" }} />
                        <Typography>{project.title}</Typography>
                        {project.category && (
                          <Chip
                            label={project.category}
                            size="small"
                            sx={{
                              ml: 1,
                              height: 20,
                              fontSize: "0.75rem",
                              backgroundColor: "#F1F5F9",
                              color: "#475569",
                            }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <AnimatePresence>
                {selectedProject && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert
                      severity="info"
                      sx={{ mt: 2, borderRadius: 2 }}
                      icon={<CheckCircleIcon />}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Typography variant="body2">
                          Editing: <strong>{selectedProject.title}</strong>
                        </Typography>
                        {lastSaved && (
                          <Typography variant="caption" sx={{ color: "#64748B" }}>
                            Last saved: {formatLastSaved()}
                          </Typography>
                        )}
                      </Box>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {selectedProjectId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Statistics Bar */}
              <Card
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  background: "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={3}
                  divider={<Divider orientation="vertical" flexItem />}
                >
                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#1E293B" }}>
                      {wordCount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      Words
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#1E293B" }}>
                      {charCount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      Characters
                    </Typography>
                  </Box>
                  {lastSaved && (
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 20, color: "#64748B" }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                          {formatLastSaved()}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        Last Saved
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Card>

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
                  disabled={!hasChanges || isSaving}
                  sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 auto" },
                    background: hasChanges
                      ? "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)"
                      : "#E2E8F0",
                    color: hasChanges ? "white" : "#94A3B8",
                    boxShadow: hasChanges ? "0 4px 12px rgba(15,23,42,0.3)" : "none",
                    "&:hover": {
                      background: hasChanges
                        ? "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
                        : "#CBD5E1",
                    },
                  }}
                >
                  {existingExplanation ? "Update" : "Create"} Explanation
                </ActionButton>

                <ActionButton
                  variant="outlined"
                  startIcon={splitView ? <CodeIcon /> : <ViewSidebarIcon />}
                  onClick={() => setSplitView(!splitView)}
                  sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 auto" },
                    borderColor: splitView ? "#3B82F6" : "#E2E8F0",
                    color: splitView ? "#3B82F6" : "#475569",
                    backgroundColor: splitView ? "rgba(59, 130, 246, 0.05)" : "transparent",
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

                <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                  <IconButton
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid #E2E8F0",
                      color: "#475569",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#F8FAFC",
                        borderColor: "#CBD5E1",
                        transform: "rotate(90deg)",
                      },
                    }}
                  >
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Keyboard Shortcuts">
                  <IconButton
                    onClick={() => setShowHelp(!showHelp)}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid #E2E8F0",
                      color: "#475569",
                      "&:hover": {
                        backgroundColor: "#F8FAFC",
                        borderColor: "#CBD5E1",
                      },
                    }}
                  >
                    <HelpIcon />
                  </IconButton>
                </Tooltip>

                {existingExplanation && (
                  <ActionButton
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteClick}
                    sx={{
                      borderColor: "#FEE2E2",
                      color: "#DC2626",
                      "&:hover": {
                        borderColor: "#FECACA",
                        backgroundColor: "#FEF2F2",
                      },
                    }}
                  >
                    Delete
                  </ActionButton>
                )}

                <Tooltip title="Refresh">
                  <IconButton
                    onClick={() => fetchProjectExplanation(selectedProjectId)}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid #E2E8F0",
                      color: "#475569",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#F8FAFC",
                        transform: "rotate(180deg)",
                      },
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

              {/* Keyboard Shortcuts Info */}
              <Collapse in={showHelp}>
                <Alert
                  severity="info"
                  icon={<InfoIcon />}
                  sx={{ mb: 3, borderRadius: 3 }}
                  onClose={() => setShowHelp(false)}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Keyboard Shortcuts
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="caption">
                      <kbd>Ctrl + S</kbd> - Save explanation
                    </Typography>
                    <Typography variant="caption">
                      <kbd>Ctrl + P</kbd> - Toggle preview
                    </Typography>
                    <Typography variant="caption">
                      <kbd>Ctrl + K</kbd> - Toggle split view
                    </Typography>
                  </Stack>
                </Alert>
              </Collapse>

              {/* Editor / Preview */}
              <Grid container spacing={3}>
                {(!showPreview || splitView) && (
                  <Grid item xs={12} md={splitView ? 6 : 12}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                          border: "2px solid #E2E8F0",
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: "#1E293B",
                            borderBottom: "1px solid #E2E8F0",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <CodeIcon sx={{ color: "#E2E8F0", fontSize: 20 }} />
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, color: "#E2E8F0" }}
                          >
                            Markdown Editor
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                          <MarkdownEditor
                            fullWidth
                            multiline
                            rows={splitView ? 20 : 24}
                            label="Markdown Content"
                            value={markdownContent}
                            onChange={handleContentChange}
                            placeholder="# Project Title

## Overview
Write your project explanation here using markdown...

### Features
- Feature 1
- Feature 2

### Technologies Used
- Technology 1
- Technology 2

## Installation
```bash
npm install
```

## Usage
Explain how to use your project..."
                            helperText="Use markdown syntax for formatting. Press Ctrl+S to save."
                            onKeyDown={(e) => {
                              if (e.ctrlKey && e.key === "s") {
                                e.preventDefault();
                                if (hasChanges) {
                                  handleSave();
                                }
                              }
                              if (e.ctrlKey && e.key === "p") {
                                e.preventDefault();
                                setShowPreview(!showPreview);
                              }
                              if (e.ctrlKey && e.key === "k") {
                                e.preventDefault();
                                setSplitView(!splitView);
                              }
                            }}
                          />
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                )}

                {(showPreview || splitView) && (
                  <Grid item xs={12} md={splitView ? 6 : 12}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                          border: "2px solid #E2E8F0",
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                            borderBottom: "1px solid #E2E8F0",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <PreviewIcon sx={{ color: "white", fontSize: 20 }} />
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, color: "white" }}
                          >
                            Preview
                          </Typography>
                        </Box>
                        <PreviewBox
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdownPreview(markdownContent || "*No content yet. Start writing in the editor!*"),
                          }}
                        />
                      </Card>
                    </motion.div>
                  </Grid>
                )}
              </Grid>

              {/* Markdown Guide */}
              <Card
                sx={{
                  mt: 3,
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  background: "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
                  <TextFieldsIcon sx={{ color: "#64748B" }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#1E293B" }}
                  >
                    Markdown Quick Reference
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {[
                    { syntax: "# Heading 1", desc: "Main heading" },
                    { syntax: "**bold**", desc: "Bold text" },
                    { syntax: "*italic*", desc: "Italic text" },
                    { syntax: "`code`", desc: "Inline code" },
                    { syntax: "[link](url)", desc: "Hyperlink" },
                    { syntax: "- item", desc: "List item" },
                    { syntax: "```code```", desc: "Code block" },
                    { syntax: "> quote", desc: "Blockquote" },
                  ].map((item, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={idx}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: "#3B82F6",
                            backgroundColor: "#F8FAFC",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(59,130,246,0.1)",
                          },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: '"Fira Code", monospace',
                            color: "#DC2626",
                            display: "block",
                            mb: 0.5,
                          }}
                        >
                          {item.syntax}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          {item.desc}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </motion.div>
          )}

          {!selectedProjectId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 4,
                  border: "2px dashed #CBD5E1",
                  backgroundColor: "#F8FAFC",
                  animation: `${float} 3s ease-in-out infinite`,
                }}
              >
                <DescriptionIcon
                  sx={{ fontSize: 80, color: "#CBD5E1", mb: 2 }}
                />
                <Typography variant="h5" sx={{ color: "#64748B", mb: 1, fontWeight: 600 }}>
                  No Project Selected
                </Typography>
                <Typography variant="body2" sx={{ color: "#94A3B8", maxWidth: 400, mx: "auto" }}>
                  Select a project from the dropdown above to create or edit its
                  detailed markdown documentation
                </Typography>
              </Card>
            </motion.div>
          )}
        </Box>
      </StyledPaper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
            color: "white",
            px: 3,
            py: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <DeleteIcon />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Delete Explanation
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Typography variant="body1" sx={{ color: "#475569", mb: 2 }}>
            Are you sure you want to delete this project explanation?
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            <Typography variant="body2">
              This action cannot be undone. The markdown content for{" "}
              <strong>{selectedProject?.title}</strong> will be permanently removed.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <ActionButton
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{
              borderColor: "#E2E8F0",
              color: "#64748B",
              "&:hover": {
                borderColor: "#CBD5E1",
                backgroundColor: "#F1F5F9",
              },
            }}
          >
            Cancel
          </ActionButton>
          <ActionButton
            onClick={handleConfirmDelete}
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{
              background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
              color: "white",
              boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                boxShadow: "0 6px 16px rgba(239,68,68,0.4)",
              },
            }}
          >
            Delete Explanation
          </ActionButton>
        </DialogActions>
      </Dialog>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        kbd {
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          border-radius: 4px;
          padding: 2px 6px;
          font-family: monospace;
          font-size: 0.9em;
          font-weight: 600;
          color: #475569;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
      `}</style>
    </Box>
  );
};

export default ProjectExplanationForm;
