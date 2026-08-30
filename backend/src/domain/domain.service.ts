import { Injectable } from '@nestjs/common';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Domain } from './entities/domain.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DomainService {
  private readonly domains = ['vnexpress.net', 'dantri.com.vn', 'tuoitre.vn'];

  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
  ) {}

  create(createDomainDto: CreateDomainDto) {
    return 'This action adds a new domain';
  }

  findAll() {
    return this.domainRepository.find({
      select: {
        name: true,
      },
    });
  }

  async findOrCreate(name: string): Promise<Domain> {
    let domain = await this.domainRepository.findOne({ where: { name } });

    if (!domain) {
      domain = this.domainRepository.create({ name });
      domain = await this.domainRepository.save(domain);
    }
    return domain;
  }

  update(id: number, updateDomainDto: UpdateDomainDto) {
    return `This action updates a #${id} domain`;
  }

  remove(id: number) {
    return `This action removes a #${id} domain`;
  }
}
