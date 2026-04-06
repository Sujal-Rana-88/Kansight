import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';
import { EmbeddingsService } from './embeddings.service';
import { OrganizationMembership } from '../organizations/entities/organization-membership.entity';
import { UserProductStats } from '../events/entities/user-product-stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationMembership, UserProductStats])],
  controllers: [InsightsController],
  providers: [InsightsService, EmbeddingsService],
  exports: [EmbeddingsService],
})
export class InsightsModule {}
