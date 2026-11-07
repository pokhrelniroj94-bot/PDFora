import type { Locale } from "./config";
import { createTranslator, type MessageTree, type Translator } from "./translate";

/**
 * Per-namespace dictionaries, loaded on demand so a page only ships what it renders.
 * Files: lib/i18n/messages/<locale>/<namespace>.json
 *
 * English is the source of truth. Every JSON file must be registered with a static import
 * below; `npm run i18n:check` verifies key parity, placeholder parity, and loader coverage.
 * Keep a locale unpublished until every user-facing namespace and route is translated,
 * tested, and reviewed by a fluent speaker. The current common/accessibility/seo set is
 * only the shared-shell foundation, not a complete site translation.
 */
export const namespaces = ["common", "accessibility", "seo"] as const;
export type Namespace = (typeof namespaces)[number];

type Loader = () => Promise<{ default: unknown }>;

// Import paths must be static strings so the bundler can split them. All 12 locales currently
// load the shared-shell foundation (common, accessibility, seo); this does not publish them.
const loaders: Partial<Record<Locale, Partial<Record<Namespace, Loader>>>> = {
  en: {
    common: () => import("./messages/en/common.json"),
    accessibility: () => import("./messages/en/accessibility.json"),
    seo: () => import("./messages/en/seo.json"),
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
  },
  bn: {
    common: () => import("./messages/bn/common.json"),
    accessibility: () => import("./messages/bn/accessibility.json"),
    seo: () => import("./messages/bn/seo.json"),
  },
  ur: {
    common: () => import("./messages/ur/common.json"),
    accessibility: () => import("./messages/ur/accessibility.json"),
    seo: () => import("./messages/ur/seo.json"),
  },
  ar: {
    common: () => import("./messages/ar/common.json"),
    accessibility: () => import("./messages/ar/accessibility.json"),
    seo: () => import("./messages/ar/seo.json"),
  },
  es: {
    common: () => import("./messages/es/common.json"),
    accessibility: () => import("./messages/es/accessibility.json"),
    seo: () => import("./messages/es/seo.json"),
  },
  fr: {
    common: () => import("./messages/fr/common.json"),
    accessibility: () => import("./messages/fr/accessibility.json"),
    seo: () => import("./messages/fr/seo.json"),
  },
  de: {
    common: () => import("./messages/de/common.json"),
    accessibility: () => import("./messages/de/accessibility.json"),
    seo: () => import("./messages/de/seo.json"),
  },
  pt: {
    common: () => import("./messages/pt/common.json"),
    accessibility: () => import("./messages/pt/accessibility.json"),
    seo: () => import("./messages/pt/seo.json"),
  },
  zh: {
    common: () => import("./messages/zh/common.json"),
    accessibility: () => import("./messages/zh/accessibility.json"),
    seo: () => import("./messages/zh/seo.json"),
  },
  ja: {
    common: () => import("./messages/ja/common.json"),
    accessibility: () => import("./messages/ja/accessibility.json"),
    seo: () => import("./messages/ja/seo.json"),
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
