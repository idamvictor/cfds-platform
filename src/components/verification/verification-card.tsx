import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface VerificationCardProps {
  title: string;
  confirmed: boolean;
  icon: ReactNode;
}

export function VerificationCard({
  title,
  confirmed,
  icon,
}: VerificationCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 h-[180px] bg-card border-card-foreground/10">
      <div className="flex items-center justify-center mb-4">{icon}</div>
      <div className="text-center">
        <p className="font-medium">
          {title}
          {confirmed && (
            <span className="text-success ml-2">- IS CONFIRMED</span>
          )}
        </p>
      </div>
    </Card>
  );
}
