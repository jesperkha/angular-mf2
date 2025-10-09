import * as i0 from '@angular/core';
import { PipeTransform } from '@angular/core';

declare class I18nPipe implements PipeTransform {
    private logger;
    transform(key: string, args?: Record<string, unknown>): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<I18nPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<I18nPipe, "i18n", true>;
}

declare class I18nStore {
    private locale;
    private defaultLocale;
    private catalogs;
    constructor();
    setLocale(locale: string): void;
    getLocale(): string;
    format(key: string, args?: Record<string, unknown>): string;
}

type Catalogs = Record<string, Record<string, string>>;
interface I18nConfig {
    defaultLocale: string;
    catalogs: Catalogs;
}
declare const i18nConfig: I18nConfig;

declare class Logger {
    logs: string[];
    log(message: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<Logger, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Logger>;
}

export { I18nPipe, I18nStore, Logger, i18nConfig };
export type { Catalogs, I18nConfig };
