import { type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: SummaryCardProps) {
  return (
    <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md px-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-muted-foreground">
          {title}
        </CardTitle>

        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </CardHeader>

      <CardContent className="text-center">
        <div className="text-4xl font-semibold tracking-tight tabular-nums">
          {value}
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
