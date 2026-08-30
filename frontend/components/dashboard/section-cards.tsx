import { BookOpen, Clock3, Timer } from "lucide-react";

import { dashboardService } from "@/service/dashboardService";
import { SummaryCard } from "./summary-card";
import { formatReadingTime } from "@/lib/utils";

export async function SectionCards() {
  const data = await dashboardService.getSummary();

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-3">
      <SummaryCard
        title="Articles Read"
        value={data.totalArticles}
        description="Total articles you've read"
        icon={BookOpen}
      />

      <SummaryCard
        title="Total Reading Time"
        value={formatReadingTime(data.totalReadingTime)}
        description="Time spent reading articles"
        icon={Clock3}
      />

      <SummaryCard
        title="Average Reading Time"
        value={formatReadingTime(data.averageReadingTime)}
        description="Average time per article"
        icon={Timer}
      />
    </div>
  );
}
