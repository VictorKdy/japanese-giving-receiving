import { HIRAGANA_MAP, MAP_REGEX } from "../data/hiraganaData.js";

// Helper to check if character is Kanji or Katakana (needs furigana)
export const needsFurigana = (text) => /[\u4e00-\u9faf\u30a0-\u30ff]/.test(text);

export const romajiToHiragana = (text) => {
  if (!text) return '';
  let converted = text.toLowerCase();

  // 1. Handle Sokuon (Double Consonants): 'tt' -> 'っt', 'kk' -> 'っk'
  // Excluding 'n' because 'nn' is 'ん'
  converted = converted.replace(/([bcdfghjklmpqrstvwxyz])\1/g, 'っ$1');

  // 2. Handle 'nn' -> 'ん' (must come BEFORE n+consonant rule)
  converted = converted.replace(/nn/g, 'ん');

  // 3. Handle 'n' followed by a consonant (except y) -> 'ん' + consonant
  // e.g., 'kanta' -> 'ka' 'n' 'ta' -> 'ka' 'ん' 'ta'
  converted = converted.replace(/n(?=[^aeiouy])/g, 'ん');

  // 4. Main Mapping Replacement
  converted = converted.replace(MAP_REGEX, (match) => HIRAGANA_MAP[match]);

  return converted;
};

// Helper to normalize Katakana to Hiragana for comparison
// Unicode Shift: Katakana (30A0-30FF) - 0x60 = Hiragana (3040-309F)
export const toHiragana = (str) => {
  return str.replace(/[\u30a1-\u30f6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
};

// Check if string contains only Hiragana and valid Japanese characters
export const isValidJapaneseInput = (str) => {
  // Allow hiragana, katakana, kanji, punctuation, and partial romaji being typed
  return /^[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3001-\u3003\u3005\u3007-\u3011a-zA-Z\s\-.,!?！？。、ー]*$/.test(str);
};
