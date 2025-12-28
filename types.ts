
export enum UserRole {
  CLIENT = 'CLIENT',
  BARBER = 'BARBER',
  RECEPTIONIST = 'RECEPTIONIST',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  email?: string;
}

export interface LoyaltyRule {
  id: string;
  type: 'EARNING' | 'BIRTHDAY' | 'REFERRAL' | 'STREAK';
  name: string;
  value: number; // ex: 1 ponto por real, ou 50 pontos fixos
  isActive: boolean;
  description: string;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  multiplier: number; // Multiplicador de pontos para este nível
  benefits: string[];
}

export interface Reward {
  id: string;
  name: string;
  pointsRequired: number;
  description: string;
  icon: string;
}

export interface LoyaltyTransaction {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'EARN' | 'REDEEM';
}

export interface AppointmentHistory {
  id: string;
  date: string;
  service: string;
  barberName: string;
  price: number;
  status: 'COMPLETED' | 'CANCELLED';
}

export interface ClientProfile extends User {
  phone: string;
  totalVisits: number;
  totalSpent: number;
  loyaltyPoints: number;
  lifetimePoints: number;
  lastVisit: string;
  memberSince: string;
  preferences: string[];
  history: AppointmentHistory[];
  loyaltyHistory: LoyaltyTransaction[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Barbershop {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  image: string;
  isOpen: boolean;
  distance: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description?: string;
  deletedAt?: string; // Timestamp para exclusão programada
}

export interface Barber extends User {
  specialties: string[];
  rating: number;
  availability: string[]; // e.g., ["09:00", "10:00", ...]
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NOSHOW';
}

export interface StockTransaction {
  id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  costPrice: number;
  price: number;
  stock: number;
  minStock: number;
  categoryId?: string;
  description?: string;
  transactions?: StockTransaction[];
}
