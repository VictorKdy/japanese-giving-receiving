import React from 'react';
import { User, CheckCircle } from 'lucide-react';
import { RubyText } from './RubyText';

export function EntityDisplay({ entity, role, isPerspective, showEnglish, showFurigana }) {
  const EntityIcon = entity.icon || User;
  
  return (
    <div className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-300 w-36 ${
      isPerspective 
        ? 'border-indigo-500 bg-[#2d2d2d] shadow-[0_0_15px_rgba(99,102,241,0.3)] transform scale-105' 
        : 'border-[#333] bg-[#222] opacity-80'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
        entity.type === 'in' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-900/50 text-orange-400'
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
}
