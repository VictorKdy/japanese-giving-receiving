import { VALIDATION_ERRORS } from '../constants';
import { toHiragana } from './hiraganaUtils';

// Get hiragana reading from furigana data (works for both items and entities)
const getReading = (obj) => {
  if (!obj.furigana) return obj.name;
  return obj.furigana.map(f => f.rt || toHiragana(f.text)).join('');
};

// Normalize input: convert to hiragana and remove spaces
const normalizeInput = (str) => toHiragana(str).replace(/\s+/g, '').trim();

// Helper to get localized error message
export const getErrorMessage = (errorKey, showEnglish, ...args) => {
  const error = VALIDATION_ERRORS[errorKey];
  if (!error) return '';
  
  const jaText = typeof error.ja === 'function' ? error.ja(...args) : error.ja;
  const enText = typeof error.en === 'function' ? error.en(...args) : error.en;
  
  if (showEnglish) {
    return { primary: jaText, subtitle: enText };
  }
  return { primary: jaText, subtitle: null };
};

// Main validation function
export const validateInput = (input, scenario, isAdvanced, showEnglish = false) => {
  // Convert input to Hiragana before validation to allow Kanji/Katakana input
  const cleanInput = normalizeInput(input);
  
  if (cleanInput.length < 5) {
    const msg = getErrorMessage('sentenceTooShort', showEnglish);
    return { valid: false, message: msg.primary, subtitle: msg.subtitle };
  }

  const { giver, receiver, item, perspective, action } = scenario;
  
  // Get hiragana readings for flexible matching
  const perspectiveReading = getReading(perspective);
  const itemReading = getReading(item);
  
  // 1. Identify Topic/Perspective (Must use 'は')
  // Check both Kanji and Hiragana versions
  const topicPhraseKanji = perspective.name + 'は';
  const topicPhraseHiragana = perspectiveReading + 'は';
  const hasTopic = cleanInput.includes(topicPhraseKanji) || cleanInput.includes(topicPhraseHiragana);
  
  if (!hasTopic) {
    const msg = getErrorMessage('missingTopic', showEnglish, perspective.name);
    return { valid: false, message: msg.primary, subtitle: msg.subtitle };
  }

  // 2. Identify Item (Must use 'を')
  // Check both Kanji and Hiragana versions, also check for が particle
  const itemPhraseWoKanji = item.name + 'を';
  const itemPhraseWoHiragana = itemReading + 'を';
  const itemPhraseGaKanji = item.name + 'が';
  const itemPhraseGaHiragana = itemReading + 'が';
  
  const hasItem = cleanInput.includes(itemPhraseWoKanji) || 
                  cleanInput.includes(itemPhraseWoHiragana) ||
                  cleanInput.includes(itemPhraseGaKanji) ||
                  cleanInput.includes(itemPhraseGaHiragana);
  
  if (!hasItem) {
    const msg = getErrorMessage('missingObject', showEnglish, item.name);
    return { valid: false, message: msg.primary, subtitle: msg.subtitle };
  }

  // 3. Logic & Verb Check - Following the flowchart exactly
  const isSubjectGiver = perspective.id === giver.id;
  let requiredVerb = '';
  let requiredParticle = 'に'; // Default particle
  let interactionTarget = isSubjectGiver ? receiver : giver;
  let interactionTargetName = interactionTarget.name;
  let interactionTargetReading = getReading(interactionTarget);

  if (!isSubjectGiver) {
    // RECEIVING BRANCH: Subject is the RECEIVER
    // Per flowchart: Subject must be in-group (speaker or speaker's group)
    // Particle: GIVER から
    // Verb: もらいます (giver inferior/equal) or いただきます (giver superior)
    requiredParticle = 'から'; // Flowchart shows から for receiving
    
    // Check giver's hierarchy to determine verb
    if (giver.hierarchy === 'superior') {
      requiredVerb = 'いただきます';
    } else {
      // Giver is equal or inferior
      requiredVerb = 'もらいます';
    }
  } else {
    // GIVING BRANCH: Subject is the GIVER
    // Per flowchart: Check if giving to in-group or out-group
    requiredParticle = 'に'; // Always に for receiver
    
    const isGiverInGroup = giver.group === 'in';
    const isReceiverInGroup = receiver.group === 'in';
    
    if (isReceiverInGroup && !isGiverInGroup) {
      // GIVING to IN-GROUP (receiver is speaker or speaker's group, giver is outsider)
      // Per flowchart: くれる family
      // Verb based on giver's hierarchy (the one giving to in-group)
      if (giver.hierarchy === 'superior') {
        requiredVerb = 'くださいます';
      } else {
        // Giver is equal or inferior
        requiredVerb = 'くれます';
      }
    } else {
      // GIVING to OUT-GROUP (or in-group to in-group like me to sister)
      // Per flowchart: あげる family
      // Verb based on receiver's hierarchy
      if (receiver.hierarchy === 'superior') {
        requiredVerb = 'さしあげます';
      } else if (receiver.hierarchy === 'inferior') {
        requiredVerb = 'やります';
      } else {
        // Receiver is equal or self
        requiredVerb = 'あげます';
      }
    }
  }

  // 4. Advanced Mode: Te-Form Check
  if (isAdvanced) {
    if (!action) {
      const msg = getErrorMessage('noActionDefined', showEnglish);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
    if (!cleanInput.includes(action.te)) {
      const msg = getErrorMessage('wrongTeForm', showEnglish, action.te, action.label);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
    // Check that te-form appears directly before the auxiliary verb
    const teFormWithVerb = action.te + requiredVerb;
    if (!cleanInput.includes(teFormWithVerb)) {
      const msg = getErrorMessage('teFormConnection', showEnglish, action.te, requiredVerb);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
  }

  // Check Verb - support all verb forms from the flowchart
  // Ageru family: やります, あげます, さしあげます
  // Kureru family: くれます, くださいます
  // Morau family: もらいます, いただきます
  const ageruFamily = ['やります', 'あげます', 'さしあげます'];
  const kureruFamily = ['くれます', 'くださいます'];
  const morauFamily = ['もらいます', 'いただきます'];
  
  const usedAgeruFamily = ageruFamily.some(v => cleanInput.includes(v));
  const usedKureruFamily = kureruFamily.some(v => cleanInput.includes(v));
  const usedMorauFamily = morauFamily.some(v => cleanInput.includes(v));
  
  if (!cleanInput.includes(requiredVerb)) {
    // Check if user used the right family but wrong form
    const requiredFamily = ageruFamily.includes(requiredVerb) ? 'ageru' :
                          kureruFamily.includes(requiredVerb) ? 'kureru' : 'morau';
    
    if (requiredFamily === 'kureru' && usedAgeruFamily) {
      const msg = getErrorMessage('useKuremasu', showEnglish);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
    if (requiredFamily === 'ageru' && usedKureruFamily) {
      const msg = getErrorMessage('useAgemasu', showEnglish);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
    if (isSubjectGiver && usedMorauFamily) {
      const msg = getErrorMessage('subjectIsGiving', showEnglish);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
    if (!isSubjectGiver && !usedMorauFamily) {
      const msg = getErrorMessage('subjectIsReceiving', showEnglish);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }

    const msg = getErrorMessage('incorrectVerb', showEnglish, requiredVerb);
    return { valid: false, message: msg.primary, subtitle: msg.subtitle };
  }

  // Check Interaction Target + Particle (check both Kanji and Hiragana)
  const targetWithNiKanji = interactionTargetName + 'に';
  const targetWithNiHiragana = interactionTargetReading + 'に';
  const targetWithKaraKanji = interactionTargetName + 'から';
  const targetWithKaraHiragana = interactionTargetReading + 'から';
  
  const hasNi = cleanInput.includes(targetWithNiKanji) || cleanInput.includes(targetWithNiHiragana);
  const hasKara = cleanInput.includes(targetWithKaraKanji) || cleanInput.includes(targetWithKaraHiragana);

  // Validate particle based on flowchart:
  // RECEIVING: use から (or に is also acceptable in Japanese)
  // GIVING: use に
  if (requiredParticle === 'から') {
    // Receiving: accept both から and に for flexibility
    if (!hasNi && !hasKara) {
      const msg = getErrorMessage('markSource', showEnglish, interactionTargetName);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
  } else {
    // Giving: must use に
    if (!hasNi) {
      const msg = getErrorMessage('markRecipient', showEnglish, interactionTargetName);
      return { valid: false, message: msg.primary, subtitle: msg.subtitle };
    }
  }

  const msg = getErrorMessage('perfect', showEnglish);
  return { valid: true, message: msg.primary, subtitle: msg.subtitle };
};
