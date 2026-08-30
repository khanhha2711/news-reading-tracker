import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from 'src/sessions/entities/session.entity';
import { Article } from 'src/articles/entities/article.entity';
import { EventType } from '../enum/even-type.enum';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  installationId: string;

  @ManyToOne(() => Session, { nullable: false })
  @JoinColumn({ name: 'sessionId' })
  session: Session;

  @Column({ type: 'enum', enum: EventType })
  eventType: EventType;

  @Column()
  tabId: number;

  @ManyToOne(() => Article, { nullable: false })
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;
}
