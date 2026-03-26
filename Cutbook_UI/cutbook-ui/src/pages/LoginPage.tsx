import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data));
        if (data.role === 'OWNER') navigate('/dashboard');
        else navigate('/');
      } else {
        alert("Giriş başarısız, bilgilerinizi kontrol edin.");
      }
    } catch (error) {
      alert("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, mb: 10 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold" textAlign="center" color="primary">
          CutBook'a Giriş Yap
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField fullWidth label="E-posta" type="email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField fullWidth label="Şifre" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>Giriş Yap</Button>
        </form>
        <Box textAlign="center">
          <Typography variant="body2">Hesabınız yok mu? <MuiLink component={Link} to="/register">Kayıt Olun</MuiLink></Typography>
        </Box>
      </Paper>
    </Box>
  );
};