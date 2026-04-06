import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { OrganizationMembership } from '../organizations/entities/organization-membership.entity';
import { UserProductStats } from '../events/entities/user-product-stats.entity';
import { RawEvent } from '../events/entities/raw-event.entity';
import { SessionSummary } from '../events/entities/session-summary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationMembership,
      UserProductStats,
      RawEvent,
      SessionSummary,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
