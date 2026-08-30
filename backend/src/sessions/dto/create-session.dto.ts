import { IsDateString, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  sessionId: string;

  @IsDateString()
  timestamp: string;
}
