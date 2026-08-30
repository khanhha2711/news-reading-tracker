import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventsDto } from './dto/create-events.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('')
  createEvent(@Body() events: CreateEventsDto) {
    return this.eventsService.create(events);
  }

  @Get('')
  findAll() {
    return this.eventsService.findAll();
  }
}
