import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockAgendamentos, mockProfissionais, mockServicos, Agendamento } from "@/mock/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type TipoAgenda = 'global' | 'profissional' | 'mista';

export default function Agenda() {
  const [tipoAgenda, setTipoAgenda] = useState<TipoAgenda>('global');
  const [selectedProfissional, setSelectedProfissional] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedServico, setSelectedServico] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredAgendamentos = mockAgendamentos.filter((a) => {
    if (selectedStatus !== 'all' && a.status !== selectedStatus) return false;
    if (selectedServico !== 'all' && a.servico !== selectedServico) return false;
    if (tipoAgenda === 'profissional' && selectedProfissional !== 'all' && a.profissional !== selectedProfissional) return false;
    if (search && !a.clienteNome.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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

      {/* Agenda Type Tabs */}
      <Tabs value={tipoAgenda} onValueChange={(v) => setTipoAgenda(v as TipoAgenda)} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="profissional">Por Profissional</TabsTrigger>
          <TabsTrigger value="mista">Mista</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            {(tipoAgenda === 'profissional' || tipoAgenda === 'mista') && (
              <Select value={selectedProfissional} onValueChange={setSelectedProfissional}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Profissional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {mockProfissionais.map((p) => (
                    <SelectItem key={p.id} value={p.nome}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedServico} onValueChange={setSelectedServico}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {mockServicos.filter(s => s.ativo).map((s) => (
                  <SelectItem key={s.id} value={s.nome}>{s.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
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
          </div>
        </CardContent>
      </Card>

      {/* Agenda Content */}
      {tipoAgenda === 'mista' && (
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {mockProfissionais.map((prof) => {
            const profAgendamentos = filteredAgendamentos.filter(a => a.profissional === prof.nome);
            return (
              <Card key={prof.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{prof.nome}</CardTitle>
                    <StatusBadge status={prof.disponivel ? 'Ativo' : 'Inativo'} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {profAgendamentos.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      Nenhum agendamento
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {profAgendamentos.slice(0, 3).map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium text-sm">{a.clienteNome}</p>
                            <p className="text-xs text-muted-foreground">{a.servico} • {a.hora}</p>
                          </div>
                          <StatusBadge status={a.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Main Table */}
      <DataTable<Agendamento>
        columns={[
          { key: 'clienteNome', header: 'Cliente' },
          { key: 'clienteTelefone', header: 'Telefone' },
          { key: 'servico', header: 'Serviço' },
          { key: 'data', header: 'Data' },
          { key: 'hora', header: 'Hora' },
          ...(tipoAgenda !== 'global' ? [{ key: 'profissional', header: 'Profissional' }] : []),
          {
            key: 'status',
            header: 'Status',
            render: (item: Agendamento) => <StatusBadge status={item.status} />,
          },
        ]}
        data={filteredAgendamentos}
      />

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>Preencha os dados para criar um novo agendamento</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input placeholder="Nome do cliente" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="(00) 00000-0000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Hora</Label>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Serviço</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {mockServicos.filter(s => s.ativo).map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Profissional</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {mockProfissionais.filter(p => p.disponivel).map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setCreateDialogOpen(false);
              toast({ title: "Agendamento criado", description: "O agendamento foi criado com sucesso (mock)" });
            }}>
              Criar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
