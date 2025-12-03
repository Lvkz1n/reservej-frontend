import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { dashboardEmpresa, mockAgendamentos, Agendamento } from "@/mock/data";
import { Calendar, CalendarCheck, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function EmpresaDashboard() {
  const { user } = useAuth();
  if (user?.role === 'empresa-atendente') {
    return <Navigate to="/empresa/agenda" replace />;
  }

  const proximosAgendamentos = mockAgendamentos
    .filter((a) => a.status !== 'Cancelado')
    .slice(0, 5);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Visão geral dos seus agendamentos"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Agendamentos Hoje"
          value={dashboardEmpresa.agendamentosHoje}
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Agendamentos da Semana"
          value={dashboardEmpresa.agendamentosSemana}
          icon={CalendarCheck}
          variant="accent"
        />
        <StatCard
          title="Taxa de Comparecimento"
          value={`${dashboardEmpresa.taxaComparecimento}%`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Total de Clientes"
          value={dashboardEmpresa.clientesTotal}
          icon={Users}
          variant="warning"
        />
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable<Agendamento>
            columns={[
              { key: 'clienteNome', header: 'Cliente' },
              { key: 'servico', header: 'Serviço' },
              { key: 'data', header: 'Data' },
              { key: 'hora', header: 'Hora' },
              { key: 'profissional', header: 'Profissional' },
              {
                key: 'status',
                header: 'Status',
                render: (item) => <StatusBadge status={item.status} />,
              },
            ]}
            data={proximosAgendamentos}
          />
        </CardContent>
      </Card>
    </div>
  );
}
