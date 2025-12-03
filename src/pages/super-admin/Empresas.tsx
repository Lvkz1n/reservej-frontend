import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockEmpresas, Empresa } from "@/mock/data";
import { useAuth } from "@/context/AuthContext";
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
import { Search, Building2, LogIn, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Empresas() {
  const navigate = useNavigate();
  const { enterAsEmpresa } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredEmpresas = mockEmpresas.filter(
    (e) => e.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleEnterAsEmpresa = (empresa: Empresa) => {
    enterAsEmpresa(empresa.id);
    navigate("/empresa");
    toast({
      title: "Acesso realizado",
      description: `Você está acessando como ${empresa.nome}`,
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Empresas"
        description="Gerencie todas as empresas cadastradas na plataforma"
        action={{
          label: "Criar Empresa",
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

      <DataTable<Empresa>
        columns={[
          {
            key: 'nome',
            header: 'Empresa',
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{item.nome}</p>
                  <p className="text-sm text-muted-foreground">ID: {item.id}</p>
                </div>
              </div>
            ),
          },
          { key: 'plano', header: 'Plano' },
          {
            key: 'status',
            header: 'Status',
            render: (item) => <StatusBadge status={item.status} />,
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
                    handleEnterAsEmpresa(item);
                  }}
                >
                  <LogIn className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
        data={filteredEmpresas}
        onRowClick={setSelectedEmpresa}
      />

      {/* Detail Dialog */}
      <Dialog open={!!selectedEmpresa} onOpenChange={() => setSelectedEmpresa(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEmpresa?.nome}</DialogTitle>
            <DialogDescription>Detalhes da empresa</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plano</p>
                <p className="font-medium">{selectedEmpresa?.plano}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {selectedEmpresa && <StatusBadge status={selectedEmpresa.status} />}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agendamentos</p>
                <p className="font-medium">{selectedEmpresa?.agendamentos}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mensagens</p>
                <p className="font-medium">{selectedEmpresa?.mensagensEnviadas}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Data de Criação</p>
                <p className="font-medium">{selectedEmpresa?.dataCriacao}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEmpresa(null)}>
              Fechar
            </Button>
            <Button onClick={() => selectedEmpresa && handleEnterAsEmpresa(selectedEmpresa)}>
              <LogIn className="h-4 w-4 mr-2" />
              Entrar como Empresa
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
              <Input placeholder="Ex: Barbearia Premium" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="contato@empresa.com" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Plano</label>
              <select className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option>Free</option>
                <option>Basic</option>
                <option>Pro</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setCreateDialogOpen(false);
              toast({ title: "Empresa criada", description: "A empresa foi criada com sucesso (mock)" });
            }}>
              Criar Empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
