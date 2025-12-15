import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CompanyProvider } from './context/CompanyContext';
import { LandingPage } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { DashboardHome } from './pages/dashboard/Home';
import { ServiceOrders } from './pages/dashboard/Orders';
import { CheckIn } from './pages/dashboard/CheckIn';
import { PDV } from './pages/dashboard/PDV';
import { Clients } from './pages/dashboard/Clients';
import { Stock } from './pages/dashboard/Stock';
import { Services } from './pages/dashboard/Services';
import { Categories } from './pages/dashboard/Categories';
import { Suppliers } from './pages/dashboard/Suppliers';
import { Schedule } from './pages/dashboard/Schedule';
import { Technicians } from './pages/dashboard/Technicians';
import { Cash } from './pages/dashboard/Cash';
import { Expenses } from './pages/dashboard/Expenses';
import { Receivables } from './pages/dashboard/Receivables';
import { Slips } from './pages/dashboard/Slips';
import { NFe } from './pages/dashboard/NFe';
import { Reports } from './pages/dashboard/Reports';
import { Loyalty } from './pages/dashboard/Loyalty';
import { Marketing } from './pages/dashboard/Marketing';
import { Settings } from './pages/dashboard/Settings';
import { Permissions } from './pages/dashboard/Permissions';
import { Subscribers } from './pages/dashboard/Subscribers';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardHome />} />
        <Route path="checkin" element={<CheckIn />} />
        <Route path="orders" element={<ServiceOrders />} />
        <Route path="pdv" element={<PDV />} />
        <Route path="clients" element={<Clients />} />
        <Route path="stock" element={<Stock />} />
        <Route path="services" element={<Services />} />
        <Route path="categories" element={<Categories />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="technicians" element={<Technicians />} />
        <Route path="cash" element={<Cash />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="receivables" element={<Receivables />} />
        <Route path="slips" element={<Slips />} />
        <Route path="nfe" element={<NFe />} />
        <Route path="reports" element={<Reports />} />
        <Route path="loyalty" element={<Loyalty />} />
        <Route path="content" element={<Marketing />} />
        <Route path="settings" element={<Settings />} />
        <Route path="permissions" element={<Permissions />} />
        <Route path="subscribers" element={<Subscribers />} />
        
        {/* Placeholders for remaining less critical routes */}
        <Route path="companies" element={<div className="p-8">Gestão de Empresas (Em breve)</div>} />
        <Route path="admins" element={<div className="p-8">Administradores do Sistema (Em breve)</div>} />
        <Route path="notifications" element={<div className="p-8">Notificações (Em breve)</div>} />
        <Route path="content-gen" element={<div className="p-8">Gerador de Conteúdo (Em breve)</div>} />
        <Route path="faq" element={<div className="p-8">FAQ (Em breve)</div>} />
        <Route path="about" element={<div className="p-8">Sobre o Sistema (Em breve)</div>} />
        <Route path="terms" element={<div className="p-8">Termos de Uso (Em breve)</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CompanyProvider>
        <AuthProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </AuthProvider>
      </CompanyProvider>
    </ThemeProvider>
  );
};

export default App;