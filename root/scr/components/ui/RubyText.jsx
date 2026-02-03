import React from 'react';
import { needsFurigana } from '../../utils';

// RubyText component - renders furigana only above Kanji/Katakana
export function RubyText({ data, showFurigana, textClass = "text-lg font-bold text-gray-200" }) {
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
}
