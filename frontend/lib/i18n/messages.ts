import type { Locale } from "./config";
import { createTranslator, type MessageTree, type Translator } from "./translate";

/**
 * Per-namespace dictionaries, loaded on demand so a page only ships what it renders.
 * Files: lib/i18n/messages/<locale>/<namespace>.json
 *
 * Add a namespace here AND create messages/en/<namespace>.json (English is the source of
 * truth). Other locales add a file only when fully translated; `npm run i18n:check`
 * verifies key parity and placeholder parity against English.
 * Planned namespaces (added per phase): navigation, homepage, tools, categories,
 * tool-descriptions, forms, validation, errors, downloads, blog, faq, about, privacy,
 * terms, contact, cookies, footer.
 */
export const namespaces = ["common", "accessibility", "seo"] as const;
export type Namespace = (typeof namespaces)[number];

type Loader = () => Promise<{ default: unknown }>;

// Import paths must be static strings so the bundler can split them. Add a locale only
// together with complete, reviewed namespace files and a published status in config.ts.
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
  ar: {
    common: () => import("./messages/ar/common.json"),
    accessibility: () => import("./messages/ar/accessibility.json"),
    seo: () => import("./messages/ar/seo.json"),
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
  ko: {
    common: () => import("./messages/ko/common.json"),
    accessibility: () => import("./messages/ko/accessibility.json"),
    seo: () => import("./messages/ko/seo.json"),
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
