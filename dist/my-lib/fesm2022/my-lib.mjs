import * as i0 from '@angular/core';
import { Injectable, inject, Pipe } from '@angular/core';
import { MessageFormat } from 'messageformat';
import sanitizeHtml from 'sanitize-html';

class Logger {
    logs = []; // capture logs for testing
    log(message) {
        this.logs.push(message);
        console.log(message);
        return message;
    }
    static ɵfac = function Logger_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Logger)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: Logger, factory: Logger.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Logger, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();

class I18nPipe {
    logger = inject(Logger);
    // transform(key: string, args?: Record<string, unknown>): string {
    //   return this.store.format(key, args);
    // }
    transform(key, args) {
        return this.logger.log("TESTS");
    }
    static ɵfac = function I18nPipe_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || I18nPipe)(); };
    static ɵpipe = /*@__PURE__*/ i0.ɵɵdefinePipe({ name: "i18n", type: I18nPipe, pure: true });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(I18nPipe, [{
        type: Pipe,
        args: [{
                name: 'i18n',
                standalone: true,
                pure: true,
            }]
    }], null, null); })();

;
// export const I18N_CONFIG: InjectionToken<I18nConfig> = new InjectionToken<I18nConfig>(
//   'i18n.config'
// );
const i18nConfig = {
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

function newGroup(defaultLocale, locales) {
    if (Object.keys(locales).length === 0) {
        throw new Error('newGroup: locales object must not be empty');
    }
    return {
        defaultLocale,
        locales,
    };
}
function generate(locale, group, args) {
    // Fallback to default if requested locale is missing
    if (!(locale in group.locales)) {
        locale = group.defaultLocale;
        if (!(locale in group.locales)) {
            return { ok: false, error: 'group has no valid locales' };
        }
    }
    const translation = group.locales[locale];
    const formatted = mf2Format(locale, translation, args);
    return { ok: true, value: formatted };
}
function mf2Format(locale, t, a) {
    const result = {};
    for (const key in t) {
        if (!Object.prototype.hasOwnProperty.call(t, key))
            continue;
        const raw = t[key];
        const mf2 = new MessageFormat(locale, raw);
        const parts = mf2.formatToParts(a);
        const formatted = partsToHtml(parts);
        result[key] = sanitizeHtml(formatted, {
            allowedTags: ['b', 'i', 'a', 'span'], // Only allow tags used by mf2
            allowedAttributes: {},
            disallowedTagsMode: 'escape',
        });
    }
    return result;
}
function partsToHtml(parts) {
    const result = [];
    for (const part of parts) {
        switch (part.type) {
            case 'text':
            case 'string':
                result.push(part.value);
                break;
            case 'markup':
                result.push(markupToHtml(part));
                break;
        }
    }
    return result.join('');
}
function markupToHtml(part) {
    const name = part.name?.trim().toLowerCase();
    switch (name) {
        case 'bold':
            return part.kind === 'open' ? '<b>' : '</b>';
        case 'italic':
            return part.kind === 'open' ? '<i>' : '</i>';
        case 'error':
            return part.kind === 'open' ? `<span style="color:red">` : '</span>';
        case 'link':
            if (part.options) {
                return `<a href="${part.options['to']}">`;
            }
            return part.kind === 'open' ? `<a style="text-decoration: underline">` : '</a>';
        default:
            return '';
    }
}

class I18nStore {
    locale;
    defaultLocale;
    catalogs;
    constructor() {
        const config = i18nConfig; // TODO: inject
        this.defaultLocale = config.defaultLocale;
        this.locale = this.defaultLocale;
        this.catalogs = config.catalogs;
    }
    setLocale(locale) {
        this.locale = locale;
    }
    getLocale() {
        return this.locale;
    }
    format(key, args) {
        const group = newGroup(this.getLocale(), this.catalogs || {});
        const res = generate(this.getLocale(), group, args ?? {});
        if (!res?.ok)
            return '';
        const out = res.value[key];
        return typeof out === 'string' ? out : String(out ?? '');
    }
}

/*
 * Public API Surface of my-lib
 */

/**
 * Generated bundle index. Do not edit.
 */

export { I18nPipe, I18nStore, Logger, i18nConfig };
//# sourceMappingURL=my-lib.mjs.map
