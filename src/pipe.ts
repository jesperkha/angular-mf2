import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from './service';
import { I18nStore } from './store';

@Pipe({
  name: 'i18n',
  standalone: true,
  pure: true
})
export class I18nPipe implements PipeTransform {
  private svc = inject(I18nService);
  private store = inject(I18nStore);

  transform(key: string, args?: Record<string, unknown>): string {
    // touch the locale so Angular re-evaluates when it changes
    void this.store.activeLocale;
    return this.svc.t(key, args);
  }
}
