import React, { useState, useEffect } from 'react';
import { MOCK_ORDERS, MOCK_USERS } from '../../services/mockData';
import { ServiceOrder, User } from '../../types';
import { Button } from '../../components/ui/Button';
import { Plus, Search, Smartphone, Edit, Trash2, X, Calendar, User as UserIcon } from 'lucide-react';

// Helper to parse the structured technical report string into form fields
const parseTechnicalReport = (report: string) => {
  const defaultData = {
    deviceModel: '',
    imei: '',
    reportedDefects: '',
    accessories: '',
    notes: ''
  };

  if (!report) return defaultData;

  // Attempt to parse structured format: "Device: ... | IMEI: ... | ..."
  const deviceMatch = report.match(/Device: (.*?)( \||$)/);
  const imeiMatch = report.match(/IMEI: (.*?)( \||$)/);
  const defectsMatch = report.match(/Defects: (.*?)( \||$)/);
  const accessoriesMatch = report.match(/Accessories: (.*?)( \||$)/);
  const notesMatch = report.match(/Notes: (.*?)( \||$)/);

  if (!deviceMatch && !imeiMatch) {
    // Fallback for plain text reports from other modules
    return { ...defaultData, reportedDefects: report };
  }

  return {
    deviceModel: deviceMatch ? deviceMatch[1] : '',
    imei: imeiMatch ? imeiMatch[1] : '',
    reportedDefects: defectsMatch ? defectsMatch[1] : '',
    accessories: accessoriesMatch ? accessoriesMatch[1] : '',
    notes: notesMatch ? notesMatch[1] : ''
  };
};

export const CheckIn: React.FC = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    clientId: '',
    clientContact: '', // Read-only display
    deviceModel: '',
    imei: '',
    reportedDefects: '',
    accessories: '',
    notes: '',
    status: 'Pendente'
  });

  const clients = MOCK_USERS.filter(u => u.profile === 'client');

  // Handle opening modal for new or edit
  const openModal = (order?: ServiceOrder) => {
    if (order) {
      setEditingId(order.id);
      const parsedReport = parseTechnicalReport(order.technicalReport);
      const client = MOCK_USERS.find(u => u.id === order.clientId);
      
      setFormData({
        clientId: order.clientId,
        clientContact: client ? `${client.phone} / ${client.email}` : '',
        deviceModel: parsedReport.deviceModel,
        imei: parsedReport.imei,
        reportedDefects: parsedReport.reportedDefects,
        accessories: parsedReport.accessories,
        notes: parsedReport.notes,
        status: order.status
      });
    } else {
      setEditingId(null);
      setFormData({
        clientId: '',
        clientContact: '',
        deviceModel: '',
        imei: '',
        reportedDefects: '',
        accessories: '',
        notes: '',
        status: 'Pendente'
      });
    }
    setIsModalOpen(true);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const client = clients.find(c => c.id === clientId);
    setFormData(prev => ({
      ...prev,
      clientId,
      clientContact: client ? `${client.phone} / ${client.email}` : ''
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pack data into technicalReport string
    const structuredReport = `Device: ${formData.deviceModel} | IMEI: ${formData.imei} | Defects: ${formData.reportedDefects} | Accessories: ${formData.accessories} | Notes: ${formData.notes}`;

    if (editingId) {
      // Update existing
      setOrders(orders.map(o => o.id === editingId ? {
        ...o,
        clientId: formData.clientId,
        status: formData.status,
        technicalReport: structuredReport
      } : o));
    } else {
      // Create new
      const newOrder: ServiceOrder = {
        id: `OS-${String(orders.length + 1).padStart(3, '0')}`,
        companyId: '1',
        clientId: formData.clientId,
        employeeId: '4', // Default logged user/employee
        status: formData.status,
        entryDate: new Date().toISOString(),
        exitDate: '',
        technicalReport: structuredReport,
        productIds: [],
        serviceIds: []
      };
      setOrders([newOrder, ...orders]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('ATENÇÃO: Tem certeza que deseja excluir este Check-in/OS?\n\nEsta ação não poderá ser desfeita.')) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const getClientName = (id: string) => {
    const user = MOCK_USERS.find(u => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : 'Desconhecido';
  };

  const filteredOrders = orders.filter(o => {
    const clientName = getClientName(o.clientId).toLowerCase();
    const parsed = parseTechnicalReport(o.technicalReport);
    return clientName.includes(searchTerm.toLowerCase()) || 
           parsed.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
           o.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
             <Smartphone className="text-gray-400" /> Check-in de Aparelhos
           </h1>
           <p className="text-sm text-gray-500 mt-1">Registre a entrada de dispositivos para manutenção.</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus size={18} className="mr-2" />
          Novo Check-in
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
           <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por cliente, modelo ou OS..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider font-heading">Data</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider font-heading">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider font-heading">Aparelho / Defeito</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider font-heading">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider font-heading">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(order => {
                const details = parseTechnicalReport(order.technicalReport);
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(order.entryDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                         <div className="bg-gray-100 p-1.5 rounded-full"><UserIcon size={14} className="text-gray-500" /></div>
                         <span className="font-medium text-gray-900">{getClientName(order.clientId)}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{details.deviceModel || 'N/A'}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{details.reportedDefects}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Concluído' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(order)} className="text-gray-400 hover:text-accent p-1">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(order.id)} className="text-gray-400 hover:text-red-500 p-1">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 font-heading">
                {editingId ? 'Editar Check-in' : 'Novo Check-in'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Row 1: Client and Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Nome do Cliente</label>
                  <select
                    name="clientId"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                    value={formData.clientId}
                    onChange={handleClientChange}
                  >
                    <option value="">Selecione...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Contato do Cliente (Telefone/Email)</label>
                  <input
                    type="text"
                    name="clientContact"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 outline-none cursor-not-allowed"
                    value={formData.clientContact}
                    placeholder="Selecione um cliente"
                  />
                </div>
              </div>

              {/* Row 2: Device and IMEI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Modelo do Aparelho</label>
                  <input
                    type="text"
                    name="deviceModel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    placeholder="Ex: iPhone 11, Samsung S20..."
                    value={formData.deviceModel}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">IMEI / Nº de Série</label>
                  <input
                    type="text"
                    name="imei"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    placeholder="Ex: 3569..."
                    value={formData.imei}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Row 3: Defects */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Defeitos Reclamados</label>
                <textarea
                  name="reportedDefects"
                  rows={2}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none"
                  placeholder="Descreva o problema relatado pelo cliente..."
                  value={formData.reportedDefects}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              {/* Row 4: Accessories */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Acessórios Deixados</label>
                <input
                  type="text"
                  name="accessories"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  placeholder="Ex: Carregador, Capinha, Chip..."
                  value={formData.accessories}
                  onChange={handleInputChange}
                />
              </div>

              {/* Row 5: Notes */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Observações do Técnico (Opcional)</label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none"
                  placeholder="Marcas de uso, arranhões pré-existentes..."
                  value={formData.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              {/* Row 6: Status */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Status</label>
                <select
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Em Reparo">Em Reparo</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Entregue">Entregue</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-[#0B0F19] hover:bg-gray-800 text-white">Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};