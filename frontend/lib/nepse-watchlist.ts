// Browser-local NEPSE watchlist. Symbols never leave the device: nothing here talks to a server.
// The store is shaped for React's useSyncExternalStore so persisted state is read without a
// setState-in-effect and without a server/client hydration mismatch.

export const WATCHLIST_STORAGE_KEY = "pdfora-nepse-watchlist";
export const WATCHLIST_LIMIT = 20;
const SYMBOL_PATTERN = /^[A-Z0-9]{2,16}$/;

export type WatchlistResult = "added" | "removed" | "duplicate" | "limit" | "invalid" | "missing";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

/** Normalises user input to a candidate symbol (upper-case letters and digits only). */
export function normalizeSymbol(raw: unknown): string {
  return typeof raw === "string" ? raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16) : "";
}

export function isValidSymbol(symbol: string): boolean {
  return SYMBOL_PATTERN.test(symbol);
}

/** Parses persisted JSON defensively: bad JSON, non-arrays, invalid, duplicate or surplus symbols are dropped. */
export function parseWatchlist(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter((item): item is string => typeof item === "string" && SYMBOL_PATTERN.test(item));
    return [...new Set(valid)].slice(0, WATCHLIST_LIMIT);
  } catch {
    return [];
  }
}

export function createWatchlistStore(getStorage: () => StorageLike | null) {
  const listeners = new Set<() => void>();
  let memoryRaw: string | null = null; // used only if the browser refuses to persist (private mode, quota)
  let useMemory = false;

  const read = (): string | null => {
    if (useMemory) return memoryRaw;
    try {
      return getStorage()?.getItem(WATCHLIST_STORAGE_KEY) ?? null;
    } catch {
      return memoryRaw;
    }
  };
  const notify = () => listeners.forEach((listener) => listener());
  const write = (symbols: string[]) => {
    const raw = JSON.stringify(symbols);
    try {
      const storage = getStorage();
      if (!storage) throw new Error("storage unavailable");
      storage.setItem(WATCHLIST_STORAGE_KEY, raw);
    } catch {
      memoryRaw = raw;
      useMemory = true;
    }
    notify();
  };

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === WATCHLIST_STORAGE_KEY) listener();
      };
      if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
      };
    },
    /** Snapshot is the raw persisted string (a stable primitive); parse it with parseWatchlist. */
    getSnapshot: read,
    getServerSnapshot: (): string | null => null,
    add(raw: string): WatchlistResult {
      const symbol = normalizeSymbol(raw);
      if (!isValidSymbol(symbol)) return "invalid";
      const current = parseWatchlist(read());
      if (current.includes(symbol)) return "duplicate";
      if (current.length >= WATCHLIST_LIMIT) return "limit";
      write([...current, symbol]);
      return "added";
    },
    remove(raw: string): WatchlistResult {
      const symbol = normalizeSymbol(raw);
      const current = parseWatchlist(read());
      if (!current.includes(symbol)) return "missing";
      write(current.filter((item) => item !== symbol));
      return "removed";
    },
  };
}

export const watchlistStore = createWatchlistStore(() => (typeof window === "undefined" ? null : window.localStorage));
