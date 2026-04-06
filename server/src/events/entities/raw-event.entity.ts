import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('raw_events')
export class RawEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  organization_id!: string;

  @Column({ type: 'text' })
  event_name!: string;

  @Column({ type: 'text', nullable: true })
  user_id!: string | null;

  @Column({ type: 'text', nullable: true })
  session_id!: string | null;

  @Column({ type: 'text', nullable: true })
  product_id!: string | null;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
