import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Divider,
  CircularProgress,
  Chip,
  Avatar,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Business } from "../utils/utils";
import { Modal } from "../components/Modal";
import { apiGet, apiPost } from "../utils/api";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/tr";

export const BusinessDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDayjs, setSelectedDayjs] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getTodayString = () => new Date().toLocaleDateString("en-CA");
  const todayStr = getTodayString();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const data = await apiGet<Business>(`/api/businesses/${id}`);
        setBusiness(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  useEffect(() => {
    if (!selectedDate || !selectedService) {
      setAvailableSlots([]);
      return;
    }
    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const data = await apiGet<any>(
          `/api/working-hours/${id}/slots?date=${selectedDate}&duration=${selectedService.durationMinutes}`,
        );
        setAvailableSlots(data.availableTimes || []);
      } catch {
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, selectedService, id]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !business || !selectedService) return;
    try {
      const startDateTime = `${selectedDate}T${selectedTime}:00`;
      const [hourStr, minuteStr] = selectedTime.split(":");
      let totalMinutes =
        parseInt(hourStr) * 60 +
        parseInt(minuteStr) +
        selectedService.durationMinutes;
      const endHour = Math.floor(totalMinutes / 60)
        .toString()
        .padStart(2, "0");
      const endMin = (totalMinutes % 60).toString().padStart(2, "0");
      const endDateTime = `${selectedDate}T${endHour}:${endMin}:00`;
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : { id: 1 };
      await apiPost(
        `/api/appointments?customerId=${user.id}&businessId=${business.id}&serviceId=${selectedService.id}&startTime=${startDateTime}&endTime=${endDateTime}`,
      );
      setIsModalOpen(true);
    } catch (error: any) {
      setErrorMessage(error.message || "Bir hata oluştu.");
      setErrorModalOpen(true);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#7C3AED" }} />
      </Box>
    );
  if (!business)
    return (
      <Typography variant="h5" sx={{ mt: 5, textAlign: "center" }}>
        İşletme bulunamadı.
      </Typography>
    );

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)",
          py: 5,
          px: 4,
          mb: 4,
          borderRadius: "0 0 32px 32px",
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Avatar
          sx={{
            width: 72,
            height: 72,
            fontSize: 28,
            fontWeight: 700,
            bgcolor: "rgba(255,255,255,0.2)",
            border: "3px solid rgba(255,255,255,0.4)",
          }}
        >
          {business.name[0].toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={800} color="white">
            {business.name}
          </Typography>
          <Typography color="rgba(255,255,255,0.8)" sx={{ mt: 0.5 }}>
            {business.description}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
            {(business as any).address && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocationOnIcon
                  sx={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}
                />
                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                  {(business as any).address}
                </Typography>
              </Box>
            )}
            {(business as any).phone && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PhoneIcon
                  sx={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}
                />
                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                  {(business as any).phone}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 2, maxWidth: 800, mx: "auto" }}>
        {/* Hizmet Seçimi */}
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
          1. Hizmet Seçin
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {business.services?.map((service: any) => (
            <Grid key={service.id} size={{ xs: 12, sm: 6 }}>
              <Paper
                onClick={() => {
                  setSelectedService(service);
                  setSelectedTime("");
                }}
                sx={{
                  p: 2.5,
                  cursor: "pointer",
                  transition: "0.2s",
                  border:
                    selectedService?.id === service.id
                      ? "2px solid #C9A84C"
                      : "2px solid transparent",
                  bgcolor:
                    selectedService?.id === service.id
                      ? "rgba(201,168,76,0.04)"
                      : "white",
                  "&:hover": {
                    borderColor: "#C9A84C",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  {service.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
                    <Typography variant="body2" color="text.secondary">
                      {service.durationMinutes} dk
                    </Typography>
                  </Box>
                  {service.price && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AttachMoneyIcon
                        sx={{ fontSize: 14, color: "#C9A84C" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ₺{service.price}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tarih Seçimi */}
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
          2. Tarih Seçin
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
          <DatePicker
            label="Randevu Tarihi"
            value={selectedDayjs}
            disabled={!selectedService}
            minDate={dayjs()}
            onChange={(newValue) => {
              setSelectedDayjs(newValue);
              setSelectedDate(newValue ? newValue.format("YYYY-MM-DD") : "");
              setSelectedTime("");
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: {
                  mb: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(201,168,76,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#C9A84C",
                  },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#C9A84C",
                  },
                },
              },
              day: {
                sx: {
                  "&.Mui-selected": {
                    bgcolor: "#1A1A2E",
                    "&:hover": { bgcolor: "#0F3460" },
                  },
                  "&:hover": { bgcolor: "rgba(201,168,76,0.15)" },
                },
              },
              popper: {
                sx: {
                  "& .MuiPaper-root": {
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(201,168,76,0.2)",
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
        {/* <TextField
          label="Randevu Tarihi" type="date"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: todayStr }}
          fullWidth value={selectedDate}
          onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
          disabled={!selectedService}
          sx={{ mb: 4 }}
        /> */}

        {/* Saat Seçimi */}
        {selectedDate && selectedService && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{ mb: 2 }}
            >
              3. Saat Seçin
            </Typography>
            {slotsLoading ? (
              <CircularProgress size={24} sx={{ color: "#C9A84C" }} />
            ) : availableSlots.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {availableSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedTime(time)}
                    sx={{
                      borderRadius: "10px",
                      minWidth: "80px",
                      borderColor:
                        selectedTime === time
                          ? undefined
                          : "rgba(201,168,76,0.4)",
                      color: selectedTime === time ? undefined : "#1A1A2E",
                    }}
                  >
                    {time}
                  </Button>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  p: 3,
                  bgcolor: "rgba(239,68,68,0.05)",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography color="error" variant="body2" fontWeight={600}>
                  Bu tarih için uygun saat bulunmamaktadır.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Özet & Onayla */}
        {selectedService && selectedDate && selectedTime && (
          <Paper
            sx={{
              p: 3,
              mb: 3,
              bgcolor: "rgba(201,168,76,0.04)",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Randevu Özeti
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography color="text.secondary">Hizmet</Typography>
              <Typography fontWeight={600}>{selectedService.name}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography color="text.secondary">Tarih</Typography>
              <Typography fontWeight={600}>{selectedDate}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography color="text.secondary">Saat</Typography>
              <Typography fontWeight={600}>{selectedTime}</Typography>
            </Box>
            {selectedService.price && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary">Ücret</Typography>
                <Typography fontWeight={700} color="#C9A84C">
                  ₺{selectedService.price}
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        <Button
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          disabled={!selectedDate || !selectedTime || !selectedService}
          onClick={handleBooking}
          sx={{ py: 1.8, fontSize: "1.1rem", borderRadius: "14px" }}
        >
          Randevuyu Onayla ✓
        </Button>
      </Box>

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate("/");
        }}
        icon={<CheckCircleOutlineIcon color="success" sx={{ fontSize: 70 }} />}
      >
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Randevunuz Onaylandı! 🎉
        </Typography>
        <Typography color="text.secondary">
          <strong>{business.name}</strong> için <strong>{selectedDate}</strong>{" "}
          tarihinde saat <strong>{selectedTime}</strong>'de randevunuz
          oluşturuldu.
        </Typography>
      </Modal>

      <Modal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        icon={<ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />}
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Randevu Alınamadı!
        </Typography>
        <Typography color="text.secondary">{errorMessage}</Typography>
      </Modal>
    </Box>
  );
};
