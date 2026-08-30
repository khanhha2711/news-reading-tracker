import { Period } from "@/types/dashboard";
import { DashboardStore } from "@/types/store";
import { create } from "zustand";

const initialState = {
  data: null,
  articleReadsPeriod: "WEEK" as Period,
  readingTimesPeriod: "WEEK" as Period,
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  ...initialState,

  setData: (data) => {
    set({ data });
  },

  setArticleReads: (articleReads) => {
    set((state) => ({
      data: state.data
        ? {
            ...state.data,
            articleReads,
          }
        : null,
    }));
  },

  setReadingTimes: (readingTimes) => {
    set((state) => ({
      data: state.data
        ? {
            ...state.data,
            readingTimes,
          }
        : null,
    }));
  },

  setArticleReadsPeriod: (period) => {
    set({
      articleReadsPeriod: period,
    });
  },

  setReadingTimesPeriod: (period) => {
    set({
      readingTimesPeriod: period,
    });
  },

  reset: () => {
    set(initialState);
  },
}));
