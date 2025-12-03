import { useState } from "react";
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
import { Scissors } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi, CompanyService } from "@/services/company";
import { useAuth } from "@/context/AuthContext";
import { toArray } from "@/lib/utils";

export default function Servicos() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", duration: 30, price: 0, active: true });
  const { companyId } = useAuth();
  const queryClient = useQueryClient();

  const { data: servicos, isLoading } = useQuery({
    queryKey: ["company", companyId, "services"],
    queryFn: () => companyApi.listServices(companyId!),
    enabled: !!companyId,
  });

  const createService = useMutation({
    mutationFn: () => companyApi.createService(companyId!, form),
    onSuccess: () => {
      toast({ title: "Serviço criado", description: "O serviço foi criado com sucesso." });
      queryClient.invalidateQueries({ queryKey: ["company", companyId, "services"] });
      setCreateDialogOpen(false);
      setForm({ name: "", duration: 30, price: 0, active: true });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o serviço.",
        variant: "destructive",
      });
    },
  });

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

      <DataTable<CompanyService>
        columns={[
          { key: 'name', header: 'Serviço' },
          {
            key: 'duration',
            header: 'Duração',
            render: (item) => `${item.duration} min`,
          },
          {
            key: 'price',
            header: 'Preço',
            render: (item) => `R$ ${Number(item.price ?? 0).toFixed(2)}`,
            className: 'text-right',
          },
          {
            key: 'active',
            header: 'Status',
            render: (item) => (
              <StatusBadge status={item.active ? 'Ativo' : 'Inativo'} />
            ),
          },
        ]}
        data={toArray<CompanyService>(servicos)}
        loading={isLoading}
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
              <Input
                placeholder="Ex: Corte de Cabelo"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duração (min)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={form.duration}
                  onChange={(e) => setForm((p) => ({ ...p, duration: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input
                  type="number"
                  placeholder="45.00"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => createService.mutate()}
              disabled={createService.isPending || !form.name}
            >
              {createService.isPending ? "Salvando..." : "Criar Serviço"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
