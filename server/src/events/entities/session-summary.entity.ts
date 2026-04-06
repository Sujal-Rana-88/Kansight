import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('session_summaries')
export class SessionSummary {
  @PrimaryColumn({ type: 'text' })
  session_id!: string;

  @Column({ type: 'uuid' })
  organization_id!: string;

  @Column({ type: 'text' })
  user_id!: string;

  @Column({ type: 'bigint', nullable: true })
  session_duration_ms!: string | null;

  @Column({ type: 'int', nullable: true })
  pages_visited!: number | null;

  @Column({ type: 'int', nullable: true })
  interaction_count!: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
