export type Period = "WEEK" | "MONTH";

export interface DashboardSummary {
  totalArticles: number;
  totalReadingTime: number;
  averageReadingTime: number;
}

export interface DashboardArticle {
  article: {
    id: string;
    url: string;
    title: string;
    content: string;
    summary: string;
    domain: string;
  };
  readingTime: number;
  events: {
    eventType: string;
    timestamp: string;
  }[];
}

export interface ArticlesOverTime {
  date: string;
  count: number;
}

export interface ReadingTimeOverTime {
  date: string;
  readingTime: number;
}

export interface TopWebsite {
  domain: string;
  visits: number;
}

export interface RecentArticle {
  article: {
    id: string;
    title: string;
    url: string;
    domain: string;
  };
  readAt: string;
  readingTime: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  articles: DashboardArticle[];
  articleReads: ArticlesOverTime[];
  readingTimes: ReadingTimeOverTime[];
  websites: TopWebsite[];
  recentArticles: RecentArticle[];
}

export interface ArticlesResponse {
  data: DashboardArticle[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ArticlesMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Article {
  id: string;
  url: string;
  title: string;
  content: string;
  summary: string;
  domain: { id: string; name: string };
}
