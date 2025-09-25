export type Catalogs = Record<string, Record<string, string>>; // { 'en': Translation, 'no': Translation }

export interface I18nConfig {
  defaultLocale: string;
  catalogs: Catalogs; // you’ll pass { en, no } here
}
