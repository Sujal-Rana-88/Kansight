import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Worker, type Job } from 'bullmq';
import { Repository } from 'typeorm';
import { RawEvent } from './entities/raw-event.entity';
import { SessionSummary } from './entities/session-summary.entity';
import { UserProductStats } from './entities/user-product-stats.entity';
import { EmbeddingsService } from '../insights/embeddings.service';

type EventJobData = {
  organization_id: string;
  project_id: string;
  event: string;
  user_id: string;
  product_id?: string;
  session_id?: string;
  hover_count?: number;
  total_hover_time_ms?: number;
  max_hover_time_ms?: number;
  hover_sessions?: number;
  click_count?: number;
  delay_before_click_ms?: number;
  session_duration_ms?: number;
  pages_visited?: number;
  interaction_count?: number;
  timestamp?: string;
};

@Injectable()
export class EventsWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventsWorker.name);
  private worker?: Worker;

  constructor(
    @InjectRepository(UserProductStats)
    private readonly stats: Repository<UserProductStats>,
    @InjectRepository(SessionSummary)
    private readonly sessions: Repository<SessionSummary>,
    @InjectRepository(RawEvent)
    private readonly rawEvents: Repository<RawEvent>,
    private readonly embeddingsService: EmbeddingsService,
  ) {}

  onModuleInit() {
    const connection = { url: process.env.REDIS_URL };
    this.worker = new Worker(
      'event-processing',
      async (job: Job<EventJobData>) => this.handleJob(job),
      { connection, concurrency: 10 },
    );

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Job failed ${job?.id}: ${err.message}`);
    });
  }

  async onModuleDestroy() {
    await this.worker?.close();
  }

  private async handleJob(job: Job<EventJobData>) {
    const data = job.data;

    await this.rawEvents.save(
      this.rawEvents.create({
        organization_id: data.organization_id,
        event_name: data.event,
        user_id: data.user_id ?? null,
        session_id: data.session_id ?? null,
        product_id: data.product_id ?? null,
        payload: data as unknown as Record<string, unknown>,
      }),
    );

    if (data.event === 'session_summary') {
      await this.upsertSessionSummary(data);
      await this.updateStatsForSession(data);
      return;
    }

    if (data.event === 'product_interaction_summary') {
      await this.updateStatsForProductInteraction(data);
      return;
    }

    if (data.event === 'buy_button_interaction') {
      await this.updateStatsForBuyButton(data);
      return;
    }
  }

  private async upsertSessionSummary(data: EventJobData) {
    if (!data.session_id || !data.user_id) {
      return;
    }
    const existing = await this.sessions.findOne({
      where: { session_id: data.session_id },
    });

    const summary = this.sessions.create({
      session_id: data.session_id,
      organization_id: data.organization_id,
      user_id: data.user_id,
      session_duration_ms: data.session_duration_ms?.toString() ?? null,
      pages_visited: data.pages_visited ?? null,
      interaction_count: data.interaction_count ?? null,
    });

    if (existing) {
      await this.sessions.update(data.session_id, summary);
    } else {
      await this.sessions.save(summary);
    }
  }

  private async updateStatsForSession(data: EventJobData) {
    if (!data.user_id) {
      return;
    }

    const statsRow = await this.getOrCreateStats(
      data.organization_id,
      data.user_id,
      data.product_id ?? 'session',
    );

    statsRow.sessions += 1;
    statsRow.last_session_at = data.timestamp
      ? new Date(data.timestamp)
      : new Date();

    await this.stats.save(statsRow);
    await this.embeddingsService.updateEmbedding(statsRow);
  }

  private async updateStatsForProductInteraction(data: EventJobData) {
    if (!data.user_id || !data.product_id) {
      return;
    }

    const statsRow = await this.getOrCreateStats(
      data.organization_id,
      data.user_id,
      data.product_id,
    );

    statsRow.hover_count += data.hover_count ?? 0;
    statsRow.total_hover_time_ms = (
      BigInt(statsRow.total_hover_time_ms) + BigInt(data.total_hover_time_ms ?? 0)
    ).toString();
    statsRow.max_hover_time_ms = (
      BigInt(statsRow.max_hover_time_ms) >
      BigInt(data.max_hover_time_ms ?? 0)
        ? statsRow.max_hover_time_ms
        : String(data.max_hover_time_ms ?? 0)
    );
    statsRow.hover_sessions += data.hover_sessions ?? 0;

    this.recomputeScores(statsRow);
    await this.stats.save(statsRow);
    await this.embeddingsService.updateEmbedding(statsRow);
  }

  private async updateStatsForBuyButton(data: EventJobData) {
    if (!data.user_id || !data.product_id) {
      return;
    }

    const statsRow = await this.getOrCreateStats(
      data.organization_id,
      data.user_id,
      data.product_id,
    );

    const hoverCount = data.hover_count ?? 0;
    const clickCount = data.click_count ?? 0;
    const delay = data.delay_before_click_ms ?? 0;

    statsRow.buy_button_hover_count += hoverCount;
    const previousClicks = statsRow.buy_button_click_count;
    statsRow.buy_button_click_count += clickCount;
    statsRow.click_count += clickCount;

    if (clickCount > 0) {
      const totalDelay =
        statsRow.avg_delay_before_click_ms * previousClicks + delay;
      statsRow.avg_delay_before_click_ms = Math.round(
        totalDelay / statsRow.buy_button_click_count,
      );
    }

    this.recomputeScores(statsRow);
    await this.stats.save(statsRow);
    await this.embeddingsService.updateEmbedding(statsRow);
  }

  private async getOrCreateStats(
    organizationId: string,
    userId: string,
    productId: string,
  ) {
    let statsRow = await this.stats.findOne({
      where: {
        organization_id: organizationId,
        user_id: userId,
        product_id: productId,
      },
    });

    if (!statsRow) {
      statsRow = this.stats.create({
        organization_id: organizationId,
        user_id: userId,
        product_id: productId,
        hover_count: 0,
        total_hover_time_ms: '0',
        max_hover_time_ms: '0',
        hover_sessions: 0,
        buy_button_hover_count: 0,
        buy_button_click_count: 0,
        click_count: 0,
        avg_delay_before_click_ms: 0,
        sessions: 0,
        hesitation_score: 0,
        intent_score: 0,
      });
      await this.stats.save(statsRow);
    }
    return statsRow;
  }

  private recomputeScores(statsRow: UserProductStats) {
    const hoverCount = statsRow.hover_count;
    const buyHover = statsRow.buy_button_hover_count;
    const buyClicks = statsRow.buy_button_click_count;
    const totalHover = Number(statsRow.total_hover_time_ms);

    statsRow.hesitation_score =
      hoverCount * 0.4 + buyHover * 0.3 - buyClicks * 0.5;
    statsRow.intent_score =
      buyClicks * 0.6 + (totalHover / 10000) * 0.4;
  }
}
