import { toHiragana } from './hiraganaUtils';

// Helper to check if character is Kanji or Katakana (needs furigana)
export const needsFurigana = (text) => /[\u4e00-\u9faf\u30a0-\u30ff]/.test(text);

// Get hiragana reading from furigana data (works for both items and entities)
export const getReading = (obj) => {
  if (!obj.furigana) return obj.name;
  return obj.furigana.map(f => f.rt || toHiragana(f.text)).join('');
};

// Normalize input: convert to hiragana and remove spaces
export const normalizeInput = (str) => toHiragana(str).replace(/\s+/g, '').trim();
