import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ModalProps } from "../utils/utils";

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  icon,
  actions,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
          minWidth: "350px",
          textAlign: "center",
          position: "relative",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          border: "2px solid",
          borderColor: "grey.300",
          backgroundColor: "grey.50",
          "&:hover": { backgroundColor: "grey.200" },
          padding: "4px",
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {title && (
        <DialogTitle sx={{ pb: 1, fontWeight: "bold" }}>{title}</DialogTitle>
      )}

      <DialogContent
        sx={{
          mt: title ? 0 : 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {icon && <Box sx={{ mb: 2 }}>{icon}</Box>}
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};
