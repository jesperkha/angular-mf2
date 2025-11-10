import { Inject, Injectable, Optional } from '@angular/core';
import { generate, newGroup, type GenerateOptions } from './mf2';
import { Catalogs, MF2_CONFIG, MF2Config, MF2_SANITIZE_OPTIONS } from './config.token';
import type { MarkupRenderer } from './mf2';
import type { IOptions as SanitizeOptions } from 'sanitize-html';

@Injectable()
export class Store {
  private locale: string;
  private defaultLocale: string;
  private catalogs: Catalogs;

  // Tiny memo to avoid recomputing identical calls
  // key = `${locale}|${k}|${JSON.stringify(args)}`
  private memo = new Map<string, string>();
  private memoLimit = 200;

  constructor(
    @Inject(MF2_CONFIG) config: MF2Config,
    @Optional() @Inject(MF2_SANITIZE_OPTIONS) private sanitize?: SanitizeOptions,
  ) {
    this.defaultLocale = config.defaultLocale;
    this.locale = this.defaultLocale;
    this.catalogs = config.catalogs;
  }

  log(value: unknown): unknown {
    // keep your log hook
    console.log('logging: ', value);
    return value;
  }

  setLocale(locale: string) {
    this.locale = locale;
    this.memo.clear(); // locale switch invalidates memo
  }

  getLocale(): string {
    return this.locale;
  }

  format(key: string, args?: Record<string, unknown>): string {
    const k = key ?? '';
    const a = args ?? {};
    const memoKey = `${this.getLocale()}|${k}|${JSON.stringify(a)}`;
    const hit = this.memo.get(memoKey);
    if (hit != null) return hit;

    const group = newGroup(this.getLocale(), this.catalogs || {});
    const options: GenerateOptions = {
      sanitize: this.sanitize,
    };
    const res = generate(this.getLocale(), group as any, a as any, options);
    if (!res?.ok) return '';

    const out = (res.value as Record<string, unknown>)[k];
    const val = typeof out === 'string' ? out : String(out ?? '');

    // record in memo
    if (this.memo.size >= this.memoLimit) {
      // Safe eviction: handle empty-iterator typing under strict mode
      const it = this.memo.keys().next();
      if (!it.done) {
        this.memo.delete(it.value);
      }
    }
    this.memo.set(memoKey, val);

    return val;
  }
}
