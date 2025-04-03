import * as React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const weekData = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 420 },
  { name: "Wed", value: 450 },
  { name: "Thu", value: 470 },
  { name: "Fri", value: 480 },
  { name: "Sat", value: 520 },
  { name: "Sun", value: 550 },
];

const monthData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 420 },
  { name: "Mar", value: 450 },
  { name: "Apr", value: 470 },
  { name: "May", value: 480 },
  { name: "Jun", value: 520 },
  { name: "Jul", value: 550 },
  { name: "Aug", value: 570 },
  { name: "Sep", value: 590 },
  { name: "Oct", value: 620 },
  { name: "Nov", value: 650 },
  { name: "Dec", value: 680 },
];

export function TradingResultsChart() {
  const [activeTab, setActiveTab] = React.useState("week");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Trading Results</h2>
        <Tabs
          defaultValue="week"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Card className="bg-card text-card-foreground p-4">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activeTab === "week" ? weekData : monthData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
