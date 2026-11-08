import assert from "node:assert/strict";
import { WATCHLIST_LIMIT, WATCHLIST_STORAGE_KEY, createWatchlistStore, normalizeSymbol, parseWatchlist } from "../lib/nepse-watchlist.ts";

const memoryStorage = () => { const data = new Map(); return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, String(v)), data }; };

// Parsing is defensive and never throws.
assert.deepEqual(parseWatchlist(null), []);
assert.deepEqual(parseWatchlist("not json"), []);
assert.deepEqual(parseWatchlist('{"a":1}'), []);
assert.deepEqual(parseWatchlist('["NABIL","nabil","NABIL","A","BAD SYM",5,null,"HRL"]'), ["NABIL", "HRL"], "invalid, lower-case, single-char and duplicate entries are dropped");
assert.equal(parseWatchlist(JSON.stringify(Array.from({ length: 40 }, (_, i) => `SYM${i}`))).length, WATCHLIST_LIMIT, "persisted data is capped at 20");
assert.equal(normalizeSymbol("  nab-il! "), "NABIL");
assert.equal(normalizeSymbol(42), "");

// Add / remove / limits / persistence.
const storage = memoryStorage();
const store = createWatchlistStore(() => storage);
assert.equal(store.getSnapshot(), null);
assert.equal(store.getServerSnapshot(), null, "server snapshot is empty, so hydration matches");
assert.equal(store.add("nabil"), "added");
assert.equal(store.add("NABIL"), "duplicate");
assert.equal(store.add("x"), "invalid");
assert.equal(store.add("<script>"), "added", "markup is stripped to letters/digits, never stored as markup");
assert.deepEqual(parseWatchlist(storage.data.get(WATCHLIST_STORAGE_KEY)), ["NABIL", "SCRIPT"]);
assert.equal(store.remove("script"), "removed");
assert.equal(store.remove("script"), "missing");
for (let i = 0; i < 30; i++) store.add(`SYM${i}`);
assert.equal(parseWatchlist(store.getSnapshot()).length, WATCHLIST_LIMIT, "never exceeds 20 symbols");
assert.equal(store.add("EXTRA"), "limit");

// Subscribers are notified on change only, and unsubscribing works.
let calls = 0;
const unsubscribe = store.subscribe(() => calls++);
store.remove("NABIL");
assert.equal(calls, 1);
store.add("NABIL"); store.add("NABIL");
assert.equal(calls, 2, "duplicate adds do not notify");
unsubscribe();
store.remove("NABIL");
assert.equal(calls, 2);

// A second store over the same storage sees persisted data (reload).
assert.ok(parseWatchlist(createWatchlistStore(() => storage).getSnapshot()).length > 0);

// If persistence is refused (private mode / quota) the list still works for the session.
const broken = createWatchlistStore(() => ({ getItem() { throw new Error("denied"); }, setItem() { throw new Error("denied"); } }));
assert.equal(broken.add("NABIL"), "added");
assert.deepEqual(parseWatchlist(broken.getSnapshot()), ["NABIL"]);
const noStorage = createWatchlistStore(() => null);
assert.equal(noStorage.add("HRL"), "added");
assert.deepEqual(parseWatchlist(noStorage.getSnapshot()), ["HRL"]);

console.log("NEPSE watchlist store tests passed: validation, 20-symbol cap, persistence, notifications and storage-failure fallback.");
