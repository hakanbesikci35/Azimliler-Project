import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Business } from "../utils/utils";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#16213E",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 40px rgba(201,168,76,0.2)",
          borderColor: "rgba(201,168,76,0.4)",
        },
      }}
    >
      {/* Altın üst çizgi */}
      <Box
        sx={{
          height: 4,
          background: "linear-gradient(90deg, #1A1A2E, #C9A84C, #1A1A2E)",
        }}
      />

      {/* Header */}
      <Box
        sx={{
          bgcolor: "#1A1A2E",
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 44,
            height: 44,
            fontSize: 18,
            fontWeight: 700,
            bgcolor: "#C9A84C",
            color: "#1A1A2E",
          }}
        >
          {business.name[0].toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="white">
            {business.name}
          </Typography>
          {(business as any).address && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 11, color: "#C9A84C" }} />
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.5)" }}
              >
                {(business as any).address}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2, bgcolor: "#16213E" }}>
        {business.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{ fontSize: "0.85rem" }}
          >
            {business.description}
          </Typography>
        )}
        {(business as any).phone && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}
          >
            <PhoneIcon sx={{ fontSize: 13, color: "#C9A84C" }} />
            <Typography variant="caption" color="text.secondary">
              {(business as any).phone}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {business.services?.slice(0, 3).map((service: any, index: number) => (
            <Chip
              key={index}
              label={typeof service === "object" ? service.name : service}
              size="small"
              icon={<AccessTimeIcon style={{ fontSize: 11 }} />}
              sx={{
                bgcolor: "rgba(201,168,76,0.1)",
                color: "#8B6914",
                border: "1px solid rgba(201,168,76,0.3)",
                fontSize: "0.7rem",
              }}
            />
          ))}
          {business.services?.length > 3 && (
            <Chip
              label={`+${business.services.length - 3}`}
              size="small"
              sx={{ bgcolor: "#f5f5f5", fontSize: "0.7rem" }}
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          to={`/business/${business.id}`}
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ color: "#1A1A2E", fontWeight: 700, letterSpacing: 0.5 }}
        >
          Randevu Al
        </Button>
      </CardActions>
    </Card>
  );
};
