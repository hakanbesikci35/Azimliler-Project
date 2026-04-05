import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { BusinessDetailsPage } from "./pages/BusinessDetailsPage";
import { OwnerDashboardPage } from "./pages/OwnerDashboardPage";
import { MyAppointmentsPage } from "./pages/MyAppointmentsPage";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1A1A2E" },
    secondary: { main: "#C9A84C" },
    background: { default: "#F8F6F0", paper: "#FFFFFF" },
    text: { primary: "#1A1A2E", secondary: "#6B6B6B" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "10px",
          fontWeight: 600,
          padding: "10px 24px",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
          boxShadow: "0 4px 15px rgba(26,26,46,0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #16213E 0%, #0F3460 100%)",
            boxShadow: "0 6px 20px rgba(26,26,46,0.4)",
          },
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #C9A84C 0%, #B8973B 100%)",
          color: "#1A1A2E",
          boxShadow: "0 4px 15px rgba(201,168,76,0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #B8973B 0%, #A3852A 100%)",
            boxShadow: "0 6px 20px rgba(201,168,76,0.45)",
          },
        },
        outlinedPrimary: {
          borderColor: "#1A1A2E",
          color: "#1A1A2E",
          "&:hover": { bgcolor: "rgba(26,26,46,0.05)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
          border: "1px solid rgba(201,168,76,0.12)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "#F8F6F0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/business/:id" element={<BusinessDetailsPage />} />
            <Route path="/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
