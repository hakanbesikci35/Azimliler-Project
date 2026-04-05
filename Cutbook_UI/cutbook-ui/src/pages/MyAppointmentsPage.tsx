import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Divider,
  Alert,
  Avatar,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StoreIcon from "@mui/icons-material/Store";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { apiGet, apiPut } from "../utils/api";
import { formatDate } from "../utils/utils";
import { Modal } from "../components/Modal";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: number;
  business: { id: number; name: string };
  service: { id: number; name: string; durationMinutes: number };
  startTime: string;
  endTime: string;
  status: "PENDING" | "CANCELLED";
  notes?: string;
}

export const MyAppointmentsPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [past, setPast] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"confirm" | "success" | "error">(
    "success",
  );
  const [modalMessage, setModalMessage] = useState("");
  const [pendingCancelId, setPendingCancelId] = useState<number | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchAppointments = async () => {
    try {
      const [upcomingData, pastData] = await Promise.all([
        apiGet<Appointment[]>(`/api/appointments/customer/${user.id}/upcoming`),
        apiGet<Appointment[]>(`/api/appointments/customer/${user.id}/past`),
      ]);
      setUpcoming(upcomingData);
      setPast(pastData);
    } catch (e: any) {
      setError(e.message || "Randevular yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchAppointments();
  }, []);

  const handleCancel = (appointmentId: number) => {
    setPendingCancelId(appointmentId);
    setModalMessage("Bu randevuyu iptal etmek istediğinize emin misiniz?");
    setModalType("confirm");
    setModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!pendingCancelId) return;
    setModalOpen(false);
    setCancellingId(pendingCancelId);
    try {
      await apiPut(
        `/api/appointments/${pendingCancelId}/cancel?customerId=${user.id}`,
      );
      await fetchAppointments();
      setModalMessage("Randevunuz başarıyla iptal edildi.");
      setModalType("success");
      setModalOpen(true);
    } catch (e: any) {
      setModalMessage(`İptal başarısız: ${e.message}`);
      setModalType("error");
      setModalOpen(true);
    } finally {
      setCancellingId(null);
      setPendingCancelId(null);
    }
  };

  const AppointmentCard: React.FC<{
    appt: Appointment;
    showCancel?: boolean;
  }> = ({ appt, showCancel }) => {
    const colors = ["#7C3AED", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];
    const color = colors[appt.business.name.charCodeAt(0) % colors.length];

    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 2,
          border: "1px solid rgba(124,58,237,0.08)",
          transition: "0.2s",
          "&:hover": { boxShadow: "0 4px 20px rgba(124,58,237,0.1)" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <Avatar
              sx={{
                bgcolor: "rgba(201,168,76,0.15)",
                color: "#C9A84C",
                width: 48,
                height: 48,
                fontWeight: 700,
              }}
            >
              {appt.business.name[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {appt.business.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {appt.service.name} — {appt.service.durationMinutes} dk
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 14, color: "#1A1A2E" }} />
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(appt.startTime)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 14, color: "#F59E0B" }} />
                  <Typography variant="body2" fontWeight={500}>
                    {appt.startTime.substring(11, 16)} –{" "}
                    {appt.endTime.substring(11, 16)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 1,
            }}
          >
            <Chip
              label={appt.status === "PENDING" ? "Onaylı" : "İptal Edildi"}
              color={appt.status === "PENDING" ? "success" : "error"}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            {showCancel && appt.status === "PENDING" && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleCancel(appt.id)}
                disabled={cancellingId === appt.id}
                sx={{ borderRadius: "8px" }}
              >
                {cancellingId === appt.id ? (
                  <CircularProgress size={16} />
                ) : (
                  "İptal Et"
                )}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    );
  };

  if (!user?.id) {
    return (
      <Box sx={{ mt: 5 }}>
        <Modal
          open={true}
          onClose={() => navigate("/login")}
          icon={<WarningAmberIcon color="warning" sx={{ fontSize: 60 }} />}
          actions={
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
            >
              Giriş Yap
            </Button>
          }
        >
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Giriş Gerekli
          </Typography>
          <Typography color="text.secondary">
            Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.
          </Typography>
        </Modal>
      </Box>
    );
  }

  const pendingUpcoming = upcoming.filter((a) => a.status === "PENDING");
  const cancelledUpcoming = upcoming.filter((a) => a.status === "CANCELLED");

  return (
    <Box sx={{ py: 5, px: 2, maxWidth: 800, mx: "auto" }}>
      {/* Başlık */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            background: "linear-gradient(135deg, #1A1A2E, #C9A84C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Randevularım
        </Typography>
        <Typography color="text.secondary">
          Tüm randevularınızı buradan takip edebilirsiniz.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3,
          "& .MuiTab-root": { fontWeight: 600 },
          "& .Mui-selected": { color: "#C9A84C" },
          "& .MuiTabs-indicator": { bgcolor: "#C9A84C" },
        }}
      >
        <Tab label={`Yaklaşan (${pendingUpcoming.length})`} />
        <Tab label={`Geçmiş (${past.length})`} />
        <Tab label={`İptal Edilenler (${cancelledUpcoming.length})`} />
      </Tabs>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress sx={{ color: "#C9A84C" }} />
        </Box>
      ) : tab === 0 ? (
        pendingUpcoming.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <EventBusyIcon
              sx={{ fontSize: 60, color: "rgba(201,168,76,0.25)", mb: 2 }}
            />
            <Typography color="text.secondary" fontWeight={500}>
              Yaklaşan randevunuz bulunmuyor.
            </Typography>
          </Box>
        ) : (
          pendingUpcoming.map((appt) => (
            <AppointmentCard key={appt.id} appt={appt} showCancel />
          ))
        )
      ) : tab === 1 ? (
        past.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <EventBusyIcon
              sx={{ fontSize: 60, color: "rgba(124,58,237,0.2)", mb: 2 }}
            />
            <Typography color="text.secondary" fontWeight={500}>
              Geçmiş randevunuz bulunmuyor.
            </Typography>
          </Box>
        ) : (
          past.map((appt) => <AppointmentCard key={appt.id} appt={appt} />)
        )
      ) : cancelledUpcoming.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <EventBusyIcon
            sx={{ fontSize: 60, color: "rgba(124,58,237,0.2)", mb: 2 }}
          />
          <Typography color="text.secondary" fontWeight={500}>
            İptal edilmiş randevunuz bulunmuyor.
          </Typography>
        </Box>
      ) : (
        cancelledUpcoming.map((appt) => (
          <AppointmentCard key={appt.id} appt={appt} />
        ))
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        icon={
          modalType === "success" ? (
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
          ) : modalType === "error" ? (
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
          ) : (
            <WarningAmberIcon color="warning" sx={{ fontSize: 60 }} />
          )
        }
        actions={
          modalType === "confirm" ? (
            <>
              <Button
                variant="outlined"
                onClick={() => setModalOpen(false)}
                sx={{ borderRadius: "10px" }}
              >
                Vazgeç
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={confirmCancel}
                sx={{ borderRadius: "10px" }}
              >
                İptal Et
              </Button>
            </>
          ) : undefined
        }
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {modalType === "success"
            ? "Başarılı!"
            : modalType === "error"
              ? "Hata!"
              : "Emin misiniz?"}
        </Typography>
        <Typography color="text.secondary">{modalMessage}</Typography>
      </Modal>
    </Box>
  );
};
