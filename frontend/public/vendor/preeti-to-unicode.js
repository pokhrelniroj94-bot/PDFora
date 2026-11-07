/**
 * Preeti Font to Unicode Converter
 * Converts Preeti ANSI font text to Unicode Devanagari script
 *
 * Usage:
 *   const converter = new PreetiConverter();
 *   const result = converter.convert("k\\/Llt");  // "प्रीति"
 *
 * Character map and post-processing rules based on:
 *   https://github.com/Shuvayatra/preeti
 *   https://github.com/casualsnek/npttf2utf
 *
 * @version 2.0.0
 */

class PreetiConverter {
  constructor() {
    this.initializeMapping();
  }

  initializeMapping() {
    // Standard Preeti character map (Shuvayatra/npttf2utf standard)
    // Note: 'm' and '{' are intentionally absent — they are handled by postRules
    this.preetiMap = {
      'a':'ब', 'A':'ब्', 'b':'द', 'B':'द्य', 'c':'अ', 'C':'ऋ',
      'd':'म', 'D':'म्', 'e':'भ', 'E':'भ्', 'f':'ा', 'F':'ँ',
      'g':'न', 'G':'न्', 'h':'ज', 'H':'ज्', 'i':'ष्',
      'j':'व', 'J':'व्', 'k':'प', 'K':'प्', 'l':'ि', 'L':'ी',
      'M':'ः', 'n':'ल', 'N':'ल्', 'o':'य', 'O':'इ',
      'p':'उ', 'P':'ए', 'q':'त्र', 'Q':'त्त', 'r':'च', 'R':'च्',
      's':'क', 'S':'क्', 't':'त', 'T':'त्', 'u':'ग', 'U':'ग्',
      'v':'ख', 'V':'ख्', 'w':'ध', 'W':'ध्', 'x':'ह', 'X':'ह्',
      'y':'थ', 'Y':'थ्', 'z':'श', 'Z':'श्',
      '/':'र', '\\':'्', '|':'्र',
      ';':'स', ':':'स्', "'": 'ु', '"':'ू',
      '[':'ृ', ']':'े', '}':'ै', '+':'ं',
      ',':',', '.':'।', '?':'रु', '>':'श्र',
      '<':'?', '_':')', '-':'(', '=':'.', '`':'ञ', '~':'ञ्',
      '0':'ण्', '1':'ज्ञ', '2':'द्द', '3':'घ', '4':'द्ध',
      '5':'छ',  '6':'ट',   '7':'ठ',   '8':'ड',  '9':'ढ',
      '!':'१', '@':'२', '#':'३', '$':'४', '%':'५',
      '^':'६', '&':'७', '*':'८', '(':'९', ')':'०',
      'ª':'ङ',  '´':'झ',   '¿':'रू',  '«':'्र', '•':'ड्ड',
      '˜':'ऽ',  '›':'द्र', '¡':'ज्ञ्','¢':'द्घ','£':'घ्',
      '¤':'झ्', '¥':'्र',  '§':'ट्ट', '©':'र',   '°':'ङ्ढ',
      '±':'+',  '¶':'ठ्ठ', 'Å':'हृ',  'Ë':'ङ्ग','Ì':'न्न',
      'Í':'ङ्क','Î':'ङ्ख', 'Ø':'्य',  'Ý':'ट्ठ','ß':'द्म',
      'å':'द्व','ç':'ॐ',   '÷':'/',   '„':'ध्र','‰':'झ्',
      '‹':'ङ्घ','‘':'ॅ'
    };

    this.postRules = [
      ['्ा', ''],
      ['(त्र|त्त)([^उभप]+?)m', '$1m$2'],
      ['त्रm', 'क्र'],
      ['त्तm', 'क्त'],
      ['([^उभप]+?)m', 'm$1'],
      ['उm', 'ऊ'],
      ['भm', 'झ'],
      ['पm', 'फ'],
      ['इ{', 'ई'],
      ['ि((.्)*[^्])', '$1ि'],
      ['(.[ािीुूृेैोौंःँ]*?){', '{$1'],
      ['((.्)*){', '{$1'],
      ['{', 'र्'],
      ['([ाीुूृेैोौंःँ]+?)(्(.्)*[^्])', '$2$1'],
      ['्([ाीुूृेैोौंःँ]+?)((.्)*[^्])', '्$2$1'],
      ['([ंँ])([ािीुूृेैोौः]*)', '$2$1'],
      ['ँँ', 'ँ'], ['ंं', 'ं'],
      ['ेे', 'े'], ['ैै', 'ै'],
      ['ुु', 'ु'], ['ूू', 'ू'],
      ['^ः', ':'], ['टृ', 'ट्ट'],
      ['ेा', 'ाे'], ['ैा', 'ाै'],
      ['अाे', 'ओ'], ['अाै', 'औ'], ['अा', 'आ'],
      ['एे', 'ऐ'], ['ाे', 'ो'], ['ाै', 'ौ']
    ];
  }

  convert(preetiText) {
    if (!preetiText) return '';
    let result = '';
    for (let i = 0; i < preetiText.length; i++) {
      const ch = preetiText[i];
      result += this.preetiMap[ch] !== undefined ? this.preetiMap[ch] : ch;
    }
    for (const [pattern, replacement] of this.postRules) {
      result = result.replace(new RegExp(pattern, 'g'), replacement);
    }
    return result;
  }

  convertBatch(texts) {
    return texts.map(text => this.convert(text));
  }

  addCustomMapping(preetiChar, unicodeChar) {
    this.preetiMap[preetiChar] = unicodeChar;
  }

  addCustomConjunct(preetiKey, unicodeValue) {
    this.preetiMap[preetiKey] = unicodeValue;
  }

  getMappings() {
    return {
      characters: this.preetiMap,
      postRules: this.postRules
    };
  }

  getMapping(char) {
    return this.preetiMap[char] || null;
  }

  reverseConvert(unicodeText) {
    if (!unicodeText) return '';
    const reverseMap = {};
    for (const [key, value] of Object.entries(this.preetiMap)) {
      if (!reverseMap[value]) reverseMap[value] = key;
    }
    let preetiText = '';
    for (const char of unicodeText) {
      preetiText += reverseMap[char] || char;
    }
    return preetiText;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PreetiConverter;
}

if (typeof exports !== 'undefined') {
  exports.PreetiConverter = PreetiConverter;
}


// Expose the converter for the existing browser-side integration.
// This source is vendored locally under the upstream MIT license.
if (typeof window !== "undefined") {
  window.PreetiConverter = PreetiConverter;
}
