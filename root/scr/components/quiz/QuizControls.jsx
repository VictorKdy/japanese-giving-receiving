import React from 'react';

export function QuizControls({ 
  showAnswer, 
  onGiveUp, 
  onRetry, 
  onNext 
}) {
  return (
    <div className="flex gap-4">
      {!showAnswer && (
        <button 
          onClick={onGiveUp}
          className="text-gray-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
        >
          わからない
        </button>
      )}
      
      {showAnswer && (
        <>
          <button 
            onClick={onRetry}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors cursor-pointer"
          >
            もう一度
          </button>
          <button 
            onClick={onNext}
            className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors cursor-pointer"
          >
            次へ
          </button>
        </>
      )}
    </div>
  );
}
