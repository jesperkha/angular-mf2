import { InjectionToken } from '@angular/core';
import { Store } from './store';
import type { MarkupRenderer } from './mf2';
import type { IOptions as SanitizeOptions } from 'sanitize-html';

export type Catalogs = Record<string, Record<string, string>>;

export type MF2Config = {
  defaultLocale: string;
  catalogs: Catalogs;
};

export const MF2_CONFIG = new InjectionToken<MF2Config>('MF2_CONFIG', {
  providedIn: 'root',
  factory: () => ({ defaultLocale: 'en', catalogs: {} }),
});

/** Optional: allow apps to extend/override markup renderer */
export const MF2_MARKUP_RENDERER = new InjectionToken<MarkupRenderer>('MF2_MARKUP_RENDERER', {
  providedIn: 'root',
  factory: () => ({}),
});

/** Optional: allow apps to adjust sanitize-html policy */
export const MF2_SANITIZE_OPTIONS = new InjectionToken<SanitizeOptions>('MF2_SANITIZE_OPTIONS', {
  providedIn: 'root',
  factory: () => ({}),
});

export function useMF2Config(config: MF2Config) {
  return [
    { provide: MF2_CONFIG, useValue: config },
    Store,
  ];
}
