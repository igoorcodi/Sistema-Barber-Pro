
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
  companyCode?: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientAvatar: string;
  barberName: string;
  barberAvatar: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
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

export interface Category {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface Barber extends User {
  specialties: string[];
  rating: number;
  availability: string[];
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

export interface ClientProfile extends User {
  phone: string;
  totalVisits: number;
  totalSpent: number;
  loyaltyPoints: number;
  lifetimePoints: number;
  lastVisit: string;
  memberSince: string;
  preferences: string[];
  history: any[];
  loyaltyHistory: any[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  icon: string;
}

export interface LoyaltyRule {
  id: string;
  name: string;
  type: 'EARNING' | 'BIRTHDAY' | 'REFERRAL' | 'STREAK';
  value: number;
  isActive: boolean;
  description: string;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  multiplier: number;
  benefits: string[];
}
