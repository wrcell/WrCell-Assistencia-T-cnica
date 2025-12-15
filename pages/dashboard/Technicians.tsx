import React, { useState } from 'react';
import { MOCK_EMPLOYEES } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { Plus, Search, UserCog, Edit, Trash2, X, Shield, BarChart, DollarSign } from 'lucide-react';
import { Employee } from '../../types';

export const Technicians: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(employees[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    permissions: '{"technical": true}'
  });

  const handleOpenModal = (emp?: Employee) => {
    if (emp) {
      setEditingId(emp.id);
      setFormData({
        firstName: emp.firstName,
        lastName: emp.lastName,
        permissions: emp.permissions
      });
    } else {
      setEditingId(null);
      setFormData({ firstName: '', lastName: '', permissions: '{"technical": true}' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = employees.map(emp => emp.id === editingId ? { ...emp, ...formData } : emp);
      setEmployees(updated);
      if (selectedEmp?.id === editingId) setSelectedEmp({ ...selectedEmp, ...formData } as Employee);
    } else {
      const newEmp: Employee = { 
        id: String(Date.now()), 
        companyId: '1', 
        userId: 'temp', 
        vale: 0, 
        despesas: 0, 
        ...formData 
      };
      setEmployees([newEmp, ...employees]);
      setSelectedEmp(newEmp);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('ATENÇÃO: Deseja realmente remover este técnico?\n\nEssa ação não pode ser desfeita.')) {
      const filtered = employees.filter(e => e.id !== id);
      setEmployees(filtered);
      if (selectedEmp?.id === id) setSelectedEmp(filtered[0] || null);
    }
  };

  const filteredEmployees = employees.filter(e => 
    `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4 font-sans">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Técnicos</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie sua equipe técnica e permissões.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#0B0F19]">
          <Plus size={18} className="mr-2" /> Novo Colaborador
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
                  placeholder="Buscar técnico..." 
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-gray-50"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-50">
              {filteredEmployees.map(e => (
                <div 
                  key={e.id} 
                  onClick={() => setSelectedEmp(e)}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all
                    ${selectedEmp?.id === e.id ? 'bg-blue-50/60 border-l-4 border-accent pl-3' : 'border-l-4 border-transparent pl-3'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-white">
                      <UserCog size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{e.firstName} {e.lastName}</p>
                      <p className="text-xs text-gray-500">Colaborador</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {selectedEmp ? (
            <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
              <div className="p-8 border-b border-gray-100">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                       <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border-4 border-white shadow-sm">
                          <UserCog size={40} />
                       </div>
                       <div>
                          <h2 className="text-2xl font-bold text-gray-900 font-heading">{selectedEmp.firstName} {selectedEmp.lastName}</h2>
                          <div className="flex items-center gap-2 text-sm text-green-600 mt-1 bg-green-50 px-2 py-1 rounded w-fit">
                             <Shield size={12} /> Ativo
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="secondary" onClick={() => handleOpenModal(selectedEmp)}>
                          <Edit size={16} className="mr-2" /> Editar
                       </Button>
                       <Button variant="danger" onClick={() => handleDelete(selectedEmp.id)}>
                          <Trash2 size={16} />
                       </Button>
                    </div>
                 </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 font-heading mb-4 flex items-center gap-2">
                       <DollarSign size={16} /> Financeiro (Mês Atual)
                    </h3>
                    <div className="space-y-3">
                       <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Vales</span>
                          <span className="font-bold text-red-600">R$ {selectedEmp.vale.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Despesas</span>
                          <span className="font-bold text-orange-600">R$ {selectedEmp.despesas.toFixed(2)}</span>
                       </div>
                       <div className="pt-2 border-t border-gray-200 flex justify-between">
                          <span className="font-bold text-gray-900">Total a Pagar</span>
                          <span className="font-bold text-gray-900">R$ 0,00</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 font-heading mb-4 flex items-center gap-2">
                       <Shield size={16} /> Permissões do Sistema
                    </h3>
                    <p className="text-xs font-mono bg-white p-3 rounded border border-gray-200 text-gray-600">
                       {selectedEmp.permissions}
                    </p>
                 </div>
              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <UserCog size={48} className="mb-4 opacity-20" />
                <p>Selecione um técnico</p>
             </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 font-heading">{editingId ? 'Editar Técnico' : 'Novo Técnico'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Nome</label>
                    <input required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                       value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Sobrenome</label>
                    <input required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                       value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                 </div>
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Permissões (JSON)</label>
                 <textarea className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm font-mono" rows={3}
                    value={formData.permissions} onChange={e => setFormData({...formData, permissions: e.target.value})} />
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