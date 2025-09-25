// i18n.store.ts
import { Injectable } from '@angular/core';
import { I18nConfig } from './types';
import { newGroup, generate } from './mf2';

/**
 * I18nStore
 * - Holds the current locale
 * - Builds one MF2 group from in-memory typed catalogs
 * - Formats a single key, returning the engine-sanitized string
 */
@Injectable({ providedIn: 'root' })
export class I18nStore {
  /** Current language */
  activeLocale: string;

  /** Compiled MF2 group */
  private group: unknown;

  constructor(private readonly config: I18nConfig) {
    this.activeLocale = config.defaultLocale;
    // catalogs is a map like { en, no } where each is a `Translation`
    this.group = newGroup(this.activeLocale, this.config.catalogs as any);
  }

  /** Switch the language if we have it */
  setLocale(locale: string): void {
    if (this.config.catalogs[locale]) {
      this.activeLocale = locale;
    } else {
      console.warn(`[i18n] Unsupported locale "${locale}" — staying on ${this.activeLocale}`);
    }
  }

  /**
   * Resolve a single key through MF2.
   * Engine returns sanitized HTML/plain string for each key; we pick the one requested.
   */
  format(key: string, args?: Record<string, unknown>): string | undefined {
    const res = generate(this.activeLocale, this.group as any, args ?? {});
    if (!res?.ok) return undefined;
    const out = (res.value as Record<string, unknown>)[key];
    return typeof out === 'string' ? out : String(out ?? '');
  }
}
