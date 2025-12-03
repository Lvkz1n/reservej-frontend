import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Calendar, CalendarCheck, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { companyApi, CompanyAppointment, CompanyDashboard } from "@/services/company";

export default function EmpresaDashboard() {
  const { companyRole, companyId } = useAuth();
  if (companyRole === "atendente") {
    return <Navigate to="/empresa/agenda" replace />;
  }

  const { data: dashboard } = useQuery<CompanyDashboard>({
    queryKey: ["company", companyId, "dashboard"],
    queryFn: () => companyApi.getDashboard(companyId!),
    enabled: !!companyId,
  });

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
          value={dashboard?.agendamentosHoje ?? 0}
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Agendamentos da Semana"
          value={dashboard?.agendamentosSemana ?? 0}
          icon={CalendarCheck}
          variant="accent"
        />
        <StatCard
          title="Taxa de Comparecimento"
          value={`${dashboard?.taxaComparecimento ?? 0}%`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Total de Clientes"
          value={dashboard?.clientesTotal ?? 0}
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
          <DataTable<CompanyAppointment>
            columns={[
              { key: 'clientName', header: 'Cliente' },
              { key: 'serviceName', header: 'Serviço' },
              { key: 'date', header: 'Data' },
              { key: 'time', header: 'Hora' },
              { key: 'professionalName', header: 'Profissional' },
              {
                key: 'status',
                header: 'Status',
                render: (item) => <StatusBadge status={item.status} />,
              },
            ]}
            data={dashboard?.proximosAgendamentos ?? []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
