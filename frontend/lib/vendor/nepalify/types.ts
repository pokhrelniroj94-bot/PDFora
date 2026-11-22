export type NepalifyLayoutName = "romanized" | "traditional";

export interface NepalifyLayout {
  name: NepalifyLayoutName;
  /** Devanagari output for one pressed key, or undefined when the key is not mapped. */
  formatKey: (key: string) => string | undefined;
}

export interface NepalifyFormatOptions {
  layout?: NepalifyLayoutName;
}
