
import { UserRole, Service, Barber, Product, Barbershop, Category, ClientProfile, Reward, LoyaltyRule, LoyaltyTier } from './types';

export const MOCK_LOYALTY_RULES: LoyaltyRule[] = [
  { id: 'lr1', type: 'EARNING', name: 'Conversão Padrão', value: 1, isActive: true, description: '1 ponto ganho para cada R$ 1,00 gasto em serviços.' },
  { id: 'lr2', type: 'BIRTHDAY', name: 'Bônus de Aniversário', value: 50, isActive: true, description: 'Pontos fixos creditados no dia do aniversário do cliente.' },
  { id: 'lr3', type: 'REFERRAL', name: 'Indicação Premiada', value: 30, isActive: false, description: 'Pontos ganhos quando um novo cliente indicado realiza o primeiro serviço.' },
];

export const MOCK_LOYALTY_TIERS: LoyaltyTier[] = [
  { id: 't1', name: 'Bronze', minPoints: 0, multiplier: 1, benefits: ['Participação no programa'] },
  { id: 't2', name: 'Silver', minPoints: 500, multiplier: 1.1, benefits: ['1.1x pontos ganhos', 'Acesso antecipado a agenda'] },
  { id: 't3', name: 'Gold', minPoints: 1000, multiplier: 1.25, benefits: ['1.25x pontos ganhos', 'Lata de bebida grátis no serviço'] },
  { id: 't4', name: 'Platinum', minPoints: 2000, multiplier: 1.5, benefits: ['1.5x pontos ganhos', 'Corte de cabelo anual grátis'] },
];

export const MOCK_REWARDS: Reward[] = [
  { id: 'r1', name: 'Corte de Cabelo Grátis', pointsRequired: 500, description: 'Qualquer estilo de corte por nossa conta.', icon: 'Scissors' },
  { id: 'r2', name: 'Barba Completa', pointsRequired: 300, description: 'Tratamento completo com toalha quente.', icon: 'User' },
  { id: 'r3', name: '10% de Desconto em Produtos', pointsRequired: 150, description: 'Válido para qualquer pomada ou shampoo.', icon: 'Package' },
  { id: 'r4', name: 'Lavagem Especial', pointsRequired: 100, description: 'Lavagem com massagem capilar mentolada.', icon: 'Zap' },
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
    preferences: ['Corte degradê navalhado', 'Café expresso', 'Shampoo mentolado'],
    history: [
      { id: 'h1', date: '2024-10-15', service: 'Corte de Cabelo', barberName: 'Henrique Silva', price: 50, status: 'COMPLETED' },
      { id: 'h2', date: '2024-09-20', service: 'Combo (Cabelo + Barba)', barberName: 'Henrique Silva', price: 75, status: 'COMPLETED' }
    ],
    loyaltyHistory: [
      { id: 'l1', date: '2024-10-15', description: 'Pontos ganhos: Corte de Cabelo', points: 50, type: 'EARN' },
      { id: 'l2', date: '2024-09-20', description: 'Pontos ganhos: Combo', points: 75, type: 'EARN' },
      { id: 'l3', date: '2024-08-05', description: 'Resgate: Pomada Matte', points: -150, type: 'REDEEM' },
    ]
  },
  {
    id: 'c2',
    name: 'Marcus Vinicius',
    email: 'marcus.v@email.com',
    phone: '(11) 91234-5678',
    role: UserRole.CLIENT,
    avatar: 'https://picsum.photos/seed/c2/200',
    status: 'ACTIVE',
    totalVisits: 8,
    totalSpent: 420,
    loyaltyPoints: 45,
    lifetimePoints: 450,
    lastVisit: '2024-10-12',
    memberSince: '2023-05-22',
    preferences: ['Apenas tesoura no topo', 'Cerveja gelada'],
    history: [
      { id: 'h3', date: '2024-10-12', service: 'Barba Completa', barberName: 'Carlos Santos', price: 35, status: 'COMPLETED' }
    ],
    loyaltyHistory: []
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
    availability: ['09:00', '10:00', '11:00', '14:00', '15:00']
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

export const MOCK_CATEGORIES: Category[] = [{ id: 'cat1', name: 'Pomadas' }];
export const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    name: 'Pomada Modeladora', 
    costPrice: 22.50,
    price: 45, 
    stock: 15, 
    minStock: 5, 
    categoryId: 'cat1' 
  }
];
