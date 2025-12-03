import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Calendar, MessageCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { adminApi, AdminCompany, AdminDashboard } from "@/services/admin";

export default function SuperAdminDashboard() {
  const { data: dashboard } = useQuery<AdminDashboard>({
    queryKey: ["admin", "dashboard"],
    queryFn: adminApi.getDashboard,
  });
  const { data: companies } = useQuery<AdminCompany[] | { data: AdminCompany[] }>({
    queryKey: ["admin", "companies"],
    queryFn: adminApi.listCompanies,
  });

  const companiesList = Array.isArray(companies)
    ? companies
    : Array.isArray((companies as any)?.data)
      ? (companies as any).data
      : [];

  const chartData = [
    { mes: "Jan", agendamentos: 0 },
    { mes: "Fev", agendamentos: 0 },
    { mes: "Mar", agendamentos: 0 },
    { mes: "Abr", agendamentos: 0 },
    { mes: "Mai", agendamentos: 0 },
  ];
  const recentEmpresas = companiesList.slice(0, 5);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Visão geral da plataforma ReserveJá"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total de Empresas"
          value={dashboard?.totalEmpresas ?? 0}
          subtitle={`${dashboard?.empresasAtivas ?? 0} ativas`}
          icon={Building2}
          variant="primary"
          trend={{ value: dashboard?.crescimentoEmpresas ?? 0, isPositive: true }}
        />
        <StatCard
          title="Agendamentos no Mês"
          value={(dashboard?.agendamentosMes ?? 0).toLocaleString()}
          icon={Calendar}
          variant="success"
          trend={{ value: dashboard?.crescimentoAgendamentos ?? 0, isPositive: true }}
        />
        <StatCard
          title="Mensagens Enviadas"
          value={(dashboard?.mensagensEnviadas ?? 0).toLocaleString()}
          icon={MessageCircle}
          variant="accent"
        />
        <StatCard
          title="Crescimento"
          value={`${dashboard?.crescimentoEmpresas ?? 0}%`}
          subtitle="vs mês anterior"
          icon={TrendingUp}
          variant="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agendamentos por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mes" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="agendamentos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Empresas Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable<AdminCompany>
              columns={[
                { key: 'name', header: 'Empresa' },
                { key: 'plan', header: 'Plano' },
                {
                  key: 'status',
                  header: 'Status',
                  render: (item) => <StatusBadge status={item.status ?? "Ativo"} />,
                },
                { key: 'agendamentos', header: 'Agend.', className: 'text-right' },
              ]}
              data={recentEmpresas}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
