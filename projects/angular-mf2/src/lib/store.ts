import { Injectable } from '@angular/core';
import { Catalogs, i18nConfig } from './types';
import { generate, newGroup } from './mf2';

@Injectable({ providedIn: 'root' })
export class Store {
  private locale: string;
  private defaultLocale: string;
  private catalogs: Catalogs;

  log(value: unknown): unknown {
    console.log('logging: ', value);
    return value;
  }

  constructor() {
    const config = i18nConfig;
    this.defaultLocale = config.defaultLocale;
    this.locale = this.defaultLocale;
    this.catalogs = config.catalogs;
  }

  setLocale(locale: string) {
    this.locale = locale;
  }

  getLocale(): string {
    return this.locale;
  }

  format(key: string, args?: Record<string, unknown>): string {
    const group = newGroup(this.getLocale(), this.catalogs || {});
    const res = generate(this.getLocale(), group as any, args ?? {});
    if (!res?.ok) return '';
    const out = (res.value as Record<string, unknown>)[key];
    return typeof out === 'string' ? out : String(out ?? '');
  }
}
