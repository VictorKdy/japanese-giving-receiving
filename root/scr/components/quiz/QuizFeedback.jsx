import React from 'react';
import { RubyText } from '../ui';
import { getVerbExplanation, getOtherVerbExplanations } from '../../constants';

export function QuizFeedback({ 
  feedback, 
  showAnswer, 
  scenario, 
  settings,
  userInput 
}) {
  // Get the correct verb explanation
  const correctVerbExplanation = scenario?.requiredVerb 
    ? getVerbExplanation(scenario.requiredVerb) 
    : null;

  // Map verb keys to settings filter keys
  const verbToFilterKey = {
    morau: 'moraimasu',
    itadaku: 'itadakimasu',
    yaru: 'yarimasu',
    ageru: 'agemasu',
    sashiageru: 'sashiagemasu',
    kureru: 'kuremasu',
    kudasaru: 'kudasaimasu'
  };

  // Get other verb explanations filtered by user's verb settings
  const otherVerbExplanations = scenario?.requiredVerb 
    ? getOtherVerbExplanations(scenario.requiredVerb).filter(verbInfo => {
        const filterKey = verbToFilterKey[verbInfo.verb];
        return filterKey && settings.verbFilters?.[filterKey] === true;
      })
    : [];

  return (
    <div className="min-h-[40px] flex flex-col items-center w-full max-w-2xl">
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
        <div className="text-center animate-in fade-in slide-in-from-bottom-2 space-y-4 w-full">
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

          {/* Corrective Feedback: Why this verb is correct */}
          {correctVerbExplanation && (
            <div className="mt-4 p-3 bg-[#252525] rounded-lg border border-blue-500/30">
              <p className="text-blue-400 text-xs font-bold mb-2">
                なぜ「{scenario.requiredVerb}」？
              </p>
              <p className="text-gray-100 text-sm leading-relaxed">
                {correctVerbExplanation.japanese_text}
              </p>
              {settings.englishLabels && (
                <p className="text-gray-300 text-xs mt-2 italic">
                  {correctVerbExplanation.english_text}
                </p>
              )}
            </div>
          )}

          {/* Comparative Feedback: Show other verbs when hints are enabled */}
          {/* Verb headings: English suppressed. Explanation sentences: follow englishLabels setting */}
          {settings.hints && otherVerbExplanations.length > 0 && (
            <div className="mt-4 p-3 bg-[#1e1e1e] rounded-lg border border-gray-700">
              <p className="text-gray-200 text-xs font-bold mb-3">
                他の動詞との比較
              </p>
              <div className="space-y-3 text-left">
                {otherVerbExplanations.map((verbInfo) => (
                  <div 
                    key={verbInfo.verb} 
                    className="p-2 bg-[#252525] rounded border border-gray-600/50"
                  >
                    <p className="text-gray-100 text-xs font-semibold mb-1">
                      <span className="text-rose-400">{verbInfo.verbMasu}</span>
                    </p>
                    <p className="text-gray-200 text-xs leading-relaxed">
                      {verbInfo.japanese_text}
                    </p>
                    {settings.englishLabels && (
                      <p className="text-gray-300 text-xs mt-1 italic">
                        {verbInfo.english_text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
