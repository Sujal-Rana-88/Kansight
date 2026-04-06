import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { Session } from './auth/entities/session.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { OAuthAccount } from './auth/entities/oauth-account.entity';
import { Organization } from './organizations/entities/organization.entity';
import { OrganizationMembership } from './organizations/entities/organization-membership.entity';
import { Project } from './organizations/entities/project.entity';
import { OrganizationsModule } from './organizations/organizations.module';
import { EventsModule } from './events/events.module';
import { RawEvent } from './events/entities/raw-event.entity';
import { SessionSummary } from './events/entities/session-summary.entity';
import { UserProductStats } from './events/entities/user-product-stats.entity';
import { InsightsModule } from './insights/insights.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
      synchronize: true,
    }),
    AuthModule,
    OrganizationsModule,
    EventsModule,
    InsightsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
