import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { Domain } from 'src/domain/entities/domain.entity';
import { readFromFile } from 'src/utils/file';
import { Repository } from 'typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const domainsRepository = app.get<Repository<Domain>>(
    getRepositoryToken(Domain),
  );

  const domains = readFromFile<Domain[]>('domains.json');
  await domainsRepository.save(domains);
  await app.close();
}

seed().catch((error) => {
  console.error('Seeding failed: ', error);
  process.exit(1);
});
