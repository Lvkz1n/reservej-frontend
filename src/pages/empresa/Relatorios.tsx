import { useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { companyApi, CompanyReport } from "@/services/company";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Briefcase, TrendingUp, DollarSign } from "lucide-react";
import { toArray } from "@/lib/utils";

export default function RelatoriosEmpresa() {
  const { companyId } = useAuth();

  const { data: report, isLoading } = useQuery<CompanyReport>({
    queryKey: ["company", companyId, "reports"],
    queryFn: () => companyApi.getReports(companyId!),
    enabled: !!companyId,
  });

  const receitaMensal = useMemo(() => toArray<{ mes: string; receita: number }>(report?.receitaMensal), [report]);
  const topServicos = useMemo(() => toArray<{ name: string; total: number; receita?: number }>(report?.topServicos), [report]);
  const profissionais = useMemo(() => toArray<{ name: string; total: number; receita?: number }>(report?.profissionais), [report]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Relatórios"
        description="Métricas da empresa: serviços, profissionais e receita"
      />

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard
          title="Receita Total"
          value={report?.totais?.receitaTotal?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "R$ 0,00"}
          icon={DollarSign}
          variant="primary"
        />
        <StatCard
          title="Atendimentos"
          value={report?.totais?.agendamentosTotal ?? 0}
          icon={Briefcase}
          variant="accent"
        />
        <StatCard
          title="Ticket Médio"
          value={report?.totais?.ticketMedio?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "R$ 0,00"}
          icon={TrendingUp}
          variant="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={receitaMensal}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mes" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip
                  formatter={(value: number) => [`R$ ${value?.toLocaleString("pt-BR")}`, "Receita"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Serviços</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable<{ name: string; total: number; receita?: number }>
              columns={[
                { key: "name", header: "Serviço" },
                { key: "total", header: "Qtd", className: "text-right" },
                {
                  key: "receita",
                  header: "Receita",
                  render: (item) =>
                    item.receita !== undefined ? `R$ ${item.receita.toLocaleString("pt-BR")}` : "-",
                  className: "text-right",
                },
              ]}
              data={topServicos}
              loading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profissionais</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable<{ name: string; total: number; receita?: number }>
            columns={[
              { key: "name", header: "Profissional" },
              { key: "total", header: "Serviços", className: "text-right" },
              {
                key: "receita",
                header: "Receita",
                render: (item) =>
                  item.receita !== undefined ? `R$ ${item.receita.toLocaleString("pt-BR")}` : "-",
                className: "text-right",
              },
            ]}
            data={profissionais}
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
