
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
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
            <LineChart data={activeTab === "week" ? weekData : monthData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                  r: 4,
                  fill: "hsl(var(--card))",
                }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
