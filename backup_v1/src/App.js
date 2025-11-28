// Packages
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Theme
import { ThemeProvider } from "./contexts/ThemeContext.jsx";

// Services
import { supabase } from "./config/supabase";

// Components
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./Auth/Login.jsx";
import Footer from "./components/Footer.jsx";
import Dashboard from "./components/Dashboard.jsx";

// Forms
import BioForm from "./components/forms/BioForm.jsx";
import EducationForm from "./components/forms/EducationForm.jsx";
import ExperienceForm from "./components/forms/ExperienceForm.jsx";
import ProjectForm from "./components/forms/ProjectForm.jsx";
import SkillForm from "./components/forms/SkillForm.jsx";
import ContactForm from "./components/forms/ContactForm.jsx";
import ImageUploadForm from "./components/forms/ImageUploadForm.jsx";
import StorageForm from "./components/forms/StorageForm.jsx";
import StorageFormS from "./components/forms/StorageFormSupabase.jsx";
import ProjectExplanationForm from "./components/forms/ProjectExplanationForm.jsx";
import BlogPostForm from "./components/forms/BlogPostForm.jsx";

const App = () => {
  const [session, setSession] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const isProduction = process.env.NODE_ENV === "production";
  const basename = "/portfoliomanagement"; // Always use the same basename

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    ///
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (loading) {
    return null;
  }

  if (!session) {
    return (
      <ThemeProvider>
        <CssBaseline />
        <Login />
        <ToastContainer position="bottom-right" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router basename={basename}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />

          <Header handleDrawerToggle={handleDrawerToggle} user={session.user} />

          <Sidebar
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              width: { sm: `calc(100% - ${280}px)` },
              mt: 8,
              backgroundColor: "background.default",
            }}
          >
            <Box sx={{ p: 3, flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/bio" element={<BioForm />} />
                <Route path="/education" element={<EducationForm />} />
                <Route path="/experience" element={<ExperienceForm />} />
                <Route path="/projects" element={<ProjectForm />} />
                <Route path="/skills" element={<SkillForm />} />
                <Route path="/blog-posts" element={<BlogPostForm />} />
                <Route path="/contacts" element={<ContactForm />} />
                <Route path="/image-upload" element={<ImageUploadForm />} />
                <Route path="/storage" element={<StorageForm />} /> 
                <Route path="/storages" element={<StorageFormS />} /> 
                <Route path="/project-explanations" element={<ProjectExplanationForm />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
            <Footer />
          </Box>

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
