
"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ArticlesMeta, DashboardArticle } from "@/types/dashboard";

import { ArticleDetail } from "./article-detail";
import { ArticlesDataTable } from "./articles-data-table";

interface ArticlesSectionUiProps {
  data: DashboardArticle[];
  meta: ArticlesMeta;
}

export function ArticlesSectionUi({
  data,
  meta,
}: ArticlesSectionUiProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedArticle, setSelectedArticle] =
    useState<DashboardArticle | null>(null);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLimitChange = (limit: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");
    params.set("limit", String(limit));

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className={`mt-4 grid grid-cols-1 gap-6 px-4 lg:px-6 ${
        selectedArticle ? "lg:grid-cols-4" : ""
      }`}
    >
      <div
        className={
          selectedArticle
            ? "lg:col-span-3"
            : "lg:col-span-4"
        }
      >
        <ArticlesDataTable
          data={data}
          meta={meta}
          selectedArticle={selectedArticle}
          onSelectArticle={setSelectedArticle}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

      {selectedArticle && (
        <ArticleDetail article={selectedArticle} />
      )}
    </div>
  );
}

