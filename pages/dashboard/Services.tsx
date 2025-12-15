import React, { useState } from 'react';
import { MOCK_SERVICES } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { Plus, Search, Wrench, Edit, Trash2, X, Clock, FileText } from 'lucide-react';
import { Service } from '../../types';

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [selectedService, setSelectedService] = useState<Service | null>(services[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0
  });

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingId(service.id);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', price: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = services.map(s => s.id === editingId ? { ...s, ...formData } : s);
      setServices(updated);
      if (selectedService?.id === editingId) setSelectedService({ ...selectedService, ...formData } as Service);
    } else {
      const newService = { 
        id: String(Date.now()), 
        companyId: '1', 
        productIds: [], 
        employeeIds: [], 
        ...formData 
      };
      setServices([newService, ...services]);
      setSelectedService(newService);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('ATENÇÃO: Deseja realmente excluir este serviço?\n\nEssa ação não pode ser desfeita.')) {
      const filtered = services.filter(s => s.id !== id);
      setServices(filtered);
      if (selectedService?.id === id) setSelectedService(filtered[0] || null);
    }
  };

  const filteredServices = services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4 font-sans">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Serviços</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie seu catálogo de serviços e mão de obra.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#0B0F19]">
          <Plus size={18} className="mr-2" /> Novo Serviço
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
                  placeholder="Buscar serviço..." 
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-gray-50"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-50">
              {filteredServices.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedService(s)}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all
                    ${selectedService?.id === s.id ? 'bg-blue-50/60 border-l-4 border-accent pl-3' : 'border-l-4 border-transparent pl-3'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                      <Wrench size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-500 font-bold">R$ {s.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {selectedService ? (
            <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
              <div className="p-8 border-b border-gray-100">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                       <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border-4 border-white shadow-sm">
                          <Wrench size={32} />
                       </div>
                       <div>
                          <h2 className="text-xl font-bold text-gray-900 font-heading">{selectedService.name}</h2>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-2xl font-bold text-gray-900">R$ {selectedService.price.toFixed(2)}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="secondary" onClick={() => handleOpenModal(selectedService)}>
                          <Edit size={16} className="mr-2" /> Editar
                       </Button>
                       <Button variant="danger" onClick={() => handleDelete(selectedService.id)}>
                          <Trash2 size={16} />
                       </Button>
                    </div>
                 </div>
              </div>

              <div className="p-8">
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
                    <h3 className="text-sm font-bold text-gray-900 font-heading mb-2">Descrição do Serviço</h3>
                    <p className="text-sm text-gray-600">{selectedService.description}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg">
                       <div className="bg-blue-50 p-2 rounded-full text-blue-600"><Clock size={16} /></div>
                       <div>
                          <p className="text-xs text-gray-500">Tempo Estimado</p>
                          <p className="text-sm font-bold text-gray-900">40 min</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg">
                       <div className="bg-green-50 p-2 rounded-full text-green-600"><FileText size={16} /></div>
                       <div>
                          <p className="text-xs text-gray-500">Garantia</p>
                          <p className="text-sm font-bold text-gray-900">90 Dias</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <Wrench size={48} className="mb-4 opacity-20" />
                <p>Selecione um serviço</p>
             </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 font-heading">{editingId ? 'Editar Serviço' : 'Novo Serviço'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Nome do Serviço</label>
                <input required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Descrição</label>
                <textarea rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm resize-none" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Preço Base (R$)</label>
                 <input type="number" step="0.01" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                    value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
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