import { useCallback } from 'react';
import { romajiToHiragana, isValidJapaneseInput } from '../utils';

// useInputHandler - handles input change with Hiragana conversion and cursor preservation
export function useInputHandler(inputRef, setInputValue, setFeedback, setInvalidInput) {
  const handleInputChange = useCallback((e) => {
    const input = e.target;
    const rawValue = input.value;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    
    // Check for invalid characters (non-Japanese, non-romaji)
    if (!isValidJapaneseInput(rawValue)) {
      setInvalidInput(true);
      setTimeout(() => setInvalidInput(false), 500);
      return; // Don't update input with invalid characters
    }
    
    // Get the portion before cursor to calculate length difference
    const beforeCursor = rawValue.slice(0, selectionStart);
    const convertedBeforeCursor = romajiToHiragana(beforeCursor);
    
    // Convert full value to Hiragana
    const hiraganaValue = romajiToHiragana(rawValue);
    
    // Calculate new cursor position based on converted text before cursor
    const newCursorPos = convertedBeforeCursor.length;
    
    setInputValue(hiraganaValue);
    setFeedback(null);
    
    // Restore cursor position after React re-renders
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.selectionStart = newCursorPos;
        inputRef.current.selectionEnd = newCursorPos + (selectionEnd - selectionStart);
      }
    });
  }, [inputRef, setInputValue, setFeedback, setInvalidInput]);

  return handleInputChange;
}
