import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ContentCutIcon from "@mui/icons-material/ContentCut";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#1A1A2E",
        borderBottom: "none",
        flexShrink: 0,
        borderRadius: 0,
      }}
    >
      <Container maxWidth={false} disableGutters>
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(201,168,76,0.4)",
              }}
            >
              <ContentCutIcon sx={{ color: "#1A1A2E", fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ color: "#C9A84C", letterSpacing: 1 }}
            >
              CUTBOOK
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              component={Link}
              to="/"
              sx={{
                color: "rgba(255,255,255,0.8)",
                fontWeight: 500,
                "&:hover": { color: "#C9A84C" },
              }}
            >
              İşletmeler
            </Button>
            {user ? (
              <>
                {user.role === "OWNER" && (
                  <Button
                    component={Link}
                    to="/dashboard"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: 500,
                      "&:hover": { color: "#C9A84C" },
                    }}
                  >
                    Yönetim Paneli
                  </Button>
                )}
                {user.role === "CUSTOMER" && (
                  <Button
                    component={Link}
                    to="/my-appointments"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: 500,
                      "&:hover": { color: "#C9A84C" },
                    }}
                  >
                    Randevularım
                  </Button>
                )}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}
                >
                  <Chip
                    avatar={
                      <Avatar
                        sx={{
                          bgcolor: "#C9A84C",
                          color: "#1A1A2E",
                          width: 26,
                          height: 26,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {user.email?.[0]?.toUpperCase()}
                      </Avatar>
                    }
                    label={user.role === "OWNER" ? "İşletme Sahibi" : "Müşteri"}
                    size="small"
                    sx={{
                      bgcolor: "rgba(201,168,76,0.15)",
                      color: "#C9A84C",
                      fontWeight: 600,
                      border: "1px solid rgba(201,168,76,0.3)",
                    }}
                  />
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "rgba(201,168,76,0.5)",
                      color: "#C9A84C",
                      "&:hover": {
                        borderColor: "#C9A84C",
                        bgcolor: "rgba(201,168,76,0.1)",
                      },
                    }}
                  >
                    Çıkış
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    "&:hover": { color: "#C9A84C" },
                  }}
                >
                  Giriş Yap
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  sx={{ color: "#1A1A2E", fontWeight: 700 }}
                >
                  Kayıt Ol
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
