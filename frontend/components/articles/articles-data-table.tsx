"use client";

import type { ArticlesMeta, DashboardArticle } from "@/types/dashboard";

import { ArticlesTable } from "./articles-table";
import { ArticlesPagination } from "./articles-pagination";

interface ArticlesDataTableProps {
  data: DashboardArticle[];
  meta: ArticlesMeta;
  selectedArticle: DashboardArticle | null;
  onSelectArticle: (article: DashboardArticle) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function ArticlesDataTable({
  data,
  meta,
  selectedArticle,
  onSelectArticle,
  onPageChange,
  onLimitChange,
}: ArticlesDataTableProps) {
    console.log(data)
  return (
    <div className="space-y-4">
      <ArticlesTable
        data={data}
        selectedArticle={selectedArticle}
        onSelectArticle={onSelectArticle}
        startIndex={(meta.page - 1) * meta.limit}
      />

      <ArticlesPagination
        page={meta.page}
        limit={meta.limit}
        totalPages={meta.totalPages}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}
