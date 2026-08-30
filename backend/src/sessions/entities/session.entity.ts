import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;
}
