import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Pages
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Super Admin
import { SuperAdminLayout } from "@/layouts/SuperAdminLayout";
import SuperAdminDashboard from "@/pages/super-admin/Dashboard";
import Empresas from "@/pages/super-admin/Empresas";
import Planos from "@/pages/super-admin/Planos";
import Relatorios from "@/pages/super-admin/Relatorios";
import ConfiguracoesPlatform from "@/pages/super-admin/Configuracoes";

// Empresa
import { EmpresaLayout } from "@/layouts/EmpresaLayout";
import EmpresaDashboard from "@/pages/empresa/Dashboard";
import Agenda from "@/pages/empresa/Agenda";
import Clientes from "@/pages/empresa/Clientes";
import Servicos from "@/pages/empresa/Servicos";
import Notificacoes from "@/pages/empresa/Notificacoes";
import WhatsApp from "@/pages/empresa/WhatsApp";
import Conversas from "@/pages/empresa/Conversas";
import ConfiguracoesEmpresa from "@/pages/empresa/Configuracoes";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={
        isAuthenticated ? (
          <Navigate to={user?.role === 'super-admin' ? '/super-admin' : '/empresa'} replace />
        ) : (
          <Login />
        )
      } />

      {/* Index redirect */}
      <Route path="/" element={
        isAuthenticated ? (
          <Navigate to={user?.role === 'super-admin' ? '/super-admin' : '/empresa'} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/* Super Admin Routes */}
      <Route path="/super-admin" element={
        <ProtectedRoute allowedRoles={['super-admin']}>
          <SuperAdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="empresas" element={<Empresas />} />
        <Route path="planos" element={<Planos />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="configuracoes" element={<ConfiguracoesPlatform />} />
      </Route>

      {/* Empresa Routes */}
      <Route path="/empresa" element={
        <ProtectedRoute allowedRoles={['empresa-admin', 'empresa-atendente', 'empresa-profissional', 'empresa-leitura']}>
          <EmpresaLayout />
        </ProtectedRoute>
      }>
        <Route index element={<EmpresaDashboard />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="servicos" element={<Servicos />} />
        <Route path="notificacoes" element={<Notificacoes />} />
        <Route path="whatsapp" element={<WhatsApp />} />
        <Route path="conversas" element={<Conversas />} />
        <Route path="configuracoes" element={<ConfiguracoesEmpresa />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
