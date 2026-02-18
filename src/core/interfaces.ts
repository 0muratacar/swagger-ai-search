export interface SwaggerAiSearchOptions {
  /** Anthropic API key. Defaults to process.env.ANTHROPIC_API_KEY */
  apiKey?: string;

  /** Claude model to use. Default: 'claude-sonnet-4-5-20250929' */
  model?: string;

  /** Language for AI responses and UI. Default: 'tr' */
  language?: 'tr' | 'en';

  /** Cache TTL in seconds. Default: 1800. Set to 0 to disable caching. */
  cacheTtl?: number;

  /** Redis connection for distributed caching. If omitted, uses in-memory cache. */
  redis?: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };

  /** Custom system prompt. Use {{ENDPOINT_LIST}} and {{MAX_RESULTS}} placeholders. */
  systemPrompt?: string;

  /** Max results to return. Default: 5 */
  maxResults?: number;

  /** Max query length. Default: 500 */
  maxQueryLength?: number;

  /** Route prefix for endpoints. Default: 'swagger-search' */
  routePrefix?: string;

  /** OpenAPI document. Required for Express, optional for NestJS (use setupSwaggerAiSearch). */
  document?: any;
}

export interface EndpointInfo {
  method: string;
  path: string;
  tag: string;
  summary: string;
  description: string;
  operationId: string;
}

export interface SearchResult extends EndpointInfo {
  reason: string;
}

export interface SearchResponse {
  results: SearchResult[];
  answer: string;
}
