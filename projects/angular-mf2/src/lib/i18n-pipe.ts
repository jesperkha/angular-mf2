// i18n.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Store } from './store';

@Pipe({
  name: 'i18n',
  standalone: true,
  pure: false,                 // <— impure so it re-evaluates when Store changes
})
export class I18nPipe implements PipeTransform {
  constructor(private store: Store) { }

  transform(key: unknown, args?: Record<string, unknown>): string {
    const k = key == null ? '' : String(key);
    this.store.log(k);
    return this.store.format(k, args);
  }
}
