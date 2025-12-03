import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, CheckCircle2 } from "lucide-react";
import logo from "@/assets/logo.svg";

const plans = [
  {
    name: "Básico",
    price: "R$ 29,90/mês",
    description: "Para quem está começando a organizar reservas on-line.",
    features: ["Calendário essencial", "Painel simplificado", "Suporte via email"],
  },
  {
    name: "Profissional",
    price: "R$ 59,90/mês",
    description: "Ideal para empresas que precisam de automações e equipe.",
    features: ["Tudo do Básico", "Relatórios avançados", "Integração com WhatsApp"],
  },
  {
    name: "Empresarial",
    price: "R$ 99,90/mês",
    description: "Operações em escala com suporte dedicado.",
    features: ["Onboarding guiado", "APIs personalizadas", "SLA com resposta prioritária"],
  },
];

const navigation = [
  { label: "Planos", href: "#planos" },
  { label: "Contato", href: "#contato" },
  { label: "História", href: "#historia" },
  { label: "Cadastrar", href: "/login" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#060b1b] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-40" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(82,111,255,0.14),_transparent_35%),radial-gradient(circle_at_30%_20%,_rgba(76,201,240,0.12),_transparent_30%),radial-gradient(circle_at_80%_0%,_rgba(82,111,255,0.12),_transparent_25%)]" />
      </div>

      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#050916]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Reserve Já" className="h-11 w-11 rounded-lg shadow-md" />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold tracking-tight">Reserve Já</span>
              <span className="text-xs text-white/70">Sistema de Agendamentos</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
            {navigation.map((item) => (
              item.href.startsWith("#") ? (
                <a key={item.label} href={item.href} className="transition hover:text-white">
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} to={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="secondary" className="bg-white text-[#0a0f1f] hover:bg-white/90">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-0">
        <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-20 pt-16 lg:flex-row lg:items-center lg:pb-24 lg:pt-20">
          <div className="flex-1 space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Plataforma de reservas</p>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Reserve Ja</h1>
              <p className="max-w-2xl text-lg text-white/80">
                Nasceu em 2025 para ajudar empresas brasileiras a automatizar atendimento e lotação de agendas com poucos
                cliques. Hoje somos parceiros de centenas de negócios que administram reservas, pagamentos e comunicação em
                um único painel.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="px-6 py-3 text-base">
                <a href="#planos">Conhecer planos</a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 bg-white/5 px-6 py-3 text-base text-white hover:bg-white/10">
                <Link to="/login">Criar conta</Link>
              </Button>
            </div>
          </div>

          <div id="historia" className="flex-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/60">Nossa história</div>
              <p className="text-white/80 leading-relaxed">
                A Reserveja LTDA começou como uma equipe de especialistas em hospitalidade. Identificamos que agendamentos eram
                feitos em planilhas sem contexto, desperdiçando tempo e dinheiro. Criamos um template inteligente, conectamos
                notificações e evoluímos para o painel completo que você vê hoje.
              </p>
              <p className="mt-4 text-white/80">Estamos prontos para o seu negócio escalar com segurança.</p>
            </div>
          </div>
        </section>

        <section id="planos" className="border-t border-white/5 bg-[#070f22]/80 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-2 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Planos</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Planos para cada estágio do seu negócio</h2>
              <p className="text-white/70">Todos incluem autenticação segura, dashboard completo e suporte para importar seu template da empresa.</p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.name} className="rounded-3xl border border-white/10 bg-[#0a132b] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                  <div className="text-xs uppercase tracking-[0.35em] text-white/60">{plan.name}</div>
                  <div className="mt-3 text-2xl font-bold sm:text-3xl">{plan.price}</div>
                  <p className="mt-3 text-sm text-white/75">{plan.description}</p>

                  <ul className="mt-5 space-y-2 text-white/80">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button asChild className="mt-8 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link to="/login">Escolher plano</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#0a132b] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Contato</p>
              <h3 className="mt-3 text-3xl font-semibold">Atendimento humano para te ajudar</h3>
              <p className="mt-4 text-white/80">
                Envie um email para <a href="mailto:reserveja@gmail.com" className="text-primary hover:underline">reserveja@gmail.com</a> ou fale no WhatsApp
                <a className="text-primary hover:underline" href="https://wa.me/5581993293134" target="_blank" rel="noreferrer"> (81) 99329-3134</a>.
                Respondemos em até um dia útil.
              </p>

              <div className="mt-6 space-y-4 text-white/80">
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">Horários</div>
                    <div className="text-white/70">Seg-Sex das 09h às 18h</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">Endereço</div>
                    <div className="text-white/70">
                      AV. Agamenon Magalhães n.º 1143, 4º andar, Sala 401
                      <br />
                      Maurício de Nassau Caruaru-PE
                      <br />
                      55014-00
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0a132b] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Atualizações</p>
              <h3 className="mt-3 text-2xl font-semibold">Receba novidades</h3>
              <p className="mt-3 text-white/75">Fique por dentro de novos recursos, integrações e guias de uso. Enviamos só o necessário.</p>
              <form className="mt-6 space-y-3">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-primary"
                />
                <Button type="button" className="w-full">Quero receber</Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/40 px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                  <path
                    fill="currentColor"
                    d="M8.5 11.8 11 14.3l5-5.1c.2-.2.5-.2.7 0l1 1c.2.2.2.5 0 .7l-6 6c-.2.2-.5.2-.7 0L6.8 13c-.2-.2-.2-.5 0-.7l1-1c.2-.2.5-.2.7 0Z"
                  />
                </svg>
              </div>
              <div className="font-semibold">Reserve Ja</div>
            </div>
            <p className="text-sm text-white/70">Sistema de reservas completo para seu negócio.</p>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">Navegação</div>
            <div className="mt-4 space-y-2 text-sm text-white/75">
              <a href="#planos" className="block hover:text-white">Planos</a>
              <a href="#contato" className="block hover:text-white">Contato</a>
              <a href="#historia" className="block hover:text-white">História</a>
              <Link to="/login" className="block hover:text-white">Cadastrar</Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">Acesso rápido</div>
            <div className="mt-4 space-y-2 text-sm text-white/75">
              <Link to="/login" className="block hover:text-white">Login</Link>
              <Link to="/empresa" className="block hover:text-white">Dashboard</Link>
              <a href="#historia" className="block hover:text-white">História</a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">Newsletter</div>
            <p className="mt-3 text-sm text-white/75">Receba dicas e atualizações diretamente no seu email.</p>
            <form className="mt-4 space-y-3">
              <Input
                type="email"
                placeholder="seu@email.com"
                className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-primary"
              />
              <Button type="button" className="w-full">Inscrever</Button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
