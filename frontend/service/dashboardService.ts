import { api } from "@/lib/axios";

export const dashboardService = {
  getSummary: async () => {
    try {
      const response = await api.get("/dashboard/summary");

      return response.data;
    } catch (error) {
      console.error("Failed to fetch dashboard summary:", error);
      throw error;
    }
  },

  getArticles: async () => {
    try {
      const response = await api.get("/dashboard/articles");

      return response.data;
    } catch (error) {
      console.error("Failed to fetch dashboard articles:", error);
      throw error;
    }
  },

  getArticleReads: async (period: "WEEK" | "MONTH") => {
    try {
      const response = await api.get("/dashboard/article-reads", {
        params: { period },
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch article reads:", error);
      throw error;
    }
  },

  getReadingTimes: async (period: "WEEK" | "MONTH") => {
    try {
      const response = await api.get("/dashboard/reading-times", {
        params: { period },
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch reading times:", error);
      throw error;
    }
  },

  getTopWebsites: async () => {
    try {
      const response = await api.get("/dashboard/websites");

      return response.data;
    } catch (error) {
      console.error("Failed to fetch top websites:", error);
      throw error;
    }
  },

  getRecentArticles: async (limit = 10) => {
    try {
      const response = await api.get("/dashboard/recent-articles", {
        params: { limit },
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch recent articles:", error);
      throw error;
    }
  },
};
