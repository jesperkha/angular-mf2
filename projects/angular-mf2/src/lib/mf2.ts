import { MessageFormat, type MessageMarkupPart, type MessagePart } from 'messageformat';
import sanitizeHtml, { type IOptions as SanitizeOptions } from 'sanitize-html';

/** ---------- Public Types ---------- */
export type BaseTranslation = Record<string, string>;
export type BaseArguments = Record<string, any>;

type TranslationGroup<T extends BaseTranslation> = {
  defaultLocale: string;
  locales: Record<string, T>;
};

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

/** ---------- Markup Rendering Extension Points ---------- */

export type MarkupHandler = (part: MessageMarkupPart) => string;
export type MarkupRenderer = Record<string, MarkupHandler>;




/** ---------- Default Markup Renderer ---------- */
export const defaultRenderer: MarkupRenderer = {
  bold: p => (p.kind === 'open' ? '<strong>' : '</strong>'),
  italic: p => (p.kind === 'open' ? '<em>' : '</em>'),
  underline: p => (p.kind === 'open' ? '<u>' : '</u>'),
  strike: p => (p.kind === 'open' ? '<s>' : '</s>'),
  code: p => (p.kind === 'open' ? '<code>' : '</code>'),
  pre: p => (p.kind === 'open' ? '<pre>' : '</pre>'),
  kbd: p => (p.kind === 'open' ? '<kbd>' : '</kbd>'),
  mark: p => (p.kind === 'open' ? '<mark>' : '</mark>'),
  sup: p => (p.kind === 'open' ? '<sup>' : '</sup>'),
  sub: p => (p.kind === 'open' ? '<sub>' : '</sub>'),
  quote: p => (p.kind === 'open' ? '<blockquote>' : '</blockquote>'),
  br: p => (p.kind === 'open' || p.kind === 'standalone' ? '<br />' : ''),
  p: p => (p.kind === 'open' ? '<p>' : '</p>'),
  ul: p => (p.kind === 'open' ? '<ul>' : '</ul>'),
  ol: p => (p.kind === 'open' ? '<ol>' : '</ol>'),
  li: p => (p.kind === 'open' ? '<li>' : '</li>'),

  span: p => {
    if (p.kind === 'close') return '</span>';
    if (p.kind !== 'open') return '';
    const cls = (p.options as any)?.class;
    const style = (p.options as any)?.style;
    const attrs = (cls ? ` class="${cls}"` : '') + (style ? ` style="${style}"` : '');
    return `<span${attrs}>`;
  },

  link: p => {
    if (p.kind === 'close') return '</a>';
    if (p.kind !== 'open') return '';
    const to = (p.options as any)?.to;
    const title = typeof (p.options as any)?.title === 'string'
      ? (p.options as any).title.trim().slice(0, 512).replace(/"/g, '&quot;')
      : '';
    const target = (p.options as any)?.target ?? '_blank';
    const rel = target === '_blank' ? 'noopener noreferrer' : '';
    if (!to) return `<a role="link" tabindex="0">`;
    return `<a href="${to}" target="${target}"${rel ? ` rel="${rel}"` : ''}${title ? ` title="${title}"` : ''}>`;
  },

  // Legacy 'error' span with class hook
  error: p => (p.kind === 'open' ? `<span class="m2-error">` : '</span>'),
};

/** ---------- Sanitization Defaults ---------- */
export const defaultSanitize: SanitizeOptions = {
  allowedTags: [
    'strong', 'em', 'u', 's', 'code', 'pre', 'kbd', 'mark',
    'sup', 'sub', 'a', 'span', 'br', 'p', 'ul', 'ol', 'li', 'blockquote'
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'title', 'role', 'tabindex'],
    span: ['class', 'style'],
    p: ['class', 'style'],
    li: ['class'],
    ul: ['class'],
    ol: ['class'],
    blockquote: ['class'],
    code: ['class'],
    pre: ['class'],
    kbd: ['class'],
    strong: ['class'],
    em: ['class'],
    mark: ['class'],
    sup: ['class'],
    sub: ['class'],
  },
  allowedStyles: {
    '*': {
      color: [/^.*$/],
      'background-color': [/^.*$/],
    },
  },
  allowProtocolRelative: false,
  disallowedTagsMode: 'escape',
};

/** ---------- Public API ---------- */

export function newGroup<T extends BaseTranslation>(
  defaultLocale: string,
  locales: Record<string, T>
): TranslationGroup<T> {
  if (Object.keys(locales).length === 0) {
    throw new Error('newGroup: locales object must not be empty');
  }
  return { defaultLocale, locales };
}

export type GenerateOptions = {
  renderer?: MarkupRenderer;
  sanitize?: SanitizeOptions;
};

export function generate<T extends BaseTranslation, A extends BaseArguments>(
  locale: string,
  group: TranslationGroup<T>,
  args: A,
  options: GenerateOptions = {}
): Result<T, string> {
  if (!(locale in group.locales)) {
    locale = group.defaultLocale;
    if (!(locale in group.locales)) {
      return { ok: false, error: 'group has no valid locales' };
    }
  }
  const translation = group.locales[locale];
  const formatted = mf2Format(locale, translation, args, options);
  return { ok: true, value: formatted as T };
}

/** ---------- Core Formatting ---------- */

function mf2Format<T extends BaseTranslation, A extends BaseArguments>(
  locale: string,
  t: T,
  a: A,
  options: GenerateOptions
): T {
  const result: Record<string, string> = {};
  const sanitizeConfig = { ...defaultSanitize, ...(options.sanitize ?? {}) };

  for (const key in t) {
    if (!Object.prototype.hasOwnProperty.call(t, key)) continue;

    const raw = t[key];
    const mf2 = new MessageFormat(locale, raw);
    const parts = mf2.formatToParts(a);
    const html = partsToHtml(parts, defaultRenderer);
    result[key] = sanitizeHtml(html, sanitizeConfig);
  }
  return result as T;
}

/** Convert MF2 parts to HTML with a balancing stack */
function partsToHtml(parts: MessagePart<never>[], renderer: MarkupRenderer): string {
  const out: string[] = [];
  const stack: { name: string; closeHtml: string }[] = [];

  for (const part of parts as any[]) {
    switch (part.type) {
      case 'text':
      case 'string':
        out.push(part.value);
        break;
      case 'markup': {
        const name = (part.name ?? '').trim().toLowerCase();
        const handler = renderer[name];
        if (!handler) break;

        if (part.kind === 'open') {
          const openHtml = handler(part);
          const closeHtml = handler({ ...(part as any), kind: 'close' });
          if (openHtml) out.push(openHtml);
          if (closeHtml) stack.push({ name, closeHtml });
        } else if (part.kind === 'close') {
          // Unwind until the most recent matching name
          let idx = stack.length - 1;
          while (idx >= 0 && stack[idx].name !== name) idx--;
          if (idx >= 0) {
            const closes = stack.splice(idx);
            for (let i = closes.length - 1; i >= 0; i--) out.push(closes[i].closeHtml);
          }
        } else {
          const html = handler(part);
          if (html) out.push(html);
        }
        break;
      }

      case 'number':
      case 'date':
      case 'time':
        out.push(String(part.value));
        break;

      default:
        if (typeof (part as any).value !== 'undefined') {
          out.push(String((part as any).value));
        }
        break;
    }
  }

  // Close any still-open tags
  for (let i = stack.length - 1; i >= 0; i--) out.push(stack[i].closeHtml);
  return out.join('');
}
