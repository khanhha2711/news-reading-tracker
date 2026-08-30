import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EventType } from '../enum/even-type.enum';

export class CreateEventDto {
  @IsEnum(EventType)
  eventType: EventType;

  @IsString()
  installationId: string;

  @IsString()
  sessionId: string;

  @IsInt()
  tabId: number;

  @IsUrl()
  url: string;

  @IsString()
  domain: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsISO8601()
  timestamp: string;
}
