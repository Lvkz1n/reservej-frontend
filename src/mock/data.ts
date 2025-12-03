// Mock Data for ReserveJá

export type UserRole = 'super-admin' | 'empresa-admin' | 'empresa-atendente' | 'empresa-profissional' | 'empresa-leitura';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  empresaId?: string;
}

export interface Empresa {
  id: string;
  nome: string;
  plano: 'Free' | 'Basic' | 'Pro';
  status: 'Ativo' | 'Inativo' | 'Pendente';
  agendamentos: number;
  mensagensEnviadas: number;
  dataCriacao: string;
  logo?: string;
  corPrimaria?: string;
}

export interface Plano {
  id: string;
  nome: string;
  limiteAgendamentos: number;
  limiteNotificacoes: number;
  preco: number;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  ultimaVisita: string;
  totalAgendamentos: number;
}

export interface Servico {
  id: string;
  nome: string;
  duracao: number;
  preco: number;
  ativo: boolean;
}

export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  avatar?: string;
  disponivel: boolean;
}

export interface Agendamento {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  servico: string;
  data: string;
  hora: string;
  status: 'Confirmado' | 'Pendente' | 'Cancelado' | 'Concluído';
  profissional?: string;
}

export interface TemplateNotificacao {
  id: string;
  tipo: string;
  nome: string;
  mensagem: string;
  ativo: boolean;
}

export interface Conversa {
  id: string;
  clienteNome: string;
  ultimaMensagem: string;
  dataHora: string;
  naoLidas: number;
}

// Mock Users
export const mockUsers: User[] = [
  { id: '1', name: 'Admin Sistema', email: 'admin@reserveja.com', role: 'super-admin' },
  { id: '2', name: 'João Silva', email: 'joao@barbearia.com', role: 'empresa-admin', empresaId: '1' },
  { id: '3', name: 'Maria Santos', email: 'maria@barbearia.com', role: 'empresa-atendente', empresaId: '1' },
  { id: '4', name: 'Carlos Oliveira', email: 'carlos@barbearia.com', role: 'empresa-profissional', empresaId: '1' },
];

// Mock Empresas
export const mockEmpresas: Empresa[] = [
  { id: '1', nome: 'Barbearia Premium', plano: 'Pro', status: 'Ativo', agendamentos: 245, mensagensEnviadas: 890, dataCriacao: '2024-01-15' },
  { id: '2', nome: 'Studio Beauty', plano: 'Basic', status: 'Ativo', agendamentos: 120, mensagensEnviadas: 340, dataCriacao: '2024-02-20' },
  { id: '3', nome: 'Clínica Bem Estar', plano: 'Pro', status: 'Ativo', agendamentos: 380, mensagensEnviadas: 1200, dataCriacao: '2024-01-10' },
  { id: '4', nome: 'Pet Shop Amigo', plano: 'Free', status: 'Pendente', agendamentos: 45, mensagensEnviadas: 80, dataCriacao: '2024-03-05' },
  { id: '5', nome: 'Academia FitMax', plano: 'Basic', status: 'Ativo', agendamentos: 180, mensagensEnviadas: 450, dataCriacao: '2024-02-01' },
  { id: '6', nome: 'Consultório Dr. Ana', plano: 'Pro', status: 'Inativo', agendamentos: 0, mensagensEnviadas: 0, dataCriacao: '2024-03-20' },
];

// Mock Planos
export const mockPlanos: Plano[] = [
  { id: '1', nome: 'Free', limiteAgendamentos: 50, limiteNotificacoes: 100, preco: 0 },
  { id: '2', nome: 'Basic', limiteAgendamentos: 200, limiteNotificacoes: 500, preco: 49.90 },
  { id: '3', nome: 'Pro', limiteAgendamentos: -1, limiteNotificacoes: -1, preco: 99.90 },
];

// Mock Clientes
export const mockClientes: Cliente[] = [
  { id: '1', nome: 'Pedro Henrique', telefone: '(11) 98765-4321', email: 'pedro@email.com', ultimaVisita: '2024-03-10', totalAgendamentos: 12 },
  { id: '2', nome: 'Ana Paula', telefone: '(11) 99876-5432', email: 'ana@email.com', ultimaVisita: '2024-03-08', totalAgendamentos: 8 },
  { id: '3', nome: 'Lucas Martins', telefone: '(11) 97654-3210', email: 'lucas@email.com', ultimaVisita: '2024-03-12', totalAgendamentos: 5 },
  { id: '4', nome: 'Juliana Costa', telefone: '(11) 96543-2109', email: 'juliana@email.com', ultimaVisita: '2024-03-05', totalAgendamentos: 15 },
  { id: '5', nome: 'Rafael Souza', telefone: '(11) 95432-1098', email: 'rafael@email.com', ultimaVisita: '2024-03-11', totalAgendamentos: 3 },
];

// Mock Serviços
export const mockServicos: Servico[] = [
  { id: '1', nome: 'Corte de Cabelo', duracao: 30, preco: 45, ativo: true },
  { id: '2', nome: 'Barba', duracao: 20, preco: 25, ativo: true },
  { id: '3', nome: 'Corte + Barba', duracao: 45, preco: 60, ativo: true },
  { id: '4', nome: 'Hidratação', duracao: 40, preco: 35, ativo: true },
  { id: '5', nome: 'Coloração', duracao: 60, preco: 80, ativo: false },
];

// Mock Profissionais
export const mockProfissionais: Profissional[] = [
  { id: '1', nome: 'Carlos Oliveira', especialidade: 'Barbeiro', disponivel: true },
  { id: '2', nome: 'André Lima', especialidade: 'Barbeiro', disponivel: true },
  { id: '3', nome: 'Fernanda Reis', especialidade: 'Cabeleireira', disponivel: false },
];

// Mock Agendamentos
export const mockAgendamentos: Agendamento[] = [
  { id: '1', clienteNome: 'Pedro Henrique', clienteTelefone: '(11) 98765-4321', servico: 'Corte de Cabelo', data: '2024-03-15', hora: '09:00', status: 'Confirmado', profissional: 'Carlos Oliveira' },
  { id: '2', clienteNome: 'Ana Paula', clienteTelefone: '(11) 99876-5432', servico: 'Corte + Barba', data: '2024-03-15', hora: '09:30', status: 'Confirmado', profissional: 'André Lima' },
  { id: '3', clienteNome: 'Lucas Martins', clienteTelefone: '(11) 97654-3210', servico: 'Barba', data: '2024-03-15', hora: '10:00', status: 'Pendente', profissional: 'Carlos Oliveira' },
  { id: '4', clienteNome: 'Juliana Costa', clienteTelefone: '(11) 96543-2109', servico: 'Hidratação', data: '2024-03-15', hora: '10:30', status: 'Confirmado', profissional: 'Fernanda Reis' },
  { id: '5', clienteNome: 'Rafael Souza', clienteTelefone: '(11) 95432-1098', servico: 'Corte de Cabelo', data: '2024-03-15', hora: '11:00', status: 'Cancelado', profissional: 'André Lima' },
  { id: '6', clienteNome: 'Mariana Alves', clienteTelefone: '(11) 94321-0987', servico: 'Corte + Barba', data: '2024-03-16', hora: '09:00', status: 'Pendente', profissional: 'Carlos Oliveira' },
  { id: '7', clienteNome: 'Bruno Santos', clienteTelefone: '(11) 93210-9876', servico: 'Barba', data: '2024-03-16', hora: '09:30', status: 'Confirmado', profissional: 'André Lima' },
];

// Mock Templates de Notificação
export const mockTemplates: TemplateNotificacao[] = [
  { id: '1', tipo: 'confirmacao', nome: 'Confirmação de Agendamento', mensagem: 'Olá {{nome_cliente}}! Seu agendamento para {{servico}} no dia {{data}} às {{hora}} foi confirmado. Aguardamos você!', ativo: true },
  { id: '2', tipo: 'lembrete_1dia', nome: 'Lembrete - 1 dia antes', mensagem: 'Olá {{nome_cliente}}! Lembrando que amanhã você tem um agendamento para {{servico}} às {{hora}}. Até lá!', ativo: true },
  { id: '3', tipo: 'lembrete_30min', nome: 'Lembrete - 30 min antes', mensagem: 'Olá {{nome_cliente}}! Em 30 minutos começa seu {{servico}}. Estamos te esperando!', ativo: true },
  { id: '4', tipo: 'lembrete_10min', nome: 'Lembrete - 10 min antes', mensagem: '{{nome_cliente}}, faltam apenas 10 minutos para seu agendamento de {{servico}}!', ativo: false },
  { id: '5', tipo: 'pos_atendimento', nome: 'Pós-atendimento', mensagem: 'Olá {{nome_cliente}}! Obrigado pela visita. Esperamos que tenha gostado do serviço. Até a próxima!', ativo: true },
];

// Mock Conversas
export const mockConversas: Conversa[] = [
  { id: '1', clienteNome: 'Pedro Henrique', ultimaMensagem: 'Posso remarcar para amanhã?', dataHora: '14:35', naoLidas: 2 },
  { id: '2', clienteNome: 'Ana Paula', ultimaMensagem: 'Obrigada pelo atendimento!', dataHora: '13:20', naoLidas: 0 },
  { id: '3', clienteNome: 'Lucas Martins', ultimaMensagem: 'Qual o preço do corte?', dataHora: '12:45', naoLidas: 1 },
  { id: '4', clienteNome: 'Juliana Costa', ultimaMensagem: 'Chego em 5 minutos', dataHora: '11:30', naoLidas: 0 },
];

// Dashboard Stats
export const dashboardSuperAdmin = {
  totalEmpresas: mockEmpresas.length,
  empresasAtivas: mockEmpresas.filter(e => e.status === 'Ativo').length,
  agendamentosMes: 1250,
  mensagensEnviadas: 3500,
  crescimentoEmpresas: 12.5,
  crescimentoAgendamentos: 8.3,
};

export const dashboardEmpresa = {
  agendamentosHoje: 8,
  agendamentosSemana: 42,
  taxaComparecimento: 92,
  clientesTotal: mockClientes.length,
  servicosAtivos: mockServicos.filter(s => s.ativo).length,
};
