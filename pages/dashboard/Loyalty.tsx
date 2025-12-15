import React, { useState, useRef, useEffect } from 'react';
import { MOCK_USERS } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { 
  Award, 
  MoreHorizontal, 
  PlusCircle, 
  MinusCircle, 
  MessageCircle, 
  Save,
  Search
} from 'lucide-react';

// Extended type for display
interface LoyaltyClient {
  id: string;
  name: string;
  totalSpent: number;
  points: number;
}

export const Loyalty: React.FC = () => {
  const [conversionRate, setConversionRate] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Ref for clicking outside the dropdown
  const menuRef = useRef<HTMLDivElement>(null);

  // Mocking data based on MOCK_USERS and the screenshot logic (1 point = 1 BRL initially)
  const [clients, setClients] = useState<LoyaltyClient[]>(
    MOCK_USERS
      .filter(u => u.profile === 'client' || u.points) // Filter clients or users with points
      .map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        points: u.points || 0,
        totalSpent: (u.points || 0) * 1 // Assuming historic 1:1 for the mock data display
      }))
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveRules = () => {
    alert(`Regras salvas!\nAgora R$ 1,00 gasto equivale a ${conversionRate} ponto(s).`);
  };

  const handleAction = (action: 'add' | 'redeem' | 'notify', clientId: string) => {
    setActiveMenuId(null);
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (action === 'add') {
      const amount = prompt(`Quantos pontos adicionar para ${client.name}?`);
      if (amount) {
        const points = parseInt(amount);
        setClients(clients.map(c => c.id === clientId ? { ...c, points: c.points + points } : c));
      }
    } else if (action === 'redeem') {
      const amount = prompt(`Quantos pontos resgatar de ${client.name}? (Saldo: ${client.points})`);
      if (amount) {
        const points = parseInt(amount);
        if (points > client.points) return alert("Saldo insuficiente.");
        setClients(clients.map(c => c.id === clientId ? { ...c, points: c.points - points } : c));
      }
    } else if (action === 'notify') {
      alert(`Notificação enviada para ${client.name} via WhatsApp com saldo de ${client.points} pontos.`);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6 font-sans pb-10" onClick={() => { if(activeMenuId) setActiveMenuId(null); }}>
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
          <Award className="text-gray-900" size={24} />
          Programa de Fidelidade
        </h1>
        <p className="text-sm text-gray-500 mt-1">Recompense seus clientes e incentive a recorrência.</p>
      </div>

      {/* Rules Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 font-heading mb-1">Regras do Programa</h2>
        <p className="text-sm text-gray-500 mb-6">Defina a conversão de gastos em pontos e de pontos em descontos.</p>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span>R$ 1,00 gasto =</span>
            <input 
              type="number" 
              min="1"
              className="w-16 p-2 border border-gray-200 rounded-lg text-center outline-none focus:ring-2 focus:ring-gray-900 font-bold"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
            />
            <span>ponto(s)</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
             <span>10 pontos = <span className="font-bold text-gray-900">R$ {((10 / conversionRate) * 0.1).toFixed(2)} de desconto</span></span>
             <span className="text-xs text-gray-400">(Estimado)</span>
          </div>

          <Button className="bg-[#0B0F19] text-white ml-auto" onClick={handleSaveRules}>
            Salvar Regras
          </Button>
        </div>
      </div>

      {/* Clients Panel */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <h2 className="text-lg font-bold text-gray-900 font-heading">Painel de Fidelidade</h2>
              <p className="text-sm text-gray-500 mt-1">Gerencie os pontos dos seus clientes.</p>
           </div>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar cliente..." 
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 font-heading text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Total Gasto</th>
                <th className="px-6 py-4 font-semibold">Pontos Acumulados</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">R$ {client.totalSpent.toFixed(2).replace('.', ',')}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                      {client.points}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === client.id ? null : client.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuId === client.id && (
                      <div 
                        ref={menuRef}
                        className="absolute right-8 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-fade-in overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          onClick={() => handleAction('add', client.id)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50"
                        >
                          <PlusCircle size={16} className="text-gray-500" /> Adicionar Pontos
                        </button>
                        <button 
                          onClick={() => handleAction('redeem', client.id)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50"
                        >
                          <MinusCircle size={16} className="text-gray-500" /> Resgatar Pontos
                        </button>
                        <button 
                          onClick={() => handleAction('notify', client.id)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <MessageCircle size={16} className="text-gray-500" /> Notificar Saldo
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};