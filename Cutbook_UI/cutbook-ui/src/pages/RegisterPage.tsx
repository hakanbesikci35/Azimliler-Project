import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link as MuiLink,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
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
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import { Modal } from "../components/Modal";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errorModal, setErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiPost<any>("/api/auth/register", {
        email,
        password,
        role,
      });
      localStorage.setItem("user", JSON.stringify(data));
      if (data.role === "OWNER") navigate("/dashboard");
      else navigate("/");
    } catch (error) {
      setErrorMsg("Kayıt başarısız, e-posta kullanımda olabilir.");
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
      <Box sx={{ width: "100%", maxWidth: 450 }}>
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
            CutBook'a Katıl
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Ücretsiz hesap oluştur
          </Typography>
        </Box>

        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleRegister}>
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
              label="Şifre (min. 6 karakter)"
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

            {/* Hesap Türü */}
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
                gutterBottom
              >
                Hesap Türü
              </Typography>
              <RadioGroup
                row
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <FormControlLabel
                  value="CUSTOMER"
                  control={
                    <Radio
                      sx={{
                        color: "#C9A84C",
                        "&.Mui-checked": { color: "#C9A84C" },
                      }}
                    />
                  }
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <PersonIcon fontSize="small" />
                      <span>Müşteri</span>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="OWNER"
                  control={
                    <Radio
                      sx={{
                        color: "#C9A84C",
                        "&.Mui-checked": { color: "#C9A84C" },
                      }}
                    />
                  }
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <StoreIcon fontSize="small" />
                      <span>İşletme Sahibi</span>
                    </Box>
                  }
                />
              </RadioGroup>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              Kayıt Ol
            </Button>
          </form>
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Zaten hesabınız var mı?{" "}
              <MuiLink
                component={Link}
                to="/login"
                sx={{ color: "#C9A84C", fontWeight: 600 }}
              >
                Giriş Yapın
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
