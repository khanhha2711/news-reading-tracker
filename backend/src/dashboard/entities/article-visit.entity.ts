import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Article } from 'src/articles/entities/article.entity';
import { Session } from 'src/sessions/entities/session.entity';

@Entity('article_visits')
export class ArticleVisit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  articleId: string;

  @ManyToOne(() => Article, { nullable: false })
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @Column()
  sessionId: string;

  @ManyToOne(() => Session, { nullable: false })
  @JoinColumn({ name: 'sessionId' })
  session: Session;

  @Column()
  tabId: number;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  activeStartedAt: Date | null;

  @Column({ type: 'integer', default: 0 })
  readingTime: number;

  @CreateDateColumn()
  createdAt: Date;
}
