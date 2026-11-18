/*
 * Romanized keyboard layout adapted from Nepalify 0.5.0.
 * Original project: https://github.com/suvash/nepalify
 * ISC License, Copyright (c) 2020 Suvash Thapaliya.
 * The ISC license text is in nepali-typing-LICENSE.txt.
 */
const keyToNep: Record<string, string> = {
  "a": "\u093E", "b": "\u092C", "c": "\u091B", "d": "\u0926", "e": "\u0947", "f": "\u0909",
  "g": "\u0917", "h": "\u0939", "i": "\u093F", "j": "\u091C", "k": "\u0915", "l": "\u0932",
  "m": "\u092E", "n": "\u0928", "o": "\u094B", "p": "\u092A", "q": "\u091F", "r": "\u0930",
  "s": "\u0938", "t": "\u0924", "u": "\u0941", "v": "\u0935", "w": "\u094C", "x": "\u0921",
  "y": "\u092F", "z": "\u0937",
  "A": "\u0906", "B": "\u092D", "C": "\u091A", "D": "\u0927", "E": "\u0948", "F": "\u090A",
  "G": "\u0918", "H": "\u0905", "I": "\u0940", "J": "\u091D", "K": "\u0916", "L": "\u0933",
  "M": "\u0902", "N": "\u0923", "O": "\u0913", "P": "\u092B", "Q": "\u0920", "R": "\u0943",
  "S": "\u0936", "T": "\u0925", "U": "\u0942", "V": "\u0901", "W": "\u0914", "X": "\u0922",
  "Y": "\u091E", "Z": "\u090B",
  "0": "\u0966", "1": "\u0967", "2": "\u0968", "3": "\u0969", "4": "\u096A",
  "5": "\u096B", "6": "\u096C", "7": "\u096D", "8": "\u096E", "9": "\u096F",
  "^": "^", "`": "\u093D", "~": "\u093C", "_": "\u0952", "+": "\u200C", "=": "\u200D",
  "[": "\u0907", "{": "\u0908", "]": "\u090F", "}": "\u0910", "\\": "\u0950",
  "|": "\u0903", "<": "\u0919", ".": "\u0964", ">": "\u0965", "/": "\u094D", "?": "?",
};

export function formatNepaliRomanized(value: string): string {
  return Array.from(String(value), (character) => keyToNep[character] ?? character).join("");
}
