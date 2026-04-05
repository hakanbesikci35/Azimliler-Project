import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Alert,
  Table,
  Avatar,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StoreIcon from "@mui/icons-material/Store";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { apiGet, apiPost } from "../utils/api";
import { formatDate } from "../utils/utils";
import { Modal } from "../components/Modal";

interface AppointmentRow {
  id: number;
  customer: { id: number; email: string };
  service: { id: number; name: string; durationMinutes: number };
  startTime: string;
  endTime: string;
  status: "PENDING" | "CANCELLED";
  notes?: string;
}

export const OwnerDashboardPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [serviceName, setServiceName] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [servicePrice, setServicePrice] = useState("");

  const [selectedDays, setSelectedDays] = useState<string[]>(["MON"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  const [calStart, setCalStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1);
    return d.toLocaleDateString("en-CA");
  });
  const [calEnd, setCalEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 7);
    return d.toLocaleDateString("en-CA");
  });
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [apptLoading, setApptLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const showModal = (message: string, success: boolean) => {
    setModalMessage(message);
    setModalSuccess(success);
    setModalOpen(true);
  };

  const fetchMyBusiness = async () => {
    try {
      const allBusinesses = await apiGet<any[]>("/api/businesses");
      const myBiz = allBusinesses.find((b: any) => b.owner.id === user.id);
      if (myBiz) setBusiness(myBiz);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchMyBusiness();
  }, []);

  const fetchAppointments = async () => {
    if (!business) return;
    setApptLoading(true);
    try {
      const data = await apiGet<AppointmentRow[]>(
        `/api/appointments/business/${business.id}?start=${calStart}T00:00:00&end=${calEnd}T23:59:59`,
      );
      setAppointments(data);
    } catch (e: any) {
      showModal(e.message || "Randevular yüklenemedi.", false);
    } finally {
      setApptLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 1 && business) fetchAppointments();
  }, [tab, business, calStart, calEnd]);

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost("/api/businesses", {
        ownerId: user.id,
        name,
        description,
        phone,
        address,
      });
      showModal("İşletmeniz başarıyla oluşturuldu!", true);
      fetchMyBusiness();
    } catch (e: any) {
      showModal(e.message || "Bir hata oluştu.", false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost(`/api/businesses/${business.id}/services`, {
        name: serviceName,
        durationMinutes: parseInt(serviceDuration),
        price: parseFloat(servicePrice),
      });
      showModal("Hizmet başarıyla eklendi!", true);
      setServiceName("");
      setServiceDuration("");
      setServicePrice("");
      fetchMyBusiness();
    } catch (e: any) {
      showModal(e.message || "Bir hata oluştu.", false);
    }
  };

  const handleAddHours = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Promise.all(
        selectedDays.map((day) =>
          apiPost(`/api/working-hours/${business.id}`, {
            dayOfWeek: day,
            startTime: `${startTime}:00`,
            endTime: `${endTime}:00`,
          }),
        ),
      );
      showModal(
        `${selectedDays.length} gün için çalışma saati kaydedildi!`,
        true,
      );
      setSelectedDays(["MON"]);
    } catch (e: any) {
      showModal(e.message || "Bir hata oluştu.", false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#7C3AED" }} />
      </Box>
    );

  if (!business) {
    return (
      <Box sx={{ py: 5, px: 2, maxWidth: 600, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              boxShadow: "0 8px 24px rgba(124,58,237,0.3)",
            }}
          >
            <StoreIcon sx={{ color: "white", fontSize: 36 }} />
          </Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              background: "linear-gradient(135deg, #1A1A2E, #C9A84C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            İşletmenizi Oluşturun
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Müşterileriniz sizi bulsun, randevular otomatik dolsun!
          </Typography>
        </Box>

        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleCreateBusiness}>
            <TextField
              fullWidth
              label="İşletme Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Açıklama"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Telefon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Adres"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5 }}
            >
              İşletmeyi Kaydet 🚀
            </Button>
          </form>
        </Paper>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          icon={
            modalSuccess ? (
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
            ) : (
              <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
            )
          }
        >
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {modalSuccess ? "Başarılı!" : "Hata!"}
          </Typography>
          <Typography color="text.secondary">{modalMessage}</Typography>
        </Modal>
      </Box>
    );
  }

  const colors = ["#7C3AED", "#F59E0B", "#10B981", "#3B82F6"];
  const bizColor = colors[business.name.charCodeAt(0) % colors.length];

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)",
          py: 3,
          px: 4,
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            fontSize: 24,
            fontWeight: 700,
            bgcolor: "rgba(255,255,255,0.2)",
            border: "3px solid rgba(255,255,255,0.4)",
          }}
        >
          {business.name[0].toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={800} color="white">
            {business.name}
          </Typography>
          <Typography color="rgba(255,255,255,0.8)" variant="body2">
            Yönetim Paneli
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
            {business.services?.slice(0, 3).map((s: any) => (
              <Chip
                key={s.id}
                label={s.name}
                size="small"
                sx={{
                  bgcolor: "rgba(201,168,76,0.1)",
                  color: "#8B6914",
                  border: "1px solid rgba(201,168,76,0.3)",
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 4, maxWidth: 1000, mx: "auto" }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 4,
            "& .MuiTab-root": { fontWeight: 600 },
            "& .Mui-selected": { color: "#C9A84C" },
            "& .MuiTabs-indicator": { bgcolor: "#C9A84C" },
          }}
        >
          <Tab label="⚙️ İşletme Ayarları" />
          <Tab label="📅 Randevu Takvimi" />
        </Tabs>

        {/* TAB 0 */}
        {tab === 0 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 4 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <AddCircleOutlineIcon sx={{ color: "#C9A84C" }} />
                  <Typography variant="h6" fontWeight={700}>
                    Hizmet Ekle
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {business.services?.length > 0 && (
                  <Box
                    sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    {business.services.map((s: any) => (
                      <Chip
                        key={s.id}
                        label={`${s.name} • ${s.durationMinutes}dk • ₺${s.price}`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(201,168,76,0.1)",
                          color: "#8B6914",
                          border: "1px solid rgba(201,168,76,0.3)",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Box>
                )}
                <form onSubmit={handleAddService}>
                  <TextField
                    fullWidth
                    label="Hizmet Adı"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Süre (Dakika)"
                    type="number"
                    value={serviceDuration}
                    onChange={(e) => setServiceDuration(e.target.value)}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Fiyat (TL)"
                    type="number"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    margin="normal"
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2, py: 1.2 }}
                  >
                    Hizmet Ekle
                  </Button>
                </form>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 4 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <AccessTimeIcon sx={{ color: "#C9A84C" }} />
                  <Typography variant="h6" fontWeight={700}>
                    Çalışma Saati Ayarla
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <form onSubmit={handleAddHours}>
                  {/* Gün seçimi — tıklanabilir butonlar */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                      gutterBottom
                    >
                      Gün Seçin
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      {[
                        { v: "MON", l: "Pazartesi" },
                        { v: "TUE", l: "Salı" },
                        { v: "WED", l: "Çarşamba" },
                        { v: "THURS", l: "Perşembe" },
                        { v: "FRI", l: "Cuma" },
                        { v: "SAT", l: "Cumartesi" },
                        { v: "SUN", l: "Pazar" },
                      ].map((d) => (
                        <Button
                          key={d.v}
                          variant={
                            selectedDays.includes(d.v)
                              ? "contained"
                              : "outlined"
                          }
                          color={
                            selectedDays.includes(d.v) ? "primary" : "inherit"
                          }
                          size="small"
                          onClick={() => {
                            setSelectedDays((prev) =>
                              prev.includes(d.v)
                                ? prev.filter((x) => x !== d.v)
                                : [...prev, d.v],
                            );
                          }}
                          type="button"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            borderColor: selectedDays.includes(d.v)
                              ? undefined
                              : "rgba(201,168,76,0.3)",
                            color: selectedDays.includes(d.v)
                              ? undefined
                              : "#1A1A2E",
                          }}
                        >
                          {d.l}
                        </Button>
                      ))}
                    </Box>
                  </Box>

                  <TextField
                    fullWidth
                    label="Başlangıç"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Bitiş"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                  />

                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ py: 1.2 }}
                    >
                      Saatleri Kaydet
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      color="error"
                      fullWidth
                      sx={{ py: 1.2 }}
                      onClick={async () => {
                        try {
                          await Promise.all(
                            selectedDays.map((day) =>
                              apiPost(`/api/working-hours/${business.id}`, {
                                dayOfWeek: day,
                                startTime: "00:00:00",
                                endTime: "00:00:00",
                              }),
                            ),
                          );
                          showModal(
                            `${selectedDays.length} gün tatil olarak işaretlendi.`,
                            true,
                          );
                        } catch (e: any) {
                          showModal(e.message || "Bir hata oluştu.", false);
                        }
                      }}
                    >
                      Tatil Günü
                    </Button>
                  </Box>
                </form>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* TAB 1 */}
        {tab === 1 && (
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <CalendarTodayIcon
                sx={{ fontSize: 48, color: "rgba(201,168,76,0.25)", mb: 1 }}
              />
              <Typography variant="h6" fontWeight={700}>
                Randevu Listesi
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 3,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <TextField
                label="Başlangıç"
                type="date"
                value={calStart}
                onChange={(e) => setCalStart(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <TextField
                label="Bitiş"
                type="date"
                value={calEnd}
                onChange={(e) => setCalEnd(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={fetchAppointments}
                sx={{ py: 1 }}
              >
                Listele
              </Button>
            </Box>

            {apptLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#C9A84C" }} />
              </Box>
            ) : appointments.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <CalendarTodayIcon
                  sx={{ fontSize: 48, color: "rgba(124,58,237,0.2)", mb: 1 }}
                />
                <Typography color="text.secondary">
                  Seçilen tarih aralığında randevu bulunamadı.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        "& th": {
                          fontWeight: 700,
                          color: "#C9A84C",
                          borderBottom: "2px solid rgba(201,168,76,0.2)",
                        },
                      }}
                    >
                      <TableCell>Müşteri</TableCell>
                      <TableCell>Hizmet</TableCell>
                      <TableCell>Tarih</TableCell>
                      <TableCell>Saat</TableCell>
                      <TableCell>Durum</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appt) => (
                      <TableRow
                        key={appt.id}
                        hover
                        sx={{ "&:hover": { bgcolor: "rgba(201,168,76,0.04)" } }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                fontSize: 12,
                                bgcolor: "#7C3AED",
                              }}
                            >
                              {appt.customer.email[0].toUpperCase()}
                            </Avatar>
                            <Typography variant="body2">
                              {appt.customer.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {appt.service.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(appt.startTime)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {appt.startTime.substring(11, 16)} –{" "}
                            {appt.endTime.substring(11, 16)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              appt.status === "PENDING" ? "Onaylı" : "İptal"
                            }
                            color={
                              appt.status === "PENDING" ? "success" : "error"
                            }
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}
      </Box>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        icon={
          modalSuccess ? (
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
          ) : (
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
          )
        }
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {modalSuccess ? "Başarılı! 🎉" : "Hata!"}
        </Typography>
        <Typography color="text.secondary">{modalMessage}</Typography>
      </Modal>
    </Box>
  );
};
