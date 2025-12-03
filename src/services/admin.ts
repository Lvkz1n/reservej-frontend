import { apiClient } from "./api-client";

export type AdminCompany = {
  id: string;
  name: string;
  status?: string;
  plan?: string;
  agendamentos?: number;
  mensagensEnviadas?: number;
  createdAt?: string;
};

export type AdminPlan = {
  id: string;
  name: string;
  price: number;
  limiteAgendamentos?: number;
  limiteNotificacoes?: number;
};

export type AdminDashboard = {
  totalEmpresas: number;
  empresasAtivas: number;
  agendamentosMes: number;
  mensagensEnviadas: number;
  crescimentoEmpresas?: number;
  crescimentoAgendamentos?: number;
};

export const adminApi = {
  listCompanies: () => apiClient.get<AdminCompany[]>("/admin/companies"),
  createCompany: (payload: Partial<AdminCompany> & { email?: string; plan?: string }) =>
    apiClient.post<AdminCompany>("/admin/companies", payload),
  getCompany: (companyId: string) => apiClient.get<AdminCompany>(`/admin/companies/${companyId}`),
  updateCompany: (companyId: string, payload: Partial<AdminCompany>) =>
    apiClient.patch<AdminCompany>(`/admin/companies/${companyId}`, payload),
  listPlans: () => apiClient.get<AdminPlan[]>("/admin/plans"),
  createPlan: (payload: Partial<AdminPlan>) => apiClient.post<AdminPlan>("/admin/plans", payload),
  updatePlan: (id: string, payload: Partial<AdminPlan>) =>
    apiClient.patch<AdminPlan>(`/admin/plans/${id}`, payload),
  getDashboard: () => apiClient.get<AdminDashboard>("/admin/dashboard"),
  getStats: () => apiClient.get("/admin/stats"),
};
