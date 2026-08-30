import { ArticlesSectionUi } from "@/components/articles/articles-section";
import { articleService } from "@/service/articleService";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;

  const result = await articleService.getArticles(page, limit);
  return <ArticlesSectionUi data={result.data} meta={result.meta} />;
}
