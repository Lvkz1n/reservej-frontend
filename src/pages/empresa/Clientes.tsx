import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { mockClientes, Cliente } from "@/mock/data";
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

export default function Clientes() {
  const [search, setSearch] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredClientes = mockClientes.filter(
    (c) => c.nome.toLowerCase().includes(search.toLowerCase()) ||
           c.telefone.includes(search) ||
           c.email.toLowerCase().includes(search.toLowerCase())
  );

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

      <DataTable<Cliente>
        columns={[
          { key: 'nome', header: 'Nome' },
          { key: 'telefone', header: 'Telefone' },
          { key: 'email', header: 'Email' },
          { key: 'ultimaVisita', header: 'Última Visita' },
          { key: 'totalAgendamentos', header: 'Total Agend.', className: 'text-right' },
        ]}
        data={filteredClientes}
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
              <Input placeholder="Nome completo" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="(00) 00000-0000" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="email@exemplo.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setCreateDialogOpen(false);
              toast({ title: "Cliente cadastrado", description: "O cliente foi cadastrado com sucesso (mock)" });
            }}>
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
