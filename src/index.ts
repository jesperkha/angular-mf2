import { MessageFormat } from "messageformat";

export type BaseTranslation = Record<string, string>;
export type BaseArguments = Record<string, any>;

type TranslationGroup<T extends BaseTranslation> = {
    defaultLocale: string;
    locales: Record<string, T>;
};

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export function newGroup<T extends BaseTranslation>(
    defaultLocale: string,
    locales: Record<string, T>
): TranslationGroup<T> {
    if (Object.keys(locales).length === 0) {
        throw new Error("newGroup: locales object must not be empty");
    }

    return {
        defaultLocale,
        locales,
    };
}

export function load<T extends BaseTranslation, A extends BaseArguments>(
    locale: string,
    group: TranslationGroup<T>,
    args: A
): Result<T, string> {
    // Fallback to default if requested locale is missing
    if (!(locale in group.locales)) {
        locale = group.defaultLocale;

        if (!(locale in group.locales)) {
            return { ok: false, error: "group has no valid locales" };
        }
    }

    const translation = group.locales[locale];
    const formatted = mf2Format(locale, translation, args);

    return { ok: true, value: formatted as T };
}

function mf2Format<T extends BaseTranslation, A extends BaseArguments>(locale: string, t: T, a: A): T {
    const formatted: Record<string, string> = {};

    for (const key in t) {
        if (!Object.prototype.hasOwnProperty.call(t, key)) continue;

        const raw = t[key];
        const mf2 = new MessageFormat(locale, raw);
        formatted[key] = mf2.format(a);
    }

    return formatted as T;
}
