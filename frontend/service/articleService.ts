import { api } from "@/lib/axios";
import type { ArticlesResponse } from "@/types/dashboard";

export const articleService = {
  getArticles: async (page = 1, limit = 10): Promise<ArticlesResponse> => {
    try {
      const response = await api.get("/dashboard/articles", {
        params: {
          page,
          limit,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      throw error;
    }
  },
};
