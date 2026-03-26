import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Divider } from '@mui/material';

export const OwnerDashboardPage: React.FC = () => {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Isletme Olusturma State (FR03)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Hizmet Ekleme State (FR11)
  const [serviceName, setServiceName] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [servicePrice, setServicePrice] = useState('');

  // Saat Ekleme State (FR04)
  const [dayOfWeek, setDayOfWeek] = useState('MON');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchMyBusiness = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/businesses');
      const allBusinesses = await res.json();
      const myBiz = allBusinesses.find((b: any) => b.owner.id === user.id);
      if (myBiz) setBusiness(myBiz);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) fetchMyBusiness();
  }, []);

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:8080/api/businesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerId: user.id, name, description, phone, address })
    });
    alert('İşletme başarıyla oluşturuldu!');
    fetchMyBusiness();
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`http://localhost:8080/api/businesses/${business.id}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: serviceName, durationMinutes: parseInt(serviceDuration), price: parseFloat(servicePrice) })
    });
    alert('Hizmet eklendi!');
    fetchMyBusiness();
  };

  const handleAddHours = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`http://localhost:8080/api/working-hours/${business.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayOfWeek, startTime: `${startTime}:00`, endTime: `${endTime}:00` })
    });
    alert('Çalışma saati eklendi!');
  };

  if (loading) return <Typography>Yükleniyor...</Typography>;

  return (
    <Box sx={{ mt: 5, mb: 10 }}>
      <Typography variant="h4" gutterBottom>Yönetim Paneli</Typography>

      {!business ? (
        <Paper sx={{ p: 4, mt: 3 }}>
          <Typography variant="h6" gutterBottom>Henüz Bir İşletmeniz Yok. Hemen Oluşturun!</Typography>
          <form onSubmit={handleCreateBusiness}>
            <TextField fullWidth label="İşletme Adı" value={name} onChange={e => setName(e.target.value)} margin="normal" required />
            <TextField fullWidth label="Açıklama" value={description} onChange={e => setDescription(e.target.value)} margin="normal" />
            <TextField fullWidth label="Telefon" value={phone} onChange={e => setPhone(e.target.value)} margin="normal" />
            <TextField fullWidth label="Adres" value={address} onChange={e => setAddress(e.target.value)} margin="normal" />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>İşletmeyi Kaydet</Button>
          </form>
        </Paper>
      ) : (
        <Grid container spacing={4} sx={{ mt: 1 }}>
          {/* Yeni MUI Grid yapısına göre güncellendi */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>Hizmet Ekle</Typography>
              <Divider sx={{ mb: 2 }} />
              <form onSubmit={handleAddService}>
                <TextField fullWidth label="Hizmet Adı" value={serviceName} onChange={e => setServiceName(e.target.value)} margin="normal" required />
                <TextField fullWidth label="Süre (Dakika)" type="number" value={serviceDuration} onChange={e => setServiceDuration(e.target.value)} margin="normal" required />
                <TextField fullWidth label="Fiyat (TL)" type="number" value={servicePrice} onChange={e => setServicePrice(e.target.value)} margin="normal" required />
                <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2 }}>Hizmet Ekle</Button>
              </form>
            </Paper>
          </Grid>

          {/* Yeni MUI Grid yapısına göre güncellendi */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>Çalışma Saati Ekle</Typography>
              <Divider sx={{ mb: 2 }} />
              <form onSubmit={handleAddHours}>
                <TextField fullWidth select label="Gün (Örn: MON, TUE, WED, THURS, FRI)" value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)} margin="normal" SelectProps={{ native: true }}>
                  {['MON', 'TUE', 'WED', 'THURS', 'FRI', 'SAT', 'SUN'].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </TextField>
                <TextField fullWidth label="Başlangıç (Örn: 09:00)" value={startTime} onChange={e => setStartTime(e.target.value)} margin="normal" required />
                <TextField fullWidth label="Bitiş (Örn: 18:00)" value={endTime} onChange={e => setEndTime(e.target.value)} margin="normal" required />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Saatleri Kaydet</Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};