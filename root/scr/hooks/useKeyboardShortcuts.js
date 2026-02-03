import { useEffect } from 'react';

// useKeyboardShortcuts - handles global keyboard events for navigation
export function useKeyboardShortcuts({ showAnswer, onNext, onCheck, inputRef }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if we're typing in the input
      if (document.activeElement === inputRef?.current) {
        return;
      }
      
      // Enter to proceed to next when showing answer
      if (e.key === 'Enter' && showAnswer) {
        e.preventDefault();
        onNext();
      }
      
      // Space to check answer when not showing answer
      if (e.key === ' ' && !showAnswer) {
        e.preventDefault();
        onCheck();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAnswer, onNext, onCheck, inputRef]);
}
