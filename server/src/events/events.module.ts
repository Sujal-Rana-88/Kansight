import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsWorker } from './events.worker';
import { RawEvent } from './entities/raw-event.entity';
import { SessionSummary } from './entities/session-summary.entity';
import { UserProductStats } from './entities/user-product-stats.entity';
import { Project } from '../organizations/entities/project.entity';
import { InsightsModule } from '../insights/insights.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RawEvent, SessionSummary, UserProductStats, Project]),
    InsightsModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsWorker],
})
export class EventsModule {}
