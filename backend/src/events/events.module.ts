import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';

import { ArticlesModule } from 'src/articles/articles.module';
import { SessionsModule } from 'src/sessions/sessions.module';
import { ArticleVisit } from 'src/dashboard/entities/article-visit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, ArticleVisit]),
    ArticlesModule,
    SessionsModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
