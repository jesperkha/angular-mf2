import { InjectionToken } from '@angular/core';
import { Store } from 'mf2';

export type Catalogs = Record<string, Record<string, string>>;

export type MF2Config = {
  defaultLocale: string;
  catalogs: Catalogs;
};

export const MF2_CONFIG = new InjectionToken<MF2Config>('MF2_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    defaultLocale: 'en',
    catalogs: {},
  }),
});

export function useMF2Config(config: MF2Config) {
  return [
    {
      provide: MF2_CONFIG,
      useValue: config,
    },
    Store,
  ];
}
