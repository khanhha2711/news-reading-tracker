"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { ArticlesOverTime, Period } from "@/types/dashboard";

import {
  Card,
  CardAction,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ArticlesReadChartUiProps {
  data: ArticlesOverTime[];
}

const chartConfig = {
  count: {
    label: "Articles",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ArticlesReadChartUi({ data }: ArticlesReadChartUiProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const period = (searchParams.get("articleReadsPeriod") as Period) || "MONTH";
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(period);

  useEffect(() => {
    setSelectedPeriod(period);
  }, [period]);

  const handlePeriodChange = (value: string) => {
    if (value !== "WEEK" && value !== "MONTH") {
      return;
    }

    const nextPeriod = value as Period;

    setSelectedPeriod(nextPeriod);

    const params = new URLSearchParams(searchParams.toString());

    params.set("articleReadsPeriod", nextPeriod);
    router.push(`?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles Read</CardTitle>

        <CardDescription>
          Articles read {selectedPeriod === "WEEK" ? "this week" : "this month"}
        </CardDescription>

        <CardAction>
          <ToggleGroup
            multiple={false}
            value={[selectedPeriod]}
            onValueChange={(value) => {
              const selected = value[0];

              if (selected) {
                handlePeriodChange(selected);
              }
            }}
            variant="outline"
          >
            <ToggleGroupItem
              value="WEEK"
              className={`
                rounded-md border-0 px-4
                ${
                  selectedPeriod === "WEEK"
                    ? "bg-primary text-black shadow-sm"
                    : "text-muted-foreground"
                }
              `}
            >
              Week
            </ToggleGroupItem>

            <ToggleGroupItem
              value="MONTH"
              className={`
                rounded-md border-0 px-4
                ${
                  selectedPeriod === "MONTH"
                    ? "bg-primary text-black shadow-sm"
                    : "text-muted-foreground"
                }
              `}
            >
              Month
            </ToggleGroupItem>
          </ToggleGroup>

          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-28 md:hidden">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="WEEK">Week</SelectItem>

              <SelectItem value="MONTH">Month</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);

                if (selectedPeriod === "WEEK") {
                  return date.toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                }

                return date.toLocaleDateString("en-US", {
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              cursor={{ fill: "var(--muted)" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value);

                    if (selectedPeriod === "WEEK") {
                      return date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      });
                    }

                    return date.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
              }
            />

            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
