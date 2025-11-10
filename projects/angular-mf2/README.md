# angular‑mf2

Angular integration for **MessageFormat 2 (MF2)** with a pipe, a tiny store, and DI-based configuration. It renders MF2 strings to **sanitized HTML** and supports a small, explicit subset of inline and block markup.

You bring the catalogs and the arguments; the library handles locale selection, MF2 parsing, and safe HTML.

---

## Features at a glance

* ⚙️ **DI-first config** via `MF2_CONFIG` and a `useMF2Config(...)` helper
* 🧠 **Store service** for locale management and formatting (impure pipe reacts to it)
* 🧵 **`| mf2` pipe** (standalone, impure) for templates
* 🔒 **HTML sanitization** with a strict allowlist (customizable via DI)
* 🏷️ **Minimal markup**, now including:

  * Inline: `{#bold}`, `{#italic}`, `{#underline}`,  `{#code}`, `{#kbd}`, `{#mark}`,  `{#sup}`, `{#sub}`
  * Block: `{#p}`, `{#quote}`, `{#ul}`, `{#ol}`, `{#li}`, `{#pre}`
* 🧰 **Sanitizer policy token**: `MF2_SANITIZE_OPTIONS` lets apps extend/tighten the `sanitize-html` policy

## Installation

```bash
npm i angular-mf2 messageformat sanitize-html
```

---

## Quick start

### 1) Provide your config (default locale + catalogs)

```ts
// app.config.ts (Angular standalone bootstrap)
import { ApplicationConfig, provideHttpClient } from '@angular/core';
import { useMF2Config } from 'angular-mf2';

const catalogs = {
  en: {
    greeting: 'Hello {$name}, how are you?',
    rich: 'This is {#bold}bold{/bold}, {#italic}italic{/italic}, {#underline}underlined{/underline}, inline {#code}code(){/code}.',
    block: '{#p}Paragraph one.{/p}{#p}Paragraph two with a {#mark}highlight{/mark}.{/p}',
    quote: '{#quote}“Simplicity is the soul of efficiency.” — Austin Freeman{/quote}',
    list: '{#p}List:{/p}{#ul}{#li}First{/li}{#li}Second{/li}{#li}Third{/li}{/ul}',
    ordlist: '{#p}Steps:{/p}{#ol}{#li}Plan{/li}{#li}Do{/li}{#li}Review{/li}{/ol}',
    supSub: 'H{#sub}2{/sub}O and 2{#sup}10{/sup}=1024',
    codeBlock: '{#pre}npm i angular-mf2{/pre}',
  },
  no: {
    greeting: 'Hei {$name}, hvordan går det?',
    rich: 'Dette er {#bold}fet{/bold}, {#italic}kursiv{/italic}, {#underline}understreket{/underline}, inline {#code}kode(){/code}.',
    block: '{#p}Avsnitt én.{/p}{#p}Avsnitt to med en {#mark}utheving{/mark}.{/p}',
    quote: '{#quote}«Enkelhet er effektivitetens sjel.» — Austin Freeman{/quote}',
    list: '{#p}Liste:{/p}{#ul}{#li}Første{/li}{#li}Andre{/li}{#li}Tredje{/li}{/ul}',
    ordlist: '{#p}Steg:{/p}{#ol}{#li}Plan{/li}{#li}Gjør{/li}{#li}Evaluer{/li}{/ol}',
    supSub: 'H{#sub}2{/sub}O og 2{#sup}10{/sup}=1024',
    codeBlock: '{#pre}npm i angular-mf2{/pre}',
  }
} as const;

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    ...useMF2Config({
      defaultLocale: 'en',
      catalogs,
    }),
  ],
};
```

### 2) Use the pipe in templates

```html
<h1>{{ 'greeting' | mf2 : { name: userName } }}</h1>
<p [innerHTML]="'rich' | mf2"></p>
<div [innerHTML]="'list' | mf2"></div>
```

---

## API

### `MF2_CONFIG` (InjectionToken)

Holds the runtime configuration:

```ts
export type MF2Config = {
  defaultLocale: string;
  catalogs: Record<string, Record<string, string>>;
};
```

### `useMF2Config(config: MF2Config)`

Helper that returns providers to register both the config and the store:

```ts
providers: [
  ...useMF2Config({ defaultLocale: 'en', catalogs }),
]
```

### `MF2Pipe` (`| mf2`)

* **Signature:** `{{ key | mf2 : args? }}`
* **Standalone:** can be imported directly into components
* **Impure:** re-evaluates when the Store changes (e.g., locale swap)
* **Returns:** a **sanitized HTML** string

### `Store` (service)

A small service used by the pipe (and available for direct use):

```ts
@Injectable()
class Store {
  setLocale(locale: string): void;
  getLocale(): string;
  format(key: string, args?: Record<string, unknown>): string;
}
```

Example (programmatic use):

```ts
@Component({/* ... */})
export class LocaleSwitcher {
  constructor(private store: Store) {}
  set(lang: string) { this.store.setLocale(lang); }
}
```

---

## Security & Sanitization

This library uses **sanitize-html** with a conservative default policy. You can adjust that policy via DI:

```ts
// app.config.ts (adding attributes/styles for links, etc.)
import { MF2_SANITIZE_OPTIONS } from 'angular-mf2';

providers: [
  ...useMF2Config({ defaultLocale: 'en', catalogs }),
  {
    provide: MF2_SANITIZE_OPTIONS,
    useValue: {
      allowedAttributes: {
        a: ['href', 'target', 'rel', 'title', 'role', 'tabindex'],
      },
      allowedStyles: { '*': { color: [/^.*$/], 'background-color': [/^.*$/] } },
    },
  },
];
```

**Default allowlist (subset):** `strong`, `em`, `u`, `s`, `code`, `pre`, `kbd`, `mark`, `sup`, `sub`, `a`, `span`, `br`, `p`, `ul`, `ol`, `li`, `blockquote` with a minimal set of attributes. This keeps messages safe while still expressive.

---

## Markup Cheatsheet

| MF2 Markup                  | Renders as                   |
| --------------------------- | ---------------------------- |
| `{#bold}x{/bold}`           | `<strong>x</strong>`         |
| `{#italic}x{/italic}`       | `<em>x</em>`                 |
| `{#underline}x{/underline}` | `<u>x</u>`                   |
| `{#s}x{/s}`                 | `<s>x</s>`                   |
| `{#code}x{/code}`           | `<code>x</code>`             |
| `{#kbd}⌘K{/kbd}`            | `<kbd>⌘K</kbd>`              |
| `{#mark}x{/mark}`           | `<mark>x</mark>`             |
| `{#a href="/"}x{/a}`        | `<a href="/">x</a>`          |
| `{#sup}x{/sup}`             | `<sup>x</sup>`               |
| `{#sub}x{/sub}`             | `<sub>x</sub>`               |
| `{#p}x{/p}`                 | `<p>x</p>`                   |
| `{#quote}x{/quote}`         | `<blockquote>x</blockquote>` |
| `{#ul}{#li}x{/li}{/ul}`     | `<ul><li>x</li></ul>`        |
| `{#ol}{#li}x{/li}{/ol}`     | `<ol><li>x</li></ol>`        |
| `{#pre}x{/pre}`             | `<pre>x</pre>`               |

> All output is sanitized. Only the above tags (and a minimal set of attributes) are allowed by default.

## License

MIT
