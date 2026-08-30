import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { Event } from 'src/events/entities/event.entity';
import { ArticleVisit } from './entities/article-visit.entity';
import { EventsModule } from 'src/events/events.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [
    TypeOrmModule.forFeature([Event, Article, ArticleVisit]),
    EventsModule,
  ],
})
export class DashboardModule {}
