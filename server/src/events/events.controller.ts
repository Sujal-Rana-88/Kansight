import { Body, Controller, Headers, Post } from '@nestjs/common';
import { EventsService, type EventPayload } from './events.service';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('events')
  ingest(
    @Headers('x-api-key') apiKey: string,
    @Body() body: EventPayload | EventPayload[],
  ) {
    return this.eventsService.ingest(apiKey, body);
  }
}
