import { Injectable, Inject } from '@nestjs/common';
import { SearchEngine } from '../core/search-engine';
import { SwaggerAiSearchOptions, SearchResponse } from '../core/interfaces';
import { SWAGGER_AI_SEARCH_OPTIONS } from './swagger-ai-search.constants';

@Injectable()
export class SwaggerAiSearchService {
  private readonly engine: SearchEngine;

  constructor(
    @Inject(SWAGGER_AI_SEARCH_OPTIONS)
    private readonly options: SwaggerAiSearchOptions,
  ) {
    this.engine = new SearchEngine(options);
  }

  setDocument(doc: any): void {
    this.engine.setDocument(doc);
  }

  async search(query: string): Promise<SearchResponse> {
    return this.engine.search(query);
  }
}
