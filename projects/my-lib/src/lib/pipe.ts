import { EnvironmentInjector, Pipe, PipeTransform, inject } from '@angular/core';
import { generate, newGroup } from './mf2';
import { I18nStore } from './store';
import { Logger } from './logger'

@Pipe({
  name: 'i18n',
  standalone: true,
  pure: true,
})
export class I18nPipe implements PipeTransform {
  private logger = inject(Logger)


  // transform(key: string, args?: Record<string, unknown>): string {
  //   return this.store.format(key, args);
  // }

  transform(key: string, args?: Record<string, unknown>): string {
    return this.logger.log("TESTS")
  }
}
