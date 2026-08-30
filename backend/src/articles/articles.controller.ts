import { Controller, Get, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';

import { ArticlesQueryDto } from './entities/articles-query.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}
  @Get() findAll(@Query() query: ArticlesQueryDto) {
    return this.articlesService.findAll(query.page, query.limit);
  }
}
