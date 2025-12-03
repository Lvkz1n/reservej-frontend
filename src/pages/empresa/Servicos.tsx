import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockServicos, Servico } from "@/mock/data";
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
import { Scissors } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Servicos() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Serviços"
        description="Gerencie os serviços oferecidos"
        action={{
          label: "Novo Serviço",
          icon: Scissors,
          onClick: () => setCreateDialogOpen(true),
        }}
      />

      <DataTable<Servico>
        columns={[
          { key: 'nome', header: 'Serviço' },
          {
            key: 'duracao',
            header: 'Duração',
            render: (item) => `${item.duracao} min`,
          },
          {
            key: 'preco',
            header: 'Preço',
            render: (item) => `R$ ${item.preco.toFixed(2)}`,
            className: 'text-right',
          },
          {
            key: 'ativo',
            header: 'Status',
            render: (item) => (
              <StatusBadge status={item.ativo ? 'Ativo' : 'Inativo'} />
            ),
          },
        ]}
        data={mockServicos}
      />

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Serviço</DialogTitle>
            <DialogDescription>Cadastre um novo serviço</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Serviço</Label>
              <Input placeholder="Ex: Corte de Cabelo" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duração (min)</Label>
                <Input type="number" placeholder="30" />
              </div>
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input type="number" placeholder="45.00" step="0.01" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setCreateDialogOpen(false);
              toast({ title: "Serviço criado", description: "O serviço foi criado com sucesso (mock)" });
            }}>
              Criar Serviço
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
