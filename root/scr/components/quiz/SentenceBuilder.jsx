import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

// Token types for the sentence builder
const TOKEN_TYPES = {
  PARTICLE: 'particle',
  NOUN: 'noun',
  VERB: 'verb',
};

// Available tokens for building sentences
const AVAILABLE_TOKENS = {
  particles: [
    { id: 'wa', text: 'は', reading: 'wa', type: TOKEN_TYPES.PARTICLE },
    { id: 'ni', text: 'に', reading: 'ni', type: TOKEN_TYPES.PARTICLE },
    { id: 'wo', text: 'を', reading: 'wo', type: TOKEN_TYPES.PARTICLE },
    { id: 'kara', text: 'から', reading: 'kara', englishLabel: 'from', type: TOKEN_TYPES.PARTICLE },
  ],
  verbs: [
    // Ageru family (giving to out-group)
    { id: 'yaru', text: 'やります', reading: 'yarimasu', englishLabel: 'give (to inferior)', type: TOKEN_TYPES.VERB },
    { id: 'ageru', text: 'あげます', reading: 'agemasu', englishLabel: 'give (to equal)', type: TOKEN_TYPES.VERB },
    { id: 'sashiageru', text: 'さしあげます', reading: 'sashiagemasu', englishLabel: 'give (to superior)', type: TOKEN_TYPES.VERB },
    // Kureru family (giving to in-group)
    { id: 'kureru', text: 'くれます', reading: 'kuremasu', englishLabel: 'give to me (equal)', type: TOKEN_TYPES.VERB },
    { id: 'kudasaru', text: 'くださいます', reading: 'kudasaimasu', englishLabel: 'give to me (superior)', type: TOKEN_TYPES.VERB },
    // Morau family (receiving)
    { id: 'morau', text: 'もらいます', reading: 'moraimasu', englishLabel: 'receive (from equal)', type: TOKEN_TYPES.VERB },
    { id: 'itadaku', text: 'いただきます', reading: 'itadakimasu', englishLabel: 'receive (from superior)', type: TOKEN_TYPES.VERB },
  ],
};

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Draggable Token Component
function DraggableToken({ token, onDragStart, onClick, onRemove, isDragging, isInSentence, showEnglish, isLocked }) {
  const handleClick = (e) => {
    if (isLocked) return;
    
    // If in sentence, click removes the token
    if (isInSentence && onRemove) {
      onRemove(token);
      return;
    }
    
    // If not in sentence, click adds the token
    if (!isInSentence && onClick) {
      onClick(token);
    }
  };

  const handleDragStart = (e) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }
    onDragStart(e, token);
  };

  return (
    <div
      draggable={!isLocked}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={`
        inline-flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg border 
        text-gray-900 font-medium text-sm select-none transition-all
        ${isLocked 
          ? 'bg-gray-600 border-gray-500 cursor-not-allowed opacity-60 grayscale text-white' 
          : 'bg-yellow-400 hover:bg-yellow-300 border-yellow-500 shadow-md hover:shadow-lg hover:-translate-y-0.5'
        }
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${isInSentence && !isLocked ? 'cursor-pointer hover:bg-red-500 hover:border-red-400 hover:text-white' : ''}
        ${!isInSentence && !isLocked ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-center gap-1">
        <span>{token.text}</span>
      </div>
      {/* Only show English label if showEnglish is true and token has englishLabel */}
      {showEnglish && token.englishLabel && (
        <span className={`text-[10px] font-normal ${isLocked ? 'text-gray-400' : 'text-gray-700'}`}>{token.englishLabel}</span>
      )}
    </div>
  );
}

// Drop Zone Component
function DropZone({ children, onDrop, onDragOver, isEmpty, isLocked }) {
  return (
    <div
      onDrop={isLocked ? undefined : onDrop}
      onDragOver={isLocked ? undefined : onDragOver}
      className={`
        min-h-[52px] w-full rounded-xl border-2 transition-all
        flex items-center flex-wrap gap-2 p-3
        ${isLocked 
          ? 'border-red-700 bg-[#2a2a2a]/50' 
          : isEmpty 
            ? 'border-white/40 border-dashed bg-[#2a2a2a]' 
            : 'border-white bg-[#2a2a2a]/80'
        }
      `}
    >
      {isEmpty ? (
        <span className="text-gray-500 text-sm italic">ここにトークンをドラッグしてください...</span>
      ) : (
        children
      )}
    </div>
  );
}

// Token Bank Component - Now renders all tokens in a single randomized pool
function TokenBank({ tokens, onDragStart, onClick, draggedToken, showEnglish, isLocked }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map((token) => (
        <DraggableToken
          key={token.id}
          token={token}
          onDragStart={onDragStart}
          onClick={onClick}
          isDragging={draggedToken?.id === token.id}
          isInSentence={false}
          showEnglish={showEnglish}
          isLocked={isLocked}
        />
      ))}
    </div>
  );
}

export function SentenceBuilder({ scenario, onSentenceChange, onCheck, showEnglish, isLocked = false, shouldReset = false, onResetComplete, verbFilters = {} }) {
  const [sentence, setSentence] = useState([]);
  const [draggedToken, setDraggedToken] = useState(null);
  // Track which token IDs are currently used in the sentence (by original id, not instanceId)
  const [usedTokenIds, setUsedTokenIds] = useState(new Set());

  // Reset sentence when scenario changes
  useEffect(() => {
    setSentence([]);
    setUsedTokenIds(new Set());
  }, [scenario]);

  // Handle retry reset when shouldReset becomes true
  useEffect(() => {
    if (shouldReset) {
      setSentence([]);
      setUsedTokenIds(new Set());
      onResetComplete?.();
    }
  }, [shouldReset, onResetComplete]);

  // Use useEffect to notify parent of sentence changes to avoid setState-in-render
  useEffect(() => {
    const sentenceText = sentence.map(t => t.text).join('');
    onSentenceChange?.(sentenceText);
  }, [sentence, onSentenceChange]);

  // Create dynamic noun tokens based on scenario
  const nounTokens = useMemo(() => [
    { 
      id: 'giver', 
      text: scenario.giver.name, 
      reading: 'giver', 
      type: TOKEN_TYPES.NOUN,
      role: 'giver',
      englishLabel: scenario.giver.english
    },
    { 
      id: 'receiver', 
      text: scenario.receiver.name, 
      reading: 'receiver', 
      type: TOKEN_TYPES.NOUN,
      role: 'receiver',
      englishLabel: scenario.receiver.english
    },
    { 
      id: 'item', 
      text: scenario.item.name, 
      reading: 'item', 
      type: TOKEN_TYPES.NOUN,
      role: 'item',
      englishLabel: scenario.item.english
    },
  ], [scenario]);

  // Combine all tokens and randomize order
  // - Particles: Always show all 4 particles
  // - Nouns: Exactly 3 (giver, receiver, item - no distractors)
  // - Verbs: Only display verbs enabled in settings
  const allTokensRandomized = useMemo(() => {
    // Filter verbs based on verbFilters settings
    // Map verb IDs to settings keys
    const verbIdToSettingKey = {
      'yaru': 'yarimasu',
      'ageru': 'agemasu',
      'sashiageru': 'sashiagemasu',
      'kureru': 'kuremasu',
      'kudasaru': 'kudasaimasu',
      'morau': 'moraimasu',
      'itadaku': 'itadakimasu'
    };
    
    const filteredVerbs = AVAILABLE_TOKENS.verbs.filter(verb => {
      const settingKey = verbIdToSettingKey[verb.id];
      return verbFilters[settingKey] === true;
    });
    
    // Build token pool:
    // - All particles (always shown)
    // - Only the 3 required nouns (giver, receiver, item)
    // - Only enabled verbs
    const allTokens = [
      ...nounTokens,                    // Exactly 3 nouns
      ...AVAILABLE_TOKENS.particles,    // All 4 particles
      ...filteredVerbs                  // Only enabled verbs
    ];
    return shuffleArray(allTokens);
  }, [nounTokens, verbFilters]);

  // Filter available tokens based on which are currently used in the sentence
  // Uses unique IDs to properly handle duplicate words
  const availableTokens = useMemo(() => {
    return allTokensRandomized.filter(token => !usedTokenIds.has(token.id));
  }, [allTokensRandomized, usedTokenIds]);

  const handleDragStart = useCallback((e, token) => {
    setDraggedToken(token);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(token));
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const tokenData = e.dataTransfer.getData('text/plain');
    if (tokenData) {
      try {
        const token = JSON.parse(tokenData);
        // Only add if not already in sentence (check by original id)
        if (usedTokenIds.has(token.id)) {
          setDraggedToken(null);
          return;
        }
        // Add unique instance id for tokens in sentence
        const instanceToken = {
          ...token,
          instanceId: `${token.id}-${Date.now()}`
        };
        setSentence(prev => [...prev, instanceToken]);
        // Mark this token id as used
        setUsedTokenIds(prev => new Set([...prev, token.id]));
      } catch (err) {
        console.error('Failed to parse dropped token:', err);
      }
    }
    setDraggedToken(null);
  }, [usedTokenIds]);

  const handleRemoveToken = useCallback((tokenToRemove) => {
    setSentence(prev => prev.filter(t => t.instanceId !== tokenToRemove.instanceId));
    // Restore this token id to the available pool
    setUsedTokenIds(prev => {
      const next = new Set(prev);
      next.delete(tokenToRemove.id);
      return next;
    });
  }, []);

  // Handle click to append token to sentence
  const handleTokenClick = useCallback((token) => {
    // Only add if not already in sentence (check by original id)
    if (usedTokenIds.has(token.id)) {
      return;
    }
    const instanceToken = {
      ...token,
      instanceId: `${token.id}-${Date.now()}`
    };
    setSentence(prev => [...prev, instanceToken]);
    // Mark this token id as used
    setUsedTokenIds(prev => new Set([...prev, token.id]));
  }, [usedTokenIds]);

  const handleReset = useCallback(() => {
    setSentence([]);
    setUsedTokenIds(new Set());
  }, []);

  const handleCheck = useCallback(() => {
    const sentenceText = sentence.map(t => t.text).join('');
    onCheck?.(sentenceText);
  }, [sentence, onCheck]);

  // Title variables
  const titleJP = '文を作成';
  const titleEN = 'Sentence Builder';

  return (
    <div className="w-full bg-[#252525] rounded-2xl border border-[#333] p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
          {titleJP}{showEnglish && <span className="text-gray-500 font-normal normal-case"> / {titleEN}</span>}
        </h3>
        {/* Reset Button - only shown when not locked and sentence is not empty */}
        {!isLocked && (
          <button
            onClick={handleReset}
            disabled={sentence.length === 0}
            className={`
              flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all
              ${sentence.length > 0 
                ? 'text-white bg-[#404040] hover:bg-[#4a4a4a] cursor-pointer' 
                : 'text-gray-600 bg-[#2a2a2a] cursor-not-allowed'
              }
            `}
          >
            <RotateCcw size={12} />
            リセット
          </button>
        )}
      </div>

      {/* Drop Zone - Sentence Building Area */}
      <DropZone
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        isEmpty={sentence.length === 0}
        isLocked={isLocked}
      >
        {sentence.map((token) => (
          <DraggableToken
            key={token.instanceId}
            token={token}
            onDragStart={handleDragStart}
            onRemove={handleRemoveToken}
            isDragging={draggedToken?.instanceId === token.instanceId}
            isInSentence={true}
            showEnglish={showEnglish}
            isLocked={isLocked}
          />
        ))}
      </DropZone>

      {/* Token Bank - Hidden when locked */}
      {!isLocked && (
        <div className="pt-2 border-t border-[#333]">
          <TokenBank
            tokens={availableTokens}
            onDragStart={handleDragStart}
            onClick={handleTokenClick}
            draggedToken={draggedToken}
            showEnglish={showEnglish}
            isLocked={isLocked}
          />
        </div>
      )}

      {/* Check Button - Hidden when locked */}
      {!isLocked && (
        <button
          onClick={handleCheck}
          disabled={sentence.length === 0}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          チェック
        </button>
      )}
    </div>
  );
}
