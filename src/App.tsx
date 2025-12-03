import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Pages
import Landing from "@/pages/Landing";
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
import RelatoriosEmpresa from "@/pages/empresa/Relatorios";

const queryClient = new QueryClient();

const getCompanyHome = (role?: string | null) => {
  if (!role) return "/empresa";
  if (role === "atendente" || role === "profissional") return "/empresa/agenda";
  return "/empresa";
};

function ProtectedRoute({
  children,
  allowedGlobalRoles,
  allowedCompanyRoles,
  requireCompany = false,
}: {
  children: React.ReactNode;
  allowedGlobalRoles?: string[];
  allowedCompanyRoles?: string[];
  requireCompany?: boolean;
}) {
  const { isAuthenticated, isLoading, roleGlobal, companyRole, companyId } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedGlobalRoles && !allowedGlobalRoles.includes(roleGlobal ?? "")) {
    return <Navigate to="/login" replace />;
  }

  if (requireCompany && !companyId) {
    return <Navigate to="/login" replace />;
  }

  if (allowedCompanyRoles && (!companyRole || !allowedCompanyRoles.includes(companyRole))) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, roleGlobal, companyRole, companyId } = useAuth();
  const companyHome = getCompanyHome(companyRole);

  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<Landing />} />

      {/* Public */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? roleGlobal === "super_admin"
              ? <Navigate to="/super-admin" replace />
              : companyId
                ? <Navigate to={companyHome} replace />
                : <Login />
            : <Login />
        }
      />

      {/* Super Admin Routes */}
      <Route path="/super-admin" element={
        <ProtectedRoute allowedGlobalRoles={['super_admin']}>
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
        <ProtectedRoute
          allowedCompanyRoles={['admin', 'atendente', 'profissional', 'leitura']}
          requireCompany
        >
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
        <Route path="relatorios" element={<RelatoriosEmpresa />} />
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
