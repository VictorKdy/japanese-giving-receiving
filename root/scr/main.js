import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowRight, User, Gift, Book, Apple, Coffee, 
  RefreshCw, CheckCircle, XCircle, Settings, 
  Menu, Flame, Trophy, Mail, Banknote, Cookie, Flower,
  GraduationCap, Briefcase, Smile, UserCheck, CheckCheck
} from 'lucide-react';
import './index.css';

// --- Hiragana Conversion Data ---
const HIRAGANA_MAP = {
  // Basic Vowels
  'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
  // K
  'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
  // S
  'sa': 'さ', 'shi': 'し', 'si': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
  // T
  'ta': 'た', 'chi': 'ち', 'ti': 'ち', 'tsu': 'つ', 'tu': 'つ', 'te': 'て', 'to': 'と',
  // N
  'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
  // H
  'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'hu': 'ふ', 'he': 'へ', 'ho': 'ほ',
  // M
  'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
  // Y
  'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
  // R
  'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
  // W
  'wa': 'わ', 'wo': 'を',
  // N singular
  'nn': 'ん', 
  // G
  'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
  // Z
  'za': 'ざ', 'ji': 'じ', 'zi': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
  // D
  'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
  // B
  'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
  // P
  'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
  // Compounds (Small Y)
  'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
  'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ',
  'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'ちょ',
  'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
  'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
  'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
  'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',
  'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
  'ja': 'じゃ', 'ju': 'じゅ', 'jo': 'じょ', 'jya': 'じゃ', 'jyu': 'じゅ', 'jyo': 'じょ',
  'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
  'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': 'ぴょ',
  // Small Tsu
  'ltu': 'っ', 'xtu': 'っ',
  // Small Vowels
  'la': 'ぁ', 'li': 'ぃ', 'lu': 'ぅ', 'le': 'ぇ', 'lo': 'ぉ',
  'xa': 'ぁ', 'xi': 'ぃ', 'xu': 'ぅ', 'xe': 'ぇ', 'xo': 'ぉ',
  // Punctuation
  '-': 'ー', '.': '。', ',': '、', '?': '？', '!': '！'
};

// Hiragana conversion helper
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MAP_KEYS = Object.keys(HIRAGANA_MAP).sort((a, b) => b.length - a.length);
const MAP_REGEX = new RegExp(MAP_KEYS.map(escapeRegExp).join('|'), 'g');

const romajiToHiragana = (text) => {
  if (!text) return '';
  let converted = text.toLowerCase();
  // Handle Sokuon (Double Consonants)
  converted = converted.replace(/([bcdfghjklmpqrstvwxyz])\1/g, 'っ$1');
  // Handle 'nn' -> 'ん'
  converted = converted.replace(/nn/g, 'ん');
  // Handle 'n' followed by a consonant (except y)
  converted = converted.replace(/n(?=[^aeiouy])/g, 'ん');
  // Main Mapping Replacement
  converted = converted.replace(MAP_REGEX, (match) => HIRAGANA_MAP[match]);
  return converted;
};

// Check if string contains only Hiragana and valid Japanese characters
const isValidJapaneseInput = (str) => {
  // Allow hiragana, katakana, kanji, punctuation, and partial romaji being typed
  return /^[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3001-\u3003\u3005\u3007-\u3011a-zA-Z\s\-.,!?！？。、ー]*$/.test(str);
};

// Helper to normalize Katakana to Hiragana for comparison
// Unicode Shift: Katakana (30A0-30FF) - 0x60 = Hiragana (3040-309F)
const toHiragana = (str) => {
  return str.replace(/[\u30a1-\u30f6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
};

// Check if string contains only Hiragana characters (strict validation)
const isHiraganaOnly = (str) => /^[\u3041-\u3096]+$/u.test(str);

// --- Validation Error Messages (Localized) ---
const VALIDATION_ERRORS = {
  sentenceTooShort: {
    ja: '文が短すぎます。',
    en: 'Sentence is too short.'
  },
  missingTopic: {
    ja: (name) => `主題から始めてください：${name}は...`,
    en: (name) => `Start with the topic: ${name}は...`
  },
  missingObject: {
    ja: (name) => `目的語を含めてください：${name}を...`,
    en: (name) => `Include the object: ${name}を...`
  },
  noActionDefined: {
    ja: 'エラー：アクションが定義されていません。',
    en: 'Error: No action defined.'
  },
  wrongTeForm: {
    ja: (te, label) => `正しいて形を使ってください：${te}（${label}）`,
    en: (te, label) => `Use the correct Te-form action: ${te} (${label})`
  },
  teFormConnection: {
    ja: (te, verb) => `て形を動詞に直接つなげてください：${te}${verb}`,
    en: (te, verb) => `Connect the te-form directly to the verb: ${te}${verb}`
  },
  useKuremasu: {
    ja: '自分がもらう時は「くれます」を使います。',
    en: "Use 'くれます' when someone gives to YOU."
  },
  useAgemasu: {
    ja: '他の人にあげる時は「あげます」を使います。',
    en: "Use 'あげます' when the subject gives to someone else."
  },
  subjectIsGiving: {
    ja: '主語はあげる側です。「もらいます」は使いません。',
    en: "Subject is giving, not receiving. Don't use 'もらいます'."
  },
  subjectIsReceiving: {
    ja: '主語はもらう側です。「もらいます」を使ってください。',
    en: "Subject is receiving. Use 'もらいます'."
  },
  incorrectVerb: {
    ja: (verb) => `補助動詞が違います。正解：...${verb}`,
    en: (verb) => `Incorrect auxiliary verb. Expected: ...${verb}`
  },
  markSource: {
    ja: (name) => `出所（${name}）に「に」か「から」をつけてください。`,
    en: (name) => `Mark the source (${name}) with 'に' or 'から'.`
  },
  markRecipient: {
    ja: (name) => `受取人（${name}）に「に」をつけてください。`,
    en: (name) => `Mark the recipient (${name}) with 'に'.`
  },
  perfect: {
    ja: '完璧！',
    en: 'Perfect!'
  }
};

// Helper to get localized error message
const getErrorMessage = (errorKey, showEnglish, ...args) => {
  const error = VALIDATION_ERRORS[errorKey];
  if (!error) return '';
  
  const jaText = typeof error.ja === 'function' ? error.ja(...args) : error.ja;
  const enText = typeof error.en === 'function' ? error.en(...args) : error.en;
  
  if (showEnglish) {
    return { primary: jaText, subtitle: enText };
  }
  return { primary: jaText, subtitle: null };
};

// Helper to get item reading in hiragana from furigana data
const getItemReading = (item) => {
  if (!item.furigana) return item.name;
  return item.furigana.map(f => f.rt || toHiragana(f.text)).join('');
};

// Helper to get entity reading in hiragana from furigana data  
const getEntityReading = (entity) => {
  if (!entity.furigana) return entity.name;
  return entity.furigana.map(f => f.rt || toHiragana(f.text)).join('');
};

// --- Custom Hooks ---

// useClickOutside - detects clicks outside a ref element
function useClickOutside(callback) {
  const ref = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);
  
  return ref;
}

// useKeyboardShortcuts - handles global keyboard events for navigation
function useKeyboardShortcuts({ isCorrect, onNext, onCheck, inputRef }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if we're typing in the input
      if (document.activeElement === inputRef?.current) {
        return;
      }
      
      // Enter to proceed to next when answer is correct
      if (e.key === 'Enter' && isCorrect) {
        e.preventDefault();
        onNext();
      }
      
      // Space to check answer when not in input
      if (e.key === ' ' && !isCorrect) {
        e.preventDefault();
        onCheck();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCorrect, onNext, onCheck, inputRef]);
}

// --- Game Data ---

const ENTITIES = [
  { 
    id: 'me', 
    name: '私', 
    furigana: [
      { text: '私', rt: 'わたし' }
    ],
    label: 'Me', 
    type: 'self', 
    icon: User 
  },
  { 
    id: 'tanaka', 
    name: '田中さん', 
    furigana: [
      { text: '田中', rt: 'たなか' },
      { text: 'さん', rt: '' }
    ], 
    label: 'Tanaka-san', 
    type: 'other', 
    icon: Briefcase 
  },
  { 
    id: 'satou', 
    name: '佐藤さん', 
    furigana: [
      { text: '佐藤', rt: 'さとう' },
      { text: 'さん', rt: '' }
    ], 
    label: 'Satou-san', 
    type: 'other', 
    icon: UserCheck 
  },
  { 
    id: 'sensei', 
    name: '先生', 
    furigana: [
      { text: '先生', rt: 'せんせい' }
    ], 
    label: 'Teacher', 
    type: 'other', 
    icon: GraduationCap 
  },
  { 
    id: 'tomodachi', 
    name: '友達', 
    furigana: [
      { text: '友達', rt: 'ともだち' }
    ], 
    label: 'Friend', 
    type: 'other', 
    icon: Smile 
  },
];

const ITEMS = [
  { 
    id: 'book', 
    name: '本', 
    furigana: [
      { text: '本', rt: 'ほん' }
    ], 
    label: 'Book', 
    icon: Book,
    actions: [
      { 
        te: '貸して', 
        furigana: [
          { text: '貸', rt: 'か' },
          { text: 'して', rt: '' }
        ], 
        label: 'Lend', 
        meaning: 'Lending a book' 
      },
      { 
        te: '読んで', 
        furigana: [
          { text: '読', rt: 'よ' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Read', 
        meaning: 'Reading to someone' 
      },
      { 
        te: '選んで', 
        furigana: [
          { text: '選', rt: 'えら' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Choose', 
        meaning: 'Choosing a book' 
      },
      { 
        te: '買って', 
        furigana: [
          { text: '買', rt: 'か' },
          { text: 'って', rt: '' }
        ], 
        label: 'Buy', 
        meaning: 'Buying a book' 
      }
    ]
  },
  { 
    id: 'present', 
    name: 'プレゼント', 
    furigana: [
      { text: 'プレゼント', rt: 'ぷれぜんと' }
    ], 
    label: 'Present', 
    icon: Gift,
    actions: [
      { 
        te: '包んで', 
        furigana: [
          { text: '包', rt: 'つつ' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Wrap', 
        meaning: 'Wrapping a gift' 
      },
      { 
        te: '選んで', 
        furigana: [
          { text: '選', rt: 'えら' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Choose', 
        meaning: 'Choosing a gift' 
      },
      { 
        te: '送って', 
        furigana: [
          { text: '送', rt: 'おく' },
          { text: 'って', rt: '' }
        ], 
        label: 'Send', 
        meaning: 'Sending a gift' 
      },
      { 
        te: '隠して', 
        furigana: [
          { text: '隠', rt: 'かく' },
          { text: 'して', rt: '' }
        ], 
        label: 'Hide', 
        meaning: 'Hiding a surprise' 
      }
    ]
  },
  { 
    id: 'apple', 
    name: 'りんご', 
    furigana: [
      { text: 'りんご', rt: '' }
    ], 
    label: 'Apple', 
    icon: Apple,
    actions: [
      { 
        te: '切って', 
        furigana: [
          { text: '切', rt: 'き' },
          { text: 'って', rt: '' }
        ], 
        label: 'Cut', 
        meaning: 'Cutting an apple' 
      },
      { 
        te: '洗って', 
        furigana: [
          { text: '洗', rt: 'あら' },
          { text: 'って', rt: '' }
        ], 
        label: 'Wash', 
        meaning: 'Washing fruit' 
      },
      { 
        te: '剥いて', 
        furigana: [
          { text: '剥', rt: 'む' },
          { text: 'いて', rt: '' }
        ], 
        label: 'Peel', 
        meaning: 'Peeling fruit' 
      },
      { 
        te: '送って', 
        furigana: [
          { text: '送', rt: 'おく' },
          { text: 'って', rt: '' }
        ], 
        label: 'Send', 
        meaning: 'Sending apples' 
      }
    ]
  },
  { 
    id: 'coffee', 
    name: 'コーヒー', 
    furigana: [
      { text: 'コーヒー', rt: 'こーひー' }
    ], 
    label: 'Coffee', 
    icon: Coffee,
    actions: [
      { 
        te: '淹れて', 
        furigana: [
          { text: '淹', rt: 'い' },
          { text: 'れて', rt: '' }
        ], 
        label: 'Brew', 
        meaning: 'Brewing coffee' 
      },
      { 
        te: '買って', 
        furigana: [
          { text: '買', rt: 'か' },
          { text: 'って', rt: '' }
        ], 
        label: 'Buy', 
        meaning: 'Buying coffee' 
      },
      { 
        te: '持ってきて', 
        furigana: [
          { text: '持', rt: 'も' },
          { text: 'ってきて', rt: '' }
        ], 
        label: 'Bring', 
        meaning: 'Bringing coffee' 
      },
      { 
        te: '注文して', 
        furigana: [
          { text: '注文', rt: 'ちゅうもん' },
          { text: 'して', rt: '' }
        ], 
        label: 'Order', 
        meaning: 'Ordering coffee' 
      }
    ]
  },
  { 
    id: 'letter', 
    name: '手紙', 
    furigana: [
      { text: '手紙', rt: 'てがみ' }
    ], 
    label: 'Letter', 
    icon: Mail,
    actions: [
      { 
        te: '書いて', 
        furigana: [
          { text: '書', rt: 'か' },
          { text: 'いて', rt: '' }
        ], 
        label: 'Write', 
        meaning: 'Writing a letter' 
      },
      { 
        te: '読んで', 
        furigana: [
          { text: '読', rt: 'よ' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Read', 
        meaning: 'Reading a letter' 
      },
      { 
        te: '翻訳して', 
        furigana: [
          { text: '翻訳', rt: 'ほんやく' },
          { text: 'して', rt: '' }
        ], 
        label: 'Translate', 
        meaning: 'Translating a letter' 
      },
      { 
        te: '出して', 
        furigana: [
          { text: '出', rt: 'だ' },
          { text: 'して', rt: '' }
        ], 
        label: 'Mail', 
        meaning: 'Mailing a letter' 
      }
    ]
  },
  { 
    id: 'money', 
    name: 'お金', 
    furigana: [
      { text: 'お', rt: '' },
      { text: '金', rt: 'かね' }
    ], 
    label: 'Money', 
    icon: Banknote,
    actions: [
      { 
        te: '貸して', 
        furigana: [
          { text: '貸', rt: 'か' },
          { text: 'して', rt: '' }
        ], 
        label: 'Lend', 
        meaning: 'Lending money' 
      },
      { 
        te: '払って', 
        furigana: [
          { text: '払', rt: 'はら' },
          { text: 'って', rt: '' }
        ], 
        label: 'Pay', 
        meaning: 'Paying for someone' 
      },
      { 
        te: '両替して', 
        furigana: [
          { text: '両替', rt: 'りょうがえ' },
          { text: 'して', rt: '' }
        ], 
        label: 'Exchange', 
        meaning: 'Exchanging money' 
      },
      { 
        te: '送金して', 
        furigana: [
          { text: '送金', rt: 'そうきん' },
          { text: 'して', rt: '' }
        ], 
        label: 'Wire', 
        meaning: 'Wiring money' 
      }
    ]
  },
  { 
    id: 'sweets', 
    name: 'お菓子', 
    furigana: [
      { text: 'お', rt: '' },
      { text: '菓子', rt: 'かし' }
    ], 
    label: 'Sweets', 
    icon: Cookie,
    actions: [
      { 
        te: '作って', 
        furigana: [
          { text: '作', rt: 'つく' },
          { text: 'って', rt: '' }
        ], 
        label: 'Make', 
        meaning: 'Baking sweets' 
      },
      { 
        te: '選んで', 
        furigana: [
          { text: '選', rt: 'えら' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Choose', 
        meaning: 'Choosing sweets' 
      },
      { 
        te: '配って', 
        furigana: [
          { text: '配', rt: 'くば' },
          { text: 'って', rt: '' }
        ], 
        label: 'Distribute', 
        meaning: 'Handing out sweets' 
      },
      { 
        te: '買って', 
        furigana: [
          { text: '買', rt: 'か' },
          { text: 'って', rt: '' }
        ], 
        label: 'Buy', 
        meaning: 'Buying sweets' 
      }
    ]
  },
  { 
    id: 'flower', 
    name: '花', 
    furigana: [
      { text: '花', rt: 'はな' }
    ], 
    label: 'Flowers', 
    icon: Flower,
    actions: [
      { 
        te: '飾って', 
        furigana: [
          { text: '飾', rt: 'かざ' },
          { text: 'って', rt: '' }
        ], 
        label: 'Decorate', 
        meaning: 'Displaying flowers' 
      },
      { 
        te: '選んで', 
        furigana: [
          { text: '選', rt: 'えら' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Choose', 
        meaning: 'Choosing flowers' 
      },
      { 
        te: '届けて', 
        furigana: [
          { text: '届', rt: 'とど' },
          { text: 'けて', rt: '' }
        ], 
        label: 'Deliver', 
        meaning: 'Delivering flowers' 
      },
      { 
        te: '生けて', 
        furigana: [
          { text: '生', rt: 'い' },
          { text: 'けて', rt: '' }
        ], 
        label: 'Arrange', 
        meaning: 'Arranging flowers' 
      }
    ]
  },
];

// --- Helper Functions ---

const normalizeInput = (str) => {
  // Convert to Hiragana and remove spaces
  const hiragana = toHiragana(str);
  return hiragana.replace(/\s+/g, '').trim();
};

const validateInput = (input, scenario, isAdvanced, showEnglish = false) => {
  // Convert input to Hiragana before validation to allow Kanji/Katakana input
  const cleanInput = normalizeInput(input);
  
  if (cleanInput.length < 5) {
    const msg = getErrorMessage('sentenceTooShort', showEnglish);
    return { valid: false, message: msg.primary, subtitle: msg.subtitle };
  }

  const { giver, receiver, item, perspective, action } = scenario;
  
  // Get hiragana readings for flexible matching
  const perspectiveReading = getEntityReading(perspective);
  const itemReading = getItemReading(item);
  
  // 1. Identify Topic/Perspective (Must use 'は')
  // Check both Kanji and Hiragana versions
  const topicPhraseKanji = perspective.name + 'は';
  const topicPhraseHiragana = perspectiveReading + 'は';
  const hasTopic = cleanInput.includes(topicPhraseKanji) || cleanInput.includes(topicPhraseHiragana);
  
  if (!hasTopic) {
    const msg = getErrorMessage('missingTopic', showEnglish, perspective.name);
    return { valid: false, message: msg.primary, subtitle: msg.subtitle };
  }

  // 2. Identify Item (Must use 'を')
  // Check both Kanji and Hiragana versions, also check for が particle
  const itemPhraseWoKanji = item.name + 'を';
  const itemPhraseWoHiragana = itemReading + 'を';
  const itemPhraseGaKanji = item.name + 'が';
  const itemPhraseGaHiragana = itemReading + 'が';
  
  const hasItem = cleanInput.includes(itemPhraseWoKanji) || 
                  cleanInput.includes(itemPhraseWoHiragana) ||
                  cleanInput.includes(itemPhraseGaKanji) ||
                  cleanInput.includes(itemPhraseGaHiragana);
  
  if (!hasItem) {
    const msg = getErrorMessage('missingObject', showEnglish, item.name);
    return { valid: false, message: msg.primary, subtitle: msg.subtitle };
  }

  // 3. Logic & Verb Check (Auxiliary)
  const isSubjectGiver = perspective.id === giver.id;
  let requiredVerb = '';
  let interactionTarget = isSubjectGiver ? receiver : giver;
  let interactionTargetName = interactionTarget.name;
  let interactionTargetReading = getEntityReading(interactionTarget);

  if (isSubjectGiver) {
    // Subject is Giver.
    if (receiver.id === 'me') {
      requiredVerb = 'くれます';
    } else {
      requiredVerb = 'あげます';
    }
  } else {
    // Subject is Receiver.
    requiredVerb = 'もらいます';
  }

  // 4. Advanced Mode: Te-Form Check
  if (isAdvanced) {
    if (!action) {
      const msg = getErrorMessage('noActionDefined', showEnglish);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
    if (!cleanInput.includes(action.te)) {
      const msg = getErrorMessage('wrongTeForm', showEnglish, action.te, action.label);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
    // Check that te-form appears directly before the auxiliary verb
    const teFormWithVerb = action.te + requiredVerb;
    if (!cleanInput.includes(teFormWithVerb)) {
      const msg = getErrorMessage('teFormConnection', showEnglish, action.te, requiredVerb);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
  }

  // Check Verb
  if (!cleanInput.includes(requiredVerb)) {
    const usedAgeru = cleanInput.includes('あげます');
    const usedKureru = cleanInput.includes('くれます');
    const usedMorau = cleanInput.includes('もらいます');

    if (requiredVerb === 'くれます' && usedAgeru) {
      const msg = getErrorMessage('useKuremasu', showEnglish);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
    if (requiredVerb === 'あげます' && usedKureru) {
      const msg = getErrorMessage('useAgemasu', showEnglish);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
    if (isSubjectGiver && usedMorau) {
      const msg = getErrorMessage('subjectIsGiving', showEnglish);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
    if (!isSubjectGiver && !usedMorau) {
      const msg = getErrorMessage('subjectIsReceiving', showEnglish);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }

    const msg = getErrorMessage('incorrectVerb', showEnglish, requiredVerb);
    return { valid: false, message: msg.primary, subtitle: msg.subtitle };
  }

  // Check Interaction Target + Particle (check both Kanji and Hiragana)
  const targetWithNiKanji = interactionTargetName + 'に';
  const targetWithNiHiragana = interactionTargetReading + 'に';
  const targetWithKaraKanji = interactionTargetName + 'から';
  const targetWithKaraHiragana = interactionTargetReading + 'から';
  
  const hasNi = cleanInput.includes(targetWithNiKanji) || cleanInput.includes(targetWithNiHiragana);
  const hasKara = cleanInput.includes(targetWithKaraKanji) || cleanInput.includes(targetWithKaraHiragana);

  if (requiredVerb === 'もらいます') {
    if (!hasNi && !hasKara) {
      const msg = getErrorMessage('markSource', showEnglish, interactionTargetName);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
  } else {
    if (!hasNi) {
      const msg = getErrorMessage('markRecipient', showEnglish, interactionTargetName);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
  }

  const msg = getErrorMessage('perfect', showEnglish);
  return { valid: true, message: msg.primary, subtitle: msg.subtitle };
};

// --- Components ---

// Helper to check if character is Kanji or Katakana (needs furigana)
const needsFurigana = (text) => {
  // Kanji range: \u4e00-\u9faf, Katakana range: \u30a0-\u30ff
  return /[\u4e00-\u9faf\u30a0-\u30ff]/.test(text);
};

// RubyText component - renders furigana only above Kanji/Katakana
const RubyText = ({ data, showFurigana, textClass = "text-lg font-bold text-gray-200" }) => {
  if (!data || !Array.isArray(data)) return null;
  
  return (
    <span className="inline-flex items-end">
      {data.map((item, idx) => {
        const hasKanjiOrKatakana = needsFurigana(item.text);
        const shouldShowRt = showFurigana && item.rt && hasKanjiOrKatakana;
        
        return (
          <span key={idx} className="inline-flex flex-col items-center">
            {shouldShowRt && (
              <span className="text-xs text-gray-400 font-normal text-center leading-tight">{item.rt}</span>
            )}
            <span className={textClass}>{item.text}</span>
          </span>
        );
      })}
    </span>
  );
};

const EntityDisplay = ({ entity, role, isPerspective, showEnglish, showFurigana }) => {
  const EntityIcon = entity.icon || User;
  
  return (
    <div className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-300 w-36 ${
      isPerspective 
        ? 'border-indigo-500 bg-[#2d2d2d] shadow-[0_0_15px_rgba(99,102,241,0.3)] transform scale-105' 
        : 'border-[#333] bg-[#222] opacity-80'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
        entity.type === 'self' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-900/50 text-orange-400'
      }`}>
        <EntityIcon size={18} />
      </div>
      <RubyText 
        data={entity.furigana} 
        showFurigana={showFurigana} 
        textClass="text-lg font-bold text-gray-200"
      />
      {showEnglish && (
        <span className="text-[10px] text-gray-500 mt-0.5">{entity.label}</span>
      )}
      <div className={`mt-1.5 px-2 py-0.5 rounded text-sm font-bold tracking-wide flex flex-col items-center ${
        role === 'giver' ? 'bg-green-900/30 text-green-400' : 'bg-purple-900/30 text-purple-400'
      }`}>
        <span>{role === 'giver' ? '贈り手' : '受け手'}</span>
        {showEnglish && (
          <span className="text-xs opacity-70">{role === 'giver' ? 'Giver' : 'Receiver'}</span>
        )}
      </div>
      {isPerspective && (
        <div className="mt-2 text-indigo-400 text-xs font-bold flex items-center animate-pulse">
          <CheckCircle size={12} className="mr-1" /> 主題
        </div>
      )}
    </div>
  );
};

const Checkbox = ({ label, checked, onChange, colorClass = "bg-green-600" }) => (
  <label className="flex items-center gap-3 cursor-pointer group mb-2 select-none hover:cursor-pointer">
    <div className={`w-5 h-5 rounded border border-gray-600 flex items-center justify-center transition-all cursor-pointer ${
      checked ? 'bg-green-600 border-transparent' : 'bg-[#222] group-hover:border-gray-500'
    }`}>
      {checked && <CheckCheck size={14} className="text-white" />}
    </div>
    <span className={`text-sm cursor-pointer ${checked ? 'text-gray-200 font-bold' : 'text-gray-500'}`}>{label}</span>
    <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
  </label>
);

export default function App() {
  const [scenario, setScenario] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showItemName, setShowItemName] = useState(false);
  
  const inputRef = useRef(null);
  
  // Click outside to close settings
  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);
  
  const settingsRef = useClickOutside(handleCloseSettings);
  
  // Input handler with Hiragana conversion and cursor preservation
  const handleInputChange = useCallback((e) => {
    const input = e.target;
    const rawValue = input.value;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    
    // Check for invalid characters (non-Japanese, non-romaji)
    if (!isValidJapaneseInput(rawValue)) {
      setInvalidInput(true);
      setTimeout(() => setInvalidInput(false), 500);
      return; // Don't update input with invalid characters
    }
    
    // Get the portion before cursor to calculate length difference
    const beforeCursor = rawValue.slice(0, selectionStart);
    const convertedBeforeCursor = romajiToHiragana(beforeCursor);
    
    // Convert full value to Hiragana
    const hiraganaValue = romajiToHiragana(rawValue);
    
    // Calculate new cursor position based on converted text before cursor
    const newCursorPos = convertedBeforeCursor.length;
    
    setInputValue(hiraganaValue);
    setFeedback(null);
    setIsCorrect(false);
    
    // Restore cursor position after React re-renders
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.selectionStart = newCursorPos;
        inputRef.current.selectionEnd = newCursorPos + (selectionEnd - selectionStart);
      }
    });
  }, []);
  // Settings State
  const [settings, setSettings] = useState({
    hints: false,
    furigana: false,
    englishLabels: false,
    advancedMode: false,
    meCentric: false, // New State: Personal Focus Mode
    verbFilters: {
      moraimasu: true,  // もらいます
      kuremasu: true,   // くれます
      agemasu: true,    // あげます
    },
  });

  const generateScenario = () => {
    let giver, receiver, perspective;
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    
    // Get enabled verb filters
    const { moraimasu, kuremasu, agemasu } = settings.verbFilters;
    
    // If no verbs are selected, default to all
    const hasAnyFilter = moraimasu || kuremasu || agemasu;
    const effectiveFilters = hasAnyFilter 
      ? { moraimasu, kuremasu, agemasu } 
      : { moraimasu: true, kuremasu: true, agemasu: true };

    // Build array of allowed scenario configurations
    const allowedConfigs = [];
    
    // もらいます: perspective is receiver (getting from giver)
    if (effectiveFilters.moraimasu) allowedConfigs.push('moraimasu');
    // くれます: perspective is giver, receiver is 'me'
    if (effectiveFilters.kuremasu) allowedConfigs.push('kuremasu');
    // あげます: perspective is giver, receiver is NOT 'me'
    if (effectiveFilters.agemasu) allowedConfigs.push('agemasu');

    if (settings.meCentric) {
      // Logic for Me-Centric Mode: Topic MUST be 'me'
      const me = ENTITIES.find(e => e.id === 'me');
      const others = ENTITIES.filter(e => e.id !== 'me');
      const other = others[Math.floor(Math.random() * others.length)];
      
      // Me is the topic (perspective)
      perspective = me;
      
      // Filter allowed verbs for me-centric mode
      // Me-centric can only use: moraimasu (me receives) or agemasu (me gives)
      const meCentricConfigs = allowedConfigs.filter(c => c === 'moraimasu' || c === 'agemasu');
      
      if (meCentricConfigs.length === 0) {
        // Fallback if only kuremasu is selected in me-centric mode
        giver = other;
        receiver = me;
      } else {
        const chosenConfig = meCentricConfigs[Math.floor(Math.random() * meCentricConfigs.length)];
        
        if (chosenConfig === 'agemasu') {
          giver = me;
          receiver = other;
        } else {
          giver = other;
          receiver = me;
        }
      }

    } else {
      // Standard Logic with verb filtering
      let attempts = 0;
      const maxAttempts = 50;
      
      do {
        giver = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
        receiver = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
        while (giver.id === receiver.id) {
          receiver = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
        }
        perspective = Math.random() > 0.5 ? giver : receiver;
        
        // Check if this configuration matches an allowed verb
        const isSubjectGiver = perspective.id === giver.id;
        let matchedVerb = '';
        
        if (isSubjectGiver) {
          if (receiver.id === 'me') {
            matchedVerb = 'kuremasu';
          } else {
            matchedVerb = 'agemasu';
          }
        } else {
          matchedVerb = 'moraimasu';
        }
        
        if (allowedConfigs.includes(matchedVerb)) break;
        attempts++;
      } while (attempts < maxAttempts);
    }
    
    // Pick specific action for advanced mode
    let action = null;
    if (settings.advancedMode && item.actions) {
       action = item.actions[Math.floor(Math.random() * item.actions.length)];
    }

    setScenario({ giver, receiver, item, perspective, action });
    setInputValue("");
    setFeedback(null);
    setIsCorrect(false);
    setShowItemName(false);
  };

  useEffect(() => {
    generateScenario();
  }, [settings.advancedMode, settings.meCentric, settings.verbFilters.moraimasu, settings.verbFilters.kuremasu, settings.verbFilters.agemasu]); // Regenerate when modes or verb filters toggle

  const handleCheck = () => {
    if (!scenario) return;
    const result = validateInput(inputValue, scenario, settings.advancedMode, settings.englishLabels);
    
    if (result.valid) {
      setFeedback({ type: 'success', text: result.message, subtitle: result.subtitle });
      setIsCorrect(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setFeedback({ type: 'error', text: result.message, subtitle: result.subtitle });
      setStreak(0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (isCorrect) generateScenario();
      else handleCheck();
    }
  };
  
  // Keyboard shortcuts for navigation
  useKeyboardShortcuts({
    isCorrect,
    onNext: generateScenario,
    onCheck: handleCheck,
    inputRef
  });

  if (!scenario) return <div className="flex items-center justify-center h-screen bg-[#1a1a1a] text-white">Loading...</div>;
  
  const ItemIcon = scenario.item.icon;

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-200 font-sans overflow-hidden">
      
      {/* Settings Dropdown Container */}
      <div className="fixed top-6 left-6 z-50" ref={settingsRef}>
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`flex items-center gap-2 text-gray-400 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 bg-[#333333] hover:bg-[#444] rounded px-3 py-1.5 text-sm cursor-pointer ${isSettingsOpen ? 'bg-[#444] text-white border-gray-500' : ''}`}
        >
          <Settings size={16} />
          <span>設定</span>
        </button>

        {/* Dropdown Menu */}
        {isSettingsOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 max-h-[80vh] overflow-y-auto bg-[#333333] border border-[#444] rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 cursor-pointer">
            
            {/* Verb Filter Selection */}
            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-1">VERB FILTER</h3>
              <hr className="border-[#333] mb-2" />
              <Checkbox 
                label="もらいます" 
                checked={settings.verbFilters.moraimasu} 
                onChange={() => setSettings(s => ({...s, verbFilters: {...s.verbFilters, moraimasu: !s.verbFilters.moraimasu}}))} 
              />
              <Checkbox 
                label="くれます" 
                checked={settings.verbFilters.kuremasu} 
                onChange={() => setSettings(s => ({...s, verbFilters: {...s.verbFilters, kuremasu: !s.verbFilters.kuremasu}}))} 
              />
              <Checkbox 
                label="あげます" 
                checked={settings.verbFilters.agemasu} 
                onChange={() => setSettings(s => ({...s, verbFilters: {...s.verbFilters, agemasu: !s.verbFilters.agemasu}}))} 
              />
            </div>

            {/* Level Selection */}
             <div className="mb-6">
              <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-1">DIFFICULTY</h3>
              <hr className="border-[#333] mb-2" />
              <Checkbox 
                label="私中心モード" 
                checked={settings.meCentric} 
                onChange={() => setSettings(s => ({...s, meCentric: !s.meCentric}))} 
              />
              <p className="text-[10px] text-gray-500 ml-8 -mt-1 mb-2">
                Me-Centric Mode
              </p>

              <Checkbox 
                label="て形練習" 
                checked={settings.advancedMode} 
                onChange={() => setSettings(s => ({...s, advancedMode: !s.advancedMode}))} 
              />
              <p className="text-[10px] text-gray-500 ml-8 -mt-1">
                Advanced Te-form Practice
              </p>
            </div>

            {/* Display Options */}
            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-1">DISPLAY OPTIONS</h3>
              <hr className="border-[#333] mb-2" />
              <Checkbox 
                label="英語表記" 
                checked={settings.englishLabels} 
                onChange={() => setSettings(s => ({...s, englishLabels: !s.englishLabels}))} 
              />
              <p className="text-[10px] text-gray-500 ml-8 -mt-1 mb-2">English Labels</p>
              <Checkbox 
                label="振仮名" 
                checked={settings.furigana} 
                onChange={() => setSettings(s => ({...s, furigana: !s.furigana}))} 
              />
              <p className="text-[10px] text-gray-500 ml-8 -mt-1">Furigana</p>
            </div>

            {/* Quiz Mode */}
            <div className="mb-4">
              <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-1">QUIZ HELPER</h3>
              <hr className="border-[#333] mb-2" />
              <Checkbox 
                label="文法ヒント" 
                checked={settings.hints} 
                onChange={() => setSettings(s => ({...s, hints: !s.hints}))} 
              />
              <p className="text-[10px] text-gray-500 ml-8 -mt-1">Show Hints</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="h-full flex flex-col items-center justify-start w-full relative pt-20 md:pt-16">
        
        {/* Top Right: Streak Counters - slightly larger */}
        <div className="absolute top-6 right-6 flex items-center gap-5">
           <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Flame size={12} className={streak > 0 ? "text-orange-400" : "text-gray-400"} /> 現在
            </span>
            <span className={`text-lg font-mono font-bold ${streak > 0 ? "text-orange-300" : "text-gray-400"}`}>{streak}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Trophy size={12} className={maxStreak > 0 ? "text-yellow-400" : "text-gray-400"} /> 最高
            </span>
            <span className={`text-lg font-mono font-bold ${maxStreak > 0 ? "text-yellow-300" : "text-gray-400"}`}>{maxStreak}</span>
          </div>
        </div>

        {/* Visual Scenario - with top margin for mobile safe-area */}
        <div className="w-full max-w-2xl mb-6 mt-4 md:mt-8">
           <div className="flex items-center justify-between px-8 md:px-16">
              <EntityDisplay entity={scenario.giver} role="giver" isPerspective={scenario.perspective.id === scenario.giver.id} showEnglish={settings.englishLabels} showFurigana={settings.furigana} />
              
              <div className="flex flex-col items-center mx-4">
                  <div 
                    className="bg-[#2a2a2a] p-3 rounded-full border border-[#333] mb-2 relative flex items-center justify-center w-14 h-14 cursor-pointer hover:border-gray-500 transition-colors"
                    onClick={() => setShowItemName(!showItemName)}
                  >
                    <ItemIcon size={22} className="text-yellow-400" />
                    
                    {/* Advanced Mode Action Overlay */}
                    {settings.advancedMode && scenario.action && (
                       <div className="absolute -bottom-2 bg-red-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap z-10">
                          {scenario.action.te}
                       </div>
                    )}

                    {/* Click-to-reveal item name */}
                    {showItemName && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-3 py-1.5 rounded whitespace-nowrap z-20 animate-in fade-in zoom-in">
                        <RubyText 
                          data={scenario.item.furigana} 
                          showFurigana={settings.furigana} 
                          textClass="text-base font-medium text-white"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-[#666] mt-2 relative">
                      <div className="w-20 h-[3px] bg-[#666]" />
                      <ArrowRight size={20} strokeWidth={3} className="text-[#666] -ml-1" />
                      
                      {/* Advanced Mode Meaning */}
                      {settings.advancedMode && scenario.action && settings.englishLabels && (
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-[10px] text-rose-400 font-medium whitespace-nowrap">
                             {scenario.action.meaning}
                          </div>
                      )}
                  </div>
              </div>

              <EntityDisplay entity={scenario.receiver} role="receiver" isPerspective={scenario.perspective.id === scenario.receiver.id} showEnglish={settings.englishLabels} showFurigana={settings.furigana} />
           </div>
        </div>

        {/* Typing Input Area */}
        <div className="w-full max-w-xl flex flex-col items-center space-y-3 px-4">
          
          <div className="w-full relative">
            <input 
              ref={inputRef}
              type="text" 
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isCorrect || showAnswer}
              placeholder={settings.advancedMode ? `...${scenario.item.name}を${scenario.action?.te}...` : "文を入力... (e.g. 私は田中さんに本をあげます)"}
              className={`w-full bg-white text-gray-900 rounded-full py-4 px-8 text-lg font-medium shadow-[0_0_20px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-80 disabled:bg-gray-200 ${invalidInput ? 'animate-giggle ring-2 ring-red-500' : ''}`}
            />
            {isCorrect && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 animate-in zoom-in">
                    <CheckCircle size={28} />
                </div>
            )}
            {(feedback?.type === 'error' || showAnswer) && !isCorrect && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 animate-in zoom-in">
                    <XCircle size={28} />
                </div>
            )}
          </div>
          
          {/* Feedback Text / Answer Explanation */}
          <div className="min-h-[40px] flex flex-col items-center">
             {feedback && !showAnswer && (
                <div className="text-center animate-in fade-in slide-in-from-bottom-2">
                  <span className={`text-sm font-medium ${feedback.type === 'success' ? 'text-green-400' : 'text-rose-400'}`}>
                     {feedback.text}
                  </span>
                  {feedback.subtitle && (
                    <p className="text-xs text-gray-400 mt-0.5">{feedback.subtitle}</p>
                  )}
                </div>
             )}
             {showAnswer && (
                <div className="text-center animate-in fade-in slide-in-from-bottom-2 space-y-2">
                   <p className="text-gray-400 text-xs font-bold">正しい回答</p>
                   <p className="text-white text-lg font-medium inline-flex flex-wrap items-end justify-center" style={{gap: 0, letterSpacing: 0}}>
                      {/* Perspective (Topic) - Giver or Receiver color */}
                      <span className={scenario.perspective.id === scenario.giver.id ? 'text-green-400 font-bold' : 'text-purple-400 font-bold'}>
                        <RubyText 
                          data={scenario.perspective.furigana} 
                          showFurigana={settings.furigana} 
                          textClass={scenario.perspective.id === scenario.giver.id ? 'text-base font-bold text-green-400' : 'text-base font-bold text-purple-400'}
                        />
                      </span>
                      <span className="text-white">は</span>
                      {/* Interaction Target - opposite role color */}
                      <span className={scenario.perspective.id === scenario.giver.id ? 'text-purple-400 font-bold' : 'text-green-400 font-bold'}>
                        <RubyText 
                          data={scenario.perspective.id === scenario.giver.id ? scenario.receiver.furigana : scenario.giver.furigana} 
                          showFurigana={settings.furigana} 
                          textClass={scenario.perspective.id === scenario.giver.id ? 'text-base font-bold text-purple-400' : 'text-base font-bold text-green-400'}
                        />
                      </span>
                      <span className="text-white">に</span>
                      {/* Item - Yellow */}
                      <span className="text-yellow-400 font-bold">
                        <RubyText 
                          data={scenario.item.furigana} 
                          showFurigana={settings.furigana} 
                          textClass="text-base font-bold text-yellow-400"
                        />
                      </span>
                      <span className="text-white">を</span>
                      {/* Te-form verb - Dark Red */}
                      {settings.advancedMode && scenario.action && (
                        <span className="text-red-700 font-bold">
                          <RubyText 
                            data={scenario.action.furigana} 
                            showFurigana={settings.furigana} 
                            textClass="text-base font-bold text-red-700"
                          />
                        </span>
                      )}
                      {/* Giving/Receiving verb - Blue */}
                      <span className="text-blue-500 font-bold">
                      {scenario.perspective.id === scenario.giver.id 
                        ? (scenario.receiver.id === 'me' ? 'くれます' : 'あげます')
                        : 'もらいます'
                      }
                      </span>
                   </p>
                   {settings.advancedMode && scenario.action && settings.englishLabels && (
                      <p className="text-rose-400 text-sm">({scenario.action.meaning})</p>
                   )}
                </div>
             )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
             {!isCorrect && !showAnswer && (
               <button 
                  onClick={() => {
                    setShowAnswer(true);
                    setStreak(0);
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
               >
                  わからない
               </button>
             )}
             
             {(isCorrect || showAnswer) && (
               <>
                 <button 
                   onClick={() => {
                     setInputValue("");
                     setFeedback(null);
                     setIsCorrect(false);
                     setShowAnswer(false);
                     if (inputRef.current) inputRef.current.focus();
                   }}
                   className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors cursor-pointer"
                 >
                   もう一度
                 </button>
                 <button 
                   onClick={() => {
                     generateScenario();
                     setShowAnswer(false);
                     if (inputRef.current) inputRef.current.focus();
                   }}
                   className={`${isCorrect ? 'bg-green-700 hover:bg-green-600' : 'bg-red-700 hover:bg-red-600'} text-white font-bold py-2 px-6 rounded-full text-sm transition-colors cursor-pointer`}
                 >
                   次へ
                 </button>
               </>
             )}
          </div>

        </div>

      </main>
    </div>
  );
}

// --- React Render ---
import ReactDOM from 'react-dom/client';

let globalRoot = null;

const rootElement = document.getElementById('root');
if (!globalRoot) {
  globalRoot = ReactDOM.createRoot(rootElement);
}
globalRoot.render(<App />);