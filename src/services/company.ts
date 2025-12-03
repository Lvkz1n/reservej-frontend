import { apiClient } from "./api-client";

export type Company = {
  id: string;
  name: string;
  status?: string;
  plan?: string;
  createdAt?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type CompanyUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
};

export type CompanyService = {
  id: string;
  name: string;
  duration: number;
  price: number;
  active: boolean;
};

export type CompanyClient = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  lastVisit?: string;
  totalAppointments?: number;
};

export type CompanyAppointment = {
  id: string;
  clientId?: string;
  clientName?: string;
  clientPhone?: string;
  serviceId?: string;
  serviceName?: string;
  professionalId?: string;
  professionalName?: string;
  date: string;
  time?: string;
  status: string;
  notes?: string;
};

export type CompanyTemplate = {
  id: string;
  type: string;
  name: string;
  message: string;
  active: boolean;
};

export type CompanySettings = {
  id?: string;
  primaryColor?: string;
  enableOnline?: boolean;
  confirmationAuto?: boolean;
  scheduleType?: string;
};

export type CompanyDashboard = {
  agendamentosHoje: number;
  agendamentosSemana: number;
  taxaComparecimento: number;
  clientesTotal: number;
  servicosAtivos: number;
  proximosAgendamentos?: CompanyAppointment[];
};

export type CompanyReport = {
  receitaMensal: { mes: string; receita: number }[];
  topServicos: { name: string; total: number; receita?: number }[];
  profissionais: { name: string; total: number; receita?: number }[];
  totais?: {
    receitaTotal?: number;
    agendamentosTotal?: number;
    ticketMedio?: number;
  };
};

export const companyApi = {
  getCompany: (companyId: string) => apiClient.get<Company>(`/companies/${companyId}`),
  updateCompany: (companyId: string, payload: Partial<Company>) =>
    apiClient.patch<Company>(`/companies/${companyId}`, payload),

  listUsers: (companyId: string) =>
    apiClient.get<CompanyUser[]>(`/companies/${companyId}/users`),
  createUser: (companyId: string, payload: Partial<CompanyUser>) =>
    apiClient.post<CompanyUser>(`/companies/${companyId}/users`, payload),
  updateUser: (companyId: string, userId: string, payload: Partial<CompanyUser>) =>
    apiClient.patch<CompanyUser>(`/companies/${companyId}/users/${userId}`, payload),
  deleteUser: (companyId: string, userId: string) =>
    apiClient.delete<void>(`/companies/${companyId}/users/${userId}`),

  listServices: (companyId: string) =>
    apiClient.get<CompanyService[]>(`/companies/${companyId}/services`),
  createService: (companyId: string, payload: Partial<CompanyService>) =>
    apiClient.post<CompanyService>(`/companies/${companyId}/services`, payload),
  updateService: (companyId: string, serviceId: string, payload: Partial<CompanyService>) =>
    apiClient.patch<CompanyService>(`/companies/${companyId}/services/${serviceId}`, payload),
  deleteService: (companyId: string, serviceId: string) =>
    apiClient.delete<void>(`/companies/${companyId}/services/${serviceId}`),

  listClients: (companyId: string, search?: string) =>
    apiClient.get<CompanyClient[]>(`/companies/${companyId}/clients${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  createClient: (companyId: string, payload: Partial<CompanyClient>) =>
    apiClient.post<CompanyClient>(`/companies/${companyId}/clients`, payload),
  updateClient: (companyId: string, clientId: string, payload: Partial<CompanyClient>) =>
    apiClient.patch<CompanyClient>(`/companies/${companyId}/clients/${clientId}`, payload),

  listAppointments: (
    companyId: string,
    params?: { date?: string; professionalId?: string; status?: string; page?: number; perPage?: number },
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.date) searchParams.set("date", params.date);
    if (params?.professionalId) searchParams.set("professionalId", params.professionalId);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.perPage) searchParams.set("perPage", params.perPage.toString());
    const query = searchParams.toString();
    return apiClient.get<CompanyAppointment[]>(
      `/companies/${companyId}/appointments${query ? `?${query}` : ""}`,
    );
  },
  createAppointment: (companyId: string, payload: Partial<CompanyAppointment>) =>
    apiClient.post<CompanyAppointment>(`/companies/${companyId}/appointments`, payload),
  updateAppointment: (companyId: string, appointmentId: string, payload: Partial<CompanyAppointment>) =>
    apiClient.patch<CompanyAppointment>(
      `/companies/${companyId}/appointments/${appointmentId}`,
      payload,
    ),
  updateAppointmentStatus: (
    companyId: string,
    appointmentId: string,
    payload: { status: string },
  ) =>
    apiClient.patch<CompanyAppointment>(
      `/companies/${companyId}/appointments/${appointmentId}/status`,
      payload,
    ),
  sendAppointmentConfirmation: (companyId: string, appointmentId: string) =>
    apiClient.post<void>(`/companies/${companyId}/appointments/${appointmentId}/send-confirmation`, {}),

  listTemplates: (companyId: string) =>
    apiClient.get<CompanyTemplate[]>(`/companies/${companyId}/message-templates`),
  createTemplate: (companyId: string, payload: Partial<CompanyTemplate>) =>
    apiClient.post<CompanyTemplate>(`/companies/${companyId}/message-templates`, payload),
  updateTemplate: (companyId: string, templateId: string, payload: Partial<CompanyTemplate>) =>
    apiClient.patch<CompanyTemplate>(
      `/companies/${companyId}/message-templates/${templateId}`,
      payload,
    ),
  deleteTemplate: (companyId: string, templateId: string) =>
    apiClient.delete<void>(`/companies/${companyId}/message-templates/${templateId}`),

  getSettings: (companyId: string) =>
    apiClient.get<CompanySettings>(`/companies/${companyId}/settings`),
  updateSettings: (companyId: string, payload: Partial<CompanySettings>) =>
    apiClient.patch<CompanySettings>(`/companies/${companyId}/settings`, payload),

  getDashboard: (companyId: string) =>
    apiClient.get<CompanyDashboard>(`/companies/${companyId}/dashboard`),
  getReports: (companyId: string) =>
    apiClient.get<CompanyReport>(`/companies/${companyId}/reports`),
};
