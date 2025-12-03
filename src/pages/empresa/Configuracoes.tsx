import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "@/hooks/use-toast";
import { Upload, UserPlus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  status: string;
}

const mockUsuarios: Usuario[] = [
  { id: '1', nome: 'João Silva', email: 'joao@empresa.com', cargo: 'Admin', status: 'Ativo' },
  { id: '2', nome: 'Maria Santos', email: 'maria@empresa.com', cargo: 'Atendente', status: 'Ativo' },
  { id: '3', nome: 'Carlos Oliveira', email: 'carlos@empresa.com', cargo: 'Profissional', status: 'Ativo' },
];

export default function Configuracoes() {
  const [tipoAgenda, setTipoAgenda] = useState('global');
  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const { companyRole } = useAuth();
  const isReadOnly = companyRole === "atendente" || companyRole === "profissional";

  const handleSave = (section: string) => {
    toast({
      title: "Configurações salvas",
      description: `As configurações de ${section} foram salvas (mock)`,
    });
  };

  if (companyRole === "atendente" || companyRole === "profissional") {
    return (
      <div className="animate-fade-in">
        <PageHeader
          title="Configurações"
          description="Gerencie as configurações da sua empresa"
        />
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Acesso às configurações não está disponível para o seu perfil.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações da sua empresa"
      />

      <Tabs defaultValue="dados" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="agendamento">Agendamento</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="personalizacao">White Label</TabsTrigger>
        </TabsList>

        {/* Dados da Empresa */}
        <TabsContent value="dados">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>Informações básicas da sua empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isReadOnly && (
                <p className="text-sm text-muted-foreground">
                  Perfil de atendente possui acesso somente leitura.
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input defaultValue="Barbearia Premium" disabled={isReadOnly} />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input defaultValue="12.345.678/0001-90" disabled={isReadOnly} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" defaultValue="contato@barbearia.com" disabled={isReadOnly} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input defaultValue="(11) 99999-9999" disabled={isReadOnly} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Endereço</Label>
                  <Input defaultValue="Rua das Flores, 123 - São Paulo, SP" disabled={isReadOnly} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('dados')} disabled={isReadOnly} className={isReadOnly ? "cursor-not-allowed opacity-60" : ""}>
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Agendamento */}
        <TabsContent value="agendamento">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Agendamento</CardTitle>
              <CardDescription>Configure como a agenda funciona</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isReadOnly && (
                <p className="text-sm text-muted-foreground">
                  Perfil de atendente possui acesso somente leitura.
                </p>
              )}
              <div className="space-y-2">
                <Label>Tipo de Agenda</Label>
                <Select value={tipoAgenda} onValueChange={setTipoAgenda} disabled={isReadOnly}>
                  <SelectTrigger className="w-full max-w-xs" disabled={isReadOnly}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (Agenda única)</SelectItem>
                    <SelectItem value="profissional">Por Profissional</SelectItem>
                    <SelectItem value="mista">Mista</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Define como os agendamentos são organizados
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Permitir agendamento online</Label>
                    <p className="text-sm text-muted-foreground">Clientes podem agendar via WhatsApp</p>
                  </div>
                  <Switch defaultChecked disabled={isReadOnly} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Confirmação automática</Label>
                    <p className="text-sm text-muted-foreground">Confirmar agendamentos automaticamente</p>
                  </div>
                  <Switch defaultChecked disabled={isReadOnly} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Intervalo entre agendamentos</Label>
                    <p className="text-sm text-muted-foreground">Tempo mínimo entre atendimentos</p>
                  </div>
                  <Select defaultValue="15" disabled={isReadOnly}>
                    <SelectTrigger className="w-[120px]" disabled={isReadOnly}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sem intervalo</SelectItem>
                      <SelectItem value="5">5 min</SelectItem>
                      <SelectItem value="10">10 min</SelectItem>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('agendamento')} disabled={isReadOnly} className={isReadOnly ? "cursor-not-allowed opacity-60" : ""}>
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usuários Internos */}
        <TabsContent value="usuarios">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Usuários Internos</CardTitle>
                <CardDescription>Gerencie os usuários da empresa</CardDescription>
              </div>
              <Button onClick={() => setCreateUserDialog(true)} disabled={isReadOnly} className={isReadOnly ? "cursor-not-allowed opacity-60" : ""}>
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable<Usuario>
                columns={[
                  { key: 'nome', header: 'Nome' },
                  { key: 'email', header: 'Email' },
                  { key: 'cargo', header: 'Cargo' },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (item) => <StatusBadge status={item.status} />,
                  },
                  {
                    key: 'actions',
                    header: '',
                    render: () => (
                      <Button variant="ghost" size="sm" disabled={isReadOnly}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    ),
                  },
                ]}
                data={mockUsuarios}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personalização White Label */}
        <TabsContent value="personalizacao">
          <Card>
            <CardHeader>
              <CardTitle>Personalização White Label</CardTitle>
              <CardDescription>Personalize a aparência do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isReadOnly && (
                <p className="text-sm text-muted-foreground">
                  Perfil de atendente possui acesso somente leitura.
                </p>
              )}
              <div className="space-y-2">
                <Label>Logo da Empresa</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline" disabled={isReadOnly} className={isReadOnly ? "cursor-not-allowed opacity-60" : ""}>Upload Logo</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Recomendado: PNG ou SVG, 256x256px
                </p>
              </div>

              <div className="space-y-2">
                <Label>Nome Exibido</Label>
                <Input defaultValue="Barbearia Premium" disabled={isReadOnly} />
                <p className="text-sm text-muted-foreground">
                  Nome que aparece para os clientes
                </p>
              </div>

              <div className="space-y-2">
                <Label>Cor Primária</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                    disabled={isReadOnly}
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-32"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('personalização')} disabled={isReadOnly} className={isReadOnly ? "cursor-not-allowed opacity-60" : ""}>
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create User Dialog */}
      <Dialog open={createUserDialog} onOpenChange={setCreateUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>Adicione um novo usuário à empresa</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input placeholder="Nome completo" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="email@empresa.com" />
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="atendente">Atendente</SelectItem>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="leitura">Leitura</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateUserDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setCreateUserDialog(false);
              toast({ title: "Usuário criado", description: "O convite foi enviado (mock)" });
            }}>
              Criar Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
