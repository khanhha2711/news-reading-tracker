import {
  ArticlesOverTime,
  DashboardData,
  Period,
  ReadingTimeOverTime,
} from "./dashboard";

export interface DashboardStore {
  data: DashboardData | null;

  articleReadsPeriod: Period;
  readingTimesPeriod: Period;

  setData: (data: DashboardData) => void;

  setArticleReads: (data: ArticlesOverTime[]) => void;
  setReadingTimes: (data: ReadingTimeOverTime[]) => void;

  setArticleReadsPeriod: (period: Period) => void;
  setReadingTimesPeriod: (period: Period) => void;

  reset: () => void;
}
