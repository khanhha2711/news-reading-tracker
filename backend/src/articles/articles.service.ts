import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DomainService } from 'src/domain/domain.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    private readonly domainsService: DomainService,
  ) {}

  async findAll(page = 1, limit = 10) {
    const [articles, total] = await this.articleRepository.findAndCount({
      relations: {
        domain: true,
      },

      order: {
        id: 'DESC',
      },

      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: articles,

      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOrCreate(data: {
    url: string;
    domain: string;
    title: string;
    content: string;
    summary: string;
  }): Promise<Article> {
    const existArticle = await this.articleRepository.findOne({
      where: {
        url: data.url,
      },
    });

    if (existArticle) {
      return existArticle;
    }

    const domain = await this.domainsService.findOrCreate(data.domain);

    const article = this.articleRepository.create({
      url: data.url,
      title: data.title,
      content: data.content,
      summary: data.summary,
      domain,
    });

    return this.articleRepository.save(article);
  }
}
