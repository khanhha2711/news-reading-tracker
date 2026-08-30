import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { SessionsModule } from './sessions/sessions.module';
import { ArticlesModule } from './articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/entities/event.entity';
import { ConfigModule } from '@nestjs/config';
import { DomainModule } from './domain/domain.module';
import { Session } from './sessions/entities/session.entity';
import { Domain } from './domain/entities/domain.entity';
import { Article } from './articles/entities/article.entity';
import { DashboardModule } from './dashboard/dashboard.module';
import { ArticleVisit } from './dashboard/entities/article-visit.entity';

@Module({
  imports: [
    EventsModule,
    SessionsModule,
    ArticlesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Event, Session, Domain, Article, ArticleVisit],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: true,
    }),
    DomainModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
