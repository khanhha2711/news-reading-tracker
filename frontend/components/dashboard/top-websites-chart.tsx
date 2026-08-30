import { dashboardService } from "@/service/dashboardService";

import { TopWebsitesChartUi } from "./top-websites-chart-ui";

export async function TopWebsitesChart() {
  const data = await dashboardService.getTopWebsites();

  return <TopWebsitesChartUi data={data} />;
}
