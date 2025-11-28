// Packages
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Components & Services
import { supabase } from "../config/supabase";
import { useThemeMode } from "../contexts/ThemeContext";

const Header = ({ handleDrawerToggle, user }) => {
  const [bioData, setBioData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchBioData();
  }, []);

  const fetchBioData = async () => {
    try {
      const { data: bioInfo, error: bioError } = await supabase
        .from("bio")
        .select("*")
        .single();

      if (bioError) throw bioError;
      setBioData(bioInfo);

      if (bioInfo?.Image) {
        const { data: imageData, error: imageError } = await supabase.storage
          .from("bio-images")
          .download(bioInfo.Image);

        if (imageError) throw imageError;

        const imageUrl = URL.createObjectURL(imageData);
        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching bio:", error);
    }
  };

  // Replace the existing handleLogout function with this optimized version
  const handleLogout = async () => {
    // Start navigation immediately
    navigate("/login");

    // Clean up local state
    setBioData(null);
    setProfileImage(null);

    // Perform logout in the background
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // If logout fails, redirect back to the protected route
        console.error("Error logging out:", error.message);
        navigate("/");
        // Show error toast if you have toast setup
        toast?.error("Logout failed, please try again");
      }
    } catch (error) {
      console.error("Error logging out:", error.message);
      navigate("/");
    }
  };

  const getUserDisplayName = () => {
    if (bioData?.name) {
      return bioData.name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  const getUserAvatar = () => {
    return (
      profileImage ||
      bioData?.Image ||
      user?.user_metadata?.avatar_url ||
      `https://ui-avatars.com/api/?name=${getUserDisplayName()}&background=0D8ABC&color=fff`
    );
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: mode === 'light'
          ? "linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95))"
          : "linear-gradient(to right, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))",
        backdropFilter: "blur(20px)",
        boxShadow: mode === 'light' ? "0 4px 30px rgba(0, 0, 0, 0.03)" : "0 4px 30px rgba(0, 0, 0, 0.5)",
        borderBottom: mode === 'light' ? "1px solid rgba(241, 245, 249, 0.9)" : "1px solid rgba(51, 65, 85, 0.5)",
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64, md: 70 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: { xs: 1, sm: 2 },
            display: { sm: "none" },
            color: "text.primary",
            padding: { xs: 1, sm: 1.5 },
            "&:hover": {
              background: mode === 'light' ? "rgba(30, 41, 59, 0.04)" : "rgba(203, 213, 225, 0.08)",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <MenuIcon sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }} />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            background: mode === 'light'
              ? "linear-gradient(135deg, #0F172A 0%, #334155 100%)"
              : "linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800,
            fontSize: {
              xs: "0.75rem",
              sm: "1.1rem",
              md: "1.35rem",
            },
            letterSpacing: { xs: "-0.01em", sm: "-0.02em" },
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            position: "relative",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -2,
              left: 0,
              width: { xs: "60%", sm: "40%" },
              height: "2px",
              background: mode === 'light'
                ? "linear-gradient(90deg, #0F172A 0%, transparent 100%)"
                : "linear-gradient(90deg, #F8FAFC 0%, transparent 100%)",
              borderRadius: "2px",
            },
          }}
        >
          {/* Remove conditional rendering and show full text */}
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Sandesh Arsud Portfolio Management
          </Box>
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2, md: 3 },
            ml: "auto",
          }}
        >
          {/* Theme Toggle Button */}
          <Tooltip title={mode === 'light' ? 'Dark Mode' : 'Light Mode'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: "text.primary",
                padding: { xs: 1, sm: 1.5 },
                "&:hover": {
                  background: mode === 'light' ? "rgba(30, 41, 59, 0.04)" : "rgba(203, 213, 225, 0.08)",
                  transform: "rotate(180deg) scale(1.1)",
                },
                transition: "all 0.4s ease-in-out",
              }}
            >
              {mode === 'light' ? 
                <DarkModeIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} /> : 
                <LightModeIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
              }
            </IconButton>
          </Tooltip>

          {user && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 2 },
                  background: mode === 'light'
                    ? "linear-gradient(to right, rgba(30, 41, 59, 0.04), rgba(30, 41, 59, 0.02))"
                    : "linear-gradient(to right, rgba(203, 213, 225, 0.08), rgba(203, 213, 225, 0.04))",
                  padding: { xs: "6px 12px", sm: "8px 16px" },
                  borderRadius: { xs: "12px", sm: "16px" },
                  transition: "all 0.3s ease",
                  border: mode === 'light' ? "1px solid rgba(241, 245, 249, 0.9)" : "1px solid rgba(51, 65, 85, 0.5)",
                  "&:hover": {
                    background: mode === 'light'
                      ? "linear-gradient(to right, rgba(30, 41, 59, 0.06), rgba(30, 41, 59, 0.04))"
                      : "linear-gradient(to right, rgba(203, 213, 225, 0.12), rgba(203, 213, 225, 0.08))",
                    transform: "translateY(-1px)",
                    boxShadow: mode === 'light' ? "0 4px 20px rgba(0, 0, 0, 0.03)" : "0 4px 20px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                <Avatar
                  src={getUserAvatar()}
                  alt={getUserDisplayName()}
                  sx={{
                    width: { xs: 32, sm: 38, md: 42 },
                    height: { xs: 32, sm: 38, md: 42 },
                    border: "3px solid white",
                    bgcolor: "#0D8ABC",
                    boxShadow: "0 2px 12px rgba(13,138,188,0.25)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.08) rotate(5deg)",
                      boxShadow: "0 4px 16px rgba(13,138,188,0.35)",
                    },
                  }}
                />
                {!isMobile && (
                  <Box
                    sx={{
                      minWidth: { sm: 80, md: 100 },
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        lineHeight: 1.2,
                        fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
                      }}
                    >
                      {getUserDisplayName()}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                      }}
                    >
                      {bioData?.title || user.email}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Button
                variant="outlined"
                startIcon={!isMobile && <LogoutIcon />}
                onClick={() => {
                  setIsLoggingOut(true);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                sx={{
                  borderColor: mode === 'light' ? "rgba(226, 232, 240, 0.8)" : "rgba(51, 65, 85, 0.8)",
                  color: "text.secondary",
                  borderRadius: { xs: "10px", sm: "12px" },
                  px: { xs: 1.5, sm: 2, md: 3 },
                  py: { xs: 0.75, sm: 1 },
                  backgroundColor: mode === 'light' ? "rgba(255, 255, 255, 0.8)" : "rgba(30, 41, 59, 0.8)",
                  "&:hover": {
                    borderColor: mode === 'light' ? "#CBD5E1" : "#64748B",
                    backgroundColor: mode === 'light' ? "#F8FAFC" : "#334155",
                    transform: "translateY(-2px)",
                    boxShadow: mode === 'light' ? "0 4px 15px rgba(0,0,0,0.05)" : "0 4px 15px rgba(0,0,0,0.3)",
                  },
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  minWidth: { xs: 38, sm: "auto" },
                  height: { xs: 38, sm: 42 },
                  fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                  fontWeight: 500,
                  opacity: isLoggingOut ? 0.7 : 1,
                  cursor: isLoggingOut ? "not-allowed" : "pointer",
                }}
              >
                {isMobile ? (
                  <LogoutIcon sx={{ fontSize: "1.25rem" }} />
                ) : isLoggingOut ? (
                  "Logging out..."
                ) : (
                  "Logout"
                )}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
