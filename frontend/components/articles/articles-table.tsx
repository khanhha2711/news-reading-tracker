"use client";

import * as React from "react";
import { Clock3, ExternalLink, FileText } from "lucide-react";

import type { Article, DashboardArticle } from "@/types/dashboard";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatReadingTime } from "@/lib/utils";

interface ArticlesTableProps {
  data: DashboardArticle[];
  selectedArticle: DashboardArticle | null;
  onSelectArticle: (article: DashboardArticle) => void;
  startIndex?: number;
}

export function ArticlesTable({
  data,
  selectedArticle,
  onSelectArticle,
  startIndex = 0,
}: ArticlesTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
        No articles found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-[60px]">#</TableHead>

            <TableHead className="w-[380px]">Article</TableHead>

            <TableHead className="w-[150px]">Domain</TableHead>

            <TableHead className="w-[300px]">URL</TableHead>

            <TableHead className="w-[140px]">Reading Time</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => {
            console.log(item);
            const isSelected = selectedArticle?.article.id === item?.article.id;

            return (
              <TableRow
                key={item.article.id}
                onClick={() => onSelectArticle(item)}
                data-state={isSelected ? "selected" : undefined}
                className="cursor-pointer transition-colors hover:bg-muted/50"
              >
                {/* # */}
                <TableCell className="text-muted-foreground">
                  {startIndex + index + 1}
                </TableCell>

                {/* Article */}
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate font-medium"
                        title={item.article.title ?? ""}
                      >
                        {item.article.title}
                      </p>

                      {item.article.summary && (
                        <p
                          className="truncate text-xs text-muted-foreground"
                          title={item.article.summary}
                        >
                          {item.article.summary}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Domain */}
                <TableCell>
                  <Badge variant="secondary">{item.article.domain}</Badge>
                </TableCell>

                {/* URL */}
                <TableCell>
                  <a
                    href={item.article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="group flex min-w-0 items-center gap-1.5"
                    title={item.article.url}
                  >
                    <span className="block truncate text-sm text-muted-foreground group-hover:text-foreground">
                      {item.article.url}
                    </span>

                    <ExternalLink className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </TableCell>

                {/* Reading Time */}
                <TableCell>
                  <div className="flex items-center gap-1.5 whitespace-nowrap text-muted-foreground">
                    <Clock3 className="size-4 shrink-0" />

                    {formatReadingTime(item.readingTime)}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
