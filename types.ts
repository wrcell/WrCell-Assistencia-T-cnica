export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'funcionario';
  company_id: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export enum ServiceStatus {
  PENDING = 'Pendente',
  ANALYSIS = 'Em Análise',
  APPROVED = 'Aprovado',
  REPAIRING = 'Em Reparo',
  COMPLETED = 'Concluído',
  DELIVERED = 'Entregue',
  CANCELLED = 'Cancelado'
}

export interface ServiceOrder {
  id: string;
  client_id: string;
  device: string;
  problem: string;
  status: ServiceStatus;
  budget: number;
  created_at: string;
  client_name?: string; // Hydrated for UI
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface SaleItem {
  product_id: string;
  quantity: number;
  price_at_sale: number;
  name: string;
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
}