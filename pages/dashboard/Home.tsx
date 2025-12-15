import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Wrench, 
  DollarSign, 
  Box, 
  ArrowRight,
  Gift,
  CheckCircle,
  AlertCircle,
  Bell,
  Smartphone,
  ShoppingCart,
  Users,
  Package,
  BarChart2
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_READY_PICKUP, MOCK_DEBTORS } from '../../services/mockData';

const KPI_CARD = ({ title, value, subtext, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-32 group">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-1 font-heading">{title}</h3>
        <span className="text-2xl font-bold text-gray-900 font-heading">{value}</span>
      </div>
      <div className="text-gray-400 group-hover:text-accent transition-colors">
        <Icon size={24} strokeWidth={1.5} />
      </div>
    </div>
    <p className="text-xs text-gray-400">{subtext}</p>
  </div>
);

const QuickActionCard = ({ to, icon: Icon, label, colorClass }: any) => (
  <Link to={to} className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 min-h-[120px]">
    <div className={`p-4 rounded-full bg-opacity-10 group-hover:scale-110 transition-transform ${colorClass.bg}`}>
      <Icon size={32} className={colorClass.text} strokeWidth={1.5} />
    </div>
    <span className="font-bold text-gray-700 font-heading text-sm text-center">{label}</span>
  </Link>
);

export const DashboardHome: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Visão geral do seu negócio.</p>
        </div>
        <div className="text-sm text-gray-500 hidden sm:block">
           {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Quick Actions - Acesso Rápido */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 font-heading">Acesso Rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           <QuickActionCard 
             to="/dashboard/checkin" 
             icon={Smartphone} 
             label="Check-in" 
             colorClass={{ bg: 'bg-blue-100', text: 'text-blue-600' }} 
           />
           <QuickActionCard 
             to="/dashboard/orders" 
             icon={Wrench} 
             label="Nova OS" 
             colorClass={{ bg: 'bg-orange-100', text: 'text-orange-600' }} 
           />
           <QuickActionCard 
             to="/dashboard/pdv" 
             icon={ShoppingCart} 
             label="Venda (PDV)" 
             colorClass={{ bg: 'bg-green-100', text: 'text-green-600' }} 
           />
           <QuickActionCard 
             to="/dashboard/clients" 
             icon={Users} 
             label="Novo Cliente" 
             colorClass={{ bg: 'bg-purple-100', text: 'text-purple-600' }} 
           />
           <QuickActionCard 
             to="/dashboard/stock" 
             icon={Package} 
             label="Estoque" 
             colorClass={{ bg: 'bg-pink-100', text: 'text-pink-600' }} 
           />
           <QuickActionCard 
             to="/dashboard/reports" 
             icon={BarChart2} 
             label="Relatórios" 
             colorClass={{ bg: 'bg-gray-100', text: 'text-gray-600' }} 
           />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div>
         <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 font-heading">Indicadores</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPI_CARD 
              title="Agendamentos Hoje" 
              value="0" 
              subtext="Compromissos para hoje."
              icon={Calendar} 
            />
            <KPI_CARD 
              title="Ordens de Serviço Abertas" 
              value="3" 
              subtext="OS atualmente em andamento."
              icon={Wrench} 
            />
            <KPI_CARD 
              title="Vendas do Dia" 
              value="R$ 1.250,00" 
              subtext="Vendas totais do PDV."
              icon={DollarSign} 
            />
            <KPI_CARD 
              title="Itens com Estoque Baixo" 
              value="5" 
              subtext="Produtos que precisam de reposição."
              icon={Box} 
            />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-gray-900 font-heading">Últimas Ordens de Serviço</h2>
                <p className="text-xs text-gray-500 mt-1">As 5 OS mais recentes registradas no sistema.</p>
              </div>
              <Link to="/dashboard/orders" className="text-xs font-medium text-accent hover:text-accentHover flex items-center">
                Ver todas <ArrowRight size={12} className="ml-1" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-bold text-gray-400 uppercase font-heading pb-3 pl-2">OS</th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase font-heading pb-3">Cliente</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase font-heading pb-3">Status</th>
                    <th className="text-right text-xs font-bold text-gray-400 uppercase font-heading pb-3 pr-2">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_ORDERS.slice(0, 5).map((os) => (
                    <tr key={os.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4 pl-2 text-sm font-medium text-gray-900">{os.id}</td>
                      <td className="py-4 text-sm text-gray-600">{os.client_name}</td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${os.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {os.status}
                        </span>
                      </td>
                      <td className="py-4 pr-2 text-right text-sm text-gray-500">
                        {new Date(os.created_at).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart Section Placeholder */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 font-heading">Resumo de Ordens de Serviço</h2>
            <p className="text-xs text-gray-500 mb-6">Status das OS nos últimos 30 dias</p>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <span className="text-gray-400 text-sm">Gráfico de Resumo</span>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width) - Widgets */}
        <div className="space-y-6">
          
          {/* Agenda */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-accent" />
                <h3 className="font-bold text-gray-900 text-sm font-heading">Agenda do Dia</h3>
              </div>
              <span className="bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">0</span>
            </div>
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">Nenhum agendamento para hoje.</p>
            </div>
            <div className="border-t border-gray-100 pt-4 mt-2">
               <Link to="/dashboard/schedule" className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center justify-center">
                Ver calendário completo <ArrowRight size={12} className="ml-1" />
              </Link>
            </div>
          </div>

          {/* Aniversariantes */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Gift size={18} className="text-pink-500" />
                <h3 className="font-bold text-gray-900 text-sm font-heading">Aniversariantes</h3>
              </div>
              <span className="bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">0</span>
            </div>
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">Nenhum aniversariante hoje.</p>
            </div>
          </div>

          {/* Aparelhos Prontos */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" />
                <h3 className="font-bold text-gray-900 text-sm font-heading">Prontos para Retirada</h3>
              </div>
              <span className="bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {MOCK_READY_PICKUP.length}
              </span>
            </div>
            <div className="space-y-4">
              {MOCK_READY_PICKUP.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                   <div className="overflow-hidden">
                      <div className="text-sm font-bold text-gray-900 flex items-center truncate font-heading">
                         {item.client_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate">
                         {item.device}
                      </div>
                   </div>
                   <button className="ml-2 p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-accent hover:border-accent transition-colors shadow-sm">
                     <Bell size={14} />
                   </button>
                </div>
              ))}
            </div>
          </div>

          {/* Devedores */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-orange-500" />
                <h3 className="font-bold text-gray-900 text-sm font-heading">Saldo Devedor</h3>
              </div>
              <span className="bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {MOCK_DEBTORS.length}
              </span>
            </div>
            <div className="space-y-4">
               {MOCK_DEBTORS.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                   <div>
                      <div className="text-sm font-bold text-gray-900 flex items-center font-heading">
                         {item.client_name}
                      </div>
                      <div className="text-xs text-red-500 font-bold mt-0.5">
                         R$ {item.amount.toFixed(2).replace('.', ',')}
                      </div>
                   </div>
                   <button className="ml-2 p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-accent hover:border-accent transition-colors shadow-sm">
                     <DollarSign size={14} />
                   </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};