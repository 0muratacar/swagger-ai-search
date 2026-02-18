# swagger-ai-search

AI-powered endpoint search for Swagger UI. Ask questions in natural language, get relevant API endpoints.

Works with **NestJS** and **Express**.

## Screenshots

### English
![English Usage](https://raw.githubusercontent.com/0muratacar/swagger-ai-search/main/screenshots/english-use-case.png)

### Turkish
![Turkish Usage](https://raw.githubusercontent.com/0muratacar/swagger-ai-search/main/screenshots/turkish-use-case.png)

## Installation

```bash
npm install swagger-ai-search
```

Set your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

## NestJS Usage

### 1. Import the module

```typescript
// app.module.ts
import { SwaggerAiSearchModule } from 'swagger-ai-search';

@Module({
  imports: [
    SwaggerAiSearchModule.forRoot({
      // apiKey defaults to process.env.ANTHROPIC_API_KEY
      language: 'en', // 'tr' (default) or 'en'
    }),
  ],
})
export class AppModule {}
```

### 2. Setup in main.ts

```typescript
// main.ts
import { setupSwaggerAiSearch, getHelmetCspDirectives } from 'swagger-ai-search';
import helmet from 'helmet';

// If using Helmet, relax CSP for Swagger UI
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        ...getHelmetCspDirectives(),
      },
    },
  }),
);

// Use setupSwaggerAiSearch instead of SwaggerModule.setup()
const document = SwaggerModule.createDocument(app, config);
setupSwaggerAiSearch(app, document);
```

### Async configuration

```typescript
SwaggerAiSearchModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    apiKey: config.get('ANTHROPIC_API_KEY'),
    language: config.get('SWAGGER_SEARCH_LANG', 'tr'),
    redis: {
      host: config.get('REDIS_HOST', 'localhost'),
      port: config.get('REDIS_PORT', 6379),
    },
  }),
});
```

## Express Usage

```typescript
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerAiSearchMiddleware } from 'swagger-ai-search/express';

const app = express();
const spec = require('./openapi.json');

// Setup Swagger UI with customJs pointing to the search script
app.use(
  '/swagger',
  swaggerUi.serve,
  swaggerUi.setup(spec, {
    customJs: '/swagger-search/script',
  }),
);

// Add AI search middleware
app.use(swaggerAiSearchMiddleware({ document: spec, language: 'en' }));

app.listen(3000);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | `process.env.ANTHROPIC_API_KEY` | Anthropic API key |
| `model` | `string` | `'claude-sonnet-4-5-20250929'` | Claude model to use |
| `language` | `'tr' \| 'en'` | `'tr'` | Language for UI and AI responses |
| `cacheTtl` | `number` | `1800` | Cache TTL in seconds. `0` to disable |
| `redis` | `object` | — | Redis config `{ host, port, password?, db? }`. Uses in-memory cache if omitted |
| `systemPrompt` | `string` | — | Custom system prompt. Use `{{ENDPOINT_LIST}}` and `{{MAX_RESULTS}}` placeholders |
| `maxResults` | `number` | `5` | Max endpoints to return per search |
| `maxQueryLength` | `number` | `500` | Max query string length |
| `routePrefix` | `string` | `'swagger-search'` | Route prefix for search endpoints |
| `document` | `object` | — | OpenAPI document (required for Express, optional for NestJS) |

## Caching

By default, search results are cached in-memory for 30 minutes.

For distributed caching with Redis:

```typescript
SwaggerAiSearchModule.forRoot({
  redis: { host: 'localhost', port: 6379 },
});
```

Redis requires `ioredis` as an optional dependency:

```bash
npm install ioredis
```

## Custom Cache Adapter

Implement the `CacheAdapter` interface for custom cache backends:

```typescript
import { CacheAdapter } from 'swagger-ai-search';

class MyCacheAdapter implements CacheAdapter {
  async get<T>(key: string): Promise<T | null> { /* ... */ }
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> { /* ... */ }
}
```

## License

MIT
