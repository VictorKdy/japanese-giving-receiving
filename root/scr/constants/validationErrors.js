// --- Validation Error Messages (Localized) ---
export const VALIDATION_ERRORS = {
  sentenceTooShort: {
    ja: '文が短すぎます。',
    en: 'Sentence is too short.'
  },
  missingTopic: {
    ja: (name) => `主題から始めてください：${name}は...`,
    en: (name) => `Start with the topic: ${name}は...`
  },
  missingObject: {
    ja: (name) => `目的語を含めてください：${name}を...`,
    en: (name) => `Include the object: ${name}を...`
  },
  noActionDefined: {
    ja: 'エラー：アクションが定義されていません。',
    en: 'Error: No action defined.'
  },
  wrongTeForm: {
    ja: (te, label) => `正しいて形を使ってください：${te}（${label}）`,
    en: (te, label) => `Use the correct Te-form action: ${te} (${label})`
  },
  teFormConnection: {
    ja: (te, verb) => `て形を動詞に直接つなげてください：${te}${verb}`,
    en: (te, verb) => `Connect the te-form directly to the verb: ${te}${verb}`
  },
  useKuremasu: {
    ja: '自分や家族が何かをもらう時は「くれます」を使います。',
    en: "Use 'くれます' when someone gives to YOU (or your family)."
  },
  useAgemasu: {
    ja: '自分から他の人（外のグループ）にあげる時は「あげます」を使います。',
    en: "Use 'あげます' when giving to others (out-group)."
  },
  subjectIsGiving: {
    ja: '主語はあげる側です。「もらいます」は使いません。',
    en: "Subject is giving, not receiving. Don't use 'もらいます'."
  },
  subjectIsReceiving: {
    ja: '主語はもらう側です。「もらいます」を使ってください。',
    en: "Subject is receiving. Use 'もらいます'."
  },
  incorrectVerb: {
    ja: (verb) => `補助動詞が違います。正解：...${verb}`,
    en: (verb) => `Incorrect auxiliary verb. Expected: ...${verb}`
  },
  markSource: {
    ja: (name) => `出所（${name}）に「に」か「から」をつけてください。`,
    en: (name) => `Mark the source (${name}) with 'に' or 'から'.`
  },
  markRecipient: {
    ja: (name) => `受取人（${name}）に「に」をつけてください。`,
    en: (name) => `Mark the recipient (${name}) with 'に'.`
  },
  perfect: {
    ja: '完璧！',
    en: 'Perfect!'
  }
};
