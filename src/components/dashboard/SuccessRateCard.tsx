import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChartComponent } from "./pie-cahrt";


export function SuccessRateCard() {
  return (
    <Card className="bg-card text-card-foreground row-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Success rate</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <PieChartComponent />
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm">Closed With Profit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span className="text-sm">Closed With Loss</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
