import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary" elevation={0} sx={{ borderBottom: '1px solid #ddd' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
            ✂️ CutBook
          </Typography>

          <Box>
            <Button color="inherit" component={Link} to="/">İşletmeler</Button>
            {user ? (
              <>
                {user.role === 'OWNER' && <Button color="inherit" component={Link} to="/dashboard">Yönetim Paneli</Button>}
                <Button color="inherit" onClick={handleLogout} sx={{ ml: 2, border: '1px solid white' }}>Çıkış Yap</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Giriş Yap</Button>
                <Button variant="outlined" color="inherit" sx={{ ml: 1, borderColor: 'white' }} component={Link} to="/register">Kayıt Ol</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};