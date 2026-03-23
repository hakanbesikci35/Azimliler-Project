
export interface Business {
  id: string;
  name: string;
  description: string;
  services: string[];
}

export interface Appointment {
  id: string;
  businessId: string;
  customerName: string;
  date: string; 
  time: string; 
}


export const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Makas Beyi Berber Salonu",
    description: "Modern ve klasik saç kesiminde uzman kadro.",
    services: ["Saç Kesimi", "Sakal Tıraşı", "Cilt Bakımı"],
  },
  {
    id: "2",
    name: "Güzellik Vadisi",
    description: "Kendinizi özel hissedeceğiniz kişisel bakım merkezi.",
    services: ["Saç Boyama", "Manikür & Pedikür", "Makyaj"],
  }
];


export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('tr-TR', options);
};
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;       
  children: React.ReactNode;     
  icon?: React.ReactNode;        
  actions?: React.ReactNode;     
}