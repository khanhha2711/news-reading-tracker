import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { PeriodQuery } from './enum/period-query.enum';
import { QueryParamsDto } from './dto/query-params.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('articles')
  getArticles(@Query() query: QueryParamsDto) {
    return this.dashboardService.getArticles(query.page, query.limit);
  }

  @Get('article-reads')
  getArticleReads(@Query('period') period: PeriodQuery) {
    return this.dashboardService.getArticleReads(period);
  }

  @Get('reading-times')
  getReadingTimes(@Query('period') period: PeriodQuery) {
    return this.dashboardService.getReadingTimes(period);
  }

  @Get('websites')
  getTopWebsites() {
    return this.dashboardService.getTopWebsites();
  }

  @Get('recent-articles')
  getRecentArticles(@Query('limit') limit?: string) {
    return this.dashboardService.getRecentArticles(limit ? Number(limit) : 10);
  }
}
