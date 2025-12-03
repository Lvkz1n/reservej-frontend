import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi, CompanyAppointment } from "@/services/company";
import { useAuth } from "@/context/AuthContext";

export default function Agenda() {
  const { companyId } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    serviceName: "",
    date: "",
    time: "",
    status: "Pendente",
  });
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["company", companyId, "appointments", statusFilter, search],
    queryFn: () =>
      companyApi.listAppointments(companyId!, {
        status: statusFilter !== "all" ? statusFilter : undefined,
      }),
    enabled: !!companyId,
  });

  const createAppointment = useMutation({
    mutationFn: () => companyApi.createAppointment(companyId!, form),
    onSuccess: () => {
      toast({ title: "Agendamento criado", description: "O agendamento foi salvo com sucesso." });
      queryClient.invalidateQueries({ queryKey: ["company", companyId, "appointments"] });
      setCreateDialogOpen(false);
      setForm({ clientName: "", clientPhone: "", serviceName: "", date: "", time: "", status: "Pendente" });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o agendamento.",
        variant: "destructive",
      });
    },
  });

  const list = useMemo<CompanyAppointment[]>(() => {
    if (Array.isArray(appointments)) return appointments;
    const data = (appointments as any)?.data;
    return Array.isArray(data) ? data : [];
  }, [appointments]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return list.filter((item) => {
      if (term && !item.clientName?.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [list, search]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Agenda"
        description="Gerencie seus agendamentos"
        action={{
          label: "Novo Agendamento",
          icon: Calendar,
          onClick: () => setCreateDialogOpen(true),
        }}
      />

      <Card className="mb-6">
        <CardContent className="pt-6 flex flex-wrap gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Confirmado">Confirmado</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <DataTable<CompanyAppointment>
        columns={[
          { key: "clientName", header: "Cliente" },
          { key: "serviceName", header: "Serviço" },
          { key: "date", header: "Data" },
          { key: "time", header: "Hora" },
          {
            key: "status",
            header: "Status",
            render: (item) => <StatusBadge status={item.status} />,
          },
        ]}
        data={filtered}
        loading={isLoading}
      />

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>Cadastre um agendamento</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input
                placeholder="Nome do cliente"
                value={form.clientName}
                onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                placeholder="(00) 00000-0000"
                value={form.clientPhone}
                onChange={(e) => setForm((p) => ({ ...p, clientPhone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Serviço</Label>
              <Input
                placeholder="Serviço"
                value={form.serviceName}
                onChange={(e) => setForm((p) => ({ ...p, serviceName: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm((p) => ({ ...p, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Confirmado">Confirmado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => createAppointment.mutate()}
              disabled={createAppointment.isPending || !form.clientName || !form.date}
            >
              {createAppointment.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
