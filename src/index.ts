// NestJS public API
export { SwaggerAiSearchModule } from './nestjs/swagger-ai-search.module';
export type { SwaggerAiSearchAsyncOptions } from './nestjs/swagger-ai-search.module';
export { SwaggerAiSearchService } from './nestjs/swagger-ai-search.service';
export {
  setupSwaggerAiSearch,
  getHelmetCspDirectives,
} from './nestjs/swagger-ai-search.setup';
export type { SwaggerAiSearchSetupOptions } from './nestjs/swagger-ai-search.setup';

// Core types (shared)
export type {
  SwaggerAiSearchOptions,
  EndpointInfo,
  SearchResult,
  SearchResponse,
} from './core/interfaces';
export { SearchEngine } from './core/search-engine';
export { ScriptRenderer } from './core/script-renderer';
export type { CacheAdapter } from './core/cache/cache.interface';
export { MemoryCacheAdapter } from './core/cache/memory-cache.adapter';
export { RedisCacheAdapter } from './core/cache/redis-cache.adapter';
