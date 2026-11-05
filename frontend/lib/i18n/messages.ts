import type { Locale } from "./config";
import { createTranslator, type MessageTree, type Translator } from "./translate";

/**
 * Per-namespace dictionaries, loaded on demand so a page only ships what it renders.
 * Files: lib/i18n/messages/<locale>/<namespace>.json
 *
 * English dictionaries define the schema. Preview locales may contain translated interface tokens while
 * slug-level content entries remain incomplete; `npm run i18n:content-check` enforces the publication gate.
 * Tool and guide content namespaces use slug-keyed entries; untranslated entries remain empty and block publication.
 */
export const namespaces = ["common", "accessibility", "seo", "tools", "guides", "calculators", "faqs"] as const;
export type Namespace = (typeof namespaces)[number];

type Loader = () => Promise<{ default: unknown }>;

// Import paths must be static strings so the bundler can split them. Add a locale only
// together with complete, reviewed namespace files and a published status in config.ts.
const loaders: Partial<Record<Locale, Partial<Record<Namespace, Loader>>>> = {
  en: {
    common: () => import("./messages/en/common.json"),
    accessibility: () => import("./messages/en/accessibility.json"),
    seo: () => import("./messages/en/seo.json"),
    tools: () => import("./messages/en/tools.json"),
    guides: () => import("./messages/en/guides.json"),
    calculators: () => import("./messages/en/calculators.json"),
    faqs: () => import("./messages/en/faqs.json"),
  },
  ne: {
    common: () => import("./messages/ne/common.json"),
    accessibility: () => import("./messages/ne/accessibility.json"),
    seo: () => import("./messages/ne/seo.json"),
  },
  hi: {
    common: () => import("./messages/hi/common.json"),
    accessibility: () => import("./messages/hi/accessibility.json"),
    seo: () => import("./messages/hi/seo.json"),
    tools: () => import("./messages/hi/tools.json"),
    guides: () => import("./messages/hi/guides.json"),
    calculators: () => import("./messages/hi/calculators.json"),
    faqs: () => import("./messages/hi/faqs.json"),
  },
  es: {
    common: () => import("./messages/es/common.json"),
    accessibility: () => import("./messages/es/accessibility.json"),
    seo: () => import("./messages/es/seo.json"),
    tools: () => import("./messages/es/tools.json"),
    guides: () => import("./messages/es/guides.json"),
    calculators: () => import("./messages/es/calculators.json"),
    faqs: () => import("./messages/es/faqs.json"),
  },
  fr: {
    common: () => import("./messages/fr/common.json"),
    accessibility: () => import("./messages/fr/accessibility.json"),
    seo: () => import("./messages/fr/seo.json"),
    tools: () => import("./messages/fr/tools.json"),
    guides: () => import("./messages/fr/guides.json"),
    calculators: () => import("./messages/fr/calculators.json"),
    faqs: () => import("./messages/fr/faqs.json"),
  },
  de: {
    common: () => import("./messages/de/common.json"),
    accessibility: () => import("./messages/de/accessibility.json"),
    seo: () => import("./messages/de/seo.json"),
    tools: () => import("./messages/de/tools.json"),
    guides: () => import("./messages/de/guides.json"),
    calculators: () => import("./messages/de/calculators.json"),
    faqs: () => import("./messages/de/faqs.json"),
  },
  ar: {
    common: () => import("./messages/ar/common.json"),
    accessibility: () => import("./messages/ar/accessibility.json"),
    seo: () => import("./messages/ar/seo.json"),
    tools: () => import("./messages/ar/tools.json"),
    guides: () => import("./messages/ar/guides.json"),
    calculators: () => import("./messages/ar/calculators.json"),
    faqs: () => import("./messages/ar/faqs.json"),
  },
  zh: {
    common: () => import("./messages/zh/common.json"),
    accessibility: () => import("./messages/zh/accessibility.json"),
    seo: () => import("./messages/zh/seo.json"),
    tools: () => import("./messages/zh/tools.json"),
    guides: () => import("./messages/zh/guides.json"),
    calculators: () => import("./messages/zh/calculators.json"),
    faqs: () => import("./messages/zh/faqs.json"),
  },
  ja: {
    common: () => import("./messages/ja/common.json"),
    accessibility: () => import("./messages/ja/accessibility.json"),
    seo: () => import("./messages/ja/seo.json"),
    tools: () => import("./messages/ja/tools.json"),
    guides: () => import("./messages/ja/guides.json"),
    calculators: () => import("./messages/ja/calculators.json"),
    faqs: () => import("./messages/ja/faqs.json"),
  },
  ko: {
    common: () => import("./messages/ko/common.json"),
    accessibility: () => import("./messages/ko/accessibility.json"),
    seo: () => import("./messages/ko/seo.json"),
    tools: () => import("./messages/ko/tools.json"),
    guides: () => import("./messages/ko/guides.json"),
    calculators: () => import("./messages/ko/calculators.json"),
    faqs: () => import("./messages/ko/faqs.json"),
  },
};

async function loadLocale(locale: Locale, wanted: readonly Namespace[]): Promise<MessageTree> {
  const tree: MessageTree = {};
  for (const ns of wanted) {
    const loader = loaders[locale]?.[ns];
    if (loader) tree[ns] = (await loader()).default as MessageTree;
  }
  return tree;
}

export interface LoadedMessages {
  messages: MessageTree;
  /** English source tree for non-English locales, used only to report/cover missing keys. */
  fallback?: MessageTree;
}

export async function loadMessages(locale: Locale, wanted: readonly Namespace[] = namespaces): Promise<LoadedMessages> {
  const messages = await loadLocale(locale, wanted);
  if (locale === "en") return { messages };
  return { messages, fallback: await loadLocale("en", wanted) };
}

/**
 * Load a slug-specific localized content entry without silently substituting English.
 * Returning undefined is intentional: callers must hide the localized section or keep
 * the locale unpublished instead of presenting fallback-heavy SEO copy as translated.
 */
export async function getLocalizedEntry(locale: Locale, namespace: "tools" | "guides" | "calculators" | "faqs", slug: string): Promise<unknown | undefined> {
  const loaded = await loadLocale(locale, [namespace]);
  const node = loaded[namespace] as MessageTree | undefined;
  if (!node || typeof node !== "object") return undefined;
  const entries = node.entries;
  if (!entries || typeof entries !== "object" || typeof entries === "string") return undefined;
  const entry = (entries as MessageTree)[slug];
  if (!entry || typeof entry !== "object" || typeof entry === "string") return undefined;
  return entry;
}

/** Convenience: load + build a translator that warns (server log) on every missing key. */
export async function getTranslator(locale: Locale, wanted: readonly Namespace[] = namespaces): Promise<Translator> {
  const { messages, fallback } = await loadMessages(locale, wanted);
  return createTranslator({
    locale,
    messages,
    fallback,
    onMissing: (key, l) => {
      if (process.env.NODE_ENV !== "production") console.warn(`[i18n] missing "${key}" for locale "${l}" (falling back to English)`);
    },
  });
}
