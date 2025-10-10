export type Catalogs = Record<string, Record<string, string>>; // { 'en': Translation, 'no': Translation }

export type MF2Config = {
  defaultLocale: string;
  catalogs: Catalogs; // you’ll pass { en, no } here
};

export const mf2Config: MF2Config = {
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
