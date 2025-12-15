import React, { useState, useEffect, useRef } from 'react';
import { MOCK_USERS, MOCK_ORDERS } from '../../services/mockData';
import { Button } from '../../components/ui/Button';
import { Plus, Search, User, Phone, Mail, X, Trash2, Edit, Upload, MessageCircle, Calendar, MapPin, FileText, Lock, AlertTriangle, MoreHorizontal, Download } from 'lucide-react';
import { User as UserType } from '../../types';
import { useAuth } from '../../context/AuthContext';

// Helper to parse device from technical report for history view
const getDeviceFromReport = (report: string) => {
  const match = report.match(/Device: (.*?)( \| |$)/);
  if (match) return match[1];
  // Fallback for simple reports
  if (report.includes('iPhone')) return 'iPhone';
  if (report.includes('Samsung')) return 'Samsung';
  return 'Aparelho Diverso';
};

export const Clients: React.FC = () => {
  const { user } = useAuth(); // Auth context for permissions
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<UserType[]>([]);
  const [selectedClient, setSelectedClient] = useState<UserType | null>(null);
  
  // Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Create/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<UserType | null>(null);
  
  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDeleteId, setClientToDeleteId] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',      
    cpf: '',            
    stateReg: '',       
    address: ''         
  });

  useEffect(() => {
    // Simulate API Fetch
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300)); // Small delay for realism
      const clientList = MOCK_USERS.filter(u => u.profile === 'client');
      setClients(clientList);
      if (clientList.length > 0) {
        setSelectedClient(clientList[0]);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const openNewClientModal = () => {
    setEditingClient(null);
    setPreviewUrl(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      cpf: '',
      stateReg: '',
      address: ''
    });
    setIsModalOpen(true);
  };

  const openEditClientModal = (client: UserType) => {
    setEditingClient(client);
    setPreviewUrl(null); // In real app, set to client.avatarUrl
    setFormData({
      fullName: `${client.firstName} ${client.lastName}`,
      email: client.email,
      phone: client.phone,
      birthDate: '', 
      cpf: '000.000.000-00', 
      stateReg: '',
      address: 'Rua Francisco Mulezini, 1229' 
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Split Full Name
    const nameParts = formData.fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    if (editingClient) {
      // Update existing
      const updatedClients = clients.map(c => 
        c.id === editingClient.id 
          ? { ...c, firstName, lastName, email: formData.email, phone: formData.phone } 
          : c
      );
      setClients(updatedClients);
      // Update selected if needed
      if (selectedClient?.id === editingClient.id) {
         setSelectedClient({ ...editingClient, firstName, lastName, email: formData.email, phone: formData.phone });
      }
    } else {
      // Create new
      const newClient: UserType = {
        id: String(Date.now()),
        companyId: '1',
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        profile: 'client'
      };
      const newClientsList = [newClient, ...clients];
      setClients(newClientsList);
      setSelectedClient(newClient);
    }
    
    setIsModalOpen(false);
  };

  // --- DELETE FLOW START ---

  const requestDelete = (clientId: string) => {
     if (!clientId) return;
     setActiveMenuId(null);

     // 1. Check Permission
     if (user?.profile !== 'admin') {
       alert('⛔ ACESSO NEGADO\n\nVocê não tem permissão para excluir clientes. Contate o administrador.');
       return;
     }

     // 2. Open Confirmation Modal
     setClientToDeleteId(clientId);
     setAdminPassword('');
     setDeleteError('');
     setIsDeleteModalOpen(true);
  };

  const confirmDelete = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock Password Check (In real app, this would verify against backend or current user session)
    // For demo purposes, let's assume the password is "admin"
    if (adminPassword !== 'admin') {
        setDeleteError('Senha incorreta. Tente novamente.');
        return;
    }

    if (clientToDeleteId) {
        const remaining = clients.filter(c => c.id !== clientToDeleteId);
        setClients(remaining);
        
        if (selectedClient?.id === clientToDeleteId) {
           setSelectedClient(remaining.length > 0 ? remaining[0] : null);
        }
    }

    setIsDeleteModalOpen(false);
    setClientToDeleteId(null);
  };

  // --- DELETE FLOW END ---

  const handleWhatsApp = (phone: string) => {
    if (!phone) {
        alert("Este cliente não possui telefone cadastrado.");
        return;
    }
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length < 8) {
        alert("Número de telefone inválido para WhatsApp.");
        return;
    }
    let finalNumber = numbers;
    if (numbers.length <= 11) {
        finalNumber = `55${numbers}`;
    }
    const link = `https://wa.me/${finalNumber}`;
    window.open(link, '_blank');
  };

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           client.phone.includes(searchTerm);
  });

  const handleExportCSV = () => {
    // Define headers
    const headers = ["ID", "Nome Completo", "Email", "Telefone", "Pontos Fidelidade"];
    
    // Convert data to CSV format
    const csvContent = [
      headers.join(","),
      ...filteredClients.map(c => [
        c.id,
        `"${c.firstName} ${c.lastName}"`, // Quote to handle spaces/commas safely
        c.email,
        c.phone,
        c.points || 0
      ].join(","))
    ].join("\n");

    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `clientes_wrcell_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  const clientOrders = selectedClient 
    ? MOCK_ORDERS.filter(o => o.clientId === selectedClient.id)
    : [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Concluído': return 'text-green-600 bg-green-50 border-green-100';
      case 'Pendente': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4 font-sans">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie sua base de clientes e seus históricos.</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportCSV} disabled={filteredClients.length === 0}>
                <Download size={18} className="mr-2" />
                Exportar CSV
            </Button>
            <Button onClick={openNewClientModal} className="bg-[#0B0F19]">
                <Plus size={18} className="mr-2" />
                Adicionar Cliente
            </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        
        {/* Left Column: Client List */}
        <div className="w-full lg:w-4/12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-white">
             <h2 className="text-lg font-bold text-gray-900 font-heading">Lista de Clientes</h2>
             <p className="text-xs text-gray-500 mb-4">{clients.length} clientes cadastrados.</p>
             
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-gray-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto">
             <div className="divide-y divide-gray-50">
               {filteredClients.map(client => (
                 <div 
                   key={client.id}
                   onClick={() => setSelectedClient(client)}
                   className={`p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50 
                     ${selectedClient?.id === client.id ? 'bg-blue-50/60 border-l-4 border-accent pl-3' : 'border-l-4 border-transparent pl-3'}`}
                 >
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                          {getInitials(client.firstName)}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-gray-900 leading-none">{client.firstName} {client.lastName}</p>
                          <p className="text-xs text-gray-400 mt-1 truncate max-w-[150px]">{client.email}</p>
                       </div>
                    </div>
                    
                    {/* Action Menu */}
                    <div className="relative">
                        <button 
                           onClick={(e) => {
                               e.stopPropagation();
                               setActiveMenuId(activeMenuId === client.id ? null : client.id);
                           }}
                           className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                           <MoreHorizontal size={16} />
                        </button>

                        {activeMenuId === client.id && (
                            <div 
                                ref={menuRef}
                                className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button 
                                    onClick={() => openEditClientModal(client)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Edit size={14} className="text-gray-500" /> Editar
                                </button>
                                <button 
                                    onClick={() => requestDelete(client.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50"
                                >
                                    <Trash2 size={14} /> Excluir
                                </button>
                            </div>
                        )}
                    </div>
                 </div>
               ))}
               {filteredClients.length === 0 && (
                 <div className="p-8 text-center text-gray-400 text-sm">
                   Nenhum cliente encontrado.
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Right Column: Client Details */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {selectedClient ? (
            <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
               {/* Client Profile Header */}
               <div className="p-8 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                     <FileText size={20} className="text-gray-900" />
                     <h2 className="text-lg font-bold text-gray-900 font-heading">Detalhes do Cliente</h2>
                  </div>
                  <p className="text-xs text-gray-500 mb-6 uppercase tracking-wide font-bold">Informações de {selectedClient.firstName} {selectedClient.lastName}</p>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                     <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400 border-4 border-white shadow-sm overflow-hidden relative">
                           {previewUrl ? (
                             <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                             formData.fullName ? getInitials(formData.fullName) : <User size={32} />
                           )}
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-xl font-bold text-gray-900 font-heading">{selectedClient.firstName} {selectedClient.lastName}</h3>
                           <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Mail size={14} /> {selectedClient.email}
                           </div>
                           <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone size={14} /> {selectedClient.phone}
                           </div>
                           <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin size={14} /> Rua Francisco Mulezini, 1229
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <Button 
                            variant="secondary" 
                            className="border-green-200 text-green-700 hover:bg-green-50 flex items-center gap-2"
                            onClick={() => handleWhatsApp(selectedClient.phone)}
                        >
                           <MessageCircle size={18} /> Chamar
                        </Button>
                        <Button 
                            variant="secondary" 
                            onClick={() => openEditClientModal(selectedClient)} 
                            className="flex items-center gap-2"
                        >
                           <Edit size={18} /> Editar
                        </Button>
                     </div>
                  </div>
               </div>

               {/* History Section */}
               <div className="p-8 flex-1 bg-gray-50/50">
                  <h3 className="text-sm font-bold text-gray-900 font-heading mb-4">Histórico de Ordens de Serviço</h3>
                  
                  {clientOrders.length > 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                       <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 text-gray-500 font-heading">
                             <tr>
                                <th className="px-6 py-3 font-medium">OS</th>
                                <th className="px-6 py-3 font-medium">Data</th>
                                <th className="px-6 py-3 font-medium">Aparelho</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Valor</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                             {clientOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                   <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                                   <td className="px-6 py-4 text-gray-500">{new Date(order.entryDate).toLocaleDateString('pt-BR')}</td>
                                   <td className="px-6 py-4 text-gray-700">{getDeviceFromReport(order.technicalReport)}</td>
                                   <td className="px-6 py-4">
                                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(order.status)}`}>
                                         {order.status}
                                      </span>
                                   </td>
                                   <td className="px-6 py-4 text-right font-bold text-gray-900">R$ 0,00</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
                       <p className="text-gray-400 font-medium">Nenhuma ordem de serviço encontrada para este cliente.</p>
                    </div>
                  )}
               </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50">
                <div className="bg-white p-6 rounded-full mb-4 shadow-sm">
                  <User size={48} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum cliente selecionado</h3>
                <p>Selecione um cliente na lista ao lado para ver os detalhes completos.</p>
             </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <X size={20} />
            </button>

            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-heading flex items-center gap-2">
                 <User size={24} />
                 {editingClient ? 'Editar Cadastro de Cliente' : 'Novo Cadastro de Cliente'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Atualize os dados do cliente.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                 <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400 overflow-hidden relative">
                       {previewUrl ? (
                         <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                         formData.fullName ? getInitials(formData.fullName) : <User size={32} />
                       )}
                    </div>
                    <div>
                       <span className="block text-sm font-bold text-gray-900 mb-2">Foto do Cliente</span>
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         className="hidden" 
                         accept="image/*"
                         onChange={handleImageUpload}
                       />
                       <button 
                         type="button" 
                         onClick={triggerFileInput}
                         className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                       >
                          <Upload size={16} /> Carregar Imagem
                       </button>
                    </div>
                 </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Nome Completo</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Telefone (WhatsApp)</label>
                    <input 
                      type="text" 
                      name="phone"
                      required
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">CPF / CNPJ</label>
                    <input 
                      type="text" 
                      name="cpf"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm"
                      value={formData.cpf}
                      onChange={handleInputChange}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Data de Nascimento</label>
                    <input 
                      type="date" 
                      name="birthDate"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                    />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5 font-heading">Endereço Completo</label>
                <input 
                  type="text" 
                  name="address"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-[#0B0F19]">Salvar Cliente</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in relative p-6">
              <div className="flex flex-col items-center text-center mb-6">
                 <div className="bg-red-100 p-3 rounded-full mb-4 text-red-600">
                    <AlertTriangle size={32} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900 font-heading">Confirmar Exclusão</h2>
                 <p className="text-sm text-gray-500 mt-2">
                    Esta ação é irreversível. O cliente e todo seu histórico serão removidos.
                 </p>
              </div>

              <form onSubmit={confirmDelete} className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Senha de Administrador</label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                           type="password" 
                           className={`w-full pl-9 pr-4 py-2.5 border rounded-lg outline-none text-sm ${deleteError ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-200'} focus:ring-2`}
                           placeholder="Digite sua senha..."
                           value={adminPassword}
                           onChange={(e) => setAdminPassword(e.target.value)}
                           autoFocus
                        />
                    </div>
                    {deleteError && <p className="text-xs text-red-500 mt-1">{deleteError}</p>}
                 </div>

                 <div className="flex gap-3 pt-2">
                    <Button variant="secondary" type="button" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
                    <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white">Excluir</Button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};