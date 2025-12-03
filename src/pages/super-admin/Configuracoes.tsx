import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export default function Configuracoes() {
  const [platformName, setPlatformName] = useState("ReserveJá");
  const [primaryColor, setPrimaryColor] = useState("#2563eb");

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "As alterações foram salvas com sucesso (mock)",
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Configurações da Plataforma"
        description="Personalize a aparência e configurações gerais"
      />

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Identidade Visual</CardTitle>
            <CardDescription>
              Configure o nome e logotipo da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Nome da Plataforma</Label>
              <Input
                id="platformName"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Logo da Plataforma</Label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <Button variant="outline">Upload Logo</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Recomendado: PNG ou SVG, 256x256px
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryColor">Cor Primária</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="primaryColor"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Email</CardTitle>
            <CardDescription>
              Configure as notificações por email do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailFrom">Email de Envio</Label>
              <Input id="emailFrom" placeholder="noreply@reserveja.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Email de Suporte</Label>
              <Input id="supportEmail" placeholder="suporte@reserveja.com" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </div>
    </div>
  );
}
