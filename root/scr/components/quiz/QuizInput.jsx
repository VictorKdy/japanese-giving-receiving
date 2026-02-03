import React from 'react';
import { XCircle } from 'lucide-react';

export function QuizInput({ 
  inputRef, 
  inputValue, 
  onInputChange, 
  onKeyDown, 
  showAnswer, 
  invalidInput,
  feedback,
  placeholder,
  readOnly = false
}) {
  return (
    <div className="w-full relative">
      <input 
        ref={inputRef}
        type="text" 
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        disabled={showAnswer}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full bg-white text-gray-900 rounded-full py-4 px-8 text-lg font-medium shadow-[0_0_20px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-80 disabled:bg-gray-200 ${readOnly ? 'cursor-default bg-gray-100' : ''} ${invalidInput ? 'animate-giggle ring-2 ring-red-500' : ''}`}
      />
      {(feedback?.type === 'error' || showAnswer) && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 animate-in zoom-in">
          <XCircle size={28} />
        </div>
      )}
    </div>
  );
}
