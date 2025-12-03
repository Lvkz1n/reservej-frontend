import { cn } from "@/lib/utils";
import { Button } from "./button";
import { LucideIcon, Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  };
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  action, 
  className,
  children 
}: PageHeaderProps) {
  const ActionIcon = action?.icon || Plus;
  
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {children}
          {action && (
            <Button onClick={action.onClick} className="gap-2">
              <ActionIcon className="h-4 w-4" />
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
