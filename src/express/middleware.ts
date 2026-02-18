import { Router, json } from 'express';
import { SearchEngine } from '../core/search-engine';
import { ScriptRenderer } from '../core/script-renderer';
import { SwaggerAiSearchOptions } from '../core/interfaces';

/**
 * Express middleware factory that adds AI search to Swagger UI.
 *
 * @example
 * ```typescript
 * import { swaggerAiSearchMiddleware } from 'swagger-ai-search/express';
 * import swaggerUi from 'swagger-ui-express';
 *
 * const spec = require('./openapi.json');
 * app.use('/swagger', swaggerUi.serve, swaggerUi.setup(spec, {
 *   customJs: '/swagger-search/script',
 * }));
 * app.use(swaggerAiSearchMiddleware({ document: spec }));
 * ```
 */
export function swaggerAiSearchMiddleware(
  options: SwaggerAiSearchOptions,
): Router {
  const engine = new SearchEngine(options);
  const renderer = new ScriptRenderer(options);
  const prefix = options.routePrefix || 'swagger-search';

  const router = Router();

  router.get(`/${prefix}/script`, (_req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(renderer.renderScript());
  });

  router.post(`/${prefix}`, json(), async (req, res) => {
    try {
      const query = req.body?.query;
      if (
        !query ||
        typeof query !== 'string' ||
        query.length > (options.maxQueryLength || 500)
      ) {
        res.status(400).json({ error: 'Invalid query' });
        return;
      }
      const result = await engine.search(query);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  return router;
}
