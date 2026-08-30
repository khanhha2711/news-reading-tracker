import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleVisit } from './entities/article-visit.entity';
import { EventsService } from 'src/events/events.service';
import { PeriodQuery } from './enum/period-query.enum';
import { getPeriodDate } from '../helper/getPeriodDate';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ArticleVisit)
    private readonly articleRepository: Repository<ArticleVisit>,
    private readonly eventService: EventsService,
  ) {}

  async getSummary() {
    const visits = await this.articleRepository.find();

    const totalArticles = new Set(visits.map((visit) => visit.articleId)).size;

    const totalReadingTime = visits.reduce(
      (total, visit) => total + visit.readingTime,
      0,
    );

    const averageReadingTime =
      totalArticles > 0 ? Math.floor(totalReadingTime / totalArticles) : 0;

    return {
      totalArticles,
      totalReadingTime,
      averageReadingTime,
    };
  }

  async getArticles(page = 1, limit = 10) {
    type DashboardArticleSummary = {
      article: {
        id: string;
        url: string;
        title: string;
        content: string;
        summary: string;
        domain: string;
      };
      readingTime: number;
      events: Array<{
        eventType: string;
        timestamp: Date;
      }>;
    };

    const [visits, events] = await Promise.all([
      this.articleRepository.find({
        relations: {
          article: true,
        },
      }),
      this.eventService.findAll(),
    ]);

    const articleMap = new Map<string, DashboardArticleSummary>();

    for (const visit of visits) {
      const article = visit.article;

      if (!article) {
        continue;
      }

      if (!articleMap.has(article.id)) {
        articleMap.set(article.id, {
          article: {
            id: article.id,
            url: article.url,
            domain: new URL(article.url).hostname,
            title: article.title,
            content: article.content,
            summary: article.summary,
          },
          readingTime: visit.readingTime,
          events: [],
        });
      }
    }

    for (const event of events) {
      const article = event.article;

      if (!article) {
        continue;
      }

      if (!articleMap.has(article.id)) {
        articleMap.set(article.id, {
          article: {
            id: article.id,
            url: article.url,
            title: article.title,
            content: article.content,
            summary: article.summary,
            domain: new URL(article.url).hostname,
          },
          readingTime: 0,
          events: [],
        });
      }

      const item = articleMap.get(article.id)!;

      item.events.push({
        eventType: event.eventType,
        timestamp: event.timestamp,
      });
    }

    const allArticles = Array.from(articleMap.values());

    allArticles.sort((a, b) => {
      const latestA = a.events.length
        ? Math.max(
            ...a.events.map((event) => new Date(event.timestamp).getTime()),
          )
        : 0;

      const latestB = b.events.length
        ? Math.max(
            ...b.events.map((event) => new Date(event.timestamp).getTime()),
          )
        : 0;

      return latestB - latestA;
    });
    // Pagination
    const total = allArticles.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = allArticles.slice(startIndex, startIndex + limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getArticleReads(period: PeriodQuery) {
    const visits = await this.articleRepository.find();

    const result = new Map<string, Set<string>>();
    for (const visit of visits) {
      const date = getPeriodDate(visit.startedAt, period);

      if (!result.has(date)) {
        result.set(date, new Set());
      }

      result.get(date)!.add(visit.articleId);
    }

    return Array.from(result.entries())
      .map(([date, articles]) => ({
        date,
        count: articles.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getReadingTimes(period: PeriodQuery) {
    const visits = await this.articleRepository.find();

    const result = new Map<string, number>();

    for (const visit of visits) {
      const date = getPeriodDate(visit.startedAt, period);

      const currentTime = result.get(date) ?? 0;

      result.set(date, currentTime + visit.readingTime);
    }

    return Array.from(result, ([date, readingTime]) => ({
      date,
      readingTime,
    })).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getTopWebsites() {
    const visits = await this.articleRepository.find({
      relations: {
        article: true,
      },
    });

    const websiteMap = new Map<string, number>();

    for (const visit of visits) {
      if (!visit.article) {
        continue;
      }

      const domain = new URL(visit.article.url).hostname;

      websiteMap.set(domain, (websiteMap.get(domain) ?? 0) + 1);
    }

    return Array.from(websiteMap.entries())
      .map(([domain, visits]) => ({
        domain,
        visits,
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);
  }

  async getRecentArticles(limit = 10) {
    const visits = await this.articleRepository.find({
      relations: {
        article: true,
      },
      order: {
        startedAt: 'DESC',
      },
      take: limit,
    });

    return visits.map((visit) => ({
      article: {
        id: visit.article.id,
        title: visit.article.title,
        url: visit.article.url,
        domain: new URL(visit.article.url).hostname,
      },
      readAt: visit.startedAt,
      readingTime: visit.readingTime,
    }));
  }
}
