import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Smartphone, 
  Wrench, 
  Calendar, 
  Users, 
  Truck, 
  HardHat, 
  Package, 
  Tag, 
  Layers, 
  ShoppingCart, 
  DollarSign, 
  CreditCard, 
  FileText, 
  BarChart2, 
  Gift, 
  Bell, 
  FileEdit, 
  Building, 
  Lock, 
  Settings, 
  HelpCircle, 
  Info,
  X,
  ChevronDown,
  ChevronRight,
  Database,
  Wallet,
  ShieldCheck,
  LayoutGrid,
  LifeBuoy,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItemProps {
  item: any;
  onClose: () => void;
}

// Subcomponent for handling individual menu items or collapsible groups
const SidebarItem: React.FC<SidebarItemProps> = ({ item, onClose }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasSubItems = item.subItems && item.subItems.length > 0;
  
  // Check if active on mount or location change to auto-expand
  useEffect(() => {
    if (hasSubItems) {
      const isChildActive = item.subItems.some((sub: any) => location.pathname === sub.to);
      if (isChildActive) setIsExpanded(true);
    }
  }, [location.pathname, hasSubItems, item.subItems]);

  if (hasSubItems) {
    const isChildActive = item.subItems.some((sub: any) => location.pathname === sub.to);
    
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
            isChildActive ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <div className="flex items-center">
            <item.icon className={`mr-3 h-5 w-5 transition-colors ${isChildActive ? 'text-accent' : 'text-gray-500 group-hover:text-white'}`} strokeWidth={1.5} />
            <span>{item.label}</span>
          </div>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
          <div className="ml-3 pl-3 border-l border-gray-800 space-y-1 my-1">
            {item.subItems.map((sub: any) => (
              <NavLink
                key={sub.to}
                to={sub.to}
                onClick={() => { if (window.innerWidth < 768) onClose(); }}
                className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-accent bg-accent/5' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                {/* Optional: Add small icons for sub-items or keeping it clean with text only */}
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-50"></span>
                {sub.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Direct Link Item
  return (
    <NavLink
      to={item.to}
      end={item.exact}
      onClick={() => { if (window.innerWidth < 768) onClose(); }}
      className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group mb-1 ${
        isActive 
          ? 'bg-accent/10 text-accent' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      {({ isActive }) => (
        <>
          <item.icon className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-accent' : 'text-gray-500 group-hover:text-white'}`} strokeWidth={1.5} />
          {item.label}
        </>
      )}
    </NavLink>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.profile === 'admin';

  const navItems = [
    // --- PRINCIPAL (Direct Links) ---
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/dashboard/checkin', icon: Smartphone, label: 'Check-in', exact: true },
    { to: '/dashboard/orders', icon: Wrench, label: 'Ordens de Serviço' },
    { to: '/dashboard/schedule', icon: Calendar, label: 'Agendamentos' },

    // --- CADASTROS (Dropdown) ---
    {
      label: 'CADASTROS',
      icon: Database,
      subItems: [
        { to: '/dashboard/clients', label: 'Clientes' },
        { to: '/dashboard/suppliers', label: 'Fornecedores' },
        { to: '/dashboard/technicians', label: 'Técnicos' },
        { to: '/dashboard/stock', label: 'Peças e Produtos' },
        { to: '/dashboard/services', label: 'Serviços' },
        { to: '/dashboard/categories', label: 'Categorias' },
      ]
    },

    // --- FINANCEIRO (Dropdown) ---
    {
      label: 'FINANCEIRO',
      icon: Wallet,
      subItems: [
        { to: '/dashboard/pdv', label: 'PDV (Vendas)' },
        { to: '/dashboard/cash', label: 'Fluxo de Caixa' },
        { to: '/dashboard/expenses', label: 'Despesas' },
        { to: '/dashboard/receivables', label: 'Contas a Receber' },
        { to: '/dashboard/slips', label: 'Gestão de Boletos' },
        { to: '/dashboard/nfe', label: 'Notas Fiscais' },
      ]
    },

    // --- OUTROS (Dropdown) ---
    {
      label: 'OUTROS',
      icon: LayoutGrid,
      subItems: [
        { to: '/dashboard/reports', label: 'Relatórios' },
        { to: '/dashboard/loyalty', label: 'Fidelidade' },
        { to: '/dashboard/content', label: 'Marketing' },
      ]
    },

    // --- ADMINISTRAÇÃO (Dropdown) - ADMIN ONLY ---
    ...(isAdmin ? [{
      label: 'ADMINISTRAÇÃO',
      icon: ShieldCheck,
      subItems: [
        { to: '/dashboard/subscribers', label: 'Assinantes' },
        { to: '/dashboard/admins', label: 'Administradores' },
        { to: '/dashboard/notifications', label: 'Notificações' },
        { to: '/dashboard/content-gen', label: 'Gerador de Conteúdo' },
        { to: '/dashboard/companies', label: 'Empresas' },
        { to: '/dashboard/permissions', label: 'Permissões' },
        { to: '/dashboard/settings', label: 'Configurações' },
      ]
    }] : []),
    
    // --- AJUDA (Dropdown) ---
    {
      label: 'AJUDA',
      icon: LifeBuoy,
      subItems: [
        { to: '/dashboard/faq', label: 'Ajuda & FAQ' },
        { to: '/dashboard/about', label: 'Sobre o Sistema' },
        { to: '/dashboard/terms', label: 'Termos de Uso' },
      ]
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-80 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B0F19] text-white shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none border-r border-gray-800 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header / Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Layers className="text-white" size={24} />
            <span className="text-xl font-bold text-white font-heading tracking-tight">WrCell System</span>
          </Link>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {navItems.map((item: any, idx) => (
               <SidebarItem key={idx} item={item} onClose={onClose} />
            ))}
          </div>
        </nav>
        
        {/* Footer info (optional) */}
        <div className="p-4 border-t border-gray-800 text-xs text-center text-gray-600">
           v1.0.0
        </div>
      </div>
    </>
  );
};