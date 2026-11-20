import { hindiEditorialPostsA } from "./hindi-editorial-posts-a";
import { hindiEditorialPostsB } from "./hindi-editorial-posts-b";
import { hindiEditorialPostsC } from "./hindi-editorial-posts-c";
import { hindiEditorialPostsD } from "./hindi-editorial-posts-d";
import type { HindiEditorialPost } from "./hindi-editorial-types";

export type { HindiEditorialPost } from "./hindi-editorial-types";

/** Hindi versions of the 16 English editorial articles (11 PDF guides + 5 calculator/SEO guides). */
export const hindiEditorialPosts: readonly HindiEditorialPost[] = [
  ...hindiEditorialPostsA,
  ...hindiEditorialPostsB,
  ...hindiEditorialPostsC,
  ...hindiEditorialPostsD,
];

export function getHindiEditorialPost(slug: string): HindiEditorialPost | null {
  return hindiEditorialPosts.find((post) => post.slug === slug) ?? null;
}
