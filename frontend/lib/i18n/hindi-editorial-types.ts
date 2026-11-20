export type HindiEditorialSection = { heading: string; paragraphs: string[]; bullets?: string[] };

/** A Hindi editorial article that mirrors an English article identified by `sourceSlug`. */
export type HindiEditorialPost = {
  slug: string;
  /** Slug of the English article this one was written from (used for review and parity tests). */
  sourceSlug: string;
  title: string;
  description: string;
  /** ISO date; matches the English source's last update so freshness stays honest. */
  updated: string;
  readTime: string;
  intro: string;
  sections: HindiEditorialSection[];
  faqs: { question: string; answer: string }[];
  /** Links to Hindi tool routes, e.g. `/hi/merge-pdf`. */
  toolLinks: { label: string; href: string }[];
  /** External references carried over from the English article, if it cites any. */
  sources?: { label: string; url: string }[];
};
