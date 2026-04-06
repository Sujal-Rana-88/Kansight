import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './auth/entities/user.entity';
import { Session } from './auth/entities/session.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { OAuthAccount } from './auth/entities/oauth-account.entity';
import { Organization } from './organizations/entities/organization.entity';
import { OrganizationMembership } from './organizations/entities/organization-membership.entity';
import { Project } from './organizations/entities/project.entity';
import { RawEvent } from './events/entities/raw-event.entity';
import { SessionSummary } from './events/entities/session-summary.entity';
import { UserProductStats } from './events/entities/user-product-stats.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    User,
    Session,
    RefreshToken,
    OAuthAccount,
    Organization,
    OrganizationMembership,
    Project,
    RawEvent,
    SessionSummary,
    UserProductStats,
  ],
  migrations: ['src/migrations/*.ts'],
});

