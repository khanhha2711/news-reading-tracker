"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { TopWebsite } from "@/types/dashboard";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface TopWebsitesChartUiProps {
  data: TopWebsite[];
}

const chartConfig = {
  visits: {
    label: "Visits",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function TopWebsitesChartUi({ data }: TopWebsitesChartUiProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Websites</CardTitle>

        <CardDescription>Websites you visit most often</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 0,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid horizontal={false} vertical />

            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />

            <YAxis
              type="category"
              dataKey="domain"
              tickLine={false}
              axisLine={false}
              width={100}
              tickMargin={8}
            />

            <ChartTooltip
              cursor={{ fill: "var(--muted)" }}
              content={<ChartTooltipContent />}
            />

            <Bar
              dataKey="visits"
              fill="var(--color-visits)"
              radius={[0, 6, 6, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
