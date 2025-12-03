import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/mock/data";
import { Shield, Building2, Headphones, UserCheck } from "lucide-react";

const loginOptions: { role: UserRole; label: string; description: string; icon: React.ElementType; redirect: string }[] = [
  {
    role: 'super-admin',
    label: 'Super Admin',
    description: 'Acesso completo ao sistema',
    icon: Shield,
    redirect: '/super-admin'
  },
  {
    role: 'empresa-admin',
    label: 'Empresa - Admin',
    description: 'Gerenciar empresa completa',
    icon: Building2,
    redirect: '/empresa'
  },
  {
    role: 'empresa-atendente',
    label: 'Empresa - Atendente',
    description: 'Gerenciar agendamentos',
    icon: Headphones,
    redirect: '/empresa/agenda'
  },
  {
    role: 'empresa-profissional',
    label: 'Empresa - Profissional',
    description: 'Visualizar sua agenda',
    icon: UserCheck,
    redirect: '/empresa'
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole, redirect: string) => {
    login(role);
    navigate(redirect);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#060b1b] text-white p-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(82,111,255,0.14),_transparent_35%),radial-gradient(circle_at_30%_20%,_rgba(76,201,240,0.12),_transparent_30%),radial-gradient(circle_at_80%_0%,_rgba(82,111,255,0.12),_transparent_25%)]" />
      </div>
      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="ReserveJá" className="h-16 w-16 mb-4 drop-shadow-lg" />
          <h1 className="text-3xl font-bold text-white">ReserveJá</h1>
          <p className="text-white/70 mt-1">Sistema de Agendamentos</p>
        </div>

        {/* Login Card */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl text-white">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-white/70">
              Selecione o tipo de acesso para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {loginOptions.map((option) => (
              <Button
                key={option.role}
                variant="outline"
                className="w-full h-auto py-4 px-4 justify-start gap-4 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-primary/40 transition-all duration-200"
                onClick={() => handleLogin(option.role, option.redirect)}
              >
                <div className="p-2 rounded-lg bg-primary/15 text-primary">
                  <option.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">{option.label}</p>
                  <p className="text-xs text-white/70">{option.description}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-white/60 mt-6">
          Sistema mockado • Dados de demonstração
        </p>
      </div>
    </div>
  );
}
