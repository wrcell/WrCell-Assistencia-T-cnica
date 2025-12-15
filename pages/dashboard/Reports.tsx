import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  Wrench, 
  Users, 
  ShoppingBag,
  Calendar,
  Download
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

// Mock Data for Charts
const financialData = [
  { name: 'Jan', receita: 4500, lucro: 2000 },
  { name: 'Fev', receita: 4800, lucro: 2100 },
  { name: 'Mar', receita: 5200, lucro: 2100 },
  { name: 'Abr', receita: 6100, lucro: 2600 },
  { name: 'Mai', receita: 5800, lucro: 2500 },
  { name: 'Jun', receita: 7200, lucro: 3300 },
  { name: 'Jul', receita: 6800, lucro: 3100 },
];

const categoryData = [
  { name: 'Troca de Tela', value: 33, color: '#00C49F' },
  { name: 'Acessórios', value: 25, color: '#FF8042' },
  { name: 'Reparo de Placa', value: 25, color: '#000000' },
  { name: 'Troca de Bateria', value: 17, color: '#FFBB28' },
];

const paymentData = [
  { name: 'PIX', value: 41, color: '#00C49F' },
  { name: 'À vista', value: 32, color: '#FF8042' },
  { name: 'A prazo', value: 22, color: '#000000' },
  { name: 'Fiado', value: 5, color: '#FFBB28' },
];

const topProducts = [
  { name: 'Tela iPhone 13', quantity: 15, revenue: 11985.00 },
  { name: 'Bateria Samsung S21', quantity: 25, revenue: 8747.50 },
  { name: 'Carregador Turbo 20W', quantity: 50, revenue: 4995.00 },
  { name: 'Película de Vidro 3D', quantity: 100, revenue: 2990.00 },
];

// KPI Card Component
const KPICard = ({ title, value, subtext, icon: Icon, trend }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-1 font-heading">{title}</h3>
        <span className="text-2xl font-bold text-gray-900 font-heading">{value}</span>
      </div>
      <div className="text-gray-400 bg-gray-50 p-2 rounded-lg">
        <Icon size={20} strokeWidth={1.5} />
      </div>
    </div>
    <div className="flex items-center gap-2 mt-2">
       {trend && (
         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend > 0 ? '+' : ''}{trend}%
         </span>
       )}
       <p className="text-xs text-gray-400">{subtext}</p>
    </div>
  </div>
);

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('15/11/25 - 15/12/25');

  return (
    <div className="flex flex-col space-y-6 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Relatórios</h1>
          <p className="text-sm text-gray-500 mt-1">Analise o desempenho do seu negócio com dados detalhados.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 shadow-sm cursor-pointer hover:border-gray-300 transition-colors">
           <Calendar size={16} />
           <span>{dateRange}</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard 
          title="Receita Bruta" 
          value="R$ 40.400,00" 
          subtext="vs. mês anterior" 
          trend={20.1}
          icon={DollarSign} 
        />
        <KPICard 
          title="Lucro Bruto" 
          value="R$ 22.200,00" 
          subtext="Receita - Custos" 
          trend={15.4}
          icon={TrendingUp} 
        />
        <KPICard 
          title="Lucro Líquido" 
          value="R$ 17.900,00" 
          subtext="Lucro Bruto - Despesas" 
          trend={12.8}
          icon={Wallet} 
        />
        <KPICard 
          title="OS Concluídas" 
          value="150" 
          subtext="vs. mês anterior" 
          trend={15.2}
          icon={Wrench} 
        />
        <KPICard 
          title="Novos Clientes" 
          value="+42" 
          subtext="vs. mês anterior" 
          trend={15.0}
          icon={Users} 
        />
        <KPICard 
          title="Ticket Médio" 
          value="R$ 269,33" 
          subtext="vs. mês anterior" 
          trend={5.3}
          icon={ShoppingBag} 
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Financial Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
           <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 font-heading">Desempenho Financeiro</h2>
              <p className="text-xs text-gray-500">Visão geral da receita e lucro nos últimos meses.</p>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => `R$ ${value}`} />
                  <Tooltip 
                    cursor={{fill: '#F9FAFB'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                  />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                  <Bar dataKey="receita" name="Receita" fill="#0F172A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lucro" name="Lucro Líquido" fill="#E879F9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
           <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 font-heading">Vendas por Categoria</h2>
              <p className="text-xs text-gray-500">Distribuição da receita por categoria.</p>
           </div>
           <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-2xl font-bold text-gray-900">100%</span>
              </div>
           </div>
           <div className="mt-4 space-y-2">
              {categoryData.map((cat, idx) => (
                 <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{backgroundColor: cat.color}}></div>
                       <span className="text-gray-600">{cat.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{cat.value}%</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Payment Methods Chart */}
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 font-heading">Formas de Pagamento</h2>
              <p className="text-xs text-gray-500">Distribuição da receita por forma de pagamento.</p>
           </div>
           <div className="flex flex-col md:flex-row items-center justify-center h-[250px] gap-8">
              <div className="w-full h-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} stroke="#fff" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 space-y-3">
                  {paymentData.map((pay, idx) => (
                     <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full" style={{backgroundColor: pay.color}}></div>
                           <span className="text-gray-600 font-medium">{pay.name}</span>
                        </div>
                        <span className="font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded">{pay.value}%</span>
                     </div>
                  ))}
              </div>
           </div>
         </div>

         {/* Top Products Table */}
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900 font-heading">Produtos e Serviços Mais Vendidos</h2>
                <p className="text-xs text-gray-500">Itens que mais geraram receita no período selecionado.</p>
              </div>
              <Button size="sm" variant="ghost" className="text-gray-400">
                 <Download size={16} />
              </Button>
           </div>
           
           <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-gray-500 font-heading text-xs uppercase">
                    <tr>
                       <th className="py-2 px-3 font-semibold rounded-l-lg">Produto/Serviço</th>
                       <th className="py-2 px-3 font-semibold text-center">Quantidade</th>
                       <th className="py-2 px-3 font-semibold text-right rounded-r-lg">Receita Gerada</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {topProducts.map((item, idx) => (
                       <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3 font-medium text-gray-900">{item.name}</td>
                          <td className="py-3 px-3 text-center text-gray-600">{item.quantity}</td>
                          <td className="py-3 px-3 text-right font-bold text-gray-900">R$ {item.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
         </div>

      </div>
    </div>
  );
};