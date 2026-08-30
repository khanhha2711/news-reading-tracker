import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateEventsDto } from './dto/create-events.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import { ArticlesService } from 'src/articles/articles.service';
import { ArticleVisit } from 'src/dashboard/entities/article-visit.entity';
import { EventType } from './enum/even-type.enum';
import { Article } from 'src/articles/entities/article.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly sessionService: SessionsService,
    private readonly articleService: ArticlesService,

    @InjectRepository(ArticleVisit)
    private readonly articleVisitRepository: Repository<ArticleVisit>,
  ) {}

  async create(createEventsDto: CreateEventsDto) {
    const eventDtos = createEventsDto.events;

    if (!eventDtos.length) {
      return [];
    }

    const sessionMap = await this.getSessionMap(eventDtos);
    const articleMap = await this.getArticleMap(eventDtos);

    const events = this.createEventEntities(eventDtos, sessionMap, articleMap);

    const savedEvents = await this.eventRepository.save(events);

    await this.processArticleVisits(savedEvents);

    return savedEvents;
  }

  private async getSessionMap(eventDtos: CreateEventsDto['events']) {
    const sessionIds = [...new Set(eventDtos.map((event) => event.sessionId))];

    const sessions = await this.sessionService.findByIds(sessionIds);

    return new Map(sessions.map((session) => [session.id, session]));
  }

  private async getArticleMap(eventDtos: CreateEventsDto['events']) {
    const uniqueArticles = new Map<
      string,
      {
        url: string;
        domain: string;
        title: string;
        content: string;
        summary: string;
      }
    >();

    for (const event of eventDtos) {
      if (!uniqueArticles.has(event.url)) {
        uniqueArticles.set(event.url, {
          url: event.url,
          domain: event.domain,
          title: event.title,
          content: event.content || '',
          summary: event.summary || '',
        });
      }
    }

    const articleMap = new Map<string, Article>();

    for (const articleData of uniqueArticles.values()) {
      const article = await this.articleService.findOrCreate(articleData);

      articleMap.set(articleData.url, article);
    }

    return articleMap;
  }

  private createEventEntities(
    eventDtos: CreateEventsDto['events'],
    sessionMap: Map<string, any>,
    articleMap: Map<string, Article>,
  ) {
    return eventDtos.map((eventDto) => {
      const session = sessionMap.get(eventDto.sessionId);

      const article = articleMap.get(eventDto.url);

      if (!session) {
        throw new NotFoundException(`Session ${eventDto.sessionId} not found`);
      }

      if (!article) {
        throw new NotFoundException(`Article ${eventDto.url} not found`);
      }

      return this.eventRepository.create({
        installationId: eventDto.installationId,
        eventType: eventDto.eventType,
        tabId: eventDto.tabId,
        timestamp: new Date(eventDto.timestamp),
        session,
        article,
      });
    });
  }

  private async processArticleVisits(events: Event[]) {
    const sortedEvents = [...events].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );

    for (const event of sortedEvents) {
      switch (event.eventType) {
        case EventType.PAGE_ENTER:
          await this.handlePageEnter(event);
          break;

        case EventType.PAGE_ACTIVE:
          await this.handlePageActive(event);
          break;

        case EventType.PAGE_INACTIVE:
          await this.handlePageInactive(event);
          break;

        case EventType.PAGE_LEAVE:
          await this.handlePageLeave(event);
          break;
      }
    }
  }
  private async handlePageEnter(event: Event) {
    const oldVisit = await this.articleVisitRepository.findOne({
      where: {
        sessionId: event.session.id,
        tabId: event.tabId,
        endedAt: IsNull(),
      },
    });

    if (oldVisit) {
      if (oldVisit.activeStartedAt) {
        oldVisit.readingTime += this.calculateDuration(
          oldVisit.activeStartedAt,
          event.timestamp,
        );

        oldVisit.activeStartedAt = null;
      }

      oldVisit.endedAt = event.timestamp;

      await this.articleVisitRepository.save(oldVisit);
    }

    const visit = this.articleVisitRepository.create({
      articleId: event.article.id,
      sessionId: event.session.id,
      tabId: event.tabId,
      startedAt: event.timestamp,
      endedAt: null,
      activeStartedAt: null,
      readingTime: 0,
    });

    await this.articleVisitRepository.save(visit);
  }

  private async findActiveVisit(event: Event) {
    return this.articleVisitRepository.findOne({
      where: {
        articleId: event.article.id,
        sessionId: event.session.id,
        tabId: event.tabId,
        endedAt: IsNull(),
      },
    });
  }
  private async handlePageActive(event: Event) {
    const visit = await this.findActiveVisit(event);

    if (!visit) {
      return;
    }

    if (visit.activeStartedAt) {
      return;
    }

    visit.activeStartedAt = event.timestamp;

    await this.articleVisitRepository.save(visit);
  }

  private async handlePageInactive(event: Event) {
    const visit = await this.findActiveVisit(event);

    if (!visit || !visit.activeStartedAt) {
      return;
    }

    visit.readingTime += this.calculateDuration(
      visit.activeStartedAt,
      event.timestamp,
    );

    visit.activeStartedAt = null;

    await this.articleVisitRepository.save(visit);
  }

  private async handlePageLeave(event: Event) {
    const visit = await this.findActiveVisit(event);

    if (!visit) {
      return;
    }

    if (visit.activeStartedAt) {
      visit.readingTime += this.calculateDuration(
        visit.activeStartedAt,
        event.timestamp,
      );

      visit.activeStartedAt = null;
    }

    visit.endedAt = event.timestamp;

    await this.articleVisitRepository.save(visit);
  }

  private calculateDuration(start: Date, end: Date): number {
    const duration = end.getTime() - start.getTime();

    if (duration <= 0) {
      return 0;
    }

    return Math.floor(duration / 1000);
  }
  async findAll() {
    const events = await this.eventRepository.find({
      relations: {
        article: true,
      },
      order: {
        timestamp: 'ASC',
      },
    });
    return events;
  }
}
