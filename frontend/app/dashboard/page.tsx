import { ArticlesReadChart } from "@/components/dashboard/articles-read-chart";
import { ReadingTimeChart } from "@/components/dashboard/reading-time-chart";
import { SectionCards } from "@/components/dashboard/section-cards";
import { TopWebsitesChart } from "@/components/dashboard/top-websites-chart";

import type { Period } from "@/types/dashboard";

interface PageProps {
  searchParams: Promise<{
    readingTimePeriod?: string;
    articleReadsPeriod?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const readingTimePeriod: Period =
    params.readingTimePeriod === "WEEK" ? "WEEK" : "MONTH";

  const articleReadsPeriod: Period =
    params.articleReadsPeriod === "WEEK" ? "WEEK" : "MONTH";

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-6 py-4 md:py-6">
        <SectionCards />

        <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-2 lg:px-6">
          <TopWebsitesChart />

          <ArticlesReadChart period={articleReadsPeriod} />
        </div>

        <div className="grid grid-cols-1 gap-6 px-4 lg:px-6">
          <ReadingTimeChart period={readingTimePeriod} />
        </div>
      </div>
    </div>
  );
}
