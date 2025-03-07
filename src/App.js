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

// Services
import { supabase } from "./Config/supabase";

// Components
import Header from "./Components/Header.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import Login from "./Auth/Login.jsx";
import Footer from "./Components/Footer.jsx";

// Forms
import BioForm from "./Components/Forms/BioForm.jsx";
import EducationForm from "./Components/Forms/EducationForm.jsx";
import ExperienceForm from "./Components/Forms/ExperienceForm.jsx";
import ProjectForm from "./Components/Forms/ProjectForm.jsx";
import SkillForm from "./Components/Forms/SkillForm.jsx";
import ContactForm from "./Components/Forms/ContactForm.jsx";
import ImageUploadForm from "./Components/Forms/ImageUploadForm.jsx";
import StorageForm from "./Components/Forms/StorageForm.jsx";
import StorageFormS from "./Components/Forms/StorageFormSupabase.jsx";

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
      <>
        <Login />
        <ToastContainer position="bottom-right" />
      </>
    );
  }

  return (
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
            backgroundColor: "#F8FAFC",
          }}
        >
          <Box sx={{ p: 3, flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/bio" replace />} />
              <Route path="/bio" element={<BioForm />} />
              <Route path="/education" element={<EducationForm />} />
              <Route path="/experience" element={<ExperienceForm />} />
              <Route path="/projects" element={<ProjectForm />} />
              <Route path="/skills" element={<SkillForm />} />
              <Route path="/contacts" element={<ContactForm />} />
              <Route path="/image-upload" element={<ImageUploadForm />} />
              <Route path="/storage" element={<StorageForm />} />{" "}
              <Route path="/storages" element={<StorageFormS />} />{" "}
              <Route path="*" element={<Navigate to="/bio" replace />} />
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
  );
};

export default App;
