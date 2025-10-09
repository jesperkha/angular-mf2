import { Catalogs, i18nConfig, I18nConfig } from './types';
import { generate, newGroup } from './mf2';
import { Inject, Injectable } from '@angular/core';

export class I18nStore {
  private locale: string;
  private defaultLocale: string;
  private catalogs: Catalogs;
  constructor() {
    const config = i18nConfig; // TODO: inject

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
