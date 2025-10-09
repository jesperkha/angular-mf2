import * as i0 from '@angular/core';
import { InjectionToken, PipeTransform, Provider } from '@angular/core';

type Catalogs = Record<string, Record<string, string>>;
interface I18nConfig {
    defaultLocale: string;
    catalogs: Catalogs;
}
declare const I18N_CONFIG: InjectionToken<I18nConfig>;

/**
 * I18nStore
 * - Holds the current locale
 * - Builds one MF2 group from in-memory typed catalogs
 * - Formats a single key, returning the engine-sanitized string
 */
declare class I18nStore {
    private readonly config;
    /** Current language */
    activeLocale: string;
    /** Compiled MF2 group */
    private group;
    constructor(config: I18nConfig);
    /** Switch the language if we have it */
    setLocale(locale: string): void;
    /**
     * Resolve a single key through MF2.
     * Engine returns sanitized HTML/plain string for each key; we pick the one requested.
     */
    format(key: string, args?: Record<string, unknown>): string | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<I18nStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<I18nStore>;
}

type BaseTranslation = Record<string, string>;
type BaseArguments = Record<string, any>;
type TranslationGroup<T extends BaseTranslation> = {
    defaultLocale: string;
    locales: Record<string, T>;
};
type Result<T, E> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: E;
};
declare function newGroup<T extends BaseTranslation>(defaultLocale: string, locales: Record<string, T>): TranslationGroup<T>;
declare function generate<T extends BaseTranslation, A extends BaseArguments>(locale: string, group: TranslationGroup<T>, args: A): Result<T, string>;

declare class I18nService {
    private readonly store;
    constructor(store: I18nStore);
    t(key: string, args?: Record<string, unknown>): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<I18nService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<I18nService>;
}

declare class I18nPipe implements PipeTransform {
    private readonly svc;
    private readonly store;
    constructor(svc: I18nService, store: I18nStore);
    transform(key: string, args?: Record<string, unknown>): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<I18nPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<I18nPipe, "i18n", true>;
}

declare function provideI18n(config: I18nConfig): Provider[];

export { I18N_CONFIG, I18nPipe, I18nStore, generate, newGroup, provideI18n };
export type { BaseArguments, BaseTranslation, Catalogs, I18nConfig };
