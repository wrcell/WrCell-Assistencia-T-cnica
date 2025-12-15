import React, { useState } from 'react';
import { MOCK_USERS } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { Button } from '../../components/ui/Button';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Check, 
  X, 
  AlertCircle,
  Eye,
  Edit,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { User as UserType, UserPermissions, PermissionRule } from '../../types';

// Default permissions for new users
const DEFAULT_PERMISSIONS: UserPermissions = {
    clients: { view: true, create: false, edit: false, delete: false },
    orders: { view: true, create: true, edit: false, delete: false },
    stock: { view: true, create: false, edit: false, delete: false },
    financial: { view: false, create: false, edit: false, delete: false },
    reports: { view: false, create: false, edit: false, delete: false }
};

export const Permissions: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { isAccountReadOnly, isTrialActive, daysRemaining } = useCompany();
  
  const [users, setUsers] = useState<UserType[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(
      MOCK_USERS.find(u => u.profile !== 'client') || null
  );
  
  // Local state for permissions being edited
  const [currentPermissions, setCurrentPermissions] = useState<UserPermissions>(
      selectedUser?.customPermissions || DEFAULT_PERMISSIONS
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Security Check
  if (currentUser?.profile !== 'admin') {
      return (
          <div className="h-[calc(100vh-6rem)] flex flex-col items-center justify-center text-center">
              <Lock size={64} className="text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 font-heading">Acesso Negado</h2>
              <p className="text-gray-500 mt-2">Apenas administradores podem acessar esta área.</p>
          </div>
      );
  }

  const handleUserSelect = (u: UserType) => {
      if (hasUnsavedChanges) {
          if (!window.confirm("Você tem alterações não salvas. Deseja descartar?")) return;
      }
      setSelectedUser(u);
      setCurrentPermissions(u.customPermissions || DEFAULT_PERMISSIONS);
      setHasUnsavedChanges(false);
  };

  const togglePermission = (module: keyof UserPermissions, action: keyof PermissionRule) => {
      if (selectedUser?.profile === 'admin') return; // Admins always have full access

      setCurrentPermissions(prev => ({
          ...prev,
          [module]: {
              ...prev[module],
              [action]: !prev[module][action]
          }
      }));
      setHasUnsavedChanges(true);
  };

  const handleSave = () => {
      if (!selectedUser) return;
      
      const updatedUsers = users.map(u => 
          u.id === selectedUser.id 
              ? { ...u, customPermissions: currentPermissions } 
              : u
      );
      
      setUsers(updatedUsers);
      // In a real app, API call here
      setHasUnsavedChanges(false);
      alert(`Permissões atualizadas para ${selectedUser.firstName}.`);
  };

  // Filter out clients, we only manage employees/admins
  const staffUsers = users.filter(u => u.profile !== 'client');

  const modules = [
      { key: 'clients', label: 'Clientes' },
      { key: 'orders', label: 'Ordens de Serviço' },
      { key: 'stock', label: 'Estoque / Produtos' },
      { key: 'financial', label: 'Financeiro' },
      { key: 'reports', label: 'Relatórios' },
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col font-sans space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
          <ShieldCheck className="text-gray-900" size={24} />
          Permissões de Acesso
        </h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie o que cada usuário pode ver ou fazer no sistema.</p>
      </div>

      {/* Trial / Lock Warning */}
      {isAccountReadOnly && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
              <div className="flex items-start">
                  <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
                  <div>
                      <h3 className="text-sm font-bold text-red-800 font-heading">Conta em Modo Leitura</h3>
                      <p className="text-sm text-red-700 mt-1">
                          Seu período de teste acabou ou sua conta está bloqueada. Nenhuma alteração (criar, editar, excluir) será permitida para nenhum usuário, independente das permissões abaixo.
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
          
          {/* User List Sidebar */}
          <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-700 font-heading">Usuários do Sistema</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                  {staffUsers.map(u => (
                      <button
                          key={u.id}
                          onClick={() => handleUserSelect(u)}
                          className={`w-full p-4 flex items-center gap-3 transition-colors text-left border-l-4
                              ${selectedUser?.id === u.id 
                                  ? 'bg-blue-50 border-accent' 
                                  : 'border-transparent hover:bg-gray-50'}`}
                      >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                              ${u.profile === 'admin' ? 'bg-[#0B0F19]' : 'bg-gray-400'}`}>
                              {u.firstName.charAt(0)}
                          </div>
                          <div>
                              <div className="text-sm font-bold text-gray-900">{u.firstName} {u.lastName}</div>
                              <div className="text-xs text-gray-500 capitalize">{u.profile === 'admin' ? 'Administrador' : 'Colaborador'}</div>
                          </div>
                      </button>
                  ))}
              </div>
          </div>

          {/* Permissions Matrix */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
              {selectedUser ? (
                  <>
                      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                          <div>
                              <h2 className="text-lg font-bold text-gray-900 font-heading">
                                  Configurar Acesso: {selectedUser.firstName} {selectedUser.lastName}
                              </h2>
                              <p className="text-xs text-gray-500 mt-1">
                                  {selectedUser.profile === 'admin' 
                                      ? 'Administradores possuem acesso total irrestrito.' 
                                      : 'Defina as permissões granulares para este colaborador.'}
                              </p>
                          </div>
                          {hasUnsavedChanges && (
                              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white animate-pulse">
                                  Salvar Alterações
                              </Button>
                          )}
                      </div>

                      <div className="flex-1 overflow-y-auto p-6">
                          {selectedUser.profile === 'admin' ? (
                              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 opacity-70">
                                  <ShieldCheck size={64} className="mb-4 text-accent" />
                                  <h3 className="text-xl font-bold text-gray-900">Acesso Total</h3>
                                  <p>Este usuário é um Administrador e tem controle total do sistema.</p>
                              </div>
                          ) : (
                              <div className="overflow-hidden border border-gray-200 rounded-lg">
                                  <table className="w-full text-sm text-left">
                                      <thead className="bg-gray-50 text-gray-500 font-heading uppercase text-xs">
                                          <tr>
                                              <th className="px-6 py-4">Módulo</th>
                                              <th className="px-6 py-4 text-center">Visualizar</th>
                                              <th className="px-6 py-4 text-center">Criar</th>
                                              <th className="px-6 py-4 text-center">Editar</th>
                                              <th className="px-6 py-4 text-center">Excluir</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100">
                                          {modules.map((mod) => {
                                              const perms = currentPermissions[mod.key as keyof UserPermissions];
                                              return (
                                                  <tr key={mod.key} className="hover:bg-gray-50">
                                                      <td className="px-6 py-4 font-medium text-gray-900">
                                                          {mod.label}
                                                      </td>
                                                      {['view', 'create', 'edit', 'delete'].map((action) => {
                                                          const isAllowed = perms[action as keyof PermissionRule];
                                                          const Icon = action === 'view' ? Eye : action === 'create' ? PlusCircle : action === 'edit' ? Edit : Trash2;
                                                          
                                                          return (
                                                              <td key={action} className="px-6 py-4 text-center">
                                                                  <button 
                                                                      onClick={() => togglePermission(mod.key as keyof UserPermissions, action as keyof PermissionRule)}
                                                                      className={`p-2 rounded-lg transition-all ${
                                                                          isAllowed 
                                                                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                                              : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                                                                      }`}
                                                                  >
                                                                      <Icon size={18} />
                                                                  </button>
                                                              </td>
                                                          );
                                                      })}
                                                  </tr>
                                              );
                                          })}
                                      </tbody>
                                  </table>
                              </div>
                          )}
                      </div>
                  </>
              ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                      <User size={48} className="mb-4 opacity-20" />
                      <p>Selecione um usuário para gerenciar permissões.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};