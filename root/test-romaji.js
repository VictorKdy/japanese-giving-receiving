// Test file for romaji conversion
const HIRAGANA_MAP = {
  'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
  'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
  'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
  'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
  'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
  'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
  'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
  'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
  'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
  'wa': 'わ', 'wo': 'を',
  'nn': 'ん',
  'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
  'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
  'da': 'だ', 'de': 'で', 'do': 'ど',
  'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
  'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
  'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
  'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ',
  'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'ちょ',
  'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
  'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
  'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
  'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',
  'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
  'ja': 'じゃ', 'ju': 'じゅ', 'jo': 'じょ',
  'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
  'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': 'ぴょ',
  '-': 'ー', '.': '。', ',': '、', '?': '？', '!': '！'
};

// Stateful parser
const romajiToHiragana = (text) => {
  if (!text) return '';
  const input = text.toLowerCase();
  let result = '';
  let buffer = '';
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    buffer += char;
    
    // Rule 1: 'nn' -> commit 'ん', keep 'n' in buffer
    if (buffer === 'nn') {
      result += 'ん';
      buffer = 'n'; // Keep one 'n' for potential next syllable
      continue;
    }
    
    // Check if buffer is just 'n' - hold and wait for next char
    if (buffer === 'n') {
      continue;
    }
    
    // If we have a pending 'n' followed by something
    if (buffer.length >= 2 && buffer[0] === 'n') {
      const nextChar = buffer[1];
      // If next char is a vowel, keep buffering for na/ni/nu/ne/no
      if ('aeiou'.includes(nextChar)) {
        if (HIRAGANA_MAP[buffer]) {
          result += HIRAGANA_MAP[buffer];
          buffer = '';
          continue;
        }
        continue;
      }
      // If next char is 'y', keep buffering for nya/nyu/nyo
      if (nextChar === 'y') {
        continue;
      }
      // If next char is another consonant - parse 'n' as 'ん'
      result += 'ん';
      buffer = buffer.slice(1);
    }
    
    // Try to match longest possible pattern from buffer
    let matched = false;
    for (let len = buffer.length; len > 0; len--) {
      const tryMatch = buffer.slice(0, len);
      if (HIRAGANA_MAP[tryMatch]) {
        result += HIRAGANA_MAP[tryMatch];
        buffer = buffer.slice(len);
        matched = true;
        break;
      }
    }
    
    // Handle sokuon (double consonants)
    if (!matched && buffer.length >= 2) {
      const first = buffer[0];
      const second = buffer[1];
      if (first === second && 'bcdfghjklmpqrstvwxyz'.includes(first)) {
        result += 'っ';
        buffer = buffer.slice(1);
      }
    }
  }
  
  // Handle remaining buffer
  if (buffer === 'n') {
    result += 'ん';
  } else if (buffer.length > 0) {
    if (HIRAGANA_MAP[buffer]) {
      result += HIRAGANA_MAP[buffer];
    } else {
      result += buffer;
    }
  }
  
  return result;
};

console.log('=== Romaji to Hiragana Tests ===');
console.log('no ->', romajiToHiragana('no'), '| Expected: の');
console.log('nn ->', romajiToHiragana('nn'), '| Expected: ん');
console.log('nani ->', romajiToHiragana('nani'), '| Expected: なに');
console.log('nya ->', romajiToHiragana('nya'), '| Expected: にゃ');
console.log('n ->', romajiToHiragana('n'), '| Expected: ん');
console.log('kantan ->', romajiToHiragana('kantan'), '| Expected: かんたん');
console.log('onna ->', romajiToHiragana('onna'), '| Expected: おんな');
console.log('sentaku ->', romajiToHiragana('sentaku'), '| Expected: せんたく');
console.log('kitte ->', romajiToHiragana('kitte'), '| Expected: きって');
console.log('gakkou ->', romajiToHiragana('gakkou'), '| Expected: がっこう');
console.log('nna ->', romajiToHiragana('nna'), '| Expected: んな (nn commits ん, n+a=な)');
console.log('onnna ->', romajiToHiragana('onnna'), '| Expected: おんな (o+nn→おん, n+a=な)');
