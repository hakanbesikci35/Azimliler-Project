import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  Container,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { BusinessCard } from "../components/BusinessCard";
import { Business } from "../utils/utils";
import { apiGet } from "../utils/api";

export const HomePage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await apiGet<Business[]>("/api/businesses");
        setBusinesses(data);
      } catch (error) {
        console.error("Veri cekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const filtered = businesses.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          bgcolor: "#1A1A2E",

          py: { xs: 8, md: 12 },
          px: 2,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          mt: -0.5,
        }}
      >
        {/* Dekoratif altın çizgiler */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, #C9A84C, transparent)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, #C9A84C, transparent)",
          }}
        />

        <Typography
          variant="h3"
          color="white"
          gutterBottom
          sx={{ letterSpacing: 2 }}
        >
          ✂️ CUTBOOK
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#C9A84C",
            mb: 1,
            fontWeight: 400,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Premium Randevu Sistemi
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.6)",
            mb: 5,
            maxWidth: 500,
            mx: "auto",
          }}
        >
          En iyi berber ve güzellik salonlarını keşfet, saniyeler içinde
          randevunu oluştur.
        </Typography>

        <TextField
          placeholder="Salon ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#C9A84C" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "100%",
            maxWidth: 520,
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              color: "white",
              "& fieldset": { borderColor: "rgba(201,168,76,0.3)" },
              "&:hover fieldset": { borderColor: "#C9A84C" },
              "&.Mui-focused fieldset": { borderColor: "#C9A84C" },
            },
            "& input::placeholder": { color: "rgba(255,255,255,0.4)" },
          }}
        />
      </Box>

      {/* İşletmeler */}
      <Box sx={{ py: 6, px: 4, bgcolor: "#FFFFFF" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Box
            sx={{ width: 4, height: 32, bgcolor: "#C9A84C", borderRadius: 2 }}
          />
          <Typography variant="h5" fontWeight={700} color="#1A1A2E">
            {search ? `"${search}" için sonuçlar` : "Tüm Salonlar"}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress sx={{ color: "#C9A84C" }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {search
                ? "Arama sonucu bulunamadı."
                : "Henüz kayıtlı işletme bulunmuyor."}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((business) => (
              <Grid key={business.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <BusinessCard business={business} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
