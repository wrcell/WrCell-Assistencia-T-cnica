import { User, Product, ServiceOrder, Company, Service, Supplier, Employee, Scheduling, CashRegister, Expense, Installment } from '../types';

// Helper to set a date X days ago
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const MOCK_COMPANY: Company = {
  id: '1',
  name: 'WrCell Assistência',
  socialName: 'WrCell Soluções Tecnológicas LTDA',
  cnpj: '00.000.000/0001-00',
  logoUrl: '',
  primaryColor: '#000000',
  backgroundColor: '#ffffff',
  accentColor: '#007BFF',
  socialNetworks: '{"instagram": "@wrcell"}',
  footer: 'WrCell System - Todos os direitos reservados',
  createdAt: daysAgo(2), // Created 2 days ago (Trial Active)
  plan: 'trial',
  status: 'active',
  landingConfig: {
    heroTitle: 'Venda, conserte e gerencie tudo com inteligência artificial.',
    heroSubtitle: 'App completo para lojas de celular e informática. Organize suas vendas, suporte e manutenção com tecnologia.',
    heroVideoUrl: '',
    heroImageUrl: '',
    useCarousel: false,
    heroOverlayOpacity: 80,
    banners: [
      { id: '1', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d', title: 'Assistência Técnica Especializada', subtitle: 'Consertos rápidos e com garantia.' }
    ],
    featuredVideo: {
      title: 'Veja como nosso sistema funciona',
      description: 'Centralize sua operação com ferramentas inteligentes que economizam seu tempo e impulsionam suas vendas.',
      videoUrl: ''
    },
    showFeatures: true,
    showPlans: true,
    showTestimonials: true
  }
};

export const MOCK_USERS: User[] = [
  {
    id: '1',
    companyId: '1',
    firstName: 'Wellyngton',
    lastName: 'Reis',
    email: 'admin@wrcell.com',
    phone: '(41) 99999-9999',
    profile: 'admin'
  },
  {
    id: '2',
    companyId: '1',
    firstName: 'W7matrix01',
    lastName: 'Reis',
    email: 'w7@cliente.com',
    phone: '(11) 98888-8888',
    profile: 'client',
    points: 1325
  },
  {
    id: '3',
    companyId: '1',
    firstName: 'Maria',
    lastName: 'Oliveira',
    email: 'maria@cliente.com',
    phone: '(21) 97777-7777',
    profile: 'client',
    points: 450
  },
  {
    id: '4',
    companyId: '1',
    firstName: 'José',
    lastName: 'Técnico',
    email: 'jose@wrcell.com',
    phone: '(41) 98888-7777',
    profile: 'employee',
    customPermissions: {
        clients: { view: true, create: true, edit: true, delete: false },
        orders: { view: true, create: true, edit: true, delete: false },
        stock: { view: true, create: false, edit: false, delete: false },
        financial: { view: false, create: false, edit: false, delete: false },
        reports: { view: false, create: false, edit: false, delete: false }
    }
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    companyId: '1',
    userId: '4',
    firstName: 'José',
    lastName: 'Técnico',
    vale: 0,
    despesas: 0,
    permissions: '{"admin": false, "technical": true}'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    companyId: '1', 
    name: 'Película de Vidro 3D', 
    description: 'Película de alta resistência para iPhone',
    price: 20.00, 
    stock: 50, 
    lowStockAlert: 5 
  },
  { 
    id: '2', 
    companyId: '1', 
    name: 'Cabo Lightning Original', 
    description: 'Cabo de 1m certificado Apple',
    price: 80.00, 
    stock: 4, 
    lowStockAlert: 2 
  },
  { 
    id: '3', 
    companyId: '1', 
    name: 'Tela iPhone 11', 
    description: 'Display completo LCD',
    price: 250.00, 
    stock: 3, 
    lowStockAlert: 1 
  },
];

export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    companyId: '1',
    name: 'Troca de Tela',
    description: 'Mão de obra para substituição de frontal',
    price: 100.00, 
    productIds: [],
    employeeIds: ['1']
  },
  {
    id: '2',
    companyId: '1',
    name: 'Formatação',
    description: 'Backup e reinstalação de sistema',
    price: 80.00, 
    productIds: [],
    employeeIds: ['1']
  }
];

export const MOCK_ORDERS: ServiceOrder[] = [
  {
    id: 'OS-001',
    companyId: '1',
    clientId: '2',
    employeeId: '1',
    status: 'Concluído',
    entryDate: '2025-11-05T10:00:00Z',
    exitDate: '2025-11-05T16:00:00Z',
    technicalReport: 'Aparelho: iPhone 11. Defeito: Tela Quebrada. Serviço realizado com sucesso.',
    productIds: ['3', '1'],
    serviceIds: ['1']
  },
  {
    id: 'OS-002',
    companyId: '1',
    clientId: '3',
    employeeId: '1',
    status: 'Pendente',
    entryDate: '2025-11-06T14:30:00Z',
    exitDate: '',
    technicalReport: 'Aparelho: Samsung S20. Defeito: Bateria viciada.',
    productIds: [],
    serviceIds: []
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    companyId: '1',
    fantasyName: 'Distribuidora Tech',
    contactName: 'Carlos',
    email: 'contato@disttech.com',
    phone: '(11) 3333-4444',
    address: 'Rua Santa Ifigênia, 100'
  }
];

export const MOCK_SCHEDULINGS: Scheduling[] = [
  {
    id: '1',
    companyId: '1',
    clientId: '2',
    serviceId: '1',
    employeeId: '1',
    dateTime: '2025-11-10T14:00:00',
    status: 'Agendado'
  }
];

export const MOCK_CASH_REGISTERS: CashRegister[] = [
  {
    id: '1',
    companyId: '1',
    openingDate: '2025-11-05T08:00:00',
    closingDate: '2025-11-05T18:00:00',
    openingBalance: 100.00,
    closingBalance: 1350.00,
    entries: 1250.00,
    exits: 0
  }
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    companyId: '1',
    description: 'Conta de Energia',
    amount: 350.00,
    date: '2025-11-01'
  }
];

export const MOCK_INSTALLMENTS: Installment[] = [
  {
    id: '1',
    companyId: '1',
    clientId: '2',
    clientName: 'João Silva',
    pointOfSaleId: 'POS-001',
    dueDate: '2025-12-05',
    value: 150.00,
    status: 'Pendente'
  }
];

export const MOCK_READY_PICKUP = [
  { id: '1', client_name: 'João Silva', device: 'iPhone 11 - Troca de Tela' },
  { id: '2', client_name: 'Maria Oliveira', device: 'Samsung A51 - Bateria' }
];

export const MOCK_DEBTORS = [
  { id: '1', client_name: 'Pedro Santos', amount: 150.00 },
  { id: '2', client_name: 'Ana Costa', amount: 80.50 }
];