import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('oauth_accounts')
@Unique(['provider', 'provider_id'])
@Unique(['user', 'provider'])
export class OAuthAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.oauth_accounts, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  provider!: string;

  @Column()
  provider_id!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
