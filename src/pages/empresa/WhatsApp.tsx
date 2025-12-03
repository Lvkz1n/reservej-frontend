import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Smartphone, RefreshCw, LogOut, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function WhatsApp() {
  const [status, setStatus] = useState<'Conectado' | 'Desconectado'>('Conectado');
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "QR Code atualizado",
        description: "O QR Code foi atualizado (mock)",
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setStatus('Desconectado');
    toast({
      title: "WhatsApp desconectado",
      description: "A conexão foi encerrada (mock)",
    });
  };

  const handleConnect = () => {
    setStatus('Conectado');
    toast({
      title: "WhatsApp conectado",
      description: "Conexão estabelecida com sucesso (mock)",
    });
  };

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
                  <StatusBadge status={status} />
                </p>
              </div>
              <div className={`h-4 w-4 rounded-full ${status === 'Conectado' ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
            </div>

            {status === 'Conectado' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Número</p>
                    <p className="font-medium">+55 11 99999-9999</p>
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
              {status === 'Conectado' ? (
                <Button variant="destructive" onClick={handleDisconnect} className="flex-1">
                  <LogOut className="h-4 w-4 mr-2" />
                  Desconectar
                </Button>
              ) : (
                <Button onClick={handleConnect} className="flex-1">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Conectar
                </Button>
              )}
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
            {/* Fake QR Code */}
            <div className="aspect-square max-w-[280px] mx-auto p-6 rounded-xl bg-card border-2 border-dashed border-border flex items-center justify-center">
              {status === 'Conectado' ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="h-8 w-8 text-success" />
                  </div>
                  <p className="font-medium text-success">WhatsApp Conectado</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sua sessão está ativa
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  {/* Simulated QR Code Pattern */}
                  <div className="grid grid-cols-8 gap-1 mb-4">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Escaneie para conectar
                  </p>
                </div>
              )}
            </div>

            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={loading || status === 'Conectado'}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar QR Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
