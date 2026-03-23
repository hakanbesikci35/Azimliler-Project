// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Link as MuiLink, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { Link } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); 

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Kayıt oluşturuluyor:", { name, email, password, role });
    alert(`Kayıt başarılı!\nHoş geldin, ${name} (${role === 'customer' ? 'Müşteri' : 'İşletme Sahibi'})`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 10 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450, borderRadius: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold" textAlign="center" color="primary">
          CutBook'a Katıl
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Hemen hesabınızı oluşturun ve kolayca randevu alın veya yönetin.
        </Typography>

        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Ad Soyad / İşletme Adı"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="E-posta Adresi"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Şifre"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <FormControl component="fieldset" sx={{ mt: 2, mb: 1, width: '100%' }}>
            <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>Hesap Türü</FormLabel>
            <RadioGroup
              row
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <FormControlLabel value="customer" control={<Radio />} label="Müşteri" />
              <FormControlLabel value="business" control={<Radio />} label="İşletme Sahibi" />
            </RadioGroup>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Kayıt Ol
          </Button>
        </form>

        <Box textAlign="center">
          <Typography variant="body2">
            Zaten bir hesabınız var mı?{' '}
            <MuiLink component={Link} to="/login" underline="hover" fontWeight="bold">
              Giriş Yapın
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};