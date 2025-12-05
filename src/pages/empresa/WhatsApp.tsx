import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Smartphone, RefreshCw, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { whatsappApi } from "@/services/whatsapp";

type SessionStatus = "connected" | "pending" | "disconnected" | "unknown";

const normalizeStatus = (value?: string | null): SessionStatus => {
  const v = (value ?? "").toLowerCase();
  if (v.includes("connected")) return "connected";
  if (v.includes("pending")) return "pending";
  return "disconnected";
};

export default function WhatsApp() {
  const { companyRole, companyId } = useAuth();
  const canManage = companyRole === "admin" || companyRole === "atendente";
  const [status, setStatus] = useState<SessionStatus>("unknown");
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const displayStatus = useMemo(() => {
    switch (status) {
      case "connected":
        return "Conectado";
      case "pending":
        return "Pendente";
      case "disconnected":
        return "Desconectado";
      default:
        return "Desconhecido";
    }
  }, [status]);

  const buildQrSrc = (value: string | null) => {
    if (!value) return null;
    return value.startsWith("data:") ? value : `data:image/png;base64,${value}`;
  };

  const fetchStatus = async () => {
    if (!companyId) return;
    setLoadingStatus(true);
    try {
      const response = await whatsappApi.status(companyId);
      const nextStatus = normalizeStatus(response.status);
      setStatus(nextStatus);
      setPhoneNumber(response.phone_number ?? null);
      if (nextStatus === "connected") {
        setQrCode(null);
      }
    } catch (error) {
      toast({
        title: "Erro ao consultar status",
        description: "Não foi possível consultar o status do WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleConnect = async () => {
    if (!companyId) {
      toast({
        title: "Selecione uma empresa",
        description: "Não foi possível identificar a empresa ativa.",
        variant: "destructive",
      });
      return;
    }

    setConnecting(true);
    try {
      const response = await whatsappApi.connect(companyId);
      const nextStatus = normalizeStatus(response.status);
      setStatus(nextStatus);
      setQrCode(response.qr_code ?? null);
      setPhoneNumber(response.phone_number ?? null);
      toast({
        title: "Sessão iniciada",
        description:
          nextStatus === "connected"
            ? "WhatsApp já está conectado."
            : "Escaneie o QR Code para concluir a conexão.",
      });
    } catch (error) {
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível iniciar a sessão do WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (!companyId) return;
    fetchStatus();
  }, [companyId]);

  useEffect(() => {
    if (!companyId) return;
    if (status !== "pending") return;

    const timer = setTimeout(() => {
      fetchStatus();
    }, 4000);

    return () => clearTimeout(timer);
  }, [status, companyId]);

  if (!canManage) {
    return (
      <div className="animate-fade-in">
        <PageHeader
          title="Conexão WhatsApp"
          description="Gerencie a conexão com o WhatsApp para envio de notificações"
        />
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Acesso à conexão do WhatsApp não está disponível para o seu perfil.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Conexão WhatsApp"
        description="Gerencie a conexão com o WhatsApp para envio de notificações"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Status da Conexão
            </CardTitle>
            <CardDescription>
              Informações sobre a conexão atual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold mt-1">
                  <StatusBadge status={displayStatus} />
                </p>
              </div>
              <div
                className={`h-4 w-4 rounded-full ${
                  status === "connected"
                    ? "bg-success animate-pulse"
                    : status === "pending"
                      ? "bg-warning animate-pulse"
                      : "bg-destructive"
                }`}
              />
            </div>

            {status === "connected" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Número</p>
                    <p className="font-medium">{phoneNumber ?? "—"}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Conectado desde</p>
                    <p className="font-medium">01/03/2024</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Mensagens enviadas hoje</p>
                  <p className="text-2xl font-bold text-primary">127</p>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleConnect}
                className="flex-1"
                disabled={connecting}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                {status === "connected" ? "Reiniciar sessão" : "Conectar / Gerar QR"}
              </Button>
              <Button
                variant="outline"
                onClick={fetchStatus}
                className="flex-1"
                disabled={loadingStatus}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingStatus ? "animate-spin" : ""}`} />
                Checar status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code
            </CardTitle>
            <CardDescription>
              Escaneie o QR Code com o WhatsApp para conectar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square max-w-[280px] mx-auto p-6 rounded-xl bg-card border-2 border-dashed border-border flex items-center justify-center">
              {status === "connected" ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="h-8 w-8 text-success" />
                  </div>
                  <p className="font-medium text-success">WhatsApp Conectado</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sua sessão está ativa
                  </p>
                </div>
              ) : qrCode ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={buildQrSrc(qrCode) ?? ""}
                    alt="QR Code do WhatsApp"
                    className="w-64 h-64 object-contain rounded-md border border-border"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Escaneie no WhatsApp para concluir a conexão.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Nenhum QR disponível. Clique em “Conectar / Gerar QR”.</p>
                </div>
              )}
            </div>

            {status !== "connected" && (
              <Button
                variant="outline"
                onClick={handleConnect}
                disabled={connecting}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${connecting ? "animate-spin" : ""}`} />
                Gerar/Atualizar QR Code
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
