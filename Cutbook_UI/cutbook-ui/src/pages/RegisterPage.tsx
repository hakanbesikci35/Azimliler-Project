import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Link as MuiLink, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data));
        if (data.role === 'OWNER') navigate('/dashboard');
        else navigate('/');
      } else {
        alert("Kayıt başarısız, e-posta kullanımda olabilir.");
      }
    } catch (error) {
      alert("Sunucu hatası.");
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 10 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450, borderRadius: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold" textAlign="center" color="primary">CutBook'a Katıl</Typography>
        <form onSubmit={handleRegister}>
          <TextField fullWidth label="E-posta" type="email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField fullWidth label="Şifre" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <FormControl component="fieldset" sx={{ mt: 2, mb: 1, width: '100%' }}>
            <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>Hesap Türü</FormLabel>
            <RadioGroup row value={role} onChange={(e) => setRole(e.target.value)}>
              <FormControlLabel value="CUSTOMER" control={<Radio />} label="Müşteri" />
              <FormControlLabel value="OWNER" control={<Radio />} label="İşletme Sahibi" />
            </RadioGroup>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>Kayıt Ol</Button>
        </form>
        <Box textAlign="center">
          <Typography variant="body2">Zaten bir hesabınız var mı? <MuiLink component={Link} to="/login">Giriş Yapın</MuiLink></Typography>
        </Box>
      </Paper>
    </Box>
  );
};