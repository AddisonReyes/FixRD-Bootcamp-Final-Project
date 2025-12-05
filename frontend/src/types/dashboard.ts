// Tipos compartidos para el dashboard técnico

export interface Request {
  _id: string;
  clientName: string;
  clientAvatar?: string;
  location: string;
  description: string;
  date: string;
  time?: string;
  status: "pending" | "accepted" | "completed";
  priceRange?: string;
  tag?: "Urgent" | "Standard";
  category?: string;
}

export interface TechnicianProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  certifications: string[];
  isAvailable: boolean;
}

export interface DashboardStats {
  pending: number;
  accepted: number;
  completed: number;
}

export interface NotificationSettings {
  newRequests: boolean;
  messages: boolean;
  reviews: boolean;
}
