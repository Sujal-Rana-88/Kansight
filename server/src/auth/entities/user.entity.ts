import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { RefreshToken } from './refresh-token.entity';
import { OAuthAccount } from './oauth-account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'text', nullable: true })
  password!: string | null;

  @Column({ default: false })
  is_email_verified!: boolean;

  @Column({ default: 0 })
  failed_login_attempts!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  refresh_tokens!: RefreshToken[];

  @OneToMany(() => OAuthAccount, (oauth) => oauth.user)
  oauth_accounts!: OAuthAccount[];
}
