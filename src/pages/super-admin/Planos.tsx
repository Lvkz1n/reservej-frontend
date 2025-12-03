import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { mockPlanos, Plano } from "@/mock/data";
import { Badge } from "@/components/ui/badge";

export default function Planos() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Planos"
        description="Configuração dos planos disponíveis na plataforma"
      />

      <DataTable<Plano>
        columns={[
          {
            key: 'nome',
            header: 'Plano',
            render: (item) => (
              <div className="flex items-center gap-2">
                <span className="font-semibold">{item.nome}</span>
                {item.nome === 'Pro' && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">Popular</Badge>
                )}
              </div>
            ),
          },
          {
            key: 'limiteAgendamentos',
            header: 'Limite de Agendamentos',
            render: (item) => (
              <span>{item.limiteAgendamentos === -1 ? 'Ilimitado' : item.limiteAgendamentos}</span>
            ),
          },
          {
            key: 'limiteNotificacoes',
            header: 'Limite de Notificações',
            render: (item) => (
              <span>{item.limiteNotificacoes === -1 ? 'Ilimitado' : item.limiteNotificacoes}</span>
            ),
          },
          {
            key: 'preco',
            header: 'Preço/mês',
            render: (item) => (
              <span className="font-semibold">
                {item.preco === 0 ? 'Grátis' : `R$ ${item.preco.toFixed(2)}`}
              </span>
            ),
            className: 'text-right',
          },
        ]}
        data={mockPlanos}
      />
    </div>
  );
}
