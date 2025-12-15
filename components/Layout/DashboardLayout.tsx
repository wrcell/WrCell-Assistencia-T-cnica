import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 focus:outline-none md:hidden mr-4"
            >
              <Menu size={24} />
            </button>
            {/* Breadcrumb or Title placeholder if needed */}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm font-medium text-gray-700">
              <User size={16} className="mr-2 text-gray-400" />
              {user?.name || 'Usuário'}
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <button 
              onClick={logout}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <LogOut size={16} className="mr-2" />
              Sair
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8F9FA] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};