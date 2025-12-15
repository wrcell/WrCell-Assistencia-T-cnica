import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { Plus, Search, Package, AlertTriangle, Edit, Trash2, X, Box, Tag, DollarSign, BarChart2 } from 'lucide-react';
import { Product } from '../../types';

export const Stock: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: 0,
    lowStockAlert: 5,
    price: 0
  });

  const handleOpenModal = (prod?: Product) => {
    if (prod) {
      setEditingId(prod.id);
      setFormData({
        name: prod.name,
        description: prod.description,
        stock: prod.stock,
        lowStockAlert: prod.lowStockAlert,
        price: prod.price
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', stock: 0, lowStockAlert: 5, price: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = products.map(p => p.id === editingId ? { ...p, ...formData } : p);
      setProducts(updated);
      if (selectedProduct?.id === editingId) setSelectedProduct({ ...selectedProduct, ...formData } as Product);
    } else {
      const newProd: Product = { id: String(Date.now()), companyId: '1', ...formData };
      setProducts([newProd, ...products]);
      setSelectedProduct(newProd);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('ATENÇÃO: Deseja realmente excluir este produto?\n\nEssa ação não pode ser desfeita.')) {
      const filtered = products.filter(p => p.id !== id);
      setProducts(filtered);
      if (selectedProduct?.id === id) setSelectedProduct(filtered[0] || null);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4 font-sans">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Peças e Produtos</h1>
          <p className="text-sm text-gray-500 mt-1">Controle de estoque, preços e alertas.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#0B0F19]">
          <Plus size={18} className="mr-2" /> Novo Produto
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
                  placeholder="Buscar produto..." 
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-gray-50"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-50">
              {filteredProducts.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedProduct(p)}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all
                    ${selectedProduct?.id === p.id ? 'bg-blue-50/60 border-l-4 border-accent pl-3' : 'border-l-4 border-transparent pl-3'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-500 font-bold">R$ {p.price.toFixed(2)}</p>
                    </div>
                  </div>
                  {p.stock <= p.lowStockAlert && (
                     <AlertTriangle size={16} className="text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {selectedProduct ? (
            <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
              <div className="p-8 border-b border-gray-100">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                       <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border-4 border-white shadow-sm">
                          <Box size={32} />
                       </div>
                       <div>
                          <h2 className="text-xl font-bold text-gray-900 font-heading">{selectedProduct.name}</h2>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-2xl font-bold text-gray-900">R$ {selectedProduct.price.toFixed(2)}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="secondary" onClick={() => handleOpenModal(selectedProduct)}>
                          <Edit size={16} className="mr-2" /> Editar
                       </Button>
                       <Button variant="danger" onClick={() => handleDelete(selectedProduct.id)}>
                          <Trash2 size={16} />
                       </Button>
                    </div>
                 </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                       <h3 className="text-sm font-bold text-gray-900 font-heading mb-4 flex items-center gap-2">
                          <BarChart2 size={16} /> Controle de Estoque
                       </h3>
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">Quantidade Atual</span>
                          <span className={`text-xl font-bold ${selectedProduct.stock <= selectedProduct.lowStockAlert ? 'text-red-600' : 'text-green-600'}`}>
                             {selectedProduct.stock} un
                          </span>
                       </div>
                       <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${selectedProduct.stock <= selectedProduct.lowStockAlert ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: '60%' }}></div>
                       </div>
                       <p className="text-xs text-gray-400 mt-2">Alerta de estoque baixo: {selectedProduct.lowStockAlert} unidades.</p>
                    </div>

                    <div>
                       <h3 className="text-sm font-bold text-gray-900 font-heading border-b border-gray-100 pb-2 mb-2">Descrição</h3>
                       <p className="text-sm text-gray-600 leading-relaxed">
                          {selectedProduct.description || 'Sem descrição cadastrada.'}
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <Package size={48} className="mb-4 opacity-20" />
                <p>Selecione um produto</p>
             </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 font-heading">{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Nome do Produto</label>
                <input required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Descrição</label>
                <textarea rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm resize-none" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Preço (R$)</label>
                    <input type="number" step="0.01" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                       value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Estoque Atual</label>
                    <input type="number" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                       value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Alerta de Estoque Mínimo</label>
                 <input type="number" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm" 
                    value={formData.lowStockAlert} onChange={e => setFormData({...formData, lowStockAlert: Number(e.target.value)})} />
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