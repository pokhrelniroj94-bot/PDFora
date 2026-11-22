/**
 * Local, pinned copy of the Nepalify runtime (v0.5.0, ISC License: see ./LICENSE).
 * Replaces the former runtime download from a public CDN, so the tool works without any third-party script.
 *
 * Nepalify is a KEYBOARD LAYOUT mapper: every pressed key becomes one fixed Devanagari character.
 * It is not a spelling-based (phonetic) transliterator: with the "romanized" layout "namaste" gives
 * "नामासते", and "nms/te" (where "/" is the halant) gives "नमस्ते".
 */
import romanized from "./romanized";
import traditional from "./traditional";
import type { NepalifyFormatOptions, NepalifyLayout, NepalifyLayoutName } from "./types";

export type { NepalifyFormatOptions, NepalifyLayout, NepalifyLayoutName } from "./types";

const layoutStore: Readonly<Record<NepalifyLayoutName, NepalifyLayout>> = { romanized, traditional };

export const defaultLayout: NepalifyLayoutName = "romanized";

export function availableLayouts(): NepalifyLayoutName[] {
  return Object.keys(layoutStore) as NepalifyLayoutName[];
}

export function isValidLayout(layout: unknown): layout is NepalifyLayoutName {
  return typeof layout === "string" && (availableLayouts() as string[]).includes(layout);
}

export function fetchLayout(layout: unknown): NepalifyLayout {
  if (!isValidLayout(layout)) throw new Error("Invalid Layout : " + String(layout));
  return layoutStore[layout];
}

/** Maps every character of `text` through the layout; characters without a mapping are kept unchanged. */
export function format(text: unknown, options: NepalifyFormatOptions = {}): string {
  const layout = fetchLayout(options.layout ?? defaultLayout);
  return Array.from(String(text), (character) => layout.formatKey(character) ?? character).join("");
}

const nepalify = { format, availableLayouts };
export default nepalify;
