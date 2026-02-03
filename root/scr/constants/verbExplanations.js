// --- Verb Explanation Data for Corrective Feedback ---
export const VERB_EXPLANATIONS = [
  {
    verb: "morau",
    verbMasu: "もらいます",
    japanese_text: "話し手が、対等または目下の人から物を受け取る時に使う一般的な動詞です。",
    english_text: "The standard verb used when the speaker receives something from someone of equal or lower status."
  },
  {
    verb: "itadaku",
    verbMasu: "いただきます",
    japanese_text: "「もらう」の謙譲語です。話し手が、目上の人から物を受け取る時に使い、相手を高めます。",
    english_text: "The humble form of 'morau.' Used when the speaker receives something from a superior, elevating the giver."
  },
  {
    verb: "yaru",
    verbMasu: "やります",
    japanese_text: "話し手が、自分より明らかに立場が低い相手（動物、植物、身内の年下など）に物を与える時に使います。",
    english_text: "Used when the speaker gives something to a receiver of clearly lower status (e.g., animals, plants, or younger family members)."
  },
  {
    verb: "ageru",
    verbMasu: "あげます",
    japanese_text: "話し手が、対等の立場の人に物を与える時に使う一般的な動詞です。",
    english_text: "The standard verb used when the speaker gives something to someone of equal status."
  },
  {
    verb: "sashiageru",
    verbMasu: "さしあげます",
    japanese_text: "「あげる」の謙譲語です。話し手が、目上の人に物を与える時に使い、へりくだった表現になります。",
    english_text: "The humble form of 'ageru.' Used when the speaker gives something to a superior, expressing deference."
  },
  {
    verb: "kureru",
    verbMasu: "くれます",
    japanese_text: "他の人が、話し手（私）に物を与える時に使います。くれる人が対等または目下の場合です。",
    english_text: "Used when someone gives something to the speaker (me). The giver is of equal or lower status."
  },
  {
    verb: "kudasaru",
    verbMasu: "くださいます",
    japanese_text: "「くれる」の尊敬語です。目上の人が、話し手（私）に物を与えてくださる時に使います。",
    english_text: "The honorific form of 'kureru.' Used when a superior kindly gives something to the speaker (me)."
  }
];

// Helper function to get explanation by verb key or masu form
export const getVerbExplanation = (verbKey) => {
  return VERB_EXPLANATIONS.find(
    v => v.verb === verbKey || v.verbMasu === verbKey
  );
};

// Helper to get all verb explanations except the correct one
export const getOtherVerbExplanations = (correctVerbMasu) => {
  return VERB_EXPLANATIONS.filter(v => v.verbMasu !== correctVerbMasu);
};
