export interface Business {
  id: string;
  name: string;
  description: string;
  phone?: string;
  address?: string;
  services: any[];
}

export interface Appointment {
  id: string;
  businessId: string;
  customerName: string;
  date: string;
  time: string;
}

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("tr-TR", options);
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}
interface BusinessCardProps {
  business: Business;
}
