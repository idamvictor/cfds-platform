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
    <Card>
      <CardHeader className="flex flex-col items-center justify-between space-y-0 pb-2">
        {icon}
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className={`text-xl font-bold ${valueClassName}`}>{value}</div>
        {footnote && (
          <p className="text-xs text-muted-foreground">{footnote}</p>
        )}
      </CardContent>
    </Card>
  );
}
