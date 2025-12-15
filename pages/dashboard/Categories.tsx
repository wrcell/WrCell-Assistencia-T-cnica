import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Plus, Search, Layers, Edit, Trash2, X, Tag } from 'lucide-react';

// Local Mock and Type for Categories since it wasn't in global types
interface Category {
  id: string;
  name: string;
  description: string;
  type: 'Produto' | 'Serviço';
}

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Acessórios', description: 'Capas, películas e cabos', type: 'Produto' },
  { id: '2', name: 'Peças de Reposição', description: 'Telas, baterias e conectores', type: 'Produto' },
  { id: '3', name: 'Manutenção', description: 'Serviços de reparo geral', type: 'Serviço' },
];

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [selectedCat, setSelectedCat] = useState<Category | null>(categories[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Produto' as 'Produto' | 'Serviço'
  });

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingId(cat.id);
      setFormData({
        name: cat.name,
        description: cat.description,
        type: cat.type
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', type: 'Produto' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = categories.map(c => c.id === editingId ? { ...c, ...formData } : c);
      setCategories(updated);
      if (selectedCat?.id === editingId) setSelectedCat({ ...selectedCat, ...formData } as Category);
    } else {
      const newCat: Category = { id: String(Date.now()), ...formData };
      setCategories([newCat, ...categories]);
      setSelectedCat(newCat);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('ATENÇÃO: Deseja realmente excluir esta categoria?\n\nEssa ação não pode ser desfeita.')) {
      const filtered = categories.filter(c => c.id !== id);
      setCategories(filtered);
      if (selectedCat?.id === id) setSelectedCat(filtered[0] || null);
    }
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4 font-sans">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Categorias</h1>
          <p className="text-sm text-gray-500 mt-1">Organize seus produtos e serviços em grupos.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#0B0F19]">
          <Plus size={18} className="mr-2" /> Nova Categoria
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
                  placeholder="Buscar categoria..." 
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-gray-50"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-50">
              {filteredCategories.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCat(c)}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all
                    ${selectedCat?.id === c.id ? 'bg-blue-50/60 border-l-4 border-accent pl-3' : 'border-l-4 border-transparent pl-3'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                      <Layers size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {selectedCat ? (
            <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
              <div className="p-8 border-b border-gray-100">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                       <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border-4 border-white shadow-sm">
                          <Layers size={32} />
                       </div>
                       <div>
                          <h2 className="text-xl font-bold text-gray-900 font-heading">{selectedCat.name}</h2>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">{selectedCat.type}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="secondary" onClick={() => handleOpenModal(selectedCat)}>
                          <Edit size={16} className="mr-2" /> Editar
                       </Button>
                       <Button variant="danger" onClick={() => handleDelete(selectedCat.id)}>
                          <Trash2 size={16} />
                       </Button>
                    </div>
                 </div>
              </div>

              <div className="p-8">
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 font-heading mb-2">Descrição da Categoria</h3>
                    <p className="text-sm text-gray-600">{selectedCat.description || 'Sem descrição.'}</p>
                 </div>
              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <Layers size={48} className="mb-4 opacity-20" />
                <p>Selecione uma categoria</p>
             </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 font-heading">{editingId ? 'Editar Categoria' : 'Nova Categoria'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Nome</label>
                <input required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Descrição</label>
                <textarea rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm resize-none" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Tipo</label>
                 <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm bg-white"
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                    <option value="Produto">Produto</option>
                    <option value="Serviço">Serviço</option>
                 </select>
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