/**
 * Vendored from Nepalify v0.5.0 (https://github.com/suvash/nepalify, commit 0f6ff54dc9a3c84f165bb558a056b2bdfb55d7db).
 * Copyright (c) 2020, Suvash Thapaliya. ISC License: see ./LICENSE.
 * Local changes: converted to TypeScript; the key map below is copied unchanged from upstream
 * src/layouts/romanized/index.js (sha256 d7d9e21aba29f360).
 */

import type { NepalifyLayout } from "./types";

// prettier-ignore
const keyToNep: Readonly<Record<string, string>> = {
  //
  "a": "\u093E", // ा
  "b": "\u092C", // ब
  "c": "\u091B", // छ
  "d": "\u0926", // द
  "e": "\u0947", // े
  "f": "\u0909", // उ
  "g": "\u0917", // ग
  "h": "\u0939", // ह
  "i": "\u093F", // ि
  "j": "\u091C", // ज
  "k": "\u0915", // क
  "l": "\u0932", // ल
  "m": "\u092E", // म
  "n": "\u0928", // न
  "o": "\u094B", // ो
  "p": "\u092A", // प
  "q": "\u091F", // ट
  "r": "\u0930", // र
  "s": "\u0938", // स
  "t": "\u0924", // त
  "u": "\u0941", // ु
  "v": "\u0935", // व
  "w": "\u094C", // ौ
  "x": "\u0921", // ड
  "y": "\u092F", // य
  "z": "\u0937", // ष
  //
  "A": "\u0906", // आ
  "B": "\u092D", // भ
  "C": "\u091A", // च
  "D": "\u0927", // ध
  "E": "\u0948", // ै
  "F": "\u090A", // ऊ
  "G": "\u0918", // घ
  "H": "\u0905", // अ
  "I": "\u0940", // ी
  "J": "\u091D", // झ
  "K": "\u0916", // ख
  "L": "\u0933", // ळ
  "M": "\u0902", // ं
  "N": "\u0923", // ण
  "O": "\u0913", // ओ
  "P": "\u092B", // फ
  "Q": "\u0920", // ठ
  "R": "\u0943", // ृ
  "S": "\u0936", // श
  "T": "\u0925", // थ
  "U": "\u0942", // ू
  "V": "\u0901", // ँ
  "W": "\u0914", // औ
  "X": "\u0922", // ढ
  "Y": "\u091E", // ञ
  "Z": "\u090B", // ऋ
  //
  "0": "\u0966", // ०
  "1": "\u0967", // १
  "2": "\u0968", // २
  "3": "\u0969", // ३
  "4": "\u096A", // ४
  "5": "\u096B", // ५
  "6": "\u096C", // ६
  "7": "\u096D", // ७
  "8": "\u096E", // ८
  "9": "\u096F", // ९
  //
  "^": "\u005E", // ^
  //
  "`": "\u093D", // ऽ
  "~": "\u093C", // ़
  //
  "_": "\u0952", // ॒
  //
  "+": "\u200C", // ZWNJ
  "=": "\u200D", // ZWJ
  //
  "[": "\u0907", // इ
  "{": "\u0908", // ई
  //
  "]": "\u090F", // ए
  "}": "\u0910", // ऐ
  //
  "\\": "\u0950", // ॐ
  "|": "\u0903", // ः
  //
  "<": "\u0919", // ङ
  //
  ".": "\u0964", // ।
  ">": "\u0965", // ॥
  //
  "/": "\u094D", // ्
  "?": "\u003F", // ?
};

const layout: NepalifyLayout = {
  name: "romanized",
  formatKey: (key: string): string | undefined => Object.prototype.hasOwnProperty.call(keyToNep, key) ? keyToNep[key] : undefined,
};

export default layout;
