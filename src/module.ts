import { ModuleWithProviders, NgModule } from '@angular/core';
import { I18nPipe } from './pipe';
import { I18nService } from './service';
import { I18nStore } from './store';
import { I18nConfig } from './types';

@NgModule({
  imports: [I18nPipe],
  exports: [I18nPipe],
})
export class I18nModule {
  static forRoot(config: I18nConfig): ModuleWithProviders<I18nModule> {
    return {
      ngModule: I18nModule,
      providers: [
        { provide: I18nStore, useFactory: () => new I18nStore(config) },
        I18nService,
      ],
    };
  }
}
