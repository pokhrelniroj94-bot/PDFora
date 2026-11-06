import { localeInfo, type Locale } from "./config";

export interface PluralMessage {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}
export type MessageValue = string | PluralMessage | MessageTree;
export interface MessageTree {
  [key: string]: MessageValue;
}
export type MessageValues = Record<string, string | number>;

const pluralKeys = new Set(["zero", "one", "two", "few", "many", "other"]);

export function isPluralMessage(value: unknown): value is PluralMessage {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.entries(value as Record<string, unknown>);
  return entries.length > 0 && typeof (value as PluralMessage).other === "string" && entries.every(([k, v]) => pluralKeys.has(k) && typeof v === "string");
}

function lookup(tree: MessageTree | undefined, key: string): MessageValue | undefined {
  let node: MessageValue | undefined = tree;
  for (const part of key.split(".")) {
    if (node === undefined || typeof node === "string" || isPluralMessage(node)) return undefined;
    node = (node as MessageTree)[part];
  }
  return node;
}

/** Replaces {name} placeholders. Unknown placeholders are left visible rather than hidden. */
export function interpolate(template: string, values?: MessageValues): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) => (name in values ? String(values[name]) : whole));
}

export interface TranslatorOptions {
  locale: Locale;
  messages: MessageTree;
  /** Source-language tree used only when a key is missing; every use is reported via onMissing. */
  fallback?: MessageTree;
  onMissing?: (key: string, locale: Locale) => void;
}

export type Translator = (key: string, values?: MessageValues) => string;

function render(value: MessageValue | undefined, locale: Locale, values?: MessageValues): string | undefined {
  if (typeof value === "string") return interpolate(value, values);
  if (isPluralMessage(value)) {
    const count = Number(values?.count);
    if (!Number.isFinite(count)) return undefined;
    const category = new Intl.PluralRules(localeInfo[locale].intl).select(count);
    return interpolate(value[category] ?? value.other, values);
  }
  return undefined;
}

export function createTranslator({ locale, messages, fallback, onMissing }: TranslatorOptions): Translator {
  return (key, values) => {
    const own = render(lookup(messages, key), locale, values);
    if (own !== undefined) return own;
    onMissing?.(key, locale);
    const source = render(lookup(fallback, key), locale, values);
    return source ?? key;
  };
}
