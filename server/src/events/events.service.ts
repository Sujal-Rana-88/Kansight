import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { Project } from '../organizations/entities/project.entity';

export type EventPayload =
  | {
      event: 'product_interaction_summary';
      user_id: string;
      product_id: string;
      session_id: string;
      hover_count: number;
      total_hover_time_ms: number;
      max_hover_time_ms: number;
      hover_sessions: number;
      timestamp?: string;
    }
  | {
      event: 'buy_button_interaction';
      user_id: string;
      product_id: string;
      session_id: string;
      hover_count: number;
      click_count: number;
      delay_before_click_ms: number;
      timestamp?: string;
    }
  | {
      event: 'session_summary';
      user_id: string;
      session_id: string;
      session_duration_ms: number;
      pages_visited: number;
      interaction_count: number;
      timestamp?: string;
    };

@Injectable()
export class EventsService {
  private readonly queue: Queue;

  constructor(
    @InjectRepository(Project)
    private readonly projects: Repository<Project>,
  ) {
    const connection = { url: process.env.REDIS_URL };
    this.queue = new Queue('event-processing', { connection });
  }

  async ingest(apiKey: string, payload: EventPayload | EventPayload[]) {
    if (!apiKey) {
      throw new BadRequestException('Missing API key.');
    }

    const project = await this.projects.findOne({
      where: { api_key: apiKey },
      relations: ['organization'],
    });

    if (!project) {
      throw new BadRequestException('Invalid API key.');
    }

    const events = Array.isArray(payload) ? payload : [payload];

    if (events.length === 0) {
      throw new BadRequestException('No events provided.');
    }

    const jobs = events.map((event) => ({
      name: event.event,
      data: {
        organization_id: project.organization.id,
        project_id: project.id,
        ...event,
      },
    }));

    await this.queue.addBulk(
      jobs.map((job) => ({
        name: job.name,
        data: job.data,
        attempts: 3,
        removeOnComplete: 1000,
        removeOnFail: 1000,
      })),
    );

    return { accepted: events.length };
  }
}
