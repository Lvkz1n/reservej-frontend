import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
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
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { adminApi, AdminPlan } from "@/services/admin";
import { toArray } from "@/lib/utils";

export default function Planos() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [payload, setPayload] = useState<Partial<AdminPlan>>({
    name: "",
    price: 0,
    limiteAgendamentos: -1,
    limiteNotificacoes: -1,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: planos, isLoading } = useQuery({
    queryKey: ["admin", "plans"],
    queryFn: adminApi.listPlans,
  });

  const createPlan = useMutation({
    mutationFn: () => adminApi.createPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
      toast({ title: "Plano criado", description: "Novo plano disponível na plataforma." });
      setCreateDialogOpen(false);
      setPayload({ name: "", price: 0, limiteAgendamentos: -1, limiteNotificacoes: -1 });
    },
    onError: () => {
      toast({
        title: "Erro ao criar plano",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Planos"
        description="Configuração dos planos disponíveis na plataforma"
        action={{
          label: "Criar Plano",
          icon: Plus,
          onClick: () => setCreateDialogOpen(true),
        }}
      />

      <DataTable<AdminPlan>
        columns={[
          {
            key: 'name',
            header: 'Plano',
            render: (item) => (
              <div className="flex items-center gap-2">
                <span className="font-semibold">{item.name}</span>
                {item.name?.toLowerCase() === 'pro' && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">Popular</Badge>
                )}
              </div>
            ),
          },
          {
            key: 'limiteAgendamentos',
            header: 'Limite de Agendamentos',
            render: (item) => (
              <span>{item.limiteAgendamentos === -1 ? 'Ilimitado' : item.limiteAgendamentos ?? 'N/D'}</span>
            ),
          },
          {
            key: 'limiteNotificacoes',
            header: 'Limite de Notificações',
            render: (item) => (
              <span>{item.limiteNotificacoes === -1 ? 'Ilimitado' : item.limiteNotificacoes ?? 'N/D'}</span>
            ),
          },
          {
            key: 'preco',
            header: 'Preço/mês',
            render: (item) => (
              <span className="font-semibold">
                {item.price === 0 ? 'Grátis' : `R$ ${item.price?.toFixed(2) ?? '-'}`}
              </span>
            ),
            className: 'text-right',
          },
        ]}
        data={toArray<AdminPlan>(planos)}
        loading={isLoading}
      />

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Plano</DialogTitle>
            <DialogDescription>Defina limites e preço do plano.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input
                className="mt-1"
                placeholder="Ex: Pro"
                value={payload.name ?? ""}
                onChange={(e) => setPayload((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Limite de Agendamentos</label>
                <Input
                  className="mt-1"
                  type="number"
                  placeholder="-1 para ilimitado"
                  value={payload.limiteAgendamentos ?? ""}
                  onChange={(e) =>
                    setPayload((p) => ({ ...p, limiteAgendamentos: Number(e.target.value) }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Limite de Notificações</label>
                <Input
                  className="mt-1"
                  type="number"
                  placeholder="-1 para ilimitado"
                  value={payload.limiteNotificacoes ?? ""}
                  onChange={(e) =>
                    setPayload((p) => ({ ...p, limiteNotificacoes: Number(e.target.value) }))
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Preço/mês (R$)</label>
              <Input
                className="mt-1"
                type="number"
                min={0}
                step={0.01}
                placeholder="0 para grátis"
                value={payload.price ?? ""}
                onChange={(e) => setPayload((p) => ({ ...p, price: Number(e.target.value) }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => createPlan.mutate()}
              disabled={createPlan.isPending || !payload.name}
            >
              {createPlan.isPending ? "Criando..." : "Criar Plano"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
