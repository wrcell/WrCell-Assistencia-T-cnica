import React, { useState } from 'react';
import { MOCK_ORDERS, MOCK_USERS, MOCK_PRODUCTS, MOCK_SERVICES } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { 
  Plus, 
  Search, 
  Printer, 
  Edit, 
  Trash2, 
  FileText, 
  Smartphone, 
  CheckCircle,
  X
} from 'lucide-react';
import { ServiceOrder } from '../../types';

// Helper to parse technical report into specific fields
const parseReportDetails = (report: string) => {
  const deviceMatch = report.match(/Device: (.*?)( \| |$)/);
  const defectMatch = report.match(/Defect: (.*?)( \| |$)/);
  const solutionMatch = report.match(/Solution: (.*?)( \| |$)/);
  
  // Fallback for legacy data or simple text
  const isStructured = deviceMatch || defectMatch || solutionMatch;
  
  return {
    device: deviceMatch ? deviceMatch[1] : (isStructured ? '' : 'Não informado'),
    defect: defectMatch ? defectMatch[1] : (isStructured ? '' : report),
    solution: solutionMatch ? solutionMatch[1] : ''
  };
};

export const ServiceOrders: React.FC = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(orders[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State for New/Edit
  const [formData, setFormData] = useState({
    clientId: '',
    employeeId: '',
    device: '',
    defect: '',
    solution: '',
    status: 'Pendente',
    entryDate: new Date().toISOString().split('T')[0],
    totalValue: 0 // Visual only for this modal, derived from calculation usually
  });

  const calculateTotal = (order: ServiceOrder) => {
    const productsTotal = order.productIds.reduce((sum, pid) => {
      const prod = MOCK_PRODUCTS.find(p => p.id === pid);
      return sum + (prod ? prod.price : 0);
    }, 0);
    const servicesTotal = order.serviceIds.reduce((sum, sid) => {
      const serv = MOCK_SERVICES.find(s => s.id === sid);
      return sum + (serv ? serv.price : 0);
    }, 0);
    return productsTotal + servicesTotal;
  };

  const getClientName = (id: string) => {
    const user = MOCK_USERS.find(u => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : 'Cliente Desconhecido';
  };

  const getEmployeeName = (id: string) => {
    const user = MOCK_USERS.find(u => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : 'Técnico Desconhecido';
  };

  const filteredOrders = orders.filter(order => {
    const clientName = getClientName(order.clientId).toLowerCase();
    return clientName.includes(searchTerm.toLowerCase()) || 
           order.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ 
      clientId: '', 
      employeeId: '', 
      device: '', 
      defect: '', 
      solution: '', 
      status: 'Pendente', 
      entryDate: new Date().toISOString().split('T')[0],
      totalValue: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (order: ServiceOrder) => {
    setEditingId(order.id);
    const details = parseReportDetails(order.technicalReport);
    setFormData({
      clientId: order.clientId,
      employeeId: order.employeeId,
      device: details.device,
      defect: details.defect,
      solution: details.solution,
      status: order.status,
      entryDate: new Date(order.entryDate).toISOString().split('T')[0],
      totalValue: calculateTotal(order)
    });
    setIsModalOpen(true);
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const structuredReport = `Device: ${formData.device} | Defect: ${formData.defect} | Solution: ${formData.solution}`;
    
    if (editingId) {
      // Update existing
      const updatedList = orders.map(o => o.id === editingId ? {
        ...o,
        clientId: formData.clientId,
        employeeId: formData.employeeId,
        status: formData.status,
        entryDate: new Date(formData.entryDate).toISOString(),
        technicalReport: structuredReport
      } : o);
      
      setOrders(updatedList);
      
      // Update selected if it was the one edited
      if (selectedOrder?.id === editingId) {
        const updatedOrder = updatedList.find(o => o.id === editingId);
        if (updatedOrder) setSelectedOrder(updatedOrder);
      }
    } else {
      // Create new
      const newOrder: ServiceOrder = {
        id: `OS-${String(orders.length + 1).padStart(3, '0')}`,
        companyId: '1',
        clientId: formData.clientId,
        employeeId: formData.employeeId,
        status: formData.status,
        entryDate: new Date(formData.entryDate).toISOString(),
        exitDate: '',
        technicalReport: structuredReport,
        productIds: [],
        serviceIds: []
      };
      const updatedList = [newOrder, ...orders];
      setOrders(updatedList);
      setSelectedOrder(newOrder);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('ATENÇÃO: Tem certeza que deseja excluir esta OS?\n\nEssa ação não pode ser desfeita.')) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      if (selectedOrder?.id === id) {
        setSelectedOrder(updated[0] || null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Concluído': return 'bg-green-100 text-green-800 border-green-200';
      case 'Em Reparo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const currentDetails = selectedOrder ? parseReportDetails(selectedOrder.technicalReport) : null;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Ordens de Serviço</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie todas as suas ordens de serviço, do diagnóstico à entrega.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        
        {/* Left Column: Order List */}
        <div className="w-full lg:w-5/12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
               <h2 className="text-lg font-bold text-gray-900 font-heading">Histórico de Ordens</h2>
               <p className="text-xs text-gray-500">Lista de todas as OS registradas.</p>
            </div>
            <Button size="sm" onClick={openNewModal}>
              <Plus size={16} className="mr-1" /> Nova OS
            </Button>
          </div>
          
          <div className="p-3 bg-gray-50 border-b border-gray-100">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  placeholder="Buscar OS por nº ou cliente..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 z-0">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider font-heading border-b border-gray-100">Nº da OS</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider font-heading border-b border-gray-100">Cliente</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider font-heading border-b border-gray-100 text-center">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider font-heading border-b border-gray-100 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map(order => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${selectedOrder?.id === order.id ? 'bg-blue-50/60 border-l-4 border-accent' : 'border-l-4 border-transparent'}`}
                  >
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">{order.id}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{getClientName(order.clientId)}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 text-gray-400">
                          <CheckCircle size={16} className="hover:text-green-500" />
                          <Printer size={16} className="hover:text-gray-600" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEditModal(order); }}
                            className="hover:text-accent transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Order Details */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {selectedOrder ? (
            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
              <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                 <div>
                    <h2 className="text-xl font-bold text-gray-900 font-heading flex items-center gap-2">
                       <FileText className="text-accent" size={24} /> 
                       Detalhes da OS
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Informações completas da OS #{selectedOrder.id}</p>
                 </div>
                 <div className="text-right">
                    <span className={`inline-flex px-3 py-1 text-xs font-bold uppercase rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                    </span>
                 </div>
              </div>

              <div className="p-6 space-y-6">
                 {/* Basic Info Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                       <span className="text-gray-500">Cliente</span>
                       <span className="font-medium text-gray-900">{getClientName(selectedOrder.clientId)}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                       <span className="text-gray-500">Técnico</span>
                       <span className="font-medium text-gray-900">{getEmployeeName(selectedOrder.employeeId)}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                       <span className="text-gray-500">Equipamento</span>
                       <span className="font-medium text-gray-900">{currentDetails?.device}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                       <span className="text-gray-500">Data de Entrada</span>
                       <span className="font-medium text-gray-900">{new Date(selectedOrder.entryDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                 </div>

                 {/* Problem Description */}
                 <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-heading">Defeito Reclamado</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 border border-gray-100">
                       {currentDetails?.defect || 'Sem descrição.'}
                    </div>
                 </div>

                 {/* Solution Description */}
                 <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-heading">Laudo / Solução Aplicada</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 border border-gray-100 min-h-[80px]">
                       {currentDetails?.solution || 'Ainda não preenchido.'}
                    </div>
                 </div>

                 {/* Totals */}
                 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-900 font-heading">Valor Total</span>
                    <span className="text-2xl font-bold text-gray-900">R$ {calculateTotal(selectedOrder).toFixed(2)}</span>
                 </div>

                 {/* Action Buttons */}
                 <div className="grid grid-cols-1 gap-3 pt-6">
                    <Button className="w-full bg-[#0F172A] hover:bg-gray-800 text-white flex items-center justify-center py-3">
                       <FileText size={18} className="mr-2" /> Gerar NF Simples
                    </Button>
                    <Button 
                      className="w-full bg-[#0F172A] hover:bg-gray-800 text-white flex items-center justify-center py-3"
                      onClick={() => openEditModal(selectedOrder)}
                    >
                       <Edit size={18} className="mr-2" /> Editar OS
                    </Button>
                    <Button variant="secondary" className="w-full flex items-center justify-center py-3 border-gray-300">
                       <Printer size={18} className="mr-2" /> Imprimir
                    </Button>
                    <Button variant="danger" className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center py-3" onClick={() => handleDelete(selectedOrder.id)}>
                       <Trash2 size={18} className="mr-2" /> Excluir OS
                    </Button>
                 </div>
              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  <Smartphone size={48} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhuma OS selecionada</h3>
                <p>Selecione uma ordem de serviço na lista ao lado para ver os detalhes completos.</p>
             </div>
          )}
        </div>
      </div>

      {/* Modal Nova/Editar OS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in relative">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-lg font-bold text-gray-900 font-heading">
                  {editingId ? `Editar Ordem de Serviço - ${editingId}` : 'Nova Ordem de Serviço'}
                </h2>
                <p className="text-sm text-gray-500">{editingId ? 'Atualize as informações da OS.' : 'Preencha os dados para criar uma nova OS.'}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveOrder} className="p-8 space-y-6">
              
              {/* Row 1: Cliente e Técnico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Cliente</label>
                  <select
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm bg-white focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={formData.clientId}
                    onChange={e => setFormData({...formData, clientId: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {MOCK_USERS.filter(u => u.profile === 'client').map(c => (
                      <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Técnico Responsável</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm bg-white focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={formData.employeeId}
                    onChange={e => setFormData({...formData, employeeId: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {MOCK_USERS.filter(u => u.profile === 'employee' || u.profile === 'admin').map(c => (
                      <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Equipamento */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Equipamento</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: iPhone 11 Pro, Samsung S20..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={formData.device}
                  onChange={e => setFormData({...formData, device: e.target.value})}
                />
              </div>

              {/* Row 3: Defeito Reclamado */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Defeito Reclamado</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva o problema relatado pelo cliente..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm resize-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={formData.defect}
                  onChange={e => setFormData({...formData, defect: e.target.value})}
                />
              </div>

              {/* Row 4: Data, Status e Valor */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Data de Entrada</label>
                   <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={formData.entryDate}
                    onChange={e => setFormData({...formData, entryDate: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Status</label>
                   <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm bg-white focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                   >
                     <option>Pendente</option>
                     <option>Em Análise</option>
                     <option>Em Reparo</option>
                     <option>Concluído</option>
                     <option>Entregue</option>
                     <option>Cancelado</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Valor Total (R$)</label>
                   <input
                    type="text"
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm bg-gray-50 text-gray-600"
                    value={formData.totalValue.toFixed(2)}
                   />
                </div>
              </div>

              {/* Row 5: Laudo / Solução */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Laudo / Solução Aplicada</label>
                <textarea
                  rows={3}
                  placeholder="Descreva o serviço realizado, peças trocadas, etc..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm resize-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={formData.solution}
                  onChange={e => setFormData({...formData, solution: e.target.value})}
                />
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                 <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)} className="px-6">Cancelar</Button>
                 <Button type="submit" className="bg-[#0B0F19] hover:bg-gray-800 text-white px-6">Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};