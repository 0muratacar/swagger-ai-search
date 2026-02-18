import { Controller, Post, Body, Get, Res, Inject } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';
import { SwaggerAiSearchService } from './swagger-ai-search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { SWAGGER_AI_SEARCH_OPTIONS } from './swagger-ai-search.constants';
import { SwaggerAiSearchOptions } from '../core/interfaces';
import { ScriptRenderer } from '../core/script-renderer';

@Controller('swagger-search')
export class SwaggerAiSearchController {
  private readonly renderer: ScriptRenderer;

  constructor(
    private readonly searchService: SwaggerAiSearchService,
    @Inject(SWAGGER_AI_SEARCH_OPTIONS)
    private readonly options: SwaggerAiSearchOptions,
  ) {
    this.renderer = new ScriptRenderer(options);
  }

  @Get('script')
  @ApiExcludeEndpoint()
  serveScript(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(this.renderer.renderScript());
  }

  @Post()
  @ApiExcludeEndpoint()
  async search(@Body() dto: SearchQueryDto) {
    return this.searchService.search(dto.query);
  }
}
