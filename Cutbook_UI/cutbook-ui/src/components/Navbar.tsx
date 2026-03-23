import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <AppBar position="static" color="primary" elevation={0} sx={{ borderBottom: '1px solid #ddd' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
          >
            ✂️ CutBook
          </Typography>
          
          <Box>
            <Button color="inherit" component={Link} to="/">
              İşletmeler
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Giriş Yap
            </Button>
            <Button variant="outlined" color="inherit" sx={{ ml: 1, borderColor: 'white' }} component={Link} to="/register">
              Kayıt Ol
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};