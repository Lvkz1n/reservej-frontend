import { cn } from "@/lib/utils";

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

const statusMap: Record<string, StatusType> = {
  'Ativo': 'success',
  'Confirmado': 'success',
  'Concluído': 'success',
  'Conectado': 'success',
  'Pendente': 'warning',
  'Inativo': 'error',
  'Cancelado': 'error',
  'Desconectado': 'error',
};

const typeStyles: Record<StatusType, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-primary/10 text-primary border-primary/20',
  default: 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const resolvedType = type || statusMap[status] || 'default';
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      typeStyles[resolvedType],
      className
    )}>
      {status}
    </span>
  );
}
