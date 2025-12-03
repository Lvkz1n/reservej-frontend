import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { mockTemplates, TemplateNotificacao } from "@/mock/data";
import { Bell, Eye, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const variaveis = ['{{nome_cliente}}', '{{data}}', '{{hora}}', '{{servico}}'];

export default function Notificacoes() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [previewDialog, setPreviewDialog] = useState<TemplateNotificacao | null>(null);

  const handleToggle = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, ativo: !t.ativo } : t
    ));
    toast({
      title: "Template atualizado",
      description: "O status do template foi alterado (mock)",
    });
  };

  const handleSave = (id: string, mensagem: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, mensagem } : t
    ));
    toast({
      title: "Template salvo",
      description: "A mensagem foi salva com sucesso (mock)",
    });
  };

  const getPreviewText = (template: TemplateNotificacao) => {
    return template.mensagem
      .replace('{{nome_cliente}}', 'João Silva')
      .replace('{{data}}', '15/03/2024')
      .replace('{{hora}}', '14:00')
      .replace('{{servico}}', 'Corte de Cabelo');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Mensagens & Notificações"
        description="Configure os templates de mensagens enviadas via WhatsApp"
      />

      {/* Variables Reference */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Variáveis Disponíveis</CardTitle>
          <CardDescription>Use estas variáveis nos seus templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {variaveis.map((v) => (
              <code key={v} className="px-2 py-1 rounded bg-muted text-sm font-mono">
                {v}
              </code>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <div className="space-y-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onToggle={() => handleToggle(template.id)}
            onSave={(msg) => handleSave(template.id, msg)}
            onPreview={() => setPreviewDialog(template)}
          />
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewDialog} onOpenChange={() => setPreviewDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview da Mensagem</DialogTitle>
            <DialogDescription>{previewDialog?.nome}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <p className="text-sm whitespace-pre-wrap">
                {previewDialog && getPreviewText(previewDialog)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Preview com dados de exemplo
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialog(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TemplateCardProps {
  template: TemplateNotificacao;
  onToggle: () => void;
  onSave: (mensagem: string) => void;
  onPreview: () => void;
}

function TemplateCard({ template, onToggle, onSave, onPreview }: TemplateCardProps) {
  const [mensagem, setMensagem] = useState(template.mensagem);
  const hasChanges = mensagem !== template.mensagem;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{template.nome}</CardTitle>
              <CardDescription className="text-xs">{template.tipo}</CardDescription>
            </div>
          </div>
          <Switch checked={template.ativo} onCheckedChange={onToggle} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          {hasChanges && (
            <Button size="sm" onClick={() => onSave(mensagem)}>
              <Save className="h-4 w-4 mr-1" />
              Salvar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
