import { readFileSync } from 'fs';
import { join } from 'path';
import { SwaggerAiSearchOptions } from './interfaces';
import { getLanguagePack } from './i18n';

export class ScriptRenderer {
  private cachedScript: string | null = null;
  private readonly options: SwaggerAiSearchOptions;

  constructor(options: SwaggerAiSearchOptions) {
    this.options = options;
  }

  renderScript(): string {
    if (this.cachedScript) return this.cachedScript;

    const templatePath = join(__dirname, '..', 'assets', 'swagger-search.js');
    let script = readFileSync(templatePath, 'utf-8');

    const lang = getLanguagePack(this.options.language);
    const prefix = this.options.routePrefix || 'swagger-search';

    script = script
      .replace(/__SEARCH_ENDPOINT__/g, `/${prefix}`)
      .replace(/__TITLE__/g, lang.ui.title)
      .replace(/__PLACEHOLDER__/g, lang.ui.placeholder)
      .replace(/__BUTTON__/g, lang.ui.button)
      .replace(/__SEARCHING__/g, lang.ui.searching)
      .replace(/__THINKING__/g, lang.ui.thinking)
      .replace(/__NO_RESULTS__/g, lang.ui.noResults)
      .replace(/__ERROR__/g, lang.ui.error);

    this.cachedScript = script;
    return script;
  }
}
