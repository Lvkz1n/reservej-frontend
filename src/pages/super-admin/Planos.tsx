import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { adminApi, AdminPlan } from "@/services/admin";
import { toArray } from "@/lib/utils";

export default function Planos() {
  const { data: planos, isLoading } = useQuery({
    queryKey: ["admin", "plans"],
    queryFn: adminApi.listPlans,
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Planos"
        description="Configuração dos planos disponíveis na plataforma"
      />

      <DataTable<AdminPlan>
        columns={[
          {
            key: 'name',
            header: 'Plano',
            render: (item) => (
              <div className="flex items-center gap-2">
                <span className="font-semibold">{item.name}</span>
                {item.name?.toLowerCase() === 'pro' && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">Popular</Badge>
                )}
              </div>
            ),
          },
          {
            key: 'limiteAgendamentos',
            header: 'Limite de Agendamentos',
            render: (item) => (
              <span>{item.limiteAgendamentos === -1 ? 'Ilimitado' : item.limiteAgendamentos ?? 'N/D'}</span>
            ),
          },
          {
            key: 'limiteNotificacoes',
            header: 'Limite de Notificações',
            render: (item) => (
              <span>{item.limiteNotificacoes === -1 ? 'Ilimitado' : item.limiteNotificacoes ?? 'N/D'}</span>
            ),
          },
          {
            key: 'preco',
            header: 'Preço/mês',
            render: (item) => (
              <span className="font-semibold">
                {item.price === 0 ? 'Grátis' : `R$ ${item.price?.toFixed(2) ?? '-'}`}
              </span>
            ),
            className: 'text-right',
          },
        ]}
        data={toArray<AdminPlan>(planos)}
        loading={isLoading}
      />
    </div>
  );
}
