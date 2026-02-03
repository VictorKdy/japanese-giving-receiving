import React from 'react';
import { RubyText } from '../ui';

export function QuizFeedback({ 
  feedback, 
  showAnswer, 
  scenario, 
  settings 
}) {
  return (
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
            <span className="text-white">{scenario.requiredParticle || 'に'}</span>
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
              {scenario.requiredVerb}
            </span>
          </p>
          {settings.advancedMode && scenario.action && settings.englishLabels && (
            <p className="text-rose-400 text-sm">({scenario.action.meaning})</p>
          )}
        </div>
      )}
    </div>
  );
}
