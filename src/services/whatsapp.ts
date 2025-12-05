import { apiClient } from "./api-client";

export type WhatsappSessionResponse = {
  status?: string;
  qr_code?: string;
  phone_number?: string;
};

export const whatsappApi = {
  connect: (companyId: string) =>
    apiClient.post<WhatsappSessionResponse>(`/companies/${companyId}/whatsapp/connect`),
  status: (companyId: string) =>
    apiClient.get<WhatsappSessionResponse>(`/companies/${companyId}/whatsapp/status`),
};
