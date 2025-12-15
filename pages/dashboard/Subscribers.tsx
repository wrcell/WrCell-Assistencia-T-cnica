import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  X, 
  User, 
  Upload,
  Eye,
  EyeOff,
  Crown,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// --- TYPES ---
interface Subscriber {
  id: string;
  companyName: string;
  responsibleName: string;
  email: string;
  avatarUrl?: string;
  plan: 'Trial' | 'Basic' | 'Pro' | 'Annual';
  status: 'Ativa' | 'Bloqueada' | 'Expirado';
  startDate: string;
  endDate: string;
}

// --- MOCK DATA ---
const MOCK_SUBSCRIBERS: Subscriber[] = [
  {
    id: '1',
    companyName: 'Juliano Tech',
    responsibleName: 'Juliano',
    email: 'juliano@tech.com',
    plan: 'Pro',
    status: 'Ativa',
    startDate: '2024-11-27',
    endDate: '2025-11-27',
  },
  {
    id: '2',
    companyName: 'Marcelo Cell',
    responsibleName: 'Marcelo Celulares e Assistência Técnica',
    email: 'marcelo@cell.com',
    plan: 'Annual',
    status: 'Ativa',
    startDate: '2024-11-11',
    endDate: '2025-11-11',
  },
  {
    id: '3',
    companyName: 'Davi',
    responsibleName: 'Davi Reparos',
    email: 'davi@email.com',
    plan: 'Trial',
    status: 'Expirado',
    startDate: '2024-10-01',
    endDate: '2024-10-08',
  },
  {
    id: '4',
    companyName: 'Robert Reis',
    responsibleName: 'w7reis@gmail.com',
    email: 'w7reis@gmail.com',
    plan: 'Basic',
    status: 'Ativa',
    startDate: '2024-11-12',
    endDate: '2025-11-12',
  },
  {
    id: '5',
    companyName: 'Fulano',
    responsibleName: 'Fulano Store',
    email: 'fulano@store.com',
    plan: 'Trial',
    status: 'Expirado',
    startDate: '2024-09-01',
    endDate: '2024-09-08',
  }
];

export const Subscribers: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(MOCK_SUBSCRIBERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    responsibleName: '',
    email: '',
    password: '',
    plan: 'Trial',
    status: 'Ativa',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  // Calculate default end date based on plan (simple logic)
  const calculateEndDate = (start: string, plan: string) => {
    const date = new Date(start);
    if (plan === 'Trial') date.setDate(date.getDate() + 7);
    else if (plan === 'Annual') date.setFullYear(date.getFullYear() + 1);
    else date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  };

  const handleOpenModal = (sub?: Subscriber) => {
    if (sub) {
      setEditingId(sub.id);
      setPreviewUrl(null); // In real app, load sub.avatarUrl
      setFormData({
        companyName: sub.companyName,
        responsibleName: sub.responsibleName,
        email: sub.email,
        password: '', // Don't show existing password
        plan: sub.plan,
        status: sub.status,
        startDate: sub.startDate,
        endDate: sub.endDate
      });
    } else {
      setEditingId(null);
      const start = new Date().toISOString().split('T')[0];
      setFormData({
        companyName: '',
        responsibleName: '',
        email: '',
        password: '',
        plan: 'Trial',
        status: 'Ativa',
        startDate: start,
        endDate: calculateEndDate(start, 'Trial')
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newData = { ...prev, [name]: value };
        // Auto update end date if start date or plan changes
        if (name === 'startDate' || name === 'plan') {
            newData.endDate = calculateEndDate(newData.startDate, newData.plan);
        }
        return newData;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSubscribers(prev => prev.map(s => s.id === editingId ? { ...s, ...formData } as Subscriber : s));
    } else {
      const newSub: Subscriber = {
        id: String(Date.now()),
        ...formData
      } as Subscriber;
      setSubscribers([newSub, ...subscribers]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este assinante?')) {
      setSubscribers(prev => prev.filter(s => s.id !== id));
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Pro': return 'bg-black text-white';
      case 'Annual': return 'bg-black text-white'; // Reference implies dark for premium
      case 'Basic': return 'bg-gray-200 text-gray-800';
      case 'Trial': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativa': return 'bg-[#0B0F19] text-white';
      case 'Expirado': return 'text-red-500 font-bold bg-transparent';
      case 'Bloqueada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Assinantes</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os assinantes do seu sistema, seus planos e status.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#0B0F19] hover:bg-gray-800">
          <Plus size={18} className="mr-2" /> Adicionar Assinante
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
           <h2 className="text-lg font-bold text-gray-900 font-heading">Lista de Assinantes</h2>
           <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por nome ou email..." 
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-gray-50"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 font-heading text-xs uppercase sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold">Nome</th>
                <th className="px-6 py-4 font-semibold">Plano</th>
                <th className="px-6 py-4 font-semibold">Status Assinatura</th>
                <th className="px-6 py-4 font-semibold">Validade</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSubscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm uppercase">
                        {sub.companyName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            {sub.companyName}
                            {sub.plan === 'Pro' || sub.plan === 'Annual' ? <Crown size={12} className="text-yellow-500" /> : null}
                         </span>
                         <span className="text-xs text-gray-400">{sub.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPlanBadge(sub.plan)}`}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusBadge(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sub.status === 'Expirado' ? (
                       <span className="text-red-400 font-medium">Expirado</span>
                    ) : (
                       new Date(sub.endDate).toLocaleDateString('pt-BR')
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleOpenModal(sub)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                          <MoreHorizontal size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in relative">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                 <h2 className="text-xl font-bold text-gray-900 font-heading flex items-center gap-2">
                    <User size={20} />
                    {editingId ? 'Editar Assinante' : 'Adicionar Novo Assinante'}
                 </h2>
                 <p className="text-sm text-gray-500 mt-1">Insira os dados para {editingId ? 'editar o' : 'criar um novo'} perfil de assinante.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
               
               {/* Avatar Upload */}
               <div className="flex items-center gap-4 justify-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center relative overflow-hidden group">
                     {previewUrl ? (
                        <img src={previewUrl} className="w-full h-full object-cover" alt="Avatar" />
                     ) : (
                        <User size={32} className="text-gray-300" />
                     )}
                  </div>
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-gray-900">Foto</span>
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                     <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <Upload size={14} /> Carregar Imagem
                     </button>
                  </div>
               </div>

               {/* Fields */}
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nome da Empresa</label>
                  <input required type="text" name="companyName" placeholder="Ex: WR Cell" 
                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-accent"
                     value={formData.companyName} onChange={handleInputChange} />
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nome do Responsável</label>
                  <input required type="text" name="responsibleName" placeholder="Ex: João da Silva" 
                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-accent"
                     value={formData.responsibleName} onChange={handleInputChange} />
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email (Login)</label>
                  <input required type="email" name="email" placeholder="Ex: joao@email.com" 
                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-accent"
                     value={formData.email} onChange={handleInputChange} />
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Senha</label>
                  <div className="relative">
                     <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-accent pr-10"
                        value={formData.password} onChange={handleInputChange} />
                     <button type="button" onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1.5">Plano</label>
                     <select name="plan" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm bg-white"
                        value={formData.plan} onChange={handleInputChange}>
                        <option value="Trial">Trial</option>
                        <option value="Basic">Basic</option>
                        <option value="Pro">Pro</option>
                        <option value="Annual">Annual</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1.5">Status da Assinatura</label>
                     <select name="status" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm bg-white"
                        value={formData.status} onChange={handleInputChange}>
                        <option value="Ativa">Ativa</option>
                        <option value="Bloqueada">Bloqueada</option>
                        <option value="Expirado">Expirado</option>
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1.5">Início da Assinatura</label>
                     <input type="date" name="startDate" 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm"
                        value={formData.startDate} onChange={handleInputChange} />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1.5">Fim da Assinatura</label>
                     <input type="date" name="endDate" 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm"
                        value={formData.endDate} onChange={handleInputChange} />
                  </div>
               </div>

               <div className="flex justify-end gap-3 pt-2">
                  <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" className="bg-[#0B0F19] hover:bg-gray-800 text-white">Salvar</Button>
               </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};