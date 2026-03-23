import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, TextField, Grid, Chip, Divider } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { mockBusinesses } from '../utils/utils'; 
import { Modal } from '../components/Modal'; 

const mockTimeSlots = ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00", "19:00", "20:30"];

export const BusinessDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const business = mockBusinesses.find(b => b.id === id);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!business) {
    return <Typography variant="h5" sx={{ mt: 5, textAlign: 'center' }}>İşletme bulunamadı.</Typography>;
  }


  const getTodayString = () => new Date().toLocaleDateString('en-CA');
  const todayStr = getTodayString();


  const getAvailableSlots = () => {
    if (!selectedDate) return [];

    if (selectedDate > todayStr) return mockTimeSlots;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return mockTimeSlots.filter(time => {
      const [hour, min] = time.split(':').map(Number);
      return hour > currentHour || (hour === currentHour && min > currentMinute);
    });
  };

  const availableSlots = getAvailableSlots();

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/'); 
  };

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
            {business.services.map((service, idx) => (
              <Chip key={idx} label={service} color="secondary" variant="outlined" />
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
              {availableSlots.length > 0 ? (
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
                  Bugün için uygun saat kalmamıştır. Lütfen ileri bir tarih seçin.
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