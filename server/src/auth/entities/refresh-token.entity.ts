import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Session } from './session.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.refresh_tokens, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Session, (session) => session.refresh_tokens, {
    onDelete: 'CASCADE',
  })
  session: Session;

  @Column()
  token_hash: string;

  @Column({ type: 'timestamptz' })
  expires_at: Date;

  @Column({ default: false })
  revoked: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
