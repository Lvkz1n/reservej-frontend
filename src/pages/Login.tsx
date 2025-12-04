import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.svg";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Mail, RotateCcw } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe sua senha"),
  captcha: z.string().min(1, "Resolva o desafio para continuar"),
});

const getCompanyHome = (role?: string | null) => {
  if (!role) return "/empresa";
  if (role === "atendente" || role === "profissional") return "/empresa/agenda";
  return "/empresa";
};

const generateCaptcha = () => {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  return { question: `${a} + ${b}`, answer: a + b };
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "admin@reserveja.local",
      password: "",
      captcha: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (Number(values.captcha) !== captcha.answer) {
        toast({
          title: "Captcha incorreto",
          description: "Resolva o desafio para continuar.",
          variant: "destructive",
        });
        setCaptcha(generateCaptcha());
        form.setValue("captcha", "");
        return;
      }

      const user = await login(values);
      const companyRole = user.companies?.[0]?.role ?? null;
      const redirectTo = user.role_global === "super_admin" ? "/super-admin" : getCompanyHome(companyRole);
      navigate(redirectTo, { replace: true });
      toast({
        title: "Login realizado",
        description: "Sessão iniciada com sucesso.",
      });
    } catch (error: any) {
      const message = error?.message ?? "Não foi possível entrar. Verifique as credenciais.";
      toast({
        title: "Falha ao autenticar",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              Autentique com seu e-mail e senha para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">E-mail</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                          <Input
                            type="email"
                            placeholder="admin@reserveja.local"
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/60"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/60"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="captcha"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-white">Validação</FormLabel>
                        <button
                          type="button"
                          onClick={() => {
                            setCaptcha(generateCaptcha());
                            form.setValue("captcha", "");
                          }}
                          className="flex items-center gap-1 text-xs text-white/70 hover:text-white"
                          aria-label="Atualizar desafio"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Trocar
                        </button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder={`Resolva: ${captcha.question}`}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/60"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-auto py-3 bg-primary text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Entrando...
                    </div>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
