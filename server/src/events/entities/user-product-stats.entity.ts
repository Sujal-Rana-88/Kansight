import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

const vectorTransformer = {
  to: (value: number[] | null) =>
    value ? `[${value.join(',')}]` : null,
  from: (value: string | null) => {
    if (!value) {
      return null;
    }
    return value
      .replace(/[\[\]\s]/g, '')
      .split(',')
      .filter((v) => v.length)
      .map(Number);
  },
};

@Entity('user_product_stats')
export class UserProductStats {
  @PrimaryColumn({ type: 'uuid' })
  organization_id!: string;

  @PrimaryColumn({ type: 'text' })
  user_id!: string;

  @PrimaryColumn({ type: 'text' })
  product_id!: string;

  @Column({ type: 'int', default: 0 })
  hover_count!: number;

  @Column({ type: 'bigint', default: 0 })
  total_hover_time_ms!: string;

  @Column({ type: 'bigint', default: 0 })
  max_hover_time_ms!: string;

  @Column({ type: 'int', default: 0 })
  hover_sessions!: number;

  @Column({ type: 'int', default: 0 })
  buy_button_hover_count!: number;

  @Column({ type: 'int', default: 0 })
  buy_button_click_count!: number;

  @Column({ type: 'int', default: 0 })
  click_count!: number;

  @Column({ type: 'int', default: 0 })
  avg_delay_before_click_ms!: number;

  @Column({ type: 'int', default: 0 })
  sessions!: number;

  @Column({ type: 'timestamptz', nullable: true })
  last_session_at!: Date | null;

  @Column({ type: 'float8', default: 0 })
  hesitation_score!: number;

  @Column({ type: 'float8', default: 0 })
  intent_score!: number;

  @Column({ type: 'vector' as any, nullable: true, transformer: vectorTransformer })
  embedding!: number[] | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;
}
