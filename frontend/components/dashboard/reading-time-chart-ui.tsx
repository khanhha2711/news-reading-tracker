"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import type { Period, ReadingTimeOverTime } from "@/types/dashboard";

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

interface ReadingTimeChartUiProps {
  data: ReadingTimeOverTime[];
}

const chartConfig = {
  readingTime: {
    label: "Reading Time",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ReadingTimeChartUi({ data }: ReadingTimeChartUiProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const period = (searchParams.get("readingTimePeriod") as Period) || "MONTH";
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

    params.set("readingTimePeriod", nextPeriod);
    router.push(`?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Time</CardTitle>

        <CardDescription>
          Reading time {selectedPeriod === "WEEK" ? "this week" : "this month"}
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
                    : "text-muted-foreground "
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
                    : "text-muted-foreground "
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
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillReadingTime" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-readingTime)"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="var(--color-readingTime)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

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
              cursor={false}
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
            <Area
              dataKey="readingTime"
              type="natural"
              fill="url(#fillReadingTime)"
              stroke="var(--color-readingTime)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
