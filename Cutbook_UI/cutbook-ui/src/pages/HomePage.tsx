import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { BusinessCard } from '../components/BusinessCard';
import { mockBusinesses } from '../utils/utils'; 

export const HomePage: React.FC = () => {
  return (
    <Box sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary.main">
        İşletmeleri Keşfet
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Size en uygun salonu bulun ve hemen randevunuzu oluşturun.
      </Typography>

      <Grid container spacing={4}>
        {mockBusinesses.map((business) => (
          <Grid key={business.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <BusinessCard business={business} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};