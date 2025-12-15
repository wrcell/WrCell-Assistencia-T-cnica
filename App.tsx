import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LandingPage } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { DashboardHome } from './pages/dashboard/Home';
import { ServiceOrders } from './pages/dashboard/Orders';
import { PDV } from './pages/dashboard/PDV';
import { Settings } from './pages/dashboard/Settings';

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
      <Route path="/register" element={<div className="p-8 text-center">Página de Cadastro (Demo)</div>} />
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardHome />} />
        <Route path="orders" element={<ServiceOrders />} />
        <Route path="pdv" element={<PDV />} />
        <Route path="clients" element={<div className="p-8">Módulo de Clientes (Em breve)</div>} />
        <Route path="stock" element={<div className="p-8">Gestão de Estoque (Em breve)</div>} />
        <Route path="finance" element={<div className="p-8">Financeiro Detalhado (Em breve)</div>} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;