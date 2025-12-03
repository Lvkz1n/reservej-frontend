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
import { Search, Building2, Eye, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, AdminCompany } from "@/services/admin";
import { toArray } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Empresas() {
  const { setCompany } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState<AdminCompany | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createPayload, setCreatePayload] = useState({
    name: "",
    email: "",
    plan: "Free",
  });
  const queryClient = useQueryClient();

  const { data: companies, isLoading } = useQuery({
    queryKey: ["admin", "companies"],
    queryFn: adminApi.listCompanies,
  });

  const createCompany = useMutation({
    mutationFn: () => adminApi.createCompany(createPayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      toast({ title: "Empresa criada", description: "A empresa foi criada com sucesso." });
      setCreateDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Erro ao criar",
        description: "Não foi possível criar a empresa.",
        variant: "destructive",
      });
    },
  });

  const filteredEmpresas = useMemo(() => {
    const list = toArray<AdminCompany>(companies);
    return list.filter((e) => (e.name ?? "").toLowerCase().includes(search.toLowerCase()));
  }, [companies, search]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Empresas"
        description="Gerencie todas as empresas cadastradas na plataforma"
        action={{
          label: "Criar Empresa",
          icon: Plus,
          onClick: () => setCreateDialogOpen(true),
        }}
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empresas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </PageHeader>

      <DataTable<AdminCompany>
        columns={[
          {
            key: 'name',
            header: 'Empresa',
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {item.id}</p>
                </div>
              </div>
            ),
          },
          { key: 'plan', header: 'Plano' },
          {
            key: 'status',
            header: 'Status',
            render: (item) => <StatusBadge status={item.status ?? "Ativo"} />,
          },
          { key: 'agendamentos', header: 'Agendamentos', className: 'text-right' },
          { key: 'mensagensEnviadas', header: 'Mensagens', className: 'text-right' },
          {
            key: 'actions',
            header: '',
            render: (item) => (
              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEmpresa(item);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCompany(item.id);
                    navigate("/empresa");
                    toast({
                      title: "Acesso como empresa",
                      description: `Entrando como ${item.name}`,
                    });
                  }}
                >
                  Acessar
                </Button>
              </div>
            ),
          },
        ]}
        data={filteredEmpresas}
        onRowClick={setSelectedEmpresa}
        loading={isLoading}
      />

      {/* Detail Dialog */}
      <Dialog open={!!selectedEmpresa} onOpenChange={() => setSelectedEmpresa(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEmpresa?.name}</DialogTitle>
            <DialogDescription>Detalhes da empresa</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plano</p>
                <p className="font-medium">{selectedEmpresa?.plan ?? "N/D"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {selectedEmpresa && <StatusBadge status={selectedEmpresa.status ?? "Ativo"} />}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agendamentos</p>
                <p className="font-medium">{selectedEmpresa?.agendamentos ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mensagens</p>
                <p className="font-medium">{selectedEmpresa?.mensagensEnviadas ?? 0}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Data de Criação</p>
                <p className="font-medium">{selectedEmpresa?.createdAt ?? "N/D"}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEmpresa(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Empresa</DialogTitle>
            <DialogDescription>Preencha os dados para criar uma nova empresa</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nome da Empresa</label>
              <Input
                placeholder="Ex: Barbearia Premium"
                className="mt-1"
                value={createPayload.name}
                onChange={(e) => setCreatePayload((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                placeholder="contato@empresa.com"
                className="mt-1"
                value={createPayload.email}
                onChange={(e) => setCreatePayload((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Plano</label>
              <select
                className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={createPayload.plan}
                onChange={(e) => setCreatePayload((p) => ({ ...p, plan: e.target.value }))}
              >
                <option value="Free">Free</option>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => createCompany.mutate()}
              disabled={createCompany.isPending || !createPayload.name || !createPayload.email}
            >
              {createCompany.isPending ? "Criando..." : "Criar Empresa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
