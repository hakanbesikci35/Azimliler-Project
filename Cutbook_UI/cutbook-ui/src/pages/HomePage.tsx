import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box, CircularProgress } from '@mui/material';
import { BusinessCard } from '../components/BusinessCard';
import { Business } from '../utils/utils';

export const HomePage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // Backend'den gercek isletme verilerini cek
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/businesses");
        const data = await response.json();
        setBusinesses(data);
      } catch (error) {
        console.error("Veri cekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  return (
    <Box sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary.main">
        İşletmeleri Keşfet
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Size en uygun salonu bulun ve hemen randevunuzu oluşturun.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : businesses.length === 0 ? (
        <Typography variant="h6" color="text.secondary">Sistemde henüz kayıtlı işletme bulunmuyor.</Typography>
      ) : (
        <Grid container spacing={4}>
          {businesses.map((business) => (
            // Yeni MUI Grid yapisina gore 'size' parametresi kullanildi
            <Grid key={business.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <BusinessCard business={business} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};