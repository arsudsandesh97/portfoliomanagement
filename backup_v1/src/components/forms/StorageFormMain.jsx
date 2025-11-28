// Packages
import React, { useState } from "react";
import {
  Box,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from "@mui/material";
import {
  Cloud as CloudIcon,
  Storage as StorageIcon,
} from "@mui/icons-material";

// Components & Services
import StorageForm from "./StorageForm";
import StorageFormS from "./StorageFormSupabase";

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
    p: { xs: 2, sm: 3 },
  },

  header: {
    mb: 3,
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "stretch", sm: "center" },
    justifyContent: "space-between",
    gap: 2,
  },

  title: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    color: "#1E293B",
  },

  toggleContainer: {
    display: "flex",
    justifyContent: { xs: "stretch", sm: "flex-end" },
  },

  toggleButton: {
    flex: { xs: 1, sm: "none" },
    p: 1.5,
    border: "2px solid #E2E8F0",
    borderRadius: "12px !important",
    "&.Mui-selected": {
      backgroundColor: "#1E293B",
      color: "white",
      "&:hover": {
        backgroundColor: "#0F172A",
      },
    },
    "&:hover": {
      backgroundColor: "#F1F5F9",
    },
  },

  buttonContent: {
    display: "flex",
    flexDirection: { xs: "row", md: "column" },
    alignItems: "center",
    gap: 1,
  },

  icon: {
    fontSize: { xs: "1.25rem", md: "2rem" },
  },

  label: {
    fontSize: { xs: "0.875rem", md: "1rem" },
    fontWeight: 500,
  },
};

const StorageMain = () => {
  const [storageType, setStorageType] = useState("supabase");

  const handleStorageChange = (event, newValue) => {
    if (newValue !== null) {
      setStorageType(newValue);
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Box sx={styles.title}>
          <StorageIcon sx={{ fontSize: "2rem" }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Storage Management
          </Typography>
        </Box>

        <Box sx={styles.toggleContainer}>
          <Paper
            elevation={0}
            sx={{ borderRadius: "12px", overflow: "hidden" }}
          >
            <ToggleButtonGroup
              value={storageType}
              exclusive
              onChange={handleStorageChange}
              aria-label="storage type"
              sx={{
                gap: 1,
                p: 0.5,
                backgroundColor: "#F8FAFC",
                "& .MuiToggleButtonGroup-grouped": {
                  border: "none",
                  "&:not(:first-of-type)": {
                    borderRadius: "12px",
                  },
                  "&:first-of-type": {
                    borderRadius: "12px",
                  },
                },
              }}
            >
              <ToggleButton value="supabase" sx={styles.toggleButton}>
                <Box sx={styles.buttonContent}>
                  <CloudIcon sx={styles.icon} />
                  <Typography sx={styles.label}>Supabase Storage</Typography>
                </Box>
              </ToggleButton>
              <ToggleButton value="firebase" sx={styles.toggleButton}>
                <Box sx={styles.buttonContent}>
                  <StorageIcon sx={styles.icon} />
                  <Typography sx={styles.label}>Firebase Storage</Typography>
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
        </Box>
      </Box>

      {/* Render the appropriate storage component based on selection */}
      <Box
        sx={{
          opacity: 0,
          animation: "fadeIn 0.3s ease-out forwards",
          "@keyframes fadeIn": {
            "0%": { opacity: 0, transform: "translateY(10px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {storageType === "supabase" ? <StorageFormS /> : <StorageForm />}
      </Box>
    </Box>
  );
};

export default StorageMain;
