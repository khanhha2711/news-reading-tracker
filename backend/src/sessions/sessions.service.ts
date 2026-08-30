import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const sessionExist = await this.sessionRepository.findOne({
      where: { id: createSessionDto.sessionId },
    });

    if (sessionExist) {
      return sessionExist;
    }

    const session = this.sessionRepository.create({
      id: createSessionDto.sessionId,
      timestamp: new Date(createSessionDto.timestamp),
    });

    return this.sessionRepository.save(session);
  }

  findAll() {
    return `This action returns all sessions`;
  }

  async findByIds(ids: string[]): Promise<Session[]> {
    return this.sessionRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOneBy({ id });

    if (!session) {
      throw new NotFoundException(`Session ${id} not found`);
    }

    return session;
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
