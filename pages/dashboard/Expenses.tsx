import React, { useState } from 'react';
import { MOCK_EXPENSES } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { 
  Plus, 
  Search, 
  TrendingDown, 
  Edit, 
  Trash2, 
  X, 
  Calendar, 
  FileText, 
  DollarSign, 
  PieChart,
  Tag
} from 'lucide-react';
import { Expense } from '../../types';

export const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(expenses[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Handlers
  const handleOpenModal = (expense?: Expense) => {
    if (expense) {
      setEditingId(expense.id);
      setFormData({
        description: expense.description,
        amount: expense.amount.toString(),
        date: expense.date
      });
    } else {
      setEditingId(null);
      setFormData({ 
        description: '', 
        amount: '', 
        date: new Date().toISOString().split('T')[0] 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountValue = parseFloat(formData.amount.replace(',', '.'));

    if (isNaN(amountValue) || amountValue <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    if (editingId) {
      const updated = expenses.map(ex => ex.id === editingId ? { 
          ...ex, 
          description: formData.description,
          amount: amountValue,
          date: formData.date
      } : ex);
      setExpenses(updated);
      
      if (selectedExpense?.id === editingId) {
          setSelectedExpense({ 
              ...selectedExpense, 
              description: formData.description,
              amount: amountValue,
              date: formData.date
          });
      }
    } else {
      const newExpense: Expense = { 
        id: String(Date.now()), 
        companyId: '1', 
        description: formData.description,
        amount: amountValue,
        date: formData.date
      };
      setExpenses([newExpense, ...expenses]);
      setSelectedExpense(newExpense);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('ATENÇÃO: Deseja realmente excluir esta despesa?\n\nEssa ação não pode ser desfeita.')) {
      const filtered = expenses.filter(e => e.id !== id);
      setExpenses(filtered);
      if (selectedExpense?.id === id) setSelectedExpense(filtered[0] || null);
    }
  };

  const filteredExpenses = expenses.filter(e => 
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4 font-sans">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Despesas</h1>
          <p className="text-sm text-gray-500 mt-1">Controle de contas a pagar e saídas do caixa.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#0B0F19]">
          <Plus size={18} className="mr-2" /> Nova Despesa
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
                  placeholder="Buscar despesa..." 
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-gray-50"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-50">
              {filteredExpenses.map(expense => (
                <div 
                  key={expense.id} 
                  onClick={() => setSelectedExpense(expense)}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all
                    ${selectedExpense?.id === expense.id ? 'bg-red-50/60 border-l-4 border-red-500 pl-3' : 'border-l-4 border-transparent pl-3'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                      <TrendingDown size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{expense.description}</p>
                      <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-red-600">
                      - R$ {expense.amount.toFixed(2)}
                  </span>
                </div>
              ))}
              {filteredExpenses.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">
                      Nenhuma despesa encontrada.
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {selectedExpense ? (
            <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
              <div className="p-8 border-b border-gray-100">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                       <div className="h-20 w-20 rounded-lg bg-red-50 flex items-center justify-center text-red-500 border-4 border-white shadow-sm">
                          <DollarSign size={32} />
                       </div>
                       <div>
                          <h2 className="text-xl font-bold text-gray-900 font-heading">{selectedExpense.description}</h2>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-3xl font-bold text-red-600">- R$ {selectedExpense.amount.toFixed(2)}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="secondary" onClick={() => handleOpenModal(selectedExpense)}>
                          <Edit size={16} className="mr-2" /> Editar
                       </Button>
                       <Button variant="danger" onClick={() => handleDelete(selectedExpense.id)}>
                          <Trash2 size={16} />
                       </Button>
                    </div>
                 </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 font-heading mb-2 flex items-center gap-2">
                        <FileText size={16} /> Detalhes do Lançamento
                    </h3>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <span className="text-sm text-gray-500">Data de Pagamento</span>
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(selectedExpense.date).toLocaleDateString('pt-BR')}
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <span className="text-sm text-gray-500">Categoria</span>
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                            <Tag size={14} className="text-gray-400" />
                            Despesa Operacional
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Pago
                        </span>
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <PieChart size={32} className="text-gray-300" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Impacto no Caixa</h4>
                    <p className="text-xs text-gray-500">Esta despesa representa uma saída direta do fluxo de caixa da empresa.</p>
                 </div>

              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <TrendingDown size={48} className="mb-4 opacity-20" />
                <p>Selecione uma despesa para ver detalhes</p>
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
              <h2 className="text-xl font-bold text-gray-900 font-heading">
                  {editingId ? 'Editar Despesa' : 'Nova Despesa'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Registre pagamentos e custos.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Descrição da Despesa</label>
                <input 
                    required 
                    placeholder="Ex: Conta de Luz, Aluguel, Compra de Peças..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Valor (R$)</label>
                    <input 
                        type="number" 
                        step="0.01" 
                        required 
                        placeholder="0,00"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                        value={formData.amount} 
                        onChange={e => setFormData({...formData, amount: e.target.value})} 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Data de Pagamento</label>
                    <input 
                        type="date" 
                        required 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                        value={formData.date} 
                        onChange={e => setFormData({...formData, date: e.target.value})} 
                    />
                 </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white border-transparent">
                    {editingId ? 'Salvar Alterações' : 'Lançar Despesa'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};