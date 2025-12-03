import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
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
import { Search, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi, CompanyClient } from "@/services/company";
import { useAuth } from "@/context/AuthContext";
import { toArray } from "@/lib/utils";

export default function Clientes() {
  const [search, setSearch] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const { companyId } = useAuth();
  const queryClient = useQueryClient();

  const { data: clientes, isLoading } = useQuery({
    queryKey: ["company", companyId, "clients", search],
    queryFn: () => companyApi.listClients(companyId!, search || undefined),
    enabled: !!companyId,
  });

  const createClient = useMutation({
    mutationFn: () => companyApi.createClient(companyId!, form),
    onSuccess: () => {
      toast({ title: "Cliente cadastrado", description: "O cliente foi cadastrado com sucesso." });
      queryClient.invalidateQueries({ queryKey: ["company", companyId, "clients"] });
      setCreateDialogOpen(false);
      setForm({ name: "", phone: "", email: "" });
    },
    onError: () => {
      toast({
        title: "Erro ao cadastrar",
        description: "Não foi possível salvar o cliente.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Clientes"
        description="Gerencie seus clientes"
        action={{
          label: "Novo Cliente",
          icon: Users,
          onClick: () => setCreateDialogOpen(true),
        }}
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </PageHeader>

      <DataTable<CompanyClient>
        columns={[
          { key: 'name', header: 'Nome' },
          { key: 'phone', header: 'Telefone' },
          { key: 'email', header: 'Email' },
          { key: 'lastVisit', header: 'Última Visita' },
          { key: 'totalAppointments', header: 'Total Agend.', className: 'text-right' },
        ]}
        data={toArray<CompanyClient>(clientes)}
        loading={isLoading}
      />

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>Cadastre um novo cliente</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                placeholder="Nome completo"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                placeholder="(00) 00000-0000"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => createClient.mutate()}
              disabled={createClient.isPending || !form.name}
            >
              {createClient.isPending ? "Salvando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
