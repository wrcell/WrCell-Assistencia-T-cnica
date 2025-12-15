import React, { useState } from 'react';
import { MOCK_SUPPLIERS } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { Plus, Search, Truck, Edit, Trash2, X, MapPin, Phone, Mail, Globe, FileText, MessageCircle } from 'lucide-react';
import { Supplier } from '../../types';

export const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(suppliers[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fantasyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: ''
  });

  // Handlers
  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingId(supplier.id);
      setFormData({
        fantasyName: supplier.fantasyName,
        contactName: supplier.contactName,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address
      });
    } else {
      setEditingId(null);
      setFormData({ fantasyName: '', contactName: '', email: '', phone: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = suppliers.map(s => s.id === editingId ? { ...s, ...formData } : s);
      setSuppliers(updated);
      if (selectedSupplier?.id === editingId) setSelectedSupplier({ ...selectedSupplier, ...formData });
    } else {
      const newSupplier = { id: String(Date.now()), companyId: '1', ...formData };
      setSuppliers([newSupplier, ...suppliers]);
      setSelectedSupplier(newSupplier);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('ATENÇÃO: Deseja realmente excluir este fornecedor?\n\nEssa ação não pode ser desfeita.')) {
      const filtered = suppliers.filter(s => s.id !== id);
      setSuppliers(filtered);
      if (selectedSupplier?.id === id) setSelectedSupplier(filtered[0] || null);
    }
  };

  const handleWhatsApp = (phone: string) => {
    if (!phone) return alert("Telefone não cadastrado.");
    const cleanNumber = phone.replace(/\D/g, '');
    if (cleanNumber.length < 10) return alert("Número inválido.");
    const number = cleanNumber.length <= 11 ? `55${cleanNumber}` : cleanNumber;
    window.open(`https://wa.me/${number}`, '_blank');
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.fantasyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4 font-sans">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Fornecedores</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie seus parceiros e contatos de suprimentos.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#0B0F19]">
          <Plus size={18} className="mr-2" /> Novo Fornecedor
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
                  placeholder="Buscar fornecedor..." 
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-gray-50"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-50">
              {filteredSuppliers.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedSupplier(s)}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all
                    ${selectedSupplier?.id === s.id ? 'bg-blue-50/60 border-l-4 border-accent pl-3' : 'border-l-4 border-transparent pl-3'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{s.fantasyName}</p>
                      <p className="text-xs text-gray-500">{s.contactName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {selectedSupplier ? (
            <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400 border-4 border-white shadow-sm">
                      {getInitials(selectedSupplier.fantasyName)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 font-heading">{selectedSupplier.fantasyName}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Truck size={14} /> Fornecedor Parceiro
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <Button 
                        variant="secondary" 
                        onClick={() => handleWhatsApp(selectedSupplier.phone)} 
                        title="Chamar no WhatsApp"
                        className="px-3"
                     >
                        <MessageCircle size={16} />
                     </Button>
                    <Button variant="secondary" onClick={() => handleOpenModal(selectedSupplier)}>
                      <Edit size={16} className="mr-2" /> Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(selectedSupplier.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 font-heading border-b border-gray-100 pb-2">Informações de Contato</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                       <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><Phone size={14} /></div>
                       {selectedSupplier.phone}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                       <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><Mail size={14} /></div>
                       {selectedSupplier.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                       <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><MapPin size={14} /></div>
                       {selectedSupplier.address}
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 font-heading border-b border-gray-100 pb-2">Dados Adicionais</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                       <p className="text-xs text-gray-500 mb-1">Contato Principal</p>
                       <p className="text-sm font-bold text-gray-900">{selectedSupplier.contactName}</p>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
              <Truck size={48} className="mb-4 opacity-20" />
              <p>Selecione um fornecedor para ver detalhes</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 font-heading">{editingId ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Nome Fantasia</label>
                  <input required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                    value={formData.fantasyName} onChange={e => setFormData({...formData, fantasyName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Nome do Contato</label>
                  <input required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                    value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Telefone</label>
                  <input required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Email</label>
                  <input type="email" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Endereço</label>
                  <input required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
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