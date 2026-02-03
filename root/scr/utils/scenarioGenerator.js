import { ENTITIES, ITEMS } from '../data';

// Determine which specific verb would be required for a scenario
const getRequiredVerb = (giver, receiver, perspective) => {
  const isSubjectGiver = perspective.id === giver.id;
  
  if (!isSubjectGiver) {
    // RECEIVING BRANCH: Subject is the RECEIVER
    if (giver.hierarchy === 'superior') {
      return 'itadakimasu'; // いただきます
    } else {
      return 'moraimasu'; // もらいます
    }
  } else {
    // GIVING BRANCH: Subject is the GIVER
    const isGiverInGroup = giver.group === 'in';
    const isReceiverInGroup = receiver.group === 'in';
    
    if (isReceiverInGroup && !isGiverInGroup) {
      // GIVING to IN-GROUP (くれる family)
      if (giver.hierarchy === 'superior') {
        return 'kudasaimasu'; // くださいます
      } else {
        return 'kuremasu'; // くれます
      }
    } else {
      // GIVING to OUT-GROUP (あげる family)
      if (receiver.hierarchy === 'superior') {
        return 'sashiagemasu'; // さしあげます
      } else if (receiver.hierarchy === 'inferior') {
        return 'yarimasu'; // やります
      } else {
        return 'agemasu'; // あげます
      }
    }
  }
};

// Generate a random scenario based on settings
export const generateScenario = (settings) => {
  let giver, receiver, perspective;
  const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  
  // Get enabled verb filters (all 7 verbs)
  const { 
    moraimasu, kuremasu, agemasu, 
    yarimasu, sashiagemasu, kudasaimasu, itadakimasu 
  } = settings.verbFilters;
  
  // Check if any verb is selected
  const hasAnyFilter = moraimasu || kuremasu || agemasu || 
                       yarimasu || sashiagemasu || kudasaimasu || itadakimasu;
  
  // If no verbs are selected, default to basic three
  const effectiveFilters = hasAnyFilter 
    ? { moraimasu, kuremasu, agemasu, yarimasu, sashiagemasu, kudasaimasu, itadakimasu } 
    : { moraimasu: true, kuremasu: true, agemasu: true, yarimasu: false, sashiagemasu: false, kudasaimasu: false, itadakimasu: false };

  // Build array of allowed specific verbs
  const allowedVerbs = [];
  if (effectiveFilters.yarimasu) allowedVerbs.push('yarimasu');
  if (effectiveFilters.agemasu) allowedVerbs.push('agemasu');
  if (effectiveFilters.sashiagemasu) allowedVerbs.push('sashiagemasu');
  if (effectiveFilters.kuremasu) allowedVerbs.push('kuremasu');
  if (effectiveFilters.kudasaimasu) allowedVerbs.push('kudasaimasu');
  if (effectiveFilters.moraimasu) allowedVerbs.push('moraimasu');
  if (effectiveFilters.itadakimasu) allowedVerbs.push('itadakimasu');

  if (settings.meCentric) {
    // Logic for Me-Centric Mode: Topic MUST be 'me'
    const me = ENTITIES.find(e => e.id === 'me');
    const others = ENTITIES.filter(e => e.id !== 'me');
    
    // Me is the topic (perspective)
    perspective = me;
    
    // Try to find a valid scenario where 'me' is the perspective
    // Me-centric can use: moraimasu/itadakimasu (me receives) or agemasu/yarimasu/sashiagemasu (me gives)
    const meCentricVerbs = allowedVerbs.filter(v => 
      v === 'moraimasu' || v === 'itadakimasu' || // receiving verbs
      v === 'agemasu' || v === 'yarimasu' || v === 'sashiagemasu' // giving verbs (not kureru family)
    );
    
    if (meCentricVerbs.length === 0) {
      // Fallback if no compatible verbs selected
      giver = others[Math.floor(Math.random() * others.length)];
      receiver = me;
    } else {
      // Pick a random allowed verb and generate matching scenario
      const chosenVerb = meCentricVerbs[Math.floor(Math.random() * meCentricVerbs.length)];
      
      if (chosenVerb === 'moraimasu' || chosenVerb === 'itadakimasu') {
        // Me receives: need to pick appropriate giver based on verb
        let eligibleGivers;
        if (chosenVerb === 'itadakimasu') {
          eligibleGivers = others.filter(e => e.hierarchy === 'superior');
        } else {
          eligibleGivers = others.filter(e => e.hierarchy !== 'superior');
        }
        giver = eligibleGivers.length > 0 
          ? eligibleGivers[Math.floor(Math.random() * eligibleGivers.length)]
          : others[Math.floor(Math.random() * others.length)];
        receiver = me;
      } else {
        // Me gives: need to pick appropriate receiver based on verb
        giver = me;
        let eligibleReceivers;
        if (chosenVerb === 'sashiagemasu') {
          eligibleReceivers = others.filter(e => e.hierarchy === 'superior');
        } else if (chosenVerb === 'yarimasu') {
          eligibleReceivers = others.filter(e => e.hierarchy === 'inferior');
        } else {
          eligibleReceivers = others.filter(e => e.hierarchy === 'equal');
        }
        receiver = eligibleReceivers.length > 0
          ? eligibleReceivers[Math.floor(Math.random() * eligibleReceivers.length)]
          : others[Math.floor(Math.random() * others.length)];
      }
    }

  } else {
    // Standard Logic with granular verb filtering
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
      giver = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
      receiver = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
      while (giver.id === receiver.id) {
        receiver = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
      }
      perspective = Math.random() > 0.5 ? giver : receiver;
      
      // Get the specific verb that would be required for this scenario
      const requiredVerb = getRequiredVerb(giver, receiver, perspective);
      
      // Check if this specific verb is allowed
      if (allowedVerbs.includes(requiredVerb)) break;
      attempts++;
    } while (attempts < maxAttempts);
  }
  
  // Pick specific action for advanced mode
  let action = null;
  if (settings.advancedMode && item.actions) {
     action = item.actions[Math.floor(Math.random() * item.actions.length)];
  }

  // Calculate the required verb and particle for this scenario
  const requiredVerbKey = getRequiredVerb(giver, receiver, perspective);
  
  // Map verb keys to Japanese text
  const verbMap = {
    'yarimasu': 'やります',
    'agemasu': 'あげます',
    'sashiagemasu': 'さしあげます',
    'kuremasu': 'くれます',
    'kudasaimasu': 'くださいます',
    'moraimasu': 'もらいます',
    'itadakimasu': 'いただきます'
  };
  
  const requiredVerb = verbMap[requiredVerbKey];
  
  // Determine required particle: から for receiving, に for giving
  const isSubjectGiver = perspective.id === giver.id;
  const requiredParticle = isSubjectGiver ? 'に' : 'から';

  return { giver, receiver, item, perspective, action, requiredVerb, requiredParticle };
};
