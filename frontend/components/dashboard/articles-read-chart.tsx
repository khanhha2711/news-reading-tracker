import { dashboardService } from "@/service/dashboardService";
import type { Period } from "@/types/dashboard";

import { ArticlesReadChartUi } from "./articles-read-chart-ui";

interface ArticlesReadChartProps {
  period: Period;
}

export async function ArticlesReadChart({ period }: ArticlesReadChartProps) {
  const data = await dashboardService.getArticleReads(period);

  return <ArticlesReadChartUi data={data} />;
}
