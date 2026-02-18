import { DynamicModule, Module } from '@nestjs/common';
import { SwaggerAiSearchOptions } from '../core/interfaces';
import { SWAGGER_AI_SEARCH_OPTIONS } from './swagger-ai-search.constants';
import { SwaggerAiSearchController } from './swagger-ai-search.controller';
import { SwaggerAiSearchService } from './swagger-ai-search.service';

export interface SwaggerAiSearchAsyncOptions {
  imports?: any[];
  useFactory: (...args: any[]) => Promise<SwaggerAiSearchOptions> | SwaggerAiSearchOptions;
  inject?: any[];
}

@Module({})
export class SwaggerAiSearchModule {
  static forRoot(options: SwaggerAiSearchOptions = {}): DynamicModule {
    const prefix = options.routePrefix || 'swagger-search';
    Reflect.defineMetadata('path', prefix, SwaggerAiSearchController);

    return {
      module: SwaggerAiSearchModule,
      controllers: [SwaggerAiSearchController],
      providers: [
        { provide: SWAGGER_AI_SEARCH_OPTIONS, useValue: options },
        SwaggerAiSearchService,
      ],
      exports: [SwaggerAiSearchService],
    };
  }

  static forRootAsync(asyncOptions: SwaggerAiSearchAsyncOptions): DynamicModule {
    return {
      module: SwaggerAiSearchModule,
      imports: asyncOptions.imports || [],
      controllers: [SwaggerAiSearchController],
      providers: [
        {
          provide: SWAGGER_AI_SEARCH_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject || [],
        },
        SwaggerAiSearchService,
      ],
      exports: [SwaggerAiSearchService],
    };
  }
}
