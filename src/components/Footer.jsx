// Packages
import React from 'react';
import { Box, Typography, Link, Container, Stack, Divider, IconButton, Tooltip } from "@mui/material";
import {
  Favorite as FavoriteIcon,
  Code as CodeIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: GitHubIcon, 
      href: "https://github.com/arsudsandesh97", 
      label: "GitHub",
      color: "#0F172A"
    },
    { 
      icon: LinkedInIcon, 
      href: "https://linkedin.com/in/sandesh-arsud", 
      label: "LinkedIn",
      color: "#0A66C2"
    },
    { 
      icon: TwitterIcon, 
      href: "https://twitter.com/sandesharsud", 
      label: "Twitter",
      color: "#1DA1F2"
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        width: "100%",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        borderTop: "1px solid",
        borderColor: "#E2E8F0",
        backdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #3B82F6 50%, transparent 100%)",
          opacity: 0.5,
        },
      }}
    >
      <Container maxWidth={false}>
        <Box
          sx={{
            py: { xs: 3, sm: 4 },
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 2, sm: 3 },
          }}
        >
          {/* Left Section: Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center"
              sx={{
                color: "#64748B",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                  color: "white",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "rotate(360deg) scale(1.1)",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.3)",
                  },
                }}
              >
                <CodeIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "#475569",
                }}
              >
                Built with React & Material-UI
              </Typography>
            </Stack>
          </motion.div>

          {/* Center Section: Made with Love */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#64748B",
                fontWeight: 500,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Made with{" "}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <FavoriteIcon
                  sx={{
                    color: "#EF4444",
                    fontSize: 18,
                    filter: "drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))",
                  }}
                />
              </motion.div>
              by
              <Link
                href="https://github.com/arsudsandesh97"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#0F172A",
                  textDecoration: "none",
                  fontWeight: 700,
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    width: 0,
                    height: "2px",
                    background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                    transition: "width 0.3s ease",
                  },
                  "&:hover": {
                    color: "#3B82F6",
                    "&::after": {
                      width: "100%",
                    },
                  },
                }}
              >
                Sandesh Arsud
              </Link>
            </Typography>
          </motion.div>

          {/* Right Section: Social Links & Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Stack spacing={2} alignItems="center">
              {/* Social Icons */}
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social, index) => (
                  <Tooltip key={index} title={social.label} arrow placement="top">
                    <IconButton
                      component={Link}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        backgroundColor: `${social.color}08`,
                        color: social.color,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          backgroundColor: social.color,
                          color: "white",
                          transform: "translateY(-4px) scale(1.1)",
                          boxShadow: `0 8px 16px ${social.color}40`,
                        },
                      }}
                    >
                      <social.icon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                ))}
              </Stack>

              {/* Copyright */}
              <Typography
                variant="caption"
                sx={{
                  color: "#94A3B8",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.813rem" },
                  letterSpacing: "0.02em",
                }}
              >
                © {currentYear} All rights reserved
              </Typography>
            </Stack>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

