import * as i0 from '@angular/core';
import { InjectionToken, Inject, Injectable, Pipe } from '@angular/core';
import { MessageFormat } from 'messageformat';
import sanitizeHtml from 'sanitize-html';

const I18N_CONFIG = new InjectionToken('I18N_CONFIG');

function newGroup(defaultLocale, locales) {
    if (Object.keys(locales).length === 0) {
        throw new Error("newGroup: locales object must not be empty");
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
            return { ok: false, error: "group has no valid locales" };
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
            allowedTags: ["b", "i", "a", "span"], // Only allow tags used by mf2
            allowedAttributes: {},
            disallowedTagsMode: "escape",
        });
    }
    return result;
}
function partsToHtml(parts) {
    const result = [];
    for (const part of parts) {
        switch (part.type) {
            case "text":
            case "string":
                result.push(part.value);
                break;
            case "markup":
                result.push(markupToHtml(part));
                break;
        }
    }
    return result.join("");
}
function markupToHtml(part) {
    const name = part.name?.trim().toLowerCase();
    switch (name) {
        case "bold":
            return part.kind === "open" ? "<b>" : "</b>";
        case "italic":
            return part.kind === "open" ? "<i>" : "</i>";
        case "error":
            return part.kind === "open" ? `<span style="color:red">` : "</span>";
        case "link":
            if (part.options) {
                return `<a href="${part.options['to']}">`;
            }
            return part.kind === "open" ? `<a style="text-decoration: underline">` : "</a>";
        default:
            return "";
    }
}

// i18n.store.ts
/**
 * I18nStore
 * - Holds the current locale
 * - Builds one MF2 group from in-memory typed catalogs
 * - Formats a single key, returning the engine-sanitized string
 */
class I18nStore {
    config;
    /** Current language */
    activeLocale;
    /** Compiled MF2 group */
    group;
    constructor(config) {
        this.config = config;
        this.activeLocale = config.defaultLocale;
        // catalogs is a map like { en, no } where each is a `Translation`
        this.group = newGroup(this.activeLocale, this.config.catalogs);
    }
    /** Switch the language if we have it */
    setLocale(locale) {
        if (this.config.catalogs[locale]) {
            this.activeLocale = locale;
        }
        else {
            console.warn(`[i18n] Unsupported locale "${locale}" — staying on ${this.activeLocale}`);
        }
    }
    /**
     * Resolve a single key through MF2.
     * Engine returns sanitized HTML/plain string for each key; we pick the one requested.
     */
    format(key, args) {
        const res = generate(this.activeLocale, this.group, args ?? {});
        if (!res?.ok)
            return undefined;
        const out = res.value[key];
        return typeof out === 'string' ? out : String(out ?? '');
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.3.2", ngImport: i0, type: I18nStore, deps: [{ token: I18N_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.3.2", ngImport: i0, type: I18nStore, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.2", ngImport: i0, type: I18nStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [I18N_CONFIG]
                }] }] });

//not really doing anything now, but should take some weigth from store later
class I18nService {
    store;
    constructor(store) {
        this.store = store;
    }
    t(key, args) {
        return this.store.format(key, args) ?? `âŸ¨${key}âŸ©`;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.3.2", ngImport: i0, type: I18nService, deps: [{ token: I18nStore }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.3.2", ngImport: i0, type: I18nService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.2", ngImport: i0, type: I18nService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: I18nStore }] });

class I18nPipe {
    svc;
    store;
    constructor(svc, store) {
        this.svc = svc;
        this.store = store;
    }
    transform(key, args) {
        // touch the locale so Angular re-evaluates when it changes
        void this.store.activeLocale;
        return this.svc.t(key, args);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.3.2", ngImport: i0, type: I18nPipe, deps: [{ token: I18nService }, { token: I18nStore }], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "20.3.2", ngImport: i0, type: I18nPipe, isStandalone: true, name: "i18n" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.2", ngImport: i0, type: I18nPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'i18n',
                    standalone: true,
                    pure: true,
                }]
        }], ctorParameters: () => [{ type: I18nService }, { type: I18nStore }] });

function provideI18n(config) {
    return [
        { provide: I18N_CONFIG, useValue: config }
    ];
}

/**
 * Generated bundle index. Do not edit.
 */

export { I18N_CONFIG, I18nPipe, I18nStore, generate, newGroup, provideI18n };
//# sourceMappingURL=mf2-i18n.mjs.map
