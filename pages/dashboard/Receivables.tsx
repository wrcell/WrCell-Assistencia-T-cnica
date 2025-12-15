import React, { useState } from 'react';
import { MOCK_INSTALLMENTS, MOCK_USERS } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  User, 
  FileText,
  AlertCircle,
  Trash2,
  Edit,
  X
} from 'lucide-react';
import { Installment } from '../../types';

export const Receivables: React.FC = () => {
  const [installments, setInstallments] = useState<Installment[]>(MOCK_INSTALLMENTS);
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(installments[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    clientId: '',
    description: '',
    value: '',
    dueDate: new Date().toISOString().split('T')[0]
  });

  // Handlers
  const handleOpenModal = () => {
    setFormData({
      clientId: '',
      description: '',
      value: '',
      dueDate: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = MOCK_USERS.find(u => u.id === formData.clientId);
    const clientName = client ? `${client.firstName} ${client.lastName}` : 'Cliente Avulso';
    const amountVal = parseFloat(formData.value.replace(',', '.'));

    const newInstallment: Installment = {
        id: String(Date.now()),
        companyId: '1',
        clientId: formData.clientId,
        clientName: clientName,
        pointOfSaleId: `MANUAL-${Date.now()}`, // Identificador manual
        dueDate: formData.dueDate,
        value: amountVal,
        status: 'Pendente'
    };

    const updated = [newInstallment, ...installments];
    setInstallments(updated);
    setSelectedInstallment(newInstallment);
    
    // Update Global Mock (simulated persistence)
    MOCK_INSTALLMENTS.unshift(newInstallment);
    
    setIsModalOpen(false);
  };

  const handleMarkAsPaid = (id: string) => {
      const updated = installments.map(i => i.id === id ? { ...i, status: 'Pago' } : i);
      setInstallments(updated);
      if (selectedInstallment?.id === id) {
          setSelectedInstallment({ ...selectedInstallment, status: 'Pago' });
      }
      // Update global mock
      const mockIndex = MOCK_INSTALLMENTS.findIndex(i => i.id === id);
      if (mockIndex >= 0) MOCK_INSTALLMENTS[mockIndex].status = 'Pago';
  };

  const handleDelete = (id: string) => {
      if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
          const filtered = installments.filter(i => i.id !== id);
          setInstallments(filtered);
          if (selectedInstallment?.id === id) setSelectedInstallment(filtered[0] || null);
      }
  };

  const filteredInstallments = installments.filter(i => 
    i.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.pointOfSaleId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string, dueDate: string) => {
      if (status === 'Pago') return 'bg-green-100 text-green-700 border-green-200';
      
      const today = new Date();
      const due = new Date(dueDate);
      // Reset hours for accurate comparison
      today.setHours(0,0,0,0);
      due.setHours(0,0,0,0);

      if (due < today) return 'bg-red-100 text-red-700 border-red-200'; // Vencido
      if (due.getTime() === today.getTime()) return 'bg-orange-100 text-orange-700 border-orange-200'; // Vence Hoje
      
      return 'bg-blue-50 text-blue-700 border-blue-100'; // A Vencer
  };

  const getStatusLabel = (status: string, dueDate: string) => {
      if (status === 'Pago') return 'Pago';
      const today = new Date();
      const due = new Date(dueDate);
      today.setHours(0,0,0,0);
      due.setHours(0,0,0,0);

      if (due < today) return 'Atrasado';
      if (due.getTime() === today.getTime()) return 'Vence Hoje';
      return 'Pendente';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4 font-sans">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Contas a Receber</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie boletos, fiados e parcelas de clientes.</p>
        </div>
        <Button onClick={handleOpenModal} className="bg-[#0B0F19]">
          <Plus size={18} className="mr-2" /> Novo Lançamento
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        
        {/* Left List */}
        <div className="w-full lg:w-4/12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar por cliente..." 
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-gray-50"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-50">
              {filteredInstallments.map(item => {
                 const statusStyle = getStatusColor(item.status, item.dueDate);
                 const statusText = getStatusLabel(item.status, item.dueDate);
                 
                 return (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedInstallment(item)}
                      className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all
                        ${selectedInstallment?.id === item.id ? 'bg-blue-50/60 border-l-4 border-accent pl-3' : 'border-l-4 border-transparent pl-3'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${statusStyle}`}>
                          <DollarSign size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.clientName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                             <Calendar size={10} /> {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">R$ {item.value.toFixed(2)}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${statusStyle.split(' ')[1]} bg-opacity-20`}>
                             {statusText}
                          </span>
                      </div>
                    </div>
                 );
              })}
              {filteredInstallments.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">
                      Nenhum registro encontrado.
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {selectedInstallment ? (
            <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
              <div className="p-8 border-b border-gray-100">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                       <div className={`h-20 w-20 rounded-lg flex items-center justify-center text-3xl font-bold border-4 border-white shadow-sm ${selectedInstallment.status === 'Pago' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          <FileText size={32} />
                       </div>
                       <div>
                          <h2 className="text-xl font-bold text-gray-900 font-heading">{selectedInstallment.clientName}</h2>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-3xl font-bold text-gray-900">R$ {selectedInstallment.value.toFixed(2)}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Ref: {selectedInstallment.pointOfSaleId}</p>
                       </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(selectedInstallment.status, selectedInstallment.dueDate)}`}>
                            {getStatusLabel(selectedInstallment.status, selectedInstallment.dueDate)}
                        </span>
                        {selectedInstallment.status !== 'Pago' && (
                             <Button 
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                onClick={() => handleMarkAsPaid(selectedInstallment.id)}
                             >
                                <CheckCircle size={16} /> Baixar Conta
                             </Button>
                        )}
                    </div>
                 </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 font-heading mb-2 flex items-center gap-2">
                        <FileText size={16} /> Detalhes da Cobrança
                    </h3>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <span className="text-sm text-gray-500">Vencimento</span>
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(selectedInstallment.dueDate).toLocaleDateString('pt-BR')}
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <span className="text-sm text-gray-500">Origem</span>
                        <div className="font-medium text-gray-900">
                            {selectedInstallment.pointOfSaleId.startsWith('POS') ? 'Venda PDV' : 'Lançamento Manual'}
                        </div>
                    </div>
                 </div>

                 <div className="flex flex-col gap-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
                        <User size={32} className="mx-auto text-gray-300 mb-2" />
                        <h4 className="text-sm font-bold text-gray-900">Dados do Cliente</h4>
                        <p className="text-xs text-gray-500 mt-1">Ver perfil completo em Clientes</p>
                    </div>

                    <Button variant="danger" className="w-full justify-center" onClick={() => handleDelete(selectedInstallment.id)}>
                        <Trash2 size={16} className="mr-2" /> Excluir Lançamento
                    </Button>
                 </div>

              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <DollarSign size={48} className="mb-4 opacity-20" />
                <p>Selecione uma conta para ver detalhes</p>
             </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={20} />
            </button>
            
            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-heading">Novo Recebível</h2>
              <p className="text-sm text-gray-500 mt-1">Lançamento manual de conta a receber.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Cliente</label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm bg-white"
                    value={formData.clientId}
                    onChange={e => setFormData({...formData, clientId: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {MOCK_USERS.filter(u => u.profile === 'client').map(c => (
                      <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                    ))}
                  </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Valor (R$)</label>
                    <input 
                        type="number" 
                        step="0.01" 
                        required 
                        placeholder="0,00"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-accent focus:border-transparent" 
                        value={formData.value} 
                        onChange={e => setFormData({...formData, value: e.target.value})} 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Vencimento</label>
                    <input 
                        type="date" 
                        required 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-accent focus:border-transparent" 
                        value={formData.dueDate} 
                        onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                    />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Descrição / Observação</label>
                <input 
                    placeholder="Ex: Venda de Película (Manual)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-accent focus:border-transparent" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-[#0B0F19]">Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};