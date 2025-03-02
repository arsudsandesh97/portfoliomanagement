import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Fab,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  Info as InfoIcon,
  Sync as LoadingIcon,
} from "@mui/icons-material";
import { experienceApi } from "../../api/SupabaseData";
import { Toaster, toast } from "react-hot-toast";

const styles = {
  container: {
    maxWidth: "100%",
    margin: "0 auto",
    p: { xs: 2, sm: 3 },
    "@media (min-width: 1200px)": {
      maxWidth: 1200,
    },
  },

  paper: {
    borderRadius: { xs: 2, sm: 4 },
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
  },

  gradientHeader: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    p: { xs: 2.5, sm: 4 },
  },

  headerText: {
    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
    lineHeight: { xs: 1.3, sm: 1.4 },
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },

  card: {
    p: { xs: 2, sm: 3 },
    borderRadius: { xs: 2, sm: 3 },
    backgroundColor: "white",
    transition: "all 0.3s ease",
    border: "1px solid",
    borderColor: "grey.200",
    "&:hover": {
      transform: { xs: "none", sm: "translateY(-4px)" },
      boxShadow: {
        xs: "0 4px 12px rgba(0,0,0,0.05)",
        sm: "0 12px 24px rgba(0,0,0,0.1)",
      },
    },
  },

  companyLogo: {
    width: { xs: "80px", sm: "100%" },
    height: { xs: "80px", sm: "auto" },
    margin: { xs: "0 auto", sm: 0 },
    aspectRatio: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "#F8FAFC",
    borderRadius: "50%",
    overflow: "hidden",
    border: "1px solid",
    borderColor: "grey.200",
    p: 1,
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: { xs: "scale(1.02)", sm: "scale(1.05)" },
    },
  },

  contentWrapper: {
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "center", sm: "flex-start" },
    textAlign: { xs: "center", sm: "left" },
    gap: { xs: 2, sm: 3 },
  },

  actionButtons: {
    justifyContent: { xs: "center", sm: "flex-end" },
    mt: { xs: 2, sm: 0 },
  },

  fabButton: {
    position: "fixed",
    bottom: 20,
    right: 20,
    display: { xs: "flex", sm: "none" },
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    "&:hover": {
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
    },
  },
};

const dialogStyles = {
  paper: {
    width: { xs: "95%", sm: "100%" },
    maxWidth: { xs: "100%", sm: 800 },
    m: { xs: 2, sm: 4 },
    borderRadius: { xs: 2, sm: 3 },
  },
  content: {
    p: { xs: 2.5, sm: 3 },
    "& .MuiTextField-root": {
      mb: { xs: 2, sm: 2.5 },
    },
  },
};

const toastConfig = {
  position: "top-center",
  style: {
    background: "rgba(15, 23, 42, 0.95)",
    color: "white",
    backdropFilter: "blur(8px)",
    borderRadius: "16px",
    padding: "16px 24px",
    maxWidth: "500px",
    width: "90%",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "14px",
    fontWeight: 500,
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  success: {
    icon: (
      <SuccessIcon
        sx={{
          animation: "rotate 0.5s ease-out",
          "@keyframes rotate": {
            "0%": { transform: "scale(0.5) rotate(-180deg)" },
            "100%": { transform: "scale(1) rotate(0)" },
          },
        }}
      />
    ),
    duration: 2000,
  },
  error: {
    icon: (
      <ErrorIcon
        sx={{
          animation: "shake 0.5s ease-in-out",
          "@keyframes shake": {
            "0%, 100%": { transform: "translateX(0)" },
            "25%": { transform: "translateX(-4px)" },
            "75%": { transform: "translateX(4px)" },
          },
        }}
      />
    ),
    duration: 3000,
  },
  loading: {
    icon: (
      <LoadingIcon
        sx={{
          animation: "spin 1s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
    ),
    duration: Infinity,
  },
};

const ExperienceForm = () => {
  const [experiences, setExperiences] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentExperience, setCurrentExperience] = useState({
    img: "",
    role: "",
    company: "",
    date: "",
    description: "",
    description2: "",
    description3: "",
    skills: [],
    doc: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const loadingToast = toast.loading(
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography>Loading experience details...</Typography>
      </Box>,
      { ...toastConfig }
    );

    try {
      const data = await experienceApi.fetch();
      setExperiences(data || []);
      toast.success(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Information loaded successfully</Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast,
        }
      );
    } catch (error) {
      console.error("Error details:", error);
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Failed to load experiences</Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast,
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!currentExperience.role || !currentExperience.company) {
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Please fill in all required fields</Typography>
        </Box>,
        { ...toastConfig }
      );
      return;
    }

    const loadingToast = toast.loading(
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography>
          {editMode ? "Updating" : "Adding"} experience...
        </Typography>
      </Box>,
      { ...toastConfig }
    );

    try {
      if (editMode) {
        await experienceApi.update(currentExperience);
      } else {
        await experienceApi.create(currentExperience);
      }

      await fetchExperiences();
      handleClose();

      toast.success(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>
            Experience {editMode ? "updated" : "added"} successfully
          </Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast,
        }
      );
    } catch (error) {
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>
            Failed to {editMode ? "update" : "add"} experience
          </Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast,
        }
      );
    }
  };

  const handleEdit = (experience) => {
    setCurrentExperience(experience);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = (experienceId) => {
    setItemToDelete({ id: experienceId });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const loadingToast = toast.loading("Deleting experience...");
    try {
      await experienceApi.delete(itemToDelete.id);
      await fetchExperiences();
      toast.dismiss(loadingToast);
      toast.success("Experience deleted successfully");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error deleting experience: " + error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentExperience({
      img: "",
      role: "",
      company: "",
      date: "",
      description: "",
      description2: "",
      description3: "",
      skills: [],
      doc: "",
    });
  };

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.paper}>
        <Box sx={styles.gradientHeader}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="h4" sx={styles.headerText}>
                Experience
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", mt: 1 }}>
                Manage your work experience
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditMode(false);
                setOpen(true);
              }}
              sx={{
                background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
                color: "#0F172A",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(255,255,255,0.15)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(255,255,255,0.2)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Add Experience
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 4 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {experiences.map((experience) => (
              <Grid item xs={12} key={experience.id}>
                <Card sx={styles.card}>
                  <Grid container sx={styles.contentWrapper}>
                    <Grid item xs={12} sm={2}>
                      <Box sx={styles.companyLogo}>
                        {experience.img ? (
                          <Box
                            component="img"
                            src={experience.img}
                            alt={experience.company}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              borderRadius: "50%",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/100?text=Company";
                            }}
                          />
                        ) : (
                          <WorkIcon sx={{ fontSize: 40, color: "#94A3B8" }} />
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={8}>
                      <Box sx={{ width: "100%" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: { xs: "1.125rem", sm: "1.25rem" },
                            color: "#1E293B",
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          {experience.role}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "#475569",
                            fontWeight: 500,
                            mb: 0.5,
                          }}
                        >
                          {experience.company}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            mb: 2,
                          }}
                        >
                          {experience.date}
                        </Typography>
                        {[
                          experience.description,
                          experience.description2,
                          experience.description3,
                        ]
                          .filter(Boolean)
                          .map((desc, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{
                                color: "#64748B",
                                mb: 1,
                                lineHeight: 1.6,
                              }}
                            >
                              {desc}
                            </Typography>
                          ))}
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ gap: 1, mt: 2 }}
                        >
                          {experience.skills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              sx={{
                                backgroundColor: "#F1F5F9",
                                color: "#475569",
                                fontWeight: 500,
                                "&:hover": {
                                  backgroundColor: "#E2E8F0",
                                },
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Box sx={styles.actionButtons}>
                        <IconButton
                          onClick={() => handleEdit(experience)}
                          sx={{
                            color: "#0F172A",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "#F1F5F9",
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(experience.id)}
                          sx={{
                            color: "#EF4444",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "#FEE2E2",
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: dialogStyles.paper,
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            color: "white",
            px: 3,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {editMode ? "Edit Experience" : "Add Experience"}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={dialogStyles.content}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Logo URL"
                value={currentExperience.img || ""}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    img: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
              {currentExperience.img && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <img
                    src={currentExperience.img}
                    alt="Company Logo"
                    style={{
                      maxHeight: 200,
                      maxWidth: "100%",
                      objectFit: "contain",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Role"
                value={currentExperience.role || ""}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    role: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Company"
                value={currentExperience.company || ""}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    company: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Date"
                value={currentExperience.date || ""}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    date: e.target.value,
                  })
                }
                helperText="e.g., October 2022 - October 2023"
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={currentExperience.description || ""}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    description: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description 2"
                value={currentExperience.description2 || ""}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    description2: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description 3"
                value={currentExperience.description3 || ""}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    description3: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills (comma-separated)"
                value={
                  Array.isArray(currentExperience.skills)
                    ? currentExperience.skills.join(", ")
                    : ""
                }
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    skills: e.target.value
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter(Boolean),
                  })
                }
                helperText="Enter skills separated by commas"
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Certificate URL"
                value={currentExperience.doc || ""}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    doc: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#F8FAFC" }}>
          <Button
            onClick={handleClose}
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
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
              color: "white",
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              },
            }}
          >
            {editMode ? "Save Changes" : "Add Experience"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            color: "white",
            px: 3,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Delete Experience
            </Typography>
            <IconButton
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <Typography>
            Are you sure you want to delete this experience?
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#F8FAFC" }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
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
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
              color: "white",
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add experience"
        onClick={() => {
          setEditMode(false);
          setOpen(true);
        }}
        sx={styles.fabButton}
      >
        <AddIcon />
      </Fab>

      <Toaster
        position="top-center"
        toastOptions={toastConfig}
        containerStyle={{
          top: 20,
        }}
        gutter={8}
      />
    </Box>
  );
};

export default ExperienceForm;
