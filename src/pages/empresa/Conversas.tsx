import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { mockConversas } from "@/mock/data";
import { MessageSquare, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Conversas() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Conversas"
        description="Central de mensagens com clientes via WhatsApp"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {mockConversas.map((conversa) => (
                <div
                  key={conversa.id}
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conversa.clienteNome}</p>
                        <span className="text-xs text-muted-foreground">{conversa.dataHora}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {conversa.ultimaMensagem}
                      </p>
                    </div>
                    {conversa.naoLidas > 0 && (
                      <Badge className="bg-primary text-primary-foreground">
                        {conversa.naoLidas}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Panel */}
        <Card className="lg:col-span-2">
          <CardContent className="h-full min-h-[400px] flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Conversas em Breve</h3>
              <p className="text-muted-foreground mb-6">
                Este módulo permitirá responder clientes pelo WhatsApp diretamente dentro do ReserveJá. 
                Você poderá visualizar todo o histórico de conversas e interagir com seus clientes sem sair da plataforma.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Em desenvolvimento</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
