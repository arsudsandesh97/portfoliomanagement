import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Fab,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { contactsApi } from "../../api/SupabaseData";
import { Toaster, toast } from "react-hot-toast";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    p: { xs: 2, sm: 3 },
    width: "100%",
  },

  paper: {
    borderRadius: { xs: 2, sm: 4 },
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  gradientHeader: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    p: { xs: 2.5, sm: 4 },
  },

  headerText: {
    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },

  addButton: {
    display: { xs: "none", sm: "flex" },
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    color: "#0F172A",
    fontWeight: 600,
    px: { xs: 2, sm: 3 },
    py: { xs: 1, sm: 1.5 },
    borderRadius: 2,
    textTransform: "none",
    boxShadow: "0 4px 12px rgba(255,255,255,0.15)",
    "&:hover": {
      background: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(255,255,255,0.2)",
    },
    transition: "all 0.2s ease-in-out",
  },

  // Mobile-specific fab button
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

  tableContainer: {
    overflowX: "auto",
    "& .MuiTable-root": {
      minWidth: { xs: "100%", sm: 800 },
    },
  },

  tableHeader: {
    display: { xs: "none", sm: "table-row" },
    background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)",
    "& .MuiTableCell-head": {
      color: "#1E293B",
      fontWeight: 600,
      fontSize: { xs: "0.813rem", sm: "0.875rem" },
      whiteSpace: "nowrap",
    },
  },

  // Mobile card style for table rows
  mobileCard: {
    display: { xs: "block", sm: "none" },
    p: 2,
    mb: 2,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "grey.200",
    "&:hover": {
      backgroundColor: "#F8FAFC",
    },
  },

  messageCell: {
    maxWidth: { xs: "200px", sm: "300px" },
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

// Add mobile-optimized dialog styles
const dialogStyles = {
  paper: {
    width: { xs: "95%", sm: "100%" },
    maxWidth: { xs: "100%", sm: 600 },
    m: { xs: 2, sm: 4 },
    borderRadius: { xs: 2, sm: 3 },
  },
  content: {
    p: { xs: 2, sm: 3 },
    "& .MuiTextField-root": {
      mb: { xs: 2, sm: 2.5 },
    },
  },
};

const ContactForm = () => {
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentContact, setCurrentContact] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await contactsApi.fetch();
      console.log("Fetched contacts:", data); // For debugging
      setContacts(data || []);
    } catch (error) {
      console.error("Error details:", error); // For debugging
      toast.error("Error fetching contacts: " + error.message);
    }
  };

  const handleSubmit = async () => {
    const loadingToast = toast.loading("Saving contact...");
    try {
      if (!currentContact.name || !currentContact.email) {
        toast.error("Name and email are required");
        return;
      }

      if (editMode) {
        await contactsApi.update(currentContact);
      } else {
        await contactsApi.create(currentContact);
      }

      await fetchContacts();
      setOpen(false);
      resetForm();
      toast.dismiss(loadingToast);
      toast.success(
        editMode
          ? "Contact updated successfully!"
          : "Contact added successfully!"
      );
    } catch (error) {
      console.error("Error details:", error); // For debugging
      toast.dismiss(loadingToast);
      toast.error("Error saving contact: " + error.message);
    }
  };

  const handleEdit = (contact) => {
    setCurrentContact(contact);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting contact...");
    try {
      await contactsApi.delete(itemToDelete.id);
      await fetchContacts();
      setDeleteDialogOpen(false);
      toast.dismiss(loadingToast);
      toast.success("Contact deleted successfully!");
    } catch (error) {
      console.error("Error details:", error); // For debugging
      toast.dismiss(loadingToast);
      toast.error("Error deleting contact: " + error.message);
    }
  };

  const resetForm = () => {
    setCurrentContact({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setEditMode(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.paper}>
        <Box sx={styles.gradientHeader}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4" sx={styles.headerText}>
                Contact Management
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", mt: 1 }}>
                Manage incoming contact messages
              </Typography>
            </Box>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => {
                resetForm();
                setOpen(true);
              }}
              sx={styles.addButton}
            >
              Add Contact
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Desktop Table */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <TableContainer sx={styles.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow sx={styles.tableHeader}>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((contact) => (
                      <TableRow key={contact.id} sx={styles.tableRow}>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <EmailIcon
                              sx={{ fontSize: 18, color: "#64748B" }}
                            />
                            {contact.email}
                          </Box>
                        </TableCell>
                        <TableCell>{contact.subject}</TableCell>
                        <TableCell sx={styles.messageCell}>
                          {contact.message}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <AccessTimeIcon
                                sx={{ fontSize: 16, color: "#64748B" }}
                              />
                              {formatDateTime(contact.created_at).date}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDateTime(contact.created_at).time}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleEdit(contact)}
                            sx={{
                              color: "#64748B",
                              "&:hover": { color: "#1E293B" },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setItemToDelete(contact);
                              setDeleteDialogOpen(true);
                            }}
                            sx={{
                              color: "#EF4444",
                              "&:hover": { color: "#DC2626" },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile Card View */}
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            {contacts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contact) => (
                <Paper key={contact.id} sx={styles.mobileCard}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      {contact.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "text.secondary",
                      }}
                    >
                      <EmailIcon sx={{ fontSize: 16 }} />
                      {contact.email}
                    </Typography>
                  </Box>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {contact.subject}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {contact.message}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      pt: 1,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(contact.created_at).date}
                      <br />
                      {formatDateTime(contact.created_at).time}
                    </Typography>

                    <Box>
                      <IconButton
                        onClick={() => handleEdit(contact)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setItemToDelete(contact);
                          setDeleteDialogOpen(true);
                        }}
                        size="small"
                        sx={{ color: "#EF4444" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
          </Box>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={contacts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>

      {/* Contact Form Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
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
              {editMode ? "Edit Contact" : "Add Contact"}
            </Typography>
            <IconButton
              onClick={() => setOpen(false)}
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
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={currentContact.name}
              onChange={(e) =>
                setCurrentContact({ ...currentContact, name: e.target.value })
              }
              sx={styles.dialogField}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={currentContact.email}
              onChange={(e) =>
                setCurrentContact({ ...currentContact, email: e.target.value })
              }
              sx={styles.dialogField}
            />
            <TextField
              fullWidth
              label="Subject"
              value={currentContact.subject}
              onChange={(e) =>
                setCurrentContact({
                  ...currentContact,
                  subject: e.target.value,
                })
              }
              sx={styles.dialogField}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={currentContact.message}
              onChange={(e) =>
                setCurrentContact({
                  ...currentContact,
                  message: e.target.value,
                })
              }
              sx={styles.dialogField}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#F8FAFC" }}>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            sx={styles.cancelButton}
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
            {editMode ? "Save Changes" : "Add Contact"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: dialogStyles.paper,
        }}
      >
        <DialogTitle sx={styles.dialogHeader}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DeleteIcon sx={{ color: "#EF4444" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Delete Contact
              </Typography>
            </Box>
            <IconButton
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {itemToDelete && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2, color: "#1E293B" }}>
                Are you sure you want to delete the contact from{" "}
                <Box component="span" sx={{ fontWeight: 600 }}>
                  {itemToDelete.name}
                </Box>
                ?
              </Typography>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: "rgba(239, 68, 68, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DeleteIcon sx={{ color: "#EF4444" }} />
                </Box>
                <Typography variant="body2" sx={{ color: "#EF4444" }}>
                  This action cannot be undone. The contact will be permanently
                  removed.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            backgroundColor: "#F8FAFC",
            borderTop: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              color: "#64748B",
              borderColor: "#E2E8F0",
              "&:hover": {
                borderColor: "#CBD5E1",
                backgroundColor: "#F1F5F9",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(239,68,68,0.25)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Delete Contact
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

      {/* Mobile-specific FAB button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
        sx={styles.fabButton}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ContactForm;
