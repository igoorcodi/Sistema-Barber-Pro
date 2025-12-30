
import { UserRole, Service, Barber, Product, Barbershop, Category, ClientProfile, Reward, LoyaltyRule, LoyaltyTier } from './types';

export const TAKEN_COMPANY_CODES = ['BARBER-MASTER-01', 'ESTILO-VIRTUAL', 'DOM-BARBAREIRO'];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Pomadas' },
  { id: 'cat2', name: 'Shampoos' },
  { id: 'cat3', name: 'Insumos' }
];

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    name: 'Pomada Modeladora Matte', 
    costPrice: 22.50,
    price: 45.00, 
    stock: 15, 
    minStock: 5, 
    categoryId: 'cat1' 
  },
  { 
    id: 'p2', 
    name: 'Shampoo Anticaspa', 
    costPrice: 18.00,
    price: 38.00, 
    stock: 8, 
    minStock: 3, 
    categoryId: 'cat2' 
  }
];

export const MOCK_BARBERS: Barber[] = [
  { 
    id: 'b1', 
    name: 'Henrique Silva', 
    role: UserRole.BARBER, 
    specialties: ['Degradê', 'Clássico'], 
    rating: 4.9, 
    avatar: 'https://picsum.photos/seed/h1/200',
    availability: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    companyCode: 'BARBER-MASTER-01'
  }
];

export const MOCK_SHOPS: Barbershop[] = [
  {
    id: 's1',
    name: 'BarberMaster Pro - Unidade Central',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    city: 'São Paulo',
    state: 'SP',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800',
    isOpen: true,
    distance: '1.2 km'
  }
];

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Corte de Cabelo', price: 50, duration: 30, description: 'Corte clássico ou moderno.' },
  { id: '2', name: 'Barba Completa', price: 35, duration: 25, description: 'Alinhamento e hidratação.' },
];

export const MOCK_CLIENTS: ClientProfile[] = [
  {
    id: 'c1',
    name: 'Gabriel Almeida',
    email: 'gabriel.almeida@email.com',
    phone: '(11) 98765-4321',
    role: UserRole.CLIENT,
    avatar: 'https://picsum.photos/seed/c1/200',
    status: 'ACTIVE',
    totalVisits: 14,
    totalSpent: 850,
    loyaltyPoints: 350,
    lifetimePoints: 1250,
    lastVisit: '2024-10-15',
    memberSince: '2023-01-10',
    preferences: ['Degradê', 'Café'],
    history: [],
    loyaltyHistory: [
      { id: 'lh1', description: 'Corte de Cabelo', points: 50, date: '2024-10-15' },
      { id: 'lh2', description: 'Resgate: Pomada', points: -200, date: '2024-10-01' }
    ]
  }
];

// Add missing mock rewards
export const MOCK_REWARDS: Reward[] = [
  { id: 'r1', name: 'Corte Grátis', description: 'Resgate um corte de cabelo completo.', pointsRequired: 500, icon: 'Scissors' },
  { id: 'r2', name: 'Barba Grátis', description: 'Aparar e alinhar a barba.', pointsRequired: 300, icon: 'User' },
  { id: 'r3', name: 'Pomada Modeladora', description: 'Escolha qualquer pomada do estoque.', pointsRequired: 200, icon: 'Package' },
];

// Add missing mock loyalty rules
export const MOCK_LOYALTY_RULES: LoyaltyRule[] = [
  { id: 'rule1', name: 'Gasto em Serviço', type: 'EARNING', value: 1, isActive: true, description: 'Ganha 1 ponto para cada real gasto.' },
  { id: 'rule2', name: 'Aniversário', type: 'BIRTHDAY', value: 50, isActive: true, description: 'Bônus de 50 pontos no dia do seu aniversário.' },
];

// Add missing mock loyalty tiers
export const MOCK_LOYALTY_TIERS: LoyaltyTier[] = [
  { id: 't1', name: 'Bronze', minPoints: 0, multiplier: 1, benefits: ['Participação em sorteios mensais'] },
  { id: 't2', name: 'Silver', minPoints: 500, multiplier: 1.1, benefits: ['10% de desconto em produtos', 'Participação em sorteios mensais'] },
  { id: 't3', name: 'Gold', minPoints: 1000, multiplier: 1.25, benefits: ['Prioridade na agenda', 'Bebida cortesia', '15% de desconto em produtos'] },
  { id: 't4', name: 'Platinum', minPoints: 2000, multiplier: 1.5, benefits: ['Um serviço grátis por mês', 'Atendimento VIP', '20% de desconto em produtos'] },
];
