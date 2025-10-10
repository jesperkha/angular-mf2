import * as i0 from '@angular/core';
import { Component, Injectable, Pipe } from '@angular/core';
import { MessageFormat } from 'messageformat';
import sanitizeHtml from 'sanitize-html';

class AngularMf2 {
    static ɵfac = function AngularMf2_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AngularMf2)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AngularMf2, selectors: [["lib-angular-mf2"]], decls: 2, vars: 0, template: function AngularMf2_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "p");
            i0.ɵɵtext(1, " angular-mf2 works! ");
            i0.ɵɵdomElementEnd();
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AngularMf2, [{
        type: Component,
        args: [{ selector: 'lib-angular-mf2', imports: [], template: `
    <p>
      angular-mf2 works!
    </p>
  ` }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AngularMf2, { className: "AngularMf2", filePath: "lib/angular-mf2.ts", lineNumber: 13 }); })();

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

class Store {
    locale;
    defaultLocale;
    catalogs;
    log(value) {
        console.log("logging: ", value);
        return value;
    }
    constructor() {
        const config = i18nConfig;
        this.defaultLocale = config.defaultLocale;
        this.locale = this.defaultLocale;
        this.catalogs = config.catalogs;
    }
    setLocale(locale) { this.locale = locale; }
    getLocale() { return this.locale; }
    format(key, args) {
        const group = newGroup(this.getLocale(), this.catalogs || {});
        const res = generate(this.getLocale(), group, args ?? {});
        if (!res?.ok)
            return '';
        const out = res.value[key];
        return typeof out === 'string' ? out : String(out ?? '');
    }
    static ɵfac = function Store_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Store)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: Store, factory: Store.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Store, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();

// i18n.pipe.ts
class I18nPipe {
    store;
    constructor(store) {
        this.store = store;
    }
    transform(key, args) {
        const k = key == null ? '' : String(key);
        this.store.log(k);
        return this.store.format(k, args);
    }
    static ɵfac = function I18nPipe_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || I18nPipe)(i0.ɵɵdirectiveInject(Store, 16)); };
    static ɵpipe = /*@__PURE__*/ i0.ɵɵdefinePipe({ name: "i18n", type: I18nPipe, pure: false });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(I18nPipe, [{
        type: Pipe,
        args: [{
                name: 'i18n',
                standalone: true,
                pure: false, // <— impure so it re-evaluates when Store changes
            }]
    }], () => [{ type: Store }], null); })();

/*
 * Public API Surface of angular-mf2
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AngularMf2, I18nPipe, Store, i18nConfig };
//# sourceMappingURL=angular-mf2.mjs.map
