// Express public API
export { swaggerAiSearchMiddleware } from './express/middleware';

// Core types
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
