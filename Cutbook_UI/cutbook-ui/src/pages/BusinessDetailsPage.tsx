import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, TextField, Grid, Divider, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Business } from '../utils/utils';
import { Modal } from '../components/Modal';

export const BusinessDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTodayString = () => new Date().toLocaleDateString('en-CA');
  const todayStr = getTodayString();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/businesses/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBusiness(data);
        }
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
        const response = await fetch(`http://localhost:8080/api/working-hours/${id}/slots?date=${selectedDate}&duration=${selectedService.durationMinutes}`);
        if (response.ok) {
          const data = await response.json();
          setAvailableSlots(data.availableTimes || []);
        } else {
          setAvailableSlots([]);
        }
      } catch (error) {
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
        const [hourStr, minuteStr] = selectedTime.split(':');
        let totalMinutes = parseInt(hourStr) * 60 + parseInt(minuteStr) + selectedService.durationMinutes;
        const endHour = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
        const endMin = (totalMinutes % 60).toString().padStart(2, '0');
        const endDateTime = `${selectedDate}T${endHour}:${endMin}:00`;

        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : { id: 1 };

        const response = await fetch(`http://localhost:8080/api/appointments?customerId=${user.id}&businessId=${business.id}&serviceId=${selectedService.id}&startTime=${startDateTime}&endTime=${endDateTime}`, {
            method: 'POST'
        });

        if (response.ok) {
            setIsModalOpen(true);
        } else {
            const errorData = await response.json();
            alert(`Randevu alınamadı: ${errorData.error}`);
        }
    } catch (error) {
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
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          1. Hizmet Seçin
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {business.services && business.services.map((service: any) => (
            <Grid key={service.id} size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={selectedService?.id === service.id ? 4 : 1}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: selectedService?.id === service.id ? '2px solid #2c3e50' : '2px solid transparent',
                  borderRadius: 2
                }}
                onClick={() => {
                  setSelectedService(service);
                  setSelectedTime('');
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">{service.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ⏱ {service.durationMinutes} Dakika | ₺ {service.price}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          2. Tarih ve Saat Seçin
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
            disabled={!selectedService}
          />

          {selectedDate && selectedService && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Uygun Saatler
              </Typography>
              {slotsLoading ? (
                  <CircularProgress size={24} />
              ) : availableSlots.length > 0 ? (
                <Grid container spacing={2}>
                  {availableSlots.map((time) => (
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
            disabled={!selectedDate || !selectedTime || !selectedService}
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