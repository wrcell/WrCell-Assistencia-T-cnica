
export interface LandingPageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrl: string;
  heroImageUrl: string;
  useCarousel: boolean;
  heroOverlayOpacity: number;
  banners: {
    id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
  }[];
  featuredVideo: {
    title: string;
    description: string;
    videoUrl: string;
  };
  showFeatures: boolean;
  showPlans: boolean;
  showTestimonials: boolean;
}

export interface Company {
  id: string;
  name: string;
  socialName: string;
  cnpj: string;
  logoUrl: string;
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  socialNetworks: string;
  footer: string;
  phone?: string;
  address?: string;
  landingConfig?: LandingPageConfig;
  
  // Subscription Fields
  createdAt: string; // ISO Date
  plan: 'trial' | 'basic' | 'pro' | 'annual';
  status: 'active' | 'blocked' | 'expired';
  subscriptionEndsAt?: string;
}

export interface PermissionRule {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface UserPermissions {
  clients: PermissionRule;
  orders: PermissionRule;
  stock: PermissionRule;
  financial: PermissionRule;
  reports: PermissionRule;
}

export interface PixKey {
  id: string;
  type: string; // 'CPF', 'CNPJ', 'Email', 'Telefone', 'Aleatoria'
  key: string;
}

export interface BankAccount {
  id: string;
  bank: string;
  agency: string;
  account: string;
  holder: string;
}

export interface User {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profile: string; // 'admin', 'employee', 'client'
  points?: number; // Loyalty program points
  // Extended permission object for detailed control
  customPermissions?: UserPermissions; 
}

export interface Employee {
  id: string;
  companyId: string;
  userId: string;
  firstName: string;
  lastName: string;
  vale: number;
  despesas: number;
  permissions: string; // Legacy JSON string, keeping for backward compatibility
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  description: string;
  stock: number;
  lowStockAlert: number;
  price: number;
}

export interface Service {
  id: string;
  companyId: string;
  name: string;
  description: string;
  price: number;
  productIds: string[];
  employeeIds: string[];
}

export interface ServiceOrder {
  id: string;
  companyId: string;
  clientId: string;
  employeeId: string;
  status: string;
  entryDate: string;
  exitDate: string;
  technicalReport: string;
  productIds: string[];
  serviceIds: string[];
}

export interface Scheduling {
  id: string;
  companyId: string;
  clientId: string;
  serviceId?: string; // Made optional
  title?: string;     // Added for custom event titles
  notes?: string;     // Added for observations
  employeeId: string;
  dateTime: string;
  status: string;
}

export interface PointOfSale {
  id: string;
  companyId: string;
  clientId: string;
  productIds: string[];
  serviceIds: string[];
  paymentMethod: string;
  totalAmount: number;
  transactionDate: string;
}

export interface CashRegister {
  id: string;
  companyId: string;
  openingDate: string;
  closingDate: string;
  openingBalance: number;
  closingBalance: number;
  entries: number;
  exits: number;
}

export interface Expense {
  id: string;
  companyId: string;
  description: string;
  amount: number;
  date: string;
}

export interface Supplier {
  id: string;
  companyId: string;
  fantasyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export interface Installment {
  id: string;
  companyId: string;
  clientId: string;
  clientName: string;
  pointOfSaleId: string;
  dueDate: string;
  value: number;
  status: string;
}

export interface Banner {
  id: string;
  companyId: string;
  imageUrl: string;
  linkUrl: string;
}