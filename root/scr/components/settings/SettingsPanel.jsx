import React from 'react';
import { Settings } from 'lucide-react';
import { Checkbox } from '../ui';

export function SettingsPanel({ 
  isOpen, 
  onToggle, 
  settingsRef,
  settings, 
  setSettings 
}) {
  return (
    <div className="fixed top-6 left-6 z-50" ref={settingsRef}>
      <button 
        onClick={onToggle}
        className={`flex items-center gap-2 text-gray-400 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 bg-[#333333] hover:bg-[#444] rounded px-3 py-1.5 text-sm cursor-pointer ${isOpen ? 'bg-[#444] text-white border-gray-500' : ''}`}
      >
        <Settings size={16} />
        <span>設定</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 max-h-[80vh] overflow-y-auto bg-[#333333] border border-[#444] rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 cursor-pointer">
          
          {/* Verb Filter Selection */}
          <div className="mb-4">
            <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-1">VERB FILTER</h3>
            <hr className="border-[#333] mb-2" />
            
            {/* あげる family */}
            <p className="text-[10px] text-gray-500 mb-1">あげる Family</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0 mb-2">
              <Checkbox 
                label="やる" 
                checked={settings.verbFilters.yarimasu} 
                onChange={() => setSettings(s => ({...s, verbFilters: {...s.verbFilters, yarimasu: !s.verbFilters.yarimasu}}))} 
              />
              <Checkbox 
                label="あげる" 
                checked={settings.verbFilters.agemasu} 
                onChange={() => setSettings(s => ({...s, verbFilters: {...s.verbFilters, agemasu: !s.verbFilters.agemasu}}))} 
              />
              <Checkbox 
                label="さしあげる" 
                checked={settings.verbFilters.sashiagemasu} 
                onChange={() => setSettings(s => ({...s, verbFilters: {...s.verbFilters, sashiagemasu: !s.verbFilters.sashiagemasu}}))} 
              />
            </div>
            
            {/* くれる family */}
            <p className="text-[10px] text-gray-500 mb-1">くれる Family</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0 mb-2">
              <Checkbox 
                label="くれる" 
                checked={settings.verbFilters.kuremasu} 
                onChange={() => setSettings(s => ({...s, verbFilters: {...s.verbFilters, kuremasu: !s.verbFilters.kuremasu}}))} 
              />
              <Checkbox 
                label="くださる" 
                checked={settings.verbFilters.kudasaimasu} 
                onChange={() => setSettings(s => ({...s, verbFilters: {...s.verbFilters, kudasaimasu: !s.verbFilters.kudasaimasu}}))} 
              />
            </div>
            
            {/* もらう family */}
            <p className="text-[10px] text-gray-500 mb-1">もらう Family</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0">
              <Checkbox 
                label="もらう" 
                checked={settings.verbFilters.moraimasu} 
                onChange={() => setSettings(s => ({...s, verbFilters: {...s.verbFilters, moraimasu: !s.verbFilters.moraimasu}}))} 
              />
              <Checkbox 
                label="いただく" 
                checked={settings.verbFilters.itadakimasu} 
                onChange={() => setSettings(s => ({...s, verbFilters: {...s.verbFilters, itadakimasu: !s.verbFilters.itadakimasu}}))} 
              />
            </div>
          </div>

          {/* Level Selection */}
          <div className="mb-4">
            <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-1">DIFFICULTY</h3>
            <hr className="border-[#333] mb-2" />
            <div className="grid grid-cols-2 gap-x-2 gap-y-0">
              <div>
                <Checkbox 
                  label="私中心モード" 
                  checked={settings.meCentric} 
                  onChange={() => setSettings(s => ({...s, meCentric: !s.meCentric}))} 
                />
                <p className="text-[10px] text-gray-500 ml-6 -mt-1">Me-Centric</p>
              </div>
              <div>
                <Checkbox 
                  label="て形練習" 
                  checked={settings.advancedMode} 
                  onChange={() => setSettings(s => ({...s, advancedMode: !s.advancedMode}))} 
                  disabled={settings.convenientMode}
                />
                <p className={`text-[10px] ml-6 -mt-1 ${settings.convenientMode ? 'text-gray-600' : 'text-gray-500'}`}>
                  Te-form {settings.convenientMode && '(無効)'}
                </p>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="mb-4">
            <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-1">DISPLAY OPTIONS</h3>
            <hr className="border-[#333] mb-2" />
            <div className="grid grid-cols-2 gap-x-2 gap-y-0">
              <div>
                <Checkbox 
                  label="英語表記" 
                  checked={settings.englishLabels} 
                  onChange={() => setSettings(s => ({...s, englishLabels: !s.englishLabels}))} 
                />
                <p className="text-[10px] text-gray-500 ml-6 -mt-1">English Labels</p>
              </div>
              <div>
                <Checkbox 
                  label="振仮名" 
                  checked={settings.furigana} 
                  onChange={() => setSettings(s => ({...s, furigana: !s.furigana}))} 
                />
                <p className="text-[10px] text-gray-500 ml-6 -mt-1">Furigana</p>
              </div>
            </div>
          </div>

          {/* Quiz Mode */}
          <div className="mb-2">
            <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-1">QUIZ HELPER</h3>
            <hr className="border-[#333] mb-2" />
            <div className="grid grid-cols-2 gap-x-2 gap-y-0">
              <div>
                <Checkbox 
                  label="かんたんモード" 
                  checked={settings.convenientMode} 
                  onChange={() => setSettings(s => {
                    const newConvenientMode = !s.convenientMode;
                    return {
                      ...s, 
                      convenientMode: newConvenientMode,
                      advancedMode: newConvenientMode ? false : s.advancedMode
                    };
                  })} 
                />
                <p className="text-[10px] text-gray-500 ml-6 -mt-1">Drag &amp; Drop</p>
              </div>
              <div>
                <Checkbox 
                  label="文法ヒント" 
                  checked={settings.hints} 
                  onChange={() => setSettings(s => ({...s, hints: !s.hints}))} 
                />
                <p className="text-[10px] text-gray-500 ml-6 -mt-1">Show Hints</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
