import { dashboardService } from "@/service/dashboardService";
import type { Period } from "@/types/dashboard";
import { ReadingTimeChartUi } from "./reading-time-chart-ui";

interface ReadingTimeChartProps {
  period: Period;
}

export async function ReadingTimeChart({ period }: ReadingTimeChartProps) {
  const data = await dashboardService.getReadingTimes(period);

  return <ReadingTimeChartUi data={data} />;
}
