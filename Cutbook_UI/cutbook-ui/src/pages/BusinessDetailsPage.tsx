import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, TextField, Grid, Chip, Divider, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Business } from '../utils/utils';
import { Modal } from '../components/Modal';

export const BusinessDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTodayString = () => new Date().toLocaleDateString('en-CA');
  const todayStr = getTodayString();

  // Isletme detaylarini getir
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/businesses/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBusiness(data);
        }
      } catch (error) {
        console.error("Isletme detaylari cekilemedi", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  // Secilen tarihe gore bos saatleri hesaplat ve getir
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }
    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/working-hours/${id}/slots?date=${selectedDate}&duration=60`);
        if (response.ok) {
          const data = await response.json();
          setAvailableSlots(data.availableTimes || []);
        } else {
          setAvailableSlots([]);
        }
      } catch (error) {
        console.error("Slotlar cekilemedi", error);
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, id]);

  // Randevu kaydetme istegi gonder
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !business) return;

    try {
        const startDateTime = `${selectedDate}T${selectedTime}:00`;
        const endHour = String(parseInt(selectedTime.split(':')[0]) + 1).padStart(2, '0');
        const endDateTime = `${selectedDate}T${endHour}:${selectedTime.split(':')[1]}:00`;

        const response = await fetch(`http://localhost:8080/api/appointments?customerId=1&businessId=${business.id}&serviceId=1&startTime=${startDateTime}&endTime=${endDateTime}`, {
            method: 'POST'
        });

        if (response.ok) {
            setIsModalOpen(true);
        } else {
            const errorData = await response.json();
            alert(`Randevu alınamadı: ${errorData.error}`);
        }
    } catch (error) {
        console.error("Randevu kaydedilemedi", error);
        alert("Bir hata oluştu.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!business) return <Typography variant="h5" sx={{ mt: 5, textAlign: 'center' }}>İşletme bulunamadı.</Typography>;

  return (
    <Box sx={{ mt: 5, mb: 10, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 800, borderRadius: 3 }}>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            {business.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {business.description}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {business.services && business.services.map((service: any, idx: number) => (
              <Chip key={idx} label={service.name || service} color="secondary" variant="outlined" />
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Tarih ve Saat Seçin
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Randevu Tarihi"
            type="date"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: todayStr }}
            fullWidth
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime('');
            }}
          />

          {selectedDate && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Uygun Saatler
              </Typography>
              {slotsLoading ? (
                  <CircularProgress size={24} />
              ) : availableSlots.length > 0 ? (
                <Grid container spacing={2}>
                  {availableSlots.map((time) => (
                    // 'item' parametresi kaldirildi
                    <Grid key={time}>
                      <Button
                        variant={selectedTime === time ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setSelectedTime(time)}
                        sx={{ borderRadius: 8, minWidth: '80px' }}
                      >
                        {time}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="error" variant="body2">
                  Bu tarih için uygun saat bulunmamaktadır.
                </Typography>
              )}
            </Box>
          )}

          <Button
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            disabled={!selectedDate || !selectedTime}
            onClick={handleBooking}
            sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
          >
            Randevuyu Onayla
          </Button>
        </Box>
      </Paper>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        icon={<CheckCircleOutlineIcon color="success" sx={{ fontSize: 70 }} />}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Randevunuz Onaylandı!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>{business.name}</strong> için <strong>{selectedDate}</strong> tarihinde saat <strong>{selectedTime}</strong> slotuna randevunuz başarıyla oluşturulmuştur.
        </Typography>
      </Modal>

    </Box>
  );
};