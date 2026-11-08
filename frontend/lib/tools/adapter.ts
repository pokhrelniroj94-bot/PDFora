import { toolCatalog, type ToolInfo } from "../../components/toolCatalog";
import { legacyToolSlugSet } from "../legacy-tool-slugs";

/**
 * Tool adapter for the localized tool route.
 *
 * Scope (this migration): the catalog utilities served at /tools/[slug]. Every one of them
 * is rendered by the EXISTING `ToolWorkspace` (default export of components/AllTools.tsx),
 * which dispatches to its own specialized handlers (ResumeBuilder,
 * MarketIntelligence, NepalTools, NepalLiveTools, NepaliTypingTool, QuickUtilityTools,
 * ExtraTools). This adapter does not render anything and does not replace those handlers;
 * it only decides whether a slug may be handed to ToolWorkspace at all.
 *
 * Not in scope yet: the 49 PDF tools. They are separate root pages that pass their props
 * (PDForaTool / Niroj77Tool) inline, so they are rejected here with "pdf-root-tool" instead
 * of being faked. When they are migrated, add a second, explicit `kind` to ToolImplementation
 * with the exact props types of those components; do not widen `catalog-workspace`.
 */

/** Catalog rows that are directory placeholders, not tools. */
export const RESERVED_CATALOG_SLUGS: ReadonlySet<string> = new Set(["pdf-tools"]);

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_SLUG_LENGTH = 80;

export type ToolRejectionReason =
  | "invalid-slug" // not a well-formed slug (wrong type, characters, length)
  | "reserved-entry" // directory placeholder such as "pdf-tools"
  | "pdf-root-tool" // implemented as a root PDF page; not served by this adapter yet
  | "unknown-tool" // not in the catalog
  | "incomplete-entry"; // catalog row is missing name, description or category

export interface CatalogWorkspaceImplementation {
  kind: "catalog-workspace";
  slug: string;
  entry: ToolInfo;
}

/** Discriminated union. Extend with new explicit kinds; never add a catch-all. */
export type ToolImplementation = CatalogWorkspaceImplementation;

export type ToolResolution =
  | { ok: true; implementation: ToolImplementation }
  | { ok: false; slug: string; reason: ToolRejectionReason };

function isCompleteEntry(entry: ToolInfo): boolean {
  return [entry.slug, entry.name, entry.description, entry.category].every((field) => typeof field === "string" && field.trim().length > 0);
}

/** Builds a resolver over a catalog. The default instance below is bound to the real catalog. */
export function createCatalogResolver(catalog: readonly ToolInfo[]): (slug: unknown) => ToolResolution {
  const bySlug = new Map<string, ToolInfo>();
  for (const entry of catalog) if (!bySlug.has(entry.slug)) bySlug.set(entry.slug, entry);

  return (slug) => {
    if (typeof slug !== "string" || slug.length === 0 || slug.length > MAX_SLUG_LENGTH || !SLUG_PATTERN.test(slug)) {
      return { ok: false, slug: typeof slug === "string" ? slug.slice(0, MAX_SLUG_LENGTH) : "", reason: "invalid-slug" };
    }
    if (RESERVED_CATALOG_SLUGS.has(slug)) return { ok: false, slug, reason: "reserved-entry" };
    if (legacyToolSlugSet.has(slug)) return { ok: false, slug, reason: "pdf-root-tool" };
    const entry = bySlug.get(slug);
    if (!entry) return { ok: false, slug, reason: "unknown-tool" };
    if (!isCompleteEntry(entry)) return { ok: false, slug, reason: "incomplete-entry" };
    return { ok: true, implementation: { kind: "catalog-workspace", slug, entry } };
  };
}

export const resolveCatalogTool = createCatalogResolver(toolCatalog);

/** Slugs the adapter accepts, derived from the real catalog (never a hard-coded list or count). */
export function listAdaptableSlugs(): string[] {
  return toolCatalog.map((entry) => entry.slug).filter((slug) => resolveCatalogTool(slug).ok);
}
