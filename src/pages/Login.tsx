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
    redirect: '/empresa'
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="ReserveJá" className="h-16 w-16 mb-4" />
          <h1 className="text-3xl font-bold text-foreground">ReserveJá</h1>
          <p className="text-muted-foreground mt-1">Sistema de Agendamentos</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Acesso ao Sistema</CardTitle>
            <CardDescription>
              Selecione o tipo de acesso para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {loginOptions.map((option) => (
              <Button
                key={option.role}
                variant="outline"
                className="w-full h-auto py-4 px-4 justify-start gap-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                onClick={() => handleLogin(option.role, option.redirect)}
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <option.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Sistema mockado • Dados de demonstração
        </p>
      </div>
    </div>
  );
}
