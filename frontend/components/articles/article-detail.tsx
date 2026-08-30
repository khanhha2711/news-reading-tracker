import { ExternalLink, Globe, Clock3, Activity } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

import { formatReadingTime } from "@/lib/utils";
import { ArticleTimeline } from "./article-timeline";
import type { DashboardArticle } from "@/types/dashboard";

export function ArticleDetail({
  article,
}: {
  article: DashboardArticle | null;
}) {
  if (!article) {
    return null;
  }

  return (
    <Card className="flex h-[calc(100vh-8rem)] min-h-0 flex-col overflow-hidden">
      {/* Header */}
      <CardHeader className="shrink-0 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">
                <Globe className="mr-1 size-3" />
                {article.article.domain}
              </Badge>
            </div>

            <CardTitle className="font-bold line-clamp-3 text-lg leading-6">
              {article.article.title}
            </CardTitle>
          </div>

          <Button variant="outline" size="icon" asChild className="shrink-0">
            <a
              href={article.article.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open article"
            >
              <ExternalLink className="size-4" />
            </a>
          </Button>
        </div>

        <a
          href={article.article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block truncate text-xs text-muted-foreground hover:text-foreground"
          title={article.article.url}
        >
          {article.article.url}
        </a>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-y-auto pt-2">
        <div className="space-y-2">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center rounded-lg border bg-muted/30 p-3">
              <div className="font-bold flex items-center gap-2 text-xs text-muted-foreground">
                Reading Time
              </div>

              <p className=" mt-1.5 text-lg font-semibold">
                {formatReadingTime(article.readingTime)}
              </p>
            </div>

            <div className=" text-center rounded-lg border bg-muted/30 p-3">
              <div className="font-bold flex items-center gap-2 text-xs text-muted-foreground">
                Total Events
              </div>

              <p className="text-center mt-1.5 text-lg font-semibold">
                {article.events.length}
              </p>
            </div>
          </div>

          {/* Summary */}
          {article.article.summary && (
            <div>
              <h3 className=" text-sm font-semibold">Summary</h3>

              <div className="rounded-lg bg-muted/30 p-3">
                <p className="text-sm leading-6 text-muted-foreground">
                  {article.article.summary}
                </p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Reading Timeline</h3>

              <span className="text-xs text-muted-foreground">
                {article.events.length} events
              </span>
            </div>

            <div className="rounded-lg border bg-muted/10 p-4">
              <ArticleTimeline events={article.events} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
