"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KPICard({ title, value, icon: Icon, description, variant = "default" }: {
  title: string; value: number; icon: React.ComponentType<{ className?: string }>; description?: string;
  variant?: "default" | "danger" | "warning" | "success";
}) {
  const cls: Record<string, string> = {
    default: "border-border", danger: "border-destructive/30 bg-destructive/5",
    warning: "border-warning/30 bg-warning/5", success: "border-success/30 bg-success/5",
  };
  return (
    <Card className={cls[variant]}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
