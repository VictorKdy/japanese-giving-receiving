import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Flame, Trophy } from 'lucide-react';
import './index.css';

// Components
import { 
  RubyText, 
  EntityDisplay, 
  QuizInput, 
  QuizFeedback, 
  QuizControls, 
  SettingsPanel,
  SentenceBuilder
} from './components';

// Hooks
import { useClickOutside, useKeyboardShortcuts, useInputHandler } from './hooks';

// Utils
import { validateInput, generateScenario } from './utils';

export default function App() {
  const [scenario, setScenario] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showItemName, setShowItemName] = useState(false);
  const [isBuilderLocked, setIsBuilderLocked] = useState(false);
  const [shouldResetBuilder, setShouldResetBuilder] = useState(false);
  
  const inputRef = useRef(null);
  
  // Settings State
  const [settings, setSettings] = useState({
    hints: false,
    furigana: false,
    englishLabels: false,
    advancedMode: false,
    meCentric: false,
    convenientMode: true,
    verbFilters: {
      // Default ON: basic forms
      agemasu: true,      // あげます (あげる)
      kuremasu: true,     // くれます (くれる)
      moraimasu: true,    // もらいます (もらう)
      // Default OFF: honorific/humble variants
      yarimasu: false,    // やります (やる)
      sashiagemasu: false, // さしあげます (さしあげる)
      kudasaimasu: false, // くださいます (くださる)
      itadakimasu: false, // いただきます (いただく)
    },
  });

  // Click outside to close settings
  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);
  
  const settingsRef = useClickOutside(handleCloseSettings);
  
  // Input handler with Hiragana conversion
  const handleInputChange = useInputHandler(inputRef, setInputValue, setFeedback, setInvalidInput);

  const handleGenerateScenario = useCallback(() => {
    const newScenario = generateScenario(settings);
    setScenario(newScenario);
    setInputValue("");
    setFeedback(null);
    setShowItemName(false);
    setShowAnswer(false);
    setIsBuilderLocked(false);
  }, [settings]);

  useEffect(() => {
    handleGenerateScenario();
  }, [
    settings.advancedMode, 
    settings.meCentric, 
    settings.verbFilters.moraimasu, 
    settings.verbFilters.kuremasu, 
    settings.verbFilters.agemasu,
    settings.verbFilters.yarimasu,
    settings.verbFilters.sashiagemasu,
    settings.verbFilters.kudasaimasu,
    settings.verbFilters.itadakimasu
  ]);

  const handleCheck = useCallback(() => {
    if (!scenario) return;
    const result = validateInput(inputValue, scenario, settings.advancedMode, settings.englishLabels);
    
    if (result.valid) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      handleGenerateScenario();
      if (inputRef.current) inputRef.current.focus();
    } else {
      setFeedback({ type: 'error', text: result.message, subtitle: result.subtitle });
      setStreak(0);
      setShowAnswer(true);
      setIsBuilderLocked(true);
    }
  }, [scenario, inputValue, settings.advancedMode, settings.englishLabels, streak, maxStreak, handleGenerateScenario]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      if (showAnswer) {
        handleGenerateScenario();
        setShowAnswer(false);
        if (inputRef.current) inputRef.current.focus();
      } else {
        handleCheck();
      }
    }
  }, [showAnswer, handleGenerateScenario, handleCheck]);
  
  // Keyboard shortcuts for navigation
  useKeyboardShortcuts({
    showAnswer,
    onNext: () => {
      handleGenerateScenario();
      setShowAnswer(false);
      if (inputRef.current) inputRef.current.focus();
    },
    onCheck: handleCheck,
    inputRef
  });

  // Control handlers
  const handleGiveUp = useCallback(() => {
    setShowAnswer(true);
    setStreak(0);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleRetry = useCallback(() => {
    setInputValue("");
    setFeedback(null);
    setShowAnswer(false);
    setIsBuilderLocked(false);
    setShouldResetBuilder(true);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Callback when SentenceBuilder has completed reset
  const handleBuilderResetComplete = useCallback(() => {
    setShouldResetBuilder(false);
  }, []);

  const handleNext = useCallback(() => {
    handleGenerateScenario();
    setShowAnswer(false);
    if (inputRef.current) inputRef.current.focus();
  }, [handleGenerateScenario]);

  if (!scenario) return <div className="flex items-center justify-center h-screen bg-[#1a1a1a] text-white">Loading...</div>;
  
  const ItemIcon = scenario.item.icon;
  const placeholder = settings.advancedMode 
    ? `...${scenario.item.name}を${scenario.action?.te}...` 
    : "文を入力... (e.g. 私は田中さんに本をあげます)";

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-200 font-sans overflow-hidden">
      
      {/* Settings Dropdown */}
      <SettingsPanel 
        isOpen={isSettingsOpen}
        onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
        settingsRef={settingsRef}
        settings={settings}
        setSettings={setSettings}
      />

      {/* Main Content Area */}
      <main className="h-full flex flex-col items-center justify-start w-full relative pt-20 md:pt-16">
        
        {/* Top Right: Streak Counters */}
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

        {/* Visual Scenario */}
        <div className="w-full max-w-2xl mb-6 mt-4 md:mt-8">
          <div className="flex items-center justify-between px-8 md:px-16">
            <EntityDisplay 
              entity={scenario.giver} 
              role="giver" 
              isPerspective={scenario.perspective.id === scenario.giver.id} 
              showEnglish={settings.englishLabels} 
              showFurigana={settings.furigana} 
            />
            
            <div className="flex flex-col items-center mx-4">
              <div 
                className="bg-[#2a2a2a] p-3 rounded-full border border-[#333] mb-2 relative flex items-center justify-center w-14 h-14 cursor-pointer hover:border-gray-500 transition-colors"
                onMouseDown={(e) => e.preventDefault()}
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
              
              <div className="flex items-center justify-center mt-2 relative">
                <ArrowRight size={36} strokeWidth={2.5} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                
                {/* Advanced Mode Meaning */}
                {settings.advancedMode && scenario.action && settings.englishLabels && (
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-[10px] text-rose-400 font-medium whitespace-nowrap">
                    {scenario.action.meaning}
                  </div>
                )}
              </div>
            </div>

            <EntityDisplay 
              entity={scenario.receiver} 
              role="receiver" 
              isPerspective={scenario.perspective.id === scenario.receiver.id} 
              showEnglish={settings.englishLabels} 
              showFurigana={settings.furigana} 
            />
          </div>
        </div>

        {/* Typing Input Area */}
        <div className="w-full max-w-xl flex flex-col items-center space-y-3 px-4">
          
          {/* Show SentenceBuilder when Convenient Mode is enabled */}
          {settings.convenientMode ? (
            <SentenceBuilder 
              scenario={scenario}
              onSentenceChange={(text) => setInputValue(text)}
              onCheck={() => handleCheck()}
              showEnglish={settings.englishLabels}
              isLocked={isBuilderLocked}
              shouldReset={shouldResetBuilder}
              onResetComplete={handleBuilderResetComplete}
              verbFilters={settings.verbFilters}
            />
          ) : (
            <QuizInput 
              inputRef={inputRef}
              inputValue={inputValue}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              showAnswer={showAnswer}
              invalidInput={invalidInput}
              feedback={feedback}
              placeholder={placeholder}
              readOnly={false}
            />
          )}
          
          <QuizFeedback 
            feedback={feedback}
            showAnswer={showAnswer}
            scenario={scenario}
            settings={settings}
          />

          <QuizControls 
            showAnswer={showAnswer}
            onGiveUp={handleGiveUp}
            onRetry={handleRetry}
            onNext={handleNext}
          />

        </div>

      </main>
    </div>
  );
}
