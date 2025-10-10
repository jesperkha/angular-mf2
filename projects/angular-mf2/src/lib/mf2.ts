import { MessageFormat, type MessageMarkupPart, type MessagePart } from 'messageformat';
import sanitizeHtml from 'sanitize-html';

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
    throw new Error('newGroup: locales object must not be empty');
  }

  return {
    defaultLocale,
    locales,
  };
}

export function generate<T extends BaseTranslation, A extends BaseArguments>(
  locale: string,
  group: TranslationGroup<T>,
  args: A
): Result<T, string> {
  // Fallback to default if requested locale is missing
  if (!(locale in group.locales)) {
    locale = group.defaultLocale;

    if (!(locale in group.locales)) {
      return { ok: false, error: 'group has no valid locales' };
    }
  }

  const translation = group.locales[locale];
  const formatted = mf2Format(locale, translation, args);

  return { ok: true, value: formatted as T };
}

function mf2Format<T extends BaseTranslation, A extends BaseArguments>(
  locale: string,
  t: T,
  a: A
): T {
  const result: Record<string, string> = {};

  for (const key in t) {
    if (!Object.prototype.hasOwnProperty.call(t, key)) continue;

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

  return result as T;
}

function partsToHtml(parts: MessagePart<never>[]): string {
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

function markupToHtml(part: MessageMarkupPart): string {
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
        return `<a href="${(part.options as any)['to']}">`;
      }
      return part.kind === 'open' ? `<a style="text-decoration: underline">` : '</a>';
    default:
      return '';
  }
}
