import Anthropic from '@anthropic-ai/sdk';
import {
  SwaggerAiSearchOptions,
  EndpointInfo,
  SearchResult,
  SearchResponse,
} from './interfaces';
import { CacheAdapter } from './cache/cache.interface';
import { MemoryCacheAdapter } from './cache/memory-cache.adapter';
import { RedisCacheAdapter } from './cache/redis-cache.adapter';
import { getLanguagePack } from './i18n';

export class SearchEngine {
  private readonly anthropic: Anthropic;
  private readonly cache: CacheAdapter;
  private readonly model: string;
  private readonly cacheTtl: number;
  private readonly maxResults: number;
  private readonly systemPromptTemplate: string;
  private readonly fallbackAnswer: string;
  private endpoints: EndpointInfo[] = [];

  constructor(private readonly options: SwaggerAiSearchOptions) {
    this.anthropic = new Anthropic({
      apiKey: options.apiKey || process.env.ANTHROPIC_API_KEY,
    });

    this.model = options.model || 'claude-sonnet-4-5-20250929';
    this.cacheTtl = options.cacheTtl ?? 1800;
    this.maxResults = options.maxResults || 5;

    // Cache adapter
    if (options.redis) {
      this.cache = new RedisCacheAdapter(options.redis);
    } else {
      this.cache = new MemoryCacheAdapter();
    }

    // System prompt
    const lang = getLanguagePack(options.language);
    this.systemPromptTemplate = options.systemPrompt || lang.systemPrompt;
    this.fallbackAnswer = lang.ui.fallbackAnswer;

    // Load document if provided
    if (options.document) {
      this.setDocument(options.document);
    }
  }

  setDocument(doc: any): void {
    this.endpoints = [];
    const paths = doc.paths || {};

    for (const [path, methods] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(methods as any)) {
        if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          const op = operation as any;
          this.endpoints.push({
            method: method.toUpperCase(),
            path,
            tag: op.tags?.[0] || 'Untagged',
            summary: op.summary || '',
            description: op.description || '',
            operationId: op.operationId || '',
          });
        }
      }
    }
  }

  getEndpoints(): EndpointInfo[] {
    return this.endpoints;
  }

  async search(query: string): Promise<SearchResponse> {
    // Check cache
    if (this.cacheTtl > 0) {
      const cacheKey = `swagger-search:${query.toLowerCase().trim()}`;
      const cached = await this.cache.get<SearchResponse>(cacheKey);
      if (cached) return cached;
    }

    const endpointList = this.endpoints
      .map(
        (e, i) =>
          `${i + 1}. [${e.method}] ${e.path} | Tag: ${e.tag} | Summary: ${e.summary} | Description: ${e.description}`,
      )
      .join('\n');

    const systemPrompt = this.systemPromptTemplate
      .replace('{{ENDPOINT_LIST}}', endpointList)
      .replace(/\{\{MAX_RESULTS\}\}/g, String(this.maxResults));

    const message = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: query }],
    });

    try {
      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type');
      }

      let jsonText = content.text.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText
          .replace(/^```(?:json)?\n?/, '')
          .replace(/\n?```$/, '');
      }

      const result: SearchResponse = JSON.parse(jsonText);

      // Cache the result
      if (this.cacheTtl > 0) {
        const cacheKey = `swagger-search:${query.toLowerCase().trim()}`;
        await this.cache.set(cacheKey, result, this.cacheTtl);
      }

      return result;
    } catch {
      return {
        results: [],
        answer: this.fallbackAnswer,
      };
    }
  }
}
