import { IsString, IsUrl } from 'class-validator';
import { Domain } from 'src/domain/entities/domain.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Domain, { nullable: false })
  @JoinColumn({ name: 'domainId' })
  domain: Domain;

  @Column({ unique: true })
  url: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'text', nullable: true })
  content: string;
}
