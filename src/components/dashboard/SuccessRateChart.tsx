import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SuccessRateChartProps {
  successRate: number;
}

export function SuccessRateChart({ successRate }: SuccessRateChartProps) {
  const data = [
    { name: "Profit", value: successRate },
    { name: "Loss", value: 100 - successRate },
  ];

  const chartConfig = {
    profit: {
      label: "Closed With Profit",
      color: "hsl(var(--success))",
    },
    loss: {
      label: "Closed With Loss",
      color: "hsl(var(--destructive))",
    },
  };

  return (
    <div className="w-full h-[200px]">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              nameKey="name"
              label={({
                cx,
                cy,
                // midAngle,
                // innerRadius,
                // outerRadius,
                value,
                index,
              }) => {
                if (index === 0) {
                  // Only show the percentage for the profit slice
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-foreground font-bold text-xl"
                    >
                      {`${value}%`}
                    </text>
                  );
                }
                return null;
              }}
            >
              <Cell key="profit" fill="var(--color-profit)" />
              <Cell key="loss" fill="var(--color-loss)" />
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
