import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowRight, User, Gift, Book, Apple, Coffee, 
  RefreshCw, CheckCircle, XCircle, Settings, 
  Menu, Flame, Trophy, Mail, Banknote, Cookie, Flower,
  GraduationCap, Briefcase, Smile, UserCheck
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
  { id: 'me', name: '私', label: 'Me (Watashi)', type: 'self', icon: User },
  { id: 'tanaka', name: '田中さん', label: 'Tanaka-san', type: 'other', icon: Briefcase },
  { id: 'satou', name: '佐藤さん', label: 'Satou-san', type: 'other', icon: UserCheck },
  { id: 'sensei', name: '先生', label: 'Teacher (Sensei)', type: 'other', icon: GraduationCap },
  { id: 'tomodachi', name: '友達', label: 'Friend (Tomodachi)', type: 'other', icon: Smile },
];

const ITEMS = [
  { 
    id: 'book', name: '本', label: 'Book', icon: Book,
    actions: [
      { te: '貸して', label: 'Lend', meaning: 'Lending a book' },
      { te: '読んで', label: 'Read', meaning: 'Reading to someone' },
      { te: '選んで', label: 'Choose', meaning: 'Choosing a book' },
      { te: '買って', label: 'Buy', meaning: 'Buying a book' }
    ]
  },
  { 
    id: 'present', name: 'プレゼント', label: 'Present', icon: Gift,
    actions: [
      { te: '包んで', label: 'Wrap', meaning: 'Wrapping a gift' },
      { te: '選んで', label: 'Choose', meaning: 'Choosing a gift' },
      { te: '送って', label: 'Send', meaning: 'Sending a gift' },
      { te: '隠して', label: 'Hide', meaning: 'Hiding a surprise' }
    ]
  },
  { 
    id: 'apple', name: 'りんご', label: 'Apple', icon: Apple,
    actions: [
      { te: '切って', label: 'Cut', meaning: 'Cutting an apple' },
      { te: '洗って', label: 'Wash', meaning: 'Washing fruit' },
      { te: '剥いて', label: 'Peel', meaning: 'Peeling fruit' },
      { te: '送って', label: 'Send', meaning: 'Sending apples' }
    ]
  },
  { 
    id: 'coffee', name: 'コーヒー', label: 'Coffee', icon: Coffee,
    actions: [
      { te: '淹れて', label: 'Brew', meaning: 'Brewing coffee' },
      { te: '買って', label: 'Buy', meaning: 'Buying coffee' },
      { te: '持ってきて', label: 'Bring', meaning: 'Bringing coffee' },
      { te: '注文して', label: 'Order', meaning: 'Ordering coffee' }
    ]
  },
  { 
    id: 'letter', name: '手紙', label: 'Letter', icon: Mail,
    actions: [
      { te: '書いて', label: 'Write', meaning: 'Writing a letter' },
      { te: '読んで', label: 'Read', meaning: 'Reading a letter' },
      { te: '翻訳して', label: 'Translate', meaning: 'Translating a letter' },
      { te: '出して', label: 'Mail', meaning: 'Mailing a letter' }
    ]
  },
  { 
    id: 'money', name: 'お金', label: 'Money', icon: Banknote,
    actions: [
      { te: '貸して', label: 'Lend', meaning: 'Lending money' },
      { te: '払って', label: 'Pay', meaning: 'Paying for someone' },
      { te: '両替して', label: 'Exchange', meaning: 'Exchanging money' },
      { te: '送金して', label: 'Wire', meaning: 'Wiring money' }
    ]
  },
  { 
    id: 'sweets', name: 'お菓子', label: 'Sweets', icon: Cookie,
    actions: [
      { te: '作って', label: 'Make', meaning: 'Baking sweets' },
      { te: '選んで', label: 'Choose', meaning: 'Choosing sweets' },
      { te: '配って', label: 'Distribute', meaning: 'Handing out sweets' },
      { te: '買って', label: 'Buy', meaning: 'Buying sweets' }
    ]
  },
  { 
    id: 'flower', name: '花', label: 'Flowers', icon: Flower,
    actions: [
      { te: '飾って', label: 'Decorate', meaning: 'Displaying flowers' },
      { te: '選んで', label: 'Choose', meaning: 'Choosing flowers' },
      { te: '届けて', label: 'Deliver', meaning: 'Delivering flowers' },
      { te: '生けて', label: 'Arrange', meaning: 'Arranging flowers' }
    ]
  },
];

// --- Helper Functions ---

const normalizeInput = (str) => {
  return str.replace(/\s+/g, '').trim();
};

const validateInput = (input, scenario, isAdvanced) => {
  const cleanInput = normalizeInput(input);
  
  if (cleanInput.length < 5) return { valid: false, message: "Sentence is too short." };

  const { giver, receiver, item, perspective, action } = scenario;
  
  // 1. Identify Topic/Perspective (Must use 'は')
  const topicPhrase = perspective.name + 'は';
  if (!cleanInput.includes(topicPhrase)) {
    return { valid: false, message: `Start with the topic: ${perspective.name}は...` };
  }

  // 2. Identify Item (Must use 'を')
  const itemPhrase = item.name + 'を';
  if (!cleanInput.includes(itemPhrase)) {
    return { valid: false, message: `Include the object: ${item.name}を...` };
  }

  // 3. Logic & Verb Check (Auxiliary)
  const isSubjectGiver = perspective.id === giver.id;
  let requiredVerb = '';
  let interactionTargetName = '';

  if (isSubjectGiver) {
    // Subject is Giver.
    if (receiver.id === 'me') {
      requiredVerb = 'くれます';
      interactionTargetName = receiver.name;
    } else {
      requiredVerb = 'あげます';
      interactionTargetName = receiver.name;
    }
  } else {
    // Subject is Receiver.
    requiredVerb = 'もらいます';
    interactionTargetName = giver.name;
  }

  // 4. Advanced Mode: Te-Form Check
  if (isAdvanced) {
    if (!action) return { valid: false, message: "Error: No action defined." };
    if (!cleanInput.includes(action.te)) {
      return { valid: false, message: `Use the correct Te-form action: ${action.te} (${action.label})` };
    }
    // Check combined form sequence (Action + Verb)
    // We don't strictly enforce adjacency for flexibility, but they should both be present.
  }

  // Check Verb
  if (!cleanInput.includes(requiredVerb)) {
    const usedAgeru = cleanInput.includes('あげます');
    const usedKureru = cleanInput.includes('くれます');
    const usedMorau = cleanInput.includes('もらいます');

    if (requiredVerb === 'くれます' && usedAgeru) return { valid: false, message: "Use 'くれます' when someone gives to YOU." };
    if (requiredVerb === 'あげます' && usedKureru) return { valid: false, message: "Use 'あげます' when the subject gives to someone else." };
    if (isSubjectGiver && usedMorau) return { valid: false, message: "Subject is giving, not receiving. Don't use 'もらいます'." };
    if (!isSubjectGiver && !usedMorau) return { valid: false, message: "Subject is receiving. Use 'もらいます'." };

    return { valid: false, message: `Incorrect auxiliary verb. Expected: ...${requiredVerb}` };
  }

  // Check Interaction Target + Particle
  const targetWithNi = interactionTargetName + 'に';
  const targetWithKara = interactionTargetName + 'から';
  const hasNi = cleanInput.includes(targetWithNi);
  const hasKara = cleanInput.includes(targetWithKara);

  if (requiredVerb === 'もらいます') {
    if (!hasNi && !hasKara) return { valid: false, message: `Mark the source (${interactionTargetName}) with 'に' or 'から'.` };
  } else {
    if (!hasNi) return { valid: false, message: `Mark the recipient (${interactionTargetName}) with 'に'.` };
  }

  return { valid: true, message: "Perfect!" };
};

// --- Components ---

const EntityDisplay = ({ entity, role, isPerspective }) => {
  const EntityIcon = entity.icon || User;
  return (
    <div className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-300 w-32 ${
      isPerspective 
        ? 'border-indigo-500 bg-[#2d2d2d] shadow-[0_0_15px_rgba(99,102,241,0.3)] transform scale-105' 
        : 'border-[#333] bg-[#222] opacity-80'
    }`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
        entity.type === 'self' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-900/50 text-orange-400'
      }`}>
        <EntityIcon size={24} />
      </div>
      <span className="font-bold text-sm text-gray-200">{entity.name}</span>
      <span className="text-[10px] text-gray-500 mt-1">{entity.label}</span>
      <div className={`mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
        role === 'giver' ? 'bg-green-900/30 text-green-400' : 'bg-purple-900/30 text-purple-400'
      }`}>
        {role}
      </div>
      {isPerspective && (
        <div className="mt-2 text-indigo-400 text-[10px] font-bold flex items-center animate-pulse">
          <CheckCircle size={10} className="mr-1" /> TOPIC
        </div>
      )}
    </div>
  );
};

const Checkbox = ({ label, checked, onChange, colorClass = "bg-indigo-600" }) => (
  <label className="flex items-center gap-3 cursor-pointer group mb-2 select-none">
    <div className={`w-5 h-5 rounded border border-gray-600 flex items-center justify-center transition-all ${
      checked ? `${colorClass} border-transparent` : 'bg-[#222] group-hover:border-gray-500'
    }`}>
      {checked && <CheckCircle size={14} className="text-white" />}
    </div>
    <span className={`text-sm ${checked ? 'text-gray-200 font-bold' : 'text-gray-500'}`}>{label}</span>
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
    furigana: true,
    englishLabels: true,
    advancedMode: false,
    meCentric: false, // New State: Personal Focus Mode
  });

  const generateScenario = () => {
    let giver, receiver, perspective;
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];

    if (settings.meCentric) {
      // Logic for Me-Centric Mode: Topic MUST be 'me'
      const me = ENTITIES.find(e => e.id === 'me');
      const others = ENTITIES.filter(e => e.id !== 'me');
      const other = others[Math.floor(Math.random() * others.length)];
      
      // Me is the topic (perspective)
      perspective = me;
      
      // Determine if Me is Giver (Ageru) or Receiver (Morau)
      // Kureru is excluded because Topic is Me, and Kureru requires Other as Topic
      const isMeGiver = Math.random() > 0.5;
      
      if (isMeGiver) {
        giver = me;
        receiver = other;
      } else {
        giver = other;
        receiver = me;
      }

    } else {
      // Standard Logic
      giver = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
      receiver = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
      while (giver.id === receiver.id) {
        receiver = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
      }
      perspective = Math.random() > 0.5 ? giver : receiver;
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
  };

  useEffect(() => {
    generateScenario();
  }, [settings.advancedMode, settings.meCentric]); // Regenerate when modes toggle

  const handleCheck = () => {
    if (!scenario) return;
    const result = validateInput(inputValue, scenario, settings.advancedMode);
    
    if (result.valid) {
      setFeedback({ type: 'success', text: result.message });
      setIsCorrect(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setFeedback({ type: 'error', text: result.message });
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
          className={`flex items-center gap-2 text-gray-400 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 bg-[#222] rounded px-3 py-1.5 text-sm ${isSettingsOpen ? 'bg-gray-800 text-white border-gray-500' : ''}`}
        >
          <Settings size={16} />
          <span>設定</span>
        </button>

        {/* Dropdown Menu */}
        {isSettingsOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-[#222] border border-[#333] rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2">
            
            {/* Level Selection */}
             <div className="mb-6 pb-6 border-b border-[#333]">
              <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-1 underline">難易度</h3>
              <p className="text-[9px] text-gray-500 mb-3">Difficulty</p>
              <Checkbox 
                label="私中心モード" 
                checked={settings.meCentric} 
                onChange={() => setSettings(s => ({...s, meCentric: !s.meCentric}))} 
                colorClass="bg-blue-600"
              />
              <p className="text-[10px] text-gray-500 ml-8 mt-1 mb-3">
                Personal Focus (Me-Centric)
              </p>

              <Checkbox 
                label="て形練習" 
                checked={settings.advancedMode} 
                onChange={() => setSettings(s => ({...s, advancedMode: !s.advancedMode}))} 
                colorClass="bg-rose-600"
              />
              <p className="text-[10px] text-gray-500 ml-8 mt-1">
                Advanced Te-form Practice
              </p>
            </div>

            {/* Display Options */}
            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-1 underline">表示設定</h3>
              <p className="text-[9px] text-gray-500 mb-3">Display Options</p>
              <Checkbox 
                label="英語表記" 
                checked={settings.englishLabels} 
                onChange={() => setSettings(s => ({...s, englishLabels: !s.englishLabels}))} 
              />
              <p className="text-[10px] text-gray-500 ml-8 mt-1 mb-3">English Labels</p>
              <Checkbox 
                label="振仮名" 
                checked={settings.furigana} 
                onChange={() => setSettings(s => ({...s, furigana: !s.furigana}))} 
              />
              <p className="text-[10px] text-gray-500 ml-8 mt-1">Furigana</p>
            </div>

            {/* Quiz Mode */}
            <div className="mb-4">
              <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-1 underline">クイズ補助</h3>
              <p className="text-[9px] text-gray-500 mb-3">Quiz Helper</p>
              <Checkbox 
                label="文法ヒント" 
                checked={settings.hints} 
                onChange={() => setSettings(s => ({...s, hints: !s.hints}))} 
                colorClass="bg-yellow-600"
              />
              <p className="text-[10px] text-gray-500 ml-8 mt-1">Show Hints</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#333] text-[10px] text-gray-600 text-center">
              Ver 2.4 • Personal Focus Mode
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area - Top 60% */}
      <main className="h-[60%] flex flex-col items-center justify-center w-full relative">
        
        {/* Top Right: Streak Counters */}
        <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
           <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              Top Streak <Trophy size={12} className={maxStreak > 0 ? "text-yellow-500" : "text-gray-600"} />
            </span>
            <span className={`text-xl font-mono ${maxStreak > 0 ? "text-yellow-400" : "text-gray-600"}`}>{maxStreak}</span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              Current Streak <Flame size={12} className={streak > 0 ? "text-orange-500" : "text-gray-600"} />
            </span>
            <span className={`text-xl font-mono ${streak > 0 ? "text-orange-400" : "text-gray-600"}`}>{streak}</span>
          </div>
        </div>

        {/* Visual Scenario */}
        <div className="w-full max-w-2xl mb-8">
           <div className="flex items-center justify-between px-8 md:px-16">
              <EntityDisplay entity={scenario.giver} role="giver" isPerspective={scenario.perspective.id === scenario.giver.id} />
              
              <div className="flex flex-col items-center mx-4">
                  <div className="bg-[#2a2a2a] p-4 rounded-full border border-[#333] mb-3 relative group flex items-center justify-center w-20 h-20">
                    <ItemIcon size={32} className="text-gray-300" />
                    
                    {/* Advanced Mode Action Overlay */}
                    {settings.advancedMode && scenario.action && (
                       <div className="absolute -bottom-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap z-10">
                          {scenario.action.te}
                       </div>
                    )}

                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20">
                        {scenario.item.name}
                        {settings.advancedMode && scenario.action && ` (${scenario.action.label})`}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-[#444] mt-2 relative">
                      <div className="w-20 h-0.5 bg-[#333]" />
                      <ArrowRight size={20} className="text-[#555] -ml-1" />
                      
                      {/* Advanced Mode Meaning */}
                      {settings.advancedMode && scenario.action && (
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-[10px] text-rose-400 font-medium whitespace-nowrap">
                             {scenario.action.meaning}
                          </div>
                      )}
                  </div>
              </div>

              <EntityDisplay entity={scenario.receiver} role="receiver" isPerspective={scenario.perspective.id === scenario.receiver.id} />
           </div>
        </div>

        {/* Typing Input Area */}
        <div className="w-full max-w-xl flex flex-col items-center space-y-4">
          
          <div className="w-full relative">
            <input 
              ref={inputRef}
              type="text" 
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isCorrect}
              placeholder={settings.advancedMode ? `...${scenario.item.name}を${scenario.action?.te}...` : "文を入力... (e.g. 私は田中さんに本をあげます)"}
              className={`w-full bg-white text-gray-900 rounded-full py-4 px-8 text-lg font-medium shadow-[0_0_20px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-80 disabled:bg-gray-200 ${invalidInput ? 'animate-giggle ring-2 ring-red-500' : ''}`}
            />
            {isCorrect && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 animate-in zoom-in">
                    <CheckCircle size={28} />
                </div>
            )}
          </div>
          
          {/* Feedback Text */}
          <div className="h-6">
             {feedback && (
                <span className={`text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${feedback.type === 'success' ? 'text-green-400' : 'text-rose-400'}`}>
                   {feedback.text}
                </span>
             )}
             {!feedback && <span className="text-gray-600 text-sm">
                {settings.advancedMode ? "Combine Te-form with giving/receiving verb." : "Write a sentence describing the diagram."}
             </span>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
             <button 
                onClick={() => setInputValue("わからない")}
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
             >
                わからない (Skip)
             </button>
             
             {isCorrect && (
               <button 
                 onClick={generateScenario}
                 className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-white px-6 py-2 rounded-full text-sm font-bold transition-all border border-gray-700"
               >
                 <RefreshCw size={14} /> Next Question
               </button>
             )}
          </div>

        </div>

      </main>
      
      {/* Bottom 40% - Empty Neutral Background */}
      <div className="h-[40%] bg-[#151515] border-t border-[#222] flex items-center justify-center">
         {/* Optional: Subtle branding or version info could go here, but kept clear as requested */}
         <div className="text-[#333] text-xs font-mono">
            Neutral Zone
         </div>
      </div>
    </div>
  );
}

// --- React Render ---
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);