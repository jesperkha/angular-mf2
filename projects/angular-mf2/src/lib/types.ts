export type Catalogs = Record<string, Record<string, string>>; // { 'en': Translation, 'no': Translation }

export type I18nConfig = {
  defaultLocale: string;
  catalogs: Catalogs; // you’ll pass { en, no } here
};

export const i18nConfig: I18nConfig = {
  defaultLocale: 'en',
  catalogs: {
    en: {
      hello: 'Hello, {$name}!',
    },
    no: {
      hello: 'Hallo, {$name}!',
    },
  }, // TODO:
  // en: () => import('./locales/en.json').then((m) => m.default),
};
