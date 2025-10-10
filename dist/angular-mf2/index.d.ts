import * as i0 from '@angular/core';
import { PipeTransform } from '@angular/core';

declare class AngularMf2 {
    static ɵfac: i0.ɵɵFactoryDeclaration<AngularMf2, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AngularMf2, "lib-angular-mf2", never, {}, {}, never, never, true, never>;
}

declare class Store {
    private locale;
    private defaultLocale;
    private catalogs;
    log(value: unknown): unknown;
    constructor();
    setLocale(locale: string): void;
    getLocale(): string;
    format(key: string, args?: Record<string, unknown>): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<Store, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Store>;
}

declare class I18nPipe implements PipeTransform {
    private store;
    constructor(store: Store);
    transform(key: unknown, args?: Record<string, unknown>): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<I18nPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<I18nPipe, "i18n", true>;
}

type Catalogs = Record<string, Record<string, string>>;
type I18nConfig = {
    defaultLocale: string;
    catalogs: Catalogs;
};
declare const i18nConfig: I18nConfig;

export { AngularMf2, I18nPipe, Store, i18nConfig };
export type { Catalogs, I18nConfig };
