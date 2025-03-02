import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  IconButton,
  Avatar,
  Divider,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Save as SaveIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Description as ResumeIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { bioApi, copyrightApi } from "../../api/SupabaseData";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Add these utility functions
const isMobile = () => window.innerWidth < 600;
const isTablet = () => window.innerWidth >= 600 && window.innerWidth < 960;

// Add responsive handlers
const handleTouchStart = (event) => {
  if (isMobile()) {
    // Add touch-specific behavior
  }
};

// Update the formStyles with responsive design
const formStyles = {
  container: {
    width: "100%",
    maxWidth: "100%",
    margin: "0 auto",
    p: { xs: 2, sm: 3 },
    "@media (min-width: 1200px)": {
      maxWidth: 1200,
    },
  },
  header: {
    background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
    p: { xs: 2.5, sm: 3, md: 4 },
    color: "white",
    borderRadius: { xs: "12px 12px 0 0", sm: "16px 16px 0 0" },
  },
  headerTitle: {
    fontWeight: 800,
    mb: { xs: 0.5, sm: 1 },
    fontSize: {
      xs: "1.5rem",
      sm: "1.75rem",
      md: "2rem",
    },
    letterSpacing: "-0.02em",
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  contentBox: {
    p: { xs: 2.5, sm: 3, md: 4 },
    backgroundColor: "#FFFFFF",
  },
};

// Update the chipStyles for better mobile handling
const chipStyles = {
  display: "flex",
  flexWrap: "wrap",
  gap: { xs: 1, sm: 1.5 },
  mt: 2,
  "& .MuiChip-root": {
    height: { xs: 32, sm: 36 },
    borderRadius: { xs: "10px", sm: "12px" },
    fontSize: { xs: "0.813rem", sm: "0.875rem" },
    "& .MuiChip-label": {
      px: { xs: 2, sm: 3 },
    },
  },
};

// Add responsive dialog styles
const dialogStyles = {
  paper: {
    width: { xs: "95%", sm: "100%" },
    maxWidth: { xs: "100%", sm: 600 },
    margin: { xs: "16px", sm: "32px" },
    borderRadius: { xs: "16px", sm: "20px" },
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(241, 245, 249, 0.1)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  title: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    px: { xs: 2.5, sm: 3 },
    py: { xs: 2, sm: 2.5 },
  },
  content: {
    p: { xs: 2.5, sm: 3 },
    "&.MuiDialogContent-root": {
      paddingTop: { xs: "20px !important", sm: "24px !important" },
    },
  },
  actions: {
    p: { xs: 2.5, sm: 3 },
    backgroundColor: "#F8FAFC",
    borderTop: "1px solid rgba(226, 232, 240, 0.8)",
  },
};

// First, add these button styles to your existing styles
const dialogButtonStyles = {
  cancelButton: {
    borderColor: "#E2E8F0",
    color: "#64748B",
    px: 3,
    py: 1,
    borderRadius: 2,
    textTransform: "none",
    "&:hover": {
      borderColor: "#CBD5E1",
      backgroundColor: "#F1F5F9",
    },
    transition: "all 0.2s ease-in-out",
  },
  deleteButton: {
    background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    color: "white",
    px: 3,
    py: 1,
    borderRadius: 2,
    textTransform: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    },
    transition: "all 0.2s ease-in-out",
  },
};

// Update the social icons for better touch targets
const socialIconStyles = (color) => ({
  color: color,
  backgroundColor: `${color}08`,
  padding: { xs: 1.25, sm: 1.5 },
  borderRadius: { xs: "10px", sm: "12px" },
  minWidth: { xs: 44, sm: 48 },
  minHeight: { xs: 44, sm: 48 },
  "& .MuiSvgIcon-root": {
    fontSize: { xs: "1.25rem", sm: "1.5rem" },
  },
});

// Update avatar styles for responsive sizing
const avatarStyles = {
  width: { xs: 120, sm: 140, md: 160 },
  height: { xs: 120, sm: 140, md: 160 },
  border: "4px solid white",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
};

// Update text field styles for mobile
const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: { xs: "10px", sm: "12px" },
    minHeight: { xs: "44px", sm: "48px" },
    fontSize: { xs: "0.875rem", sm: "1rem" },
  },
  "& .MuiInputLabel-root": {
    fontSize: { xs: "0.875rem", sm: "1rem" },
  },
  "& .MuiInputAdornment-root": {
    "& .MuiSvgIcon-root": {
      fontSize: { xs: "1.125rem", sm: "1.25rem" },
    },
  },
};

// Add these styles for better mobile grid spacing
const gridStyles = {
  container: {
    spacing: { xs: 2, sm: 3 },
  },
  item: {
    xs: 12,
    sm: 6,
    md: 6,
  },
};

// Update the Grid container in the return statement
<Grid container spacing={gridStyles.container.spacing}>
  {/* Grid items */}
  <Grid item xs={gridStyles.item.xs} sm={gridStyles.item.sm}>
    {/* Content */}
  </Grid>
</Grid>;

// Add touch-friendly button styles
const buttonStyles = {
  minHeight: { xs: "44px", sm: "48px" },
  px: { xs: 3, sm: 4 },
  fontSize: { xs: "0.875rem", sm: "0.95rem" },
  borderRadius: { xs: "10px", sm: "12px" },
};

const BioForm = () => {
  const [bio, setBio] = useState({
    name: "",
    roles: [], // Should be configured as a text array in Supabase
    description: "",
    github: "",
    resume: "",
    linkedin: "",
    twitter: "",
    insta: "",
    image: "",
  });
  const [copyright, setCopyright] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [deleteRoleDialog, setDeleteRoleDialog] = useState({
    open: false,
    role: "",
    index: -1,
  });

  const commonButtonSx = {
    background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
    borderRadius: "12px",
    textTransform: "none",
    px: 4,
    py: 1.5,
    minWidth: { xs: "100%", sm: "160px" },
    height: 46,
    fontSize: "0.95rem",
    fontWeight: 600,
    letterSpacing: "0.01em",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
  };

  // Update paperStyles
  const paperStyles = {
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease",
    border: "1px solid rgba(241, 245, 249, 0.2)",
    backdropFilter: "blur(20px)",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    },
  };

  // Update textFieldStyles
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#F8FAFC",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: "#F1F5F9",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#94A3B8",
          borderWidth: "2px",
        },
      },
      "&.Mui-focused": {
        backgroundColor: "#F1F5F9",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#0F172A",
          borderWidth: "2px",
        },
      },
    },
    "& .MuiInputLabel-root": {
      color: "#64748B",
      "&.Mui-focused": {
        color: "#0F172A",
      },
    },
    "& .MuiInputAdornment-root": {
      "& .MuiSvgIcon-root": {
        fontSize: "1.25rem",
        transition: "all 0.2s ease",
      },
      "&:hover .MuiSvgIcon-root": {
        transform: "scale(1.1)",
      },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 1,
      color: "#94A3B8",
    },
  };

  // Update socialIconStyles
  const socialIconStyles = (color) => ({
    color: color,
    backgroundColor: `${color}08`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    padding: 1.5,
    borderRadius: "12px",
    "&:hover": {
      backgroundColor: `${color}15`,
      transform: "translateY(-3px) scale(1.05)",
      boxShadow: `0 4px 12px ${color}20`,
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1.5rem",
    },
  });

  const avatarStyles = {
    width: { xs: 140, sm: 160 },
    height: { xs: 140, sm: 160 },
    border: "4px solid white",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "scale(1.05) rotate(2deg)",
      boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
      border: "4px solid #E2E8F0",
    },
  };

  // Add these styles to your existing styles
  const previewStyles = {
    previewSection: {
      p: { xs: 2.5, sm: 3 },
      borderRadius: { xs: 2, sm: 3 },
      background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
    previewTitle: {
      color: "#1E293B",
      fontWeight: 600,
      fontSize: { xs: "1.25rem", sm: "1.5rem" },
      mb: { xs: 2, sm: 3 },
      background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    socialIconsContainer: {
      display: "flex",
      gap: { xs: 1.5, sm: 2 },
      flexWrap: "wrap",
      justifyContent: { xs: "center", sm: "flex-start" },
    },
  };

  useEffect(() => {
    fetchBio();
    fetchCopyright();
  }, []);

  // Update the fetchBio function to remove prefilled roles
  const fetchBio = async () => {
    try {
      const data = await bioApi.fetch();
      setBio({
        ...data,
        roles: Array.isArray(data?.roles) ? data.roles : [],
      });
      setRoleInput(""); // Remove prefilled roles
    } catch (error) {
      toast.error("Error fetching bio: " + error.message);
    }
  };

  const handleSubmit = async () => {
    const loadingToast = toast.loading("Updating bio...");
    try {
      if (!bio.name || !bio.description) {
        toast.error("Please fill in all required fields");
        return;
      }

      await bioApi.update(bio);
      await fetchBio();
      toast.dismiss(loadingToast);
      toast.success("Bio updated successfully!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Failed to update bio: ${error.message}`);
    }
  };

  const fetchCopyright = async () => {
    try {
      const data = await copyrightApi.fetch();
      setCopyright(data?.copyright || "");
    } catch (error) {
      console.error("Error fetching copyright:", error);
      toast.error("Error fetching copyright: " + error.message);
    }
  };

  const handleCopyrightSubmit = async () => {
    let toastId = null;
    try {
      // Input validation
      if (!copyright.trim()) {
        toast.error("Copyright text cannot be empty");
        return;
      }

      // Show loading state
      toastId = toast.loading("Updating copyright...");

      // Simply pass the copyright text
      await copyrightApi.update(copyright.trim());
      await fetchCopyright();

      toast.dismiss(toastId);
      toast.success("Copyright updated successfully");
    } catch (error) {
      console.error("Error saving copyright:", error);
      if (toastId) toast.dismiss(toastId);
      toast.error(`Failed to update copyright: ${error.message}`);
    }
  };

  const handleRoleChange = (e) => {
    setRoleInput(e.target.value);
  };

  return (
    <Box sx={formStyles.container}>
      <Paper sx={paperStyles}>
        <Box sx={formStyles.header}>
          <Typography variant="h4" sx={formStyles.headerTitle}>
            Bio Information
          </Typography>
          <Typography variant="body1" sx={{ color: "#94A3B8" }}>
            Manage your personal information and social links
          </Typography>
        </Box>

        <Box sx={formStyles.contentBox}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SectionHeader
                title="Personal Information"
                subtitle="Your basic profile information"
              />
            </Grid>
            {/* Profile Image Section */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box
                sx={{
                  position: "relative",
                  "&:hover": {
                    "& .image-overlay": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <Avatar src={bio.Image} alt={bio.name} sx={avatarStyles} />
              </Box>
            </Grid>

            {/* Profile Image URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profile Image URL"
                value={bio.Image || ""}
                onChange={(e) => setBio({ ...bio, image: e.target.value })}
                sx={textFieldStyles}
              />
            </Grid>

            {/* Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Name"
                value={bio.name || ""}
                onChange={(e) => setBio({ ...bio, name: e.target.value })}
                sx={textFieldStyles}
              />
            </Grid>

            {/* Roles */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Role"
                value={roleInput}
                onChange={handleRoleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && roleInput.trim()) {
                    e.preventDefault();
                    const newRole = roleInput.trim();
                    if (!bio.roles.includes(newRole)) {
                      setBio((prev) => ({
                        ...prev,
                        roles: [...prev.roles, newRole],
                      }));
                      setRoleInput("");
                      toast.success(`Added role: ${newRole}`, {
                        icon: "🎯",
                        duration: 2000,
                      });
                    } else {
                      toast.error("This role already exists", {
                        icon: "⚠️",
                        duration: 3000,
                      });
                    }
                  }
                }}
                placeholder="Type a role and press Enter"
                helperText="Press Enter to add a role"
                sx={textFieldStyles}
                InputProps={{
                  sx: {
                    "&::placeholder": {
                      color: "rgba(100, 116, 139, 0.8)",
                    },
                  },
                }}
              />
              <AnimatePresence>
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  sx={chipStyles}
                  component={motion.div}
                  layout
                >
                  {bio.roles.map((role, index) => (
                    <motion.div
                      key={role}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                      }}
                    >
                      <Chip
                        label={role}
                        onDelete={() =>
                          setDeleteRoleDialog({ open: true, role, index })
                        }
                        sx={{
                          maxWidth: "180px",
                          backgroundColor: `hsl(${
                            (index * 75) % 360
                          }, 85%, 97%)`,
                          borderColor: `hsl(${(index * 75) % 360}, 85%, 90%)`,
                          color: `hsl(${(index * 75) % 360}, 85%, 35%)`,
                          "&:hover": {
                            backgroundColor: `hsl(${
                              (index * 75) % 360
                            }, 85%, 95%)`,
                            borderColor: `hsl(${(index * 75) % 360}, 85%, 85%)`,
                          },
                          "& .MuiChip-label": {
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontWeight: 600,
                          },
                          "& .MuiChip-deleteIcon": {
                            color: `hsl(${(index * 75) % 360}, 85%, 35%)`,
                            "&:hover": {
                              color: `hsl(${(index * 75) % 360}, 85%, 25%)`,
                            },
                          },
                        }}
                      />
                    </motion.div>
                  ))}
                </Stack>
              </AnimatePresence>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Description"
                value={bio.description || ""}
                onChange={(e) =>
                  setBio({ ...bio, description: e.target.value })
                }
                sx={textFieldStyles}
              />
            </Grid>

            {/* Social Links */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GitHub URL"
                value={bio.github || ""}
                onChange={(e) => setBio({ ...bio, github: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <GitHubIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                value={bio.linkedin || ""}
                onChange={(e) => setBio({ ...bio, linkedin: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <LinkedInIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Twitter URL"
                value={bio.twitter || ""}
                onChange={(e) => setBio({ ...bio, twitter: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <TwitterIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Instagram URL"
                value={bio.insta || ""}
                onChange={(e) => setBio({ ...bio, insta: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InstagramIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resume URL"
                value={bio.resume || ""}
                onChange={(e) => setBio({ ...bio, resume: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <ResumeIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            {/* Save Button */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-end" },
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  sx={{
                    ...commonButtonSx,
                    background:
                      "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Dialog
          open={deleteRoleDialog.open}
          onClose={() =>
            setDeleteRoleDialog({ open: false, role: "", index: -1 })
          }
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: dialogStyles.paper,
          }}
        >
          <DialogTitle sx={dialogStyles.title}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WarningIcon sx={{ color: "#EF4444" }} />
                  Delete Role
                </Box>
              </Typography>
              <IconButton
                onClick={() =>
                  setDeleteRoleDialog({ open: false, role: "", index: -1 })
                }
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={dialogStyles.content}>
            <Typography sx={{ color: "#1E293B", fontSize: "1rem", mb: 2 }}>
              Are you sure you want to delete the role "
              <Box component="span" sx={{ fontWeight: 600, color: "#0F172A" }}>
                {deleteRoleDialog.role}
              </Box>
              "?
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions sx={dialogStyles.actions}>
            <Button
              onClick={() =>
                setDeleteRoleDialog({ open: false, role: "", index: -1 })
              }
              variant="outlined"
              sx={dialogButtonStyles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setBio((prev) => ({
                  ...prev,
                  roles: prev.roles.filter(
                    (_, i) => i !== deleteRoleDialog.index
                  ),
                }));
                toast.success(`Removed role: ${deleteRoleDialog.role}`);
                setDeleteRoleDialog({ open: false, role: "", index: -1 });
              }}
              variant="contained"
              sx={dialogButtonStyles.deleteButton}
            >
              Delete Role
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>

      <Divider sx={formStyles.divider} />

      {/* Social Links Preview */}
      <Paper sx={previewStyles.previewSection}>
        <Typography variant="h6" sx={previewStyles.previewTitle}>
          Social Links Preview
        </Typography>
        <Box sx={previewStyles.socialIconsContainer}>
          {bio.github && (
            <IconButton
              href={bio.github}
              target="_blank"
              sx={{
                ...socialIconStyles("#24292e"),
                p: { xs: 1.5, sm: 2 },
                minWidth: { xs: 44, sm: 48 },
                minHeight: { xs: 44, sm: 48 },
              }}
            >
              <GitHubIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
            </IconButton>
          )}
          {bio.linkedin && (
            <IconButton
              href={bio.linkedin}
              target="_blank"
              sx={{
                ...socialIconStyles("#0077B5"),
                p: { xs: 1.5, sm: 2 },
                minWidth: { xs: 44, sm: 48 },
                minHeight: { xs: 44, sm: 48 },
              }}
            >
              <LinkedInIcon
                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              />
            </IconButton>
          )}
          {bio.twitter && (
            <IconButton
              href={bio.twitter}
              target="_blank"
              sx={{
                ...socialIconStyles("#1DA1F2"),
                p: { xs: 1.5, sm: 2 },
                minWidth: { xs: 44, sm: 48 },
                minHeight: { xs: 44, sm: 48 },
              }}
            >
              <TwitterIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
            </IconButton>
          )}
          {bio.insta && (
            <IconButton
              href={bio.insta}
              target="_blank"
              sx={{
                ...socialIconStyles("#E4405F"),
                p: { xs: 1.5, sm: 2 },
                minWidth: { xs: 44, sm: 48 },
                minHeight: { xs: 44, sm: 48 },
              }}
            >
              <InstagramIcon
                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              />
            </IconButton>
          )}
          {bio.resume && (
            <IconButton
              href={bio.resume}
              target="_blank"
              sx={{
                ...socialIconStyles("#1E293B"),
                p: { xs: 1.5, sm: 2 },
                minWidth: { xs: 44, sm: 48 },
                minHeight: { xs: 44, sm: 48 },
              }}
            >
              <ResumeIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
            </IconButton>
          )}
        </Box>
      </Paper>

      <Divider sx={formStyles.divider} />

      {/* Copyright Section */}
      <Paper sx={{ ...paperStyles, mt: 3, p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#0F172A",
              fontWeight: 600,
              mb: { xs: 2, sm: 0 },
            }}
          >
            Copyright Information
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Copyright Text"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            helperText="Example: © 2024 Your Name. All rights reserved."
            sx={textFieldStyles}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Preview: {copyright || "No copyright text set"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "stretch", sm: "flex-end" },
            }}
          >
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleCopyrightSubmit}
              sx={commonButtonSx}
            >
              Save Copyright
            </Button>
          </Box>
        </Box>
      </Paper>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            padding: "16px",
            borderRadius: "8px",
            fontSize: "14px",
          },
        }}
      />
    </Box>
  );
};

// Add this component for section headers
const SectionHeader = ({ title, subtitle }) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant="h6"
      sx={{
        color: "#0F172A",
        fontWeight: 700,
        fontSize: "1.25rem",
        mb: 0.5,
        background: "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" sx={{ color: "#64748B" }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default BioForm;
