import { ServiceOrder, ServiceStatus, Client, Product, FinancialRecord } from '../types';

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'João Silva', phone: '(11) 99999-9999', email: 'joao@email.com' },
  { id: '2', name: 'Maria Oliveira', phone: '(11) 98888-8888', email: 'maria@email.com' },
  { id: '3', name: 'Carlos Souza', phone: '(21) 97777-7777', email: 'carlos@email.com' },
  { id: '4', name: 'Wellyngton Reis', phone: '(41) 99999-9999', email: 'wellyngton@email.com' },
];

export const MOCK_ORDERS: ServiceOrder[] = [
  {
    id: 'OS-001',
    client_id: '4',
    client_name: 'Wellyngton Reis',
    device: 'iPhone 13 Pro',
    problem: 'Troca de Tela',
    status: ServiceStatus.COMPLETED,
    budget: 1200.00,
    created_at: '2025-11-05T10:00:00Z'
  },
  {
    id: 'OS-002',
    client_id: '2',
    client_name: 'Maria Oliveira',
    device: 'Samsung S20',
    problem: 'Bateria',
    status: ServiceStatus.PENDING,
    budget: 200.00,
    created_at: '2025-11-06T14:30:00Z'
  },
  {
    id: 'OS-003',
    client_id: '3',
    client_name: 'Carlos Souza',
    device: 'Xiaomi Note 10',
    problem: 'Conector',
    status: ServiceStatus.APPROVED,
    budget: 150.00,
    created_at: '2025-11-06T09:15:00Z'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Película de Vidro 3D', price: 20.00, stock: 50, category: 'Acessórios' },
  { id: '2', name: 'Cabo Lightning Original', price: 80.00, stock: 4, category: 'Cabos' },
  { id: '3', name: 'Carregador Samsung 25W', price: 120.00, stock: 10, category: 'Carregadores' },
  { id: '4', name: 'Capa Anti-Impacto iPhone 13', price: 45.00, stock: 25, category: 'Capas' },
];

export const MOCK_FINANCE: FinancialRecord[] = [
  { id: '1', type: 'income', amount: 450.00, description: 'Serviço ORD-003', date: '2025-11-04' },
  { id: '2', type: 'income', amount: 80.00, description: 'Venda Cabo Lightning', date: '2025-11-05' },
];

export const MOCK_READY_PICKUP = [
  {
    id: '1',
    os_id: 'OS-001',
    client_name: 'Wellyngton Reis',
    device: 'iPhone 13 Pro',
    location: 'Rua Francisco Molezine 1229 Pérola - PR Cep - 87.540.00'
  }
];

export const MOCK_DEBTORS = [
  {
    id: '1',
    client_name: 'Wellyngton Reis',
    amount: 190.00
  }
];