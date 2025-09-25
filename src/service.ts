import { Injectable } from '@angular/core';
import { I18nStore } from './store';

//not really doing anything now, but should take some weigth from store later
@Injectable({ providedIn: 'root' })
export class I18nService {
  constructor(private readonly store: I18nStore) { }

  t(key: string, args?: Record<string, unknown>): string {
    return this.store.format(key, args) ?? `âŸ¨${key}âŸ©`;
  }
}
