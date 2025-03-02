import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Card,
  Fab,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { educationApi } from "../../api/SupabaseData";
import { Toaster, toast } from "react-hot-toast";

// Add these responsive styles to your existing styles object
const styles = {
  gradientText: {
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },

  card: {
    p: { xs: 2, sm: 3 },
    borderRadius: "16px",
    backgroundColor: "white",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(241, 245, 249, 0.1)",
    backdropFilter: "blur(20px)",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    },
    "& .MuiGrid-container": {
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "flex-start", sm: "center" },
      gap: { xs: 2, sm: 3 },
    },
  },

  imageContainer: {
    position: "relative",
    width: { xs: "100%", sm: "100%" },
    minHeight: { xs: 100, sm: 120 },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "#F8FAFC",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
    maxWidth: { xs: 200, sm: "100%" },
    margin: { xs: "0 auto", sm: 0 },
  },

  actionButton: {
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: "12px",
    padding: "8px",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },

  dialogField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      transition: "all 0.2s ease",
      backgroundColor: "#F8FAFC",
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
      minHeight: { xs: "44px", sm: "48px" },
      fontSize: { xs: "0.875rem", sm: "1rem" },
    },
    "& .MuiInputLabel-root": {
      color: "#64748B",
      "&.Mui-focused": {
        color: "#0F172A",
      },
      fontSize: { xs: "0.875rem", sm: "1rem" },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 1,
      color: "#94A3B8",
    },
  },

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

  header: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    p: { xs: 2.5, sm: 4 },
  },

  headerTitle: {
    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
    lineHeight: { xs: 1.3, sm: 1.4 },
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },

  schoolInfo: {
    textAlign: { xs: "center", sm: "left" },
    mb: { xs: 2, sm: 0 },
  },

  actionButtons: {
    justifyContent: { xs: "center", sm: "flex-end" },
    mt: { xs: 2, sm: 0 },
  },
};

// Add new common button styles
const buttonStyles = {
  addButton: {
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    color: "#0F172A",
    fontWeight: 600,
    px: { xs: 2, sm: 3 },
    py: { xs: 1, sm: 1.5 },
    borderRadius: "12px",
    textTransform: "none",
    boxShadow: "0 4px 12px rgba(255,255,255,0.15)",
    "&:hover": {
      background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(255,255,255,0.2)",
    },
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: { xs: "0.875rem", sm: "1rem" },
  },

  dialogButton: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    fontWeight: 600,
    px: 3,
    py: 1.5,
    borderRadius: "12px",
    textTransform: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  deleteButton: {
    background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    color: "white",
    fontWeight: 600,
    px: 3,
    py: 1.5,
    borderRadius: "12px",
    textTransform: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(239,68,68,0.25)",
    },
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// Update Dialog PaperProps
const dialogPaperProps = {
  sx: {
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    overflow: "hidden",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(241, 245, 249, 0.1)",
    width: { xs: "95%", sm: "100%" },
    maxWidth: { xs: "100%", sm: 800 },
    m: { xs: 2, sm: 4 },
  },
};

// Update Dialog title styles
const dialogTitleStyles = {
  background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
  color: "white",
  px: 3,
  py: 2.5,
  "& .MuiTypography-root": {
    fontSize: "1.25rem",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
};

// Update Dialog content styles
const dialogContentStyles = {
  p: 3,
  pt: 4,
  "&.MuiDialogContent-root": {
    paddingTop: "24px !important",
  },
  backgroundColor: "#FFFFFF",
};

// Update Dialog actions styles
const dialogActionsStyles = {
  p: 3,
  backgroundColor: "#F8FAFC",
  borderTop: "1px solid rgba(226, 232, 240, 0.8)",
};

// Update the dialog styles to match ExperienceForm
const dialogStyles = {
  paper: {
    width: { xs: "95%", sm: "100%" },
    maxWidth: { xs: "100%", sm: 800 },
    m: { xs: 2, sm: 4 },
    borderRadius: { xs: 2, sm: 3 },
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    overflow: "hidden",
  },
  content: {
    p: { xs: 2.5, sm: 3 },
    "& .MuiTextField-root": {
      mb: { xs: 2, sm: 2.5 },
    },
  },
  header: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    px: 3,
    py: 2,
  },
  actions: {
    p: 3,
    backgroundColor: "#F8FAFC",
    borderTop: "1px solid rgba(226, 232, 240, 0.8)",
  },
};

const EducationForm = () => {
  const [educations, setEducations] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEducation, setCurrentEducation] = useState({
    school: "",
    degree: "",
    date: "",
    grade: "",
    description: "",
    img: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const commonButtonSx = {
    backgroundColor: "#0F172A",
    "&:hover": { backgroundColor: "#1E293B" },
    borderRadius: 2,
    textTransform: "none",
    px: 3,
    py: 1,
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  useEffect(() => {
    console.log("Current education state:", currentEducation);
  }, [currentEducation]);

  useEffect(() => {
    console.log("Educations array:", educations);
  }, [educations]);

  useEffect(() => {
    console.log("Current educations:", educations);
  }, [educations]);

  // Update the fetchEducations function
  const fetchEducations = async () => {
    try {
      console.log("Fetching educations...");
      const data = await educationApi.fetch();
      console.log("Fetched education data:", data);
      setEducations(data || []);
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Error fetching education data: " + error.message);
    }
  };

  // Update the handleSubmit function
  const handleSubmit = async () => {
    const loadingToast = toast.loading("Saving education entry...");
    try {
      if (
        !currentEducation.school ||
        !currentEducation.degree ||
        !currentEducation.date
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const educationData = {
        school: currentEducation.school.trim(),
        degree: currentEducation.degree.trim(),
        date: currentEducation.date.trim(),
        grade: currentEducation.grade?.trim() || null,
        description: currentEducation.description?.trim() || null,
        img: currentEducation.img?.trim() || null,
      };

      if (editMode && currentEducation.id) {
        educationData.id = currentEducation.id;
        await educationApi.update(educationData);
      } else {
        await educationApi.create(educationData);
      }

      await fetchEducations();
      handleClose();
      toast.dismiss(loadingToast);
      toast.success(
        editMode
          ? "Education updated successfully"
          : "Education added successfully"
      );
    } catch (error) {
      console.error("Error details:", error);
      toast.dismiss(loadingToast);
      toast.error("Error saving education: " + error.message);
    }
  };

  // Update the handleConfirmDelete function
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    const loadingToast = toast.loading("Deleting education entry...");
    try {
      await educationApi.delete(itemToDelete.id);
      await fetchEducations();
      toast.dismiss(loadingToast);
      toast.success("Education deleted successfully");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Error deleting education: ${error.message}`);
    }
  };

  const handleDelete = (education) => {
    setItemToDelete(education);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (education) => {
    setCurrentEducation({
      ...education,
      date: education.date,
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentEducation({
      school: "",
      degree: "",
      date: "",
      grade: "",
      description: "",
      img: "",
    });
  };

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.paper}>
        <Box sx={styles.header}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="h4" sx={styles.headerTitle}>
                Education Details
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#94A3B8",
                  mt: 1,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Manage your educational background
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
              Add Education
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 4 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {educations.map((education) => (
              <Grid item xs={12} key={education.id}>
                <Card sx={styles.card}>
                  <Grid container spacing={0}>
                    {/* Image Section */}
                    <Grid item xs={12} sm={2}>
                      <Box sx={styles.imageContainer}>
                        {education.img ? (
                          <Box
                            component="img"
                            src={education.img}
                            alt={education.school}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              p: 2,
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.1)",
                              },
                            }}
                            onError={(e) => {
                              console.log(
                                "Image load error for:",
                                education.school
                              );
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/100?text=No+Image";
                            }}
                          />
                        ) : (
                          <SchoolIcon sx={{ fontSize: 40, color: "#94A3B8" }} />
                        )}
                      </Box>
                    </Grid>

                    {/* Content Section */}
                    <Grid item xs={12} sm={8}>
                      <Box sx={styles.schoolInfo}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#1E293B",
                            fontWeight: 600,
                            mb: 1,
                            ...styles.schoolInfo,
                          }}
                        >
                          {education.school}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "#475569",
                            fontWeight: 500,
                            mb: 0.5,
                          }}
                        >
                          {education.degree}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ color: "#64748B" }}>
                            {education.date}
                          </Typography>
                          {education.grade && (
                            <>
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: "50%",
                                  backgroundColor: "#CBD5E1",
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ color: "#64748B" }}
                              >
                                Grade: {education.grade}
                              </Typography>
                            </>
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: "#64748B" }}>
                          {education.description}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Actions Section */}
                    <Grid item xs={12} sm={2}>
                      <Box sx={styles.actionButtons}>
                        <IconButton
                          onClick={() => handleEdit(education)}
                          sx={{
                            ...styles.actionButton,
                            color: "#0F172A",
                            "&:hover": {
                              backgroundColor: "#F1F5F9",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(education)}
                          sx={{
                            ...styles.actionButton,
                            color: "#EF4444",
                            "&:hover": {
                              backgroundColor: "#FEE2E2",
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

      {/* Add Fab for mobile */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          position: "fixed",
          bottom: 20,
          right: 20,
        }}
      >
        <Fab
          color="primary"
          aria-label="add education"
          onClick={() => setOpen(true)}
          sx={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* Main Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: dialogStyles.paper,
        }}
      >
        <DialogTitle sx={dialogStyles.header}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {editMode ? "Edit Education" : "Add Education"}
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
                label="School Logo URL"
                value={currentEducation.img || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    img: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
              {currentEducation.img && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <img
                    src={currentEducation.img}
                    alt="School Logo"
                    style={{
                      maxHeight: 200,
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="School Name"
                value={currentEducation.school || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    school: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Degree"
                value={currentEducation.degree || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    degree: e.target.value,
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
                value={currentEducation.date || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    date: e.target.value,
                  })
                }
                helperText="e.g., Apr 2017 - Apr 2021"
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Grade"
                value={currentEducation.grade || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    grade: e.target.value,
                  })
                }
                helperText="e.g., 75.00%"
                sx={styles.dialogField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={currentEducation.description || ""}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    description: e.target.value,
                  })
                }
                sx={styles.dialogField}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={dialogStyles.actions}>
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
            {editMode ? "Save Changes" : "Add Education"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: dialogStyles.paper,
        }}
      >
        <DialogTitle sx={dialogStyles.header}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Delete Education
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

        <DialogContent sx={dialogStyles.content}>
          <Typography>
            Are you sure you want to delete this education?
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={dialogStyles.actions}>
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

export default EducationForm;
