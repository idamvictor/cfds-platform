import * as React from "react";
import { Label, Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { browser: "profit", visitors: 90, fill: "url(#primaryGradient)" },
  { browser: "loss", visitors: 10, fill: "url(#lossGradient)" },
];

const chartConfig = {
  safari: {
    label: "Profit",
    color: "var(--primary)",
  },
  other: {
    label: "Loss",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;

export function PieChartComponent() {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>();
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <defs>
              <filter id="shadow">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="3"
                  floodOpacity="0.5"
                />
              </filter>
              <linearGradient id="primaryGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="#ced920" />
              </linearGradient>
              <linearGradient
                id="primaryStrokeGradient"
                x1="0"
                y1="1"
                x2="0"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity="0.4"
                />
                <stop offset="100%" stopColor="#ced920" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient
                id="primaryGradientHover"
                x1="0"
                y1="1"
                x2="0"
                y2="0"
              >
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
                <stop offset="100%" stopColor="#ced920" stopOpacity="1" />
              </linearGradient>
              <linearGradient
                id="primaryGradientDim"
                x1="0"
                y1="1"
                x2="0"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity="0.3"
                />
                <stop offset="100%" stopColor="#ced920" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a91d26" />
                <stop offset="100%" stopColor="#4361A7" />
              </linearGradient>
              <linearGradient
                id="lossStrokeGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#a91d26" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4361A7" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient
                id="lossGradientHover"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#a91d26" stopOpacity="1" />
                <stop offset="100%" stopColor="#4361A7" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="lossGradientDim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a91d26" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#4361A7" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={80}
              outerRadius={130}
              strokeWidth={2}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    activeIndex !== undefined
                      ? activeIndex === index
                        ? entry.browser === "profit"
                          ? "url(#primaryGradientHover)"
                          : "url(#lossGradientHover)"
                        : entry.browser === "profit"
                        ? "url(#primaryGradientDim)"
                        : "url(#lossGradientDim)"
                      : entry.fill
                  }
                  stroke={
                    entry.browser === "profit"
                      ? "url(#primaryStrokeGradient)"
                      : "url(#lossStrokeGradient)"
                  }
                  strokeWidth={activeIndex === index ? 12 : 2}
                  style={{
                    filter: activeIndex === index ? "url(#shadow)" : "none",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const winRate = (
                      (chartData[0].visitors / totalVisitors) *
                      100
                    ).toFixed(1); // Calculate win rate percentage
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {winRate}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Win Rate
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
    </Card>
  );
}
