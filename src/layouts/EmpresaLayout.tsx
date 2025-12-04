import { useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Bell,
  MessageCircle,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Smartphone,
  BarChart3,
} from "lucide-react";

const menuItems = [
  { path: "/empresa", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/empresa/agenda", icon: Calendar, label: "Agenda" },
  { path: "/empresa/clientes", icon: Users, label: "Clientes" },
  { path: "/empresa/servicos", icon: Scissors, label: "Serviços" },
  { path: "/empresa/notificacoes", icon: Bell, label: "Mensagens & Notificações" },
  { path: "/empresa/whatsapp", icon: Smartphone, label: "Conexão WhatsApp" },
  { path: "/empresa/conversas", icon: MessageSquare, label: "Conversas", badge: "Em breve" },
  { path: "/empresa/relatorios", icon: BarChart3, label: "Relatórios" },
  { path: "/empresa/configuracoes", icon: Settings, label: "Configurações" },
];

export function EmpresaLayout() {
  const { user, companies, companyId, companyRole, setCompany, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const roleIsLimited = companyRole === "atendente" || companyRole === "profissional";
  const homePath = roleIsLimited ? "/empresa/agenda" : "/empresa";
  const filteredMenuItems = roleIsLimited
    ? menuItems.filter(
        (item) =>
          item.path !== "/empresa/configuracoes" &&
          item.path !== "/empresa" &&
          item.path !== "/empresa/whatsapp",
      )
    : menuItems;
  const activeCompany = useMemo(
    () => companies.find((company) => company.id === companyId) ?? companies[0],
    [companies, companyId],
  );

  const getRoleLabel = () => {
    switch (companyRole) {
      case "admin":
        return "Administrador";
      case "atendente":
        return "Atendente";
      case "profissional":
        return "Profissional";
      case "leitura":
        return "Leitura";
      default:
        return "Usuário";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-card"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col sidebar-gradient transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo & Company */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <Link to={homePath} className="flex items-center gap-3">
            <img src={logo} alt="ReserveJá" className="h-8 w-8" />
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-sidebar-foreground leading-tight">
                  {activeCompany?.name || "Empresa"}
                </span>
                <span className="text-xs text-sidebar-muted">ReserveJá</span>
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronRight
              className={cn("h-4 w-4 transition-transform", !sidebarOpen && "rotate-180")}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/empresa" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="flex-1 font-medium text-sm">{item.label}</span>}
                {sidebarOpen && item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-accent/20 text-accent">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {sidebarOpen && companies.length > 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-sidebar-muted mb-1">Empresa</p>
            <Select value={activeCompany?.id ?? ""} onValueChange={(value) => setCompany(value)}>
              <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* User Info & Logout */}
        <div className="p-4 border-t border-sidebar-border">
          {sidebarOpen && (
            <div className="mb-3 px-3">
              <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
              <p className="text-xs text-sidebar-muted">{getRoleLabel()}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              !sidebarOpen && "justify-center px-0",
            )}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && "Sair"}
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20",
        )}
      >
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
