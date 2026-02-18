import { tr } from './tr';
import { en } from './en';

export type Language = 'tr' | 'en';
export type LanguagePack = typeof tr;

const languages: Record<Language, LanguagePack> = { tr, en };

export function getLanguagePack(lang?: Language): LanguagePack {
  return languages[lang || 'tr'] || languages.tr;
}
