import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  footnote?: string;
  valueClassName?: string;
}

export function StatCard({
  title,
  value,
  icon,
  footnote,
  valueClassName = "",
}: StatCardProps) {
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClassName}`}>{value}</div>
        {footnote && (
          <p className="text-xs text-muted-foreground">{footnote}</p>
        )}
      </CardContent>
    </Card>
  );
}
