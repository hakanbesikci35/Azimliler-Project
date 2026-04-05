import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { apiPost } from "../utils/api";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Modal } from "../components/Modal";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errorModal, setErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiPost<any>("/api/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(data));
      if (data.role === "OWNER") navigate("/dashboard");
      else navigate("/");
    } catch (error) {
      setErrorMsg("Giriş başarısız, bilgilerinizi kontrol edin.");
      setErrorModal(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "18px",
              background: "linear-gradient(135deg, #C9A84C, #F59E0B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              boxShadow: "0 8px 24px rgba(124,58,237,0.3)",
            }}
          >
            <ContentCutIcon sx={{ color: "white", fontSize: 32 }} />
          </Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              background: "linear-gradient(135deg, #C9A84C, #F59E0B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Tekrar Hoşgeldin!
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Hesabına giriş yap
          </Typography>
        </Box>

        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="E-posta"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#C9A84C" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Şifre"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#C9A84C" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      size="small"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Giriş Yap
            </Button>
          </form>
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Hesabınız yok mu?{" "}
              <MuiLink
                component={Link}
                to="/register"
                sx={{ color: "#C9A84C", fontWeight: 600 }}
              >
                Kayıt Olun
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Modal
        open={errorModal}
        onClose={() => setErrorModal(false)}
        icon={<ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />}
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Hata!
        </Typography>
        <Typography color="text.secondary">{errorMsg}</Typography>
      </Modal>
    </Box>
  );
};
