import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import { Link } from 'react-router-dom'; 
import { Business } from '../utils/utils';

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { boxShadow: 4 } }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" fontWeight="bold">
          {business.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {business.description}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {business.services.map((service, index) => (
            <Chip key={index} label={service} size="small" variant="outlined" color="primary" />
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          component={Link} 
          to={`/business/${business.id}`} 
          variant="contained" 
          fullWidth 
          color="primary"
        >
          Randevu Al
        </Button>
      </CardActions>
    </Card>
  );
};