import { SwaggerAiSearchService } from './swagger-ai-search.service';
import { SWAGGER_AI_SEARCH_OPTIONS } from './swagger-ai-search.constants';
import { SwaggerAiSearchOptions } from '../core/interfaces';

export interface SwaggerAiSearchSetupOptions {
  /** Swagger UI mount path. Default: '/swagger' */
  swaggerPath?: string;
  /** Additional SwaggerModule.setup options */
  swaggerOptions?: Record<string, any>;
}

/**
 * Sets up Swagger UI with AI Search integrated.
 * Call this in main.ts instead of SwaggerModule.setup().
 *
 * @example
 * ```typescript
 * const document = SwaggerModule.createDocument(app, config);
 * setupSwaggerAiSearch(app, document);
 * ```
 */
export function setupSwaggerAiSearch(
  app: any,
  document: any,
  options?: SwaggerAiSearchSetupOptions,
): void {
  const swaggerPath = options?.swaggerPath || '/swagger';

  // Pass document to the service
  try {
    const service = app.get(SwaggerAiSearchService);
    service.setDocument(document);
  } catch {
    console.warn(
      '[swagger-ai-search] SwaggerAiSearchModule not found. Did you import it?',
    );
  }

  // Get route prefix from options
  let prefix = 'swagger-search';
  try {
    const opts = app.get(SWAGGER_AI_SEARCH_OPTIONS) as SwaggerAiSearchOptions;
    if (opts?.routePrefix) prefix = opts.routePrefix;
  } catch {
    // Use default prefix
  }

  // Dynamically import SwaggerModule to avoid hard dependency at module level
  try {
    const { SwaggerModule } = require('@nestjs/swagger');
    SwaggerModule.setup(swaggerPath, app, document, {
      ...options?.swaggerOptions,
      customJs: `/${prefix}/script`,
    });
  } catch {
    console.warn(
      '[swagger-ai-search] @nestjs/swagger not found. Install it: npm install @nestjs/swagger',
    );
  }
}

/**
 * Returns Helmet CSP directives that allow the AI search script to work.
 *
 * @example
 * ```typescript
 * import helmet from 'helmet';
 * app.use(helmet({
 *   contentSecurityPolicy: {
 *     directives: {
 *       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
 *       ...getHelmetCspDirectives(),
 *     },
 *   },
 * }));
 * ```
 */
export function getHelmetCspDirectives(): Record<string, string[]> {
  return {
    'script-src': ["'self'", "'unsafe-inline'"],
  };
}
