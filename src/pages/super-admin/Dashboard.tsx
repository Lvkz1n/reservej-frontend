import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { dashboardSuperAdmin, mockEmpresas, Empresa } from "@/mock/data";
import { Building2, Calendar, MessageCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { mes: 'Jan', agendamentos: 850 },
  { mes: 'Fev', agendamentos: 920 },
  { mes: 'Mar', agendamentos: 1100 },
  { mes: 'Abr', agendamentos: 980 },
  { mes: 'Mai', agendamentos: 1250 },
];

export default function SuperAdminDashboard() {
  const recentEmpresas = mockEmpresas.slice(0, 5);

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
          value={dashboardSuperAdmin.totalEmpresas}
          subtitle={`${dashboardSuperAdmin.empresasAtivas} ativas`}
          icon={Building2}
          variant="primary"
          trend={{ value: dashboardSuperAdmin.crescimentoEmpresas, isPositive: true }}
        />
        <StatCard
          title="Agendamentos no Mês"
          value={dashboardSuperAdmin.agendamentosMes.toLocaleString()}
          icon={Calendar}
          variant="success"
          trend={{ value: dashboardSuperAdmin.crescimentoAgendamentos, isPositive: true }}
        />
        <StatCard
          title="Mensagens Enviadas"
          value={dashboardSuperAdmin.mensagensEnviadas.toLocaleString()}
          icon={MessageCircle}
          variant="accent"
        />
        <StatCard
          title="Crescimento"
          value={`${dashboardSuperAdmin.crescimentoEmpresas}%`}
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
            <DataTable<Empresa>
              columns={[
                { key: 'nome', header: 'Empresa' },
                { key: 'plano', header: 'Plano' },
                {
                  key: 'status',
                  header: 'Status',
                  render: (item) => <StatusBadge status={item.status} />,
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
