import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Giriş yapılıyor:", { email, password });
    alert(`Giriş denemesi başarılı!\nE-posta: ${email}`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, mb: 10 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold" textAlign="center" color="primary">
          CutBook'a Giriş Yap
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Randevularınızı yönetmek için hesabınıza erişin.
        </Typography>

        <form onSubmit={handleLogin}>
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Giriş Yap
          </Button>
        </form>

        <Box textAlign="center">
          <Typography variant="body2">
            Hesabınız yok mu?{' '}
            <MuiLink component={Link} to="/register" underline="hover" fontWeight="bold">
              Kayıt Olun
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};