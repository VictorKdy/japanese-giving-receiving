import { Book, Gift, Apple, Coffee, Mail, Banknote, Candy, Flower } from 'lucide-react';

// --- Game Items ---
export const ITEMS = [
  { 
    id: 'book', 
    name: '本', 
    furigana: [
      { text: '本', rt: 'ほん' }
    ], 
    label: 'Book', 
    icon: Book,
    actions: [
      { 
        te: '貸して', 
        furigana: [
          { text: '貸', rt: 'か' },
          { text: 'して', rt: '' }
        ], 
        label: 'Lend', 
        meaning: 'Lending a book' 
      },
      { 
        te: '読んで', 
        furigana: [
          { text: '読', rt: 'よ' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Read', 
        meaning: 'Reading to someone' 
      },
      { 
        te: '選んで', 
        furigana: [
          { text: '選', rt: 'えら' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Choose', 
        meaning: 'Choosing a book' 
      },
      { 
        te: '買って', 
        furigana: [
          { text: '買', rt: 'か' },
          { text: 'って', rt: '' }
        ], 
        label: 'Buy', 
        meaning: 'Buying a book' 
      }
    ]
  },
  { 
    id: 'present', 
    name: 'プレゼント', 
    furigana: [
      { text: 'プレゼント', rt: 'ぷれぜんと' }
    ], 
    label: 'Present', 
    icon: Gift,
    actions: [
      { 
        te: '包んで', 
        furigana: [
          { text: '包', rt: 'つつ' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Wrap', 
        meaning: 'Wrapping a gift' 
      },
      { 
        te: '選んで', 
        furigana: [
          { text: '選', rt: 'えら' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Choose', 
        meaning: 'Choosing a gift' 
      },
      { 
        te: '送って', 
        furigana: [
          { text: '送', rt: 'おく' },
          { text: 'って', rt: '' }
        ], 
        label: 'Send', 
        meaning: 'Sending a gift' 
      },
      { 
        te: '隠して', 
        furigana: [
          { text: '隠', rt: 'かく' },
          { text: 'して', rt: '' }
        ], 
        label: 'Hide', 
        meaning: 'Hiding a surprise' 
      }
    ]
  },
  { 
    id: 'apple', 
    name: 'りんご', 
    furigana: [
      { text: 'りんご', rt: '' }
    ], 
    label: 'Apple', 
    icon: Apple,
    actions: [
      { 
        te: '切って', 
        furigana: [
          { text: '切', rt: 'き' },
          { text: 'って', rt: '' }
        ], 
        label: 'Cut', 
        meaning: 'Cutting an apple' 
      },
      { 
        te: '洗って', 
        furigana: [
          { text: '洗', rt: 'あら' },
          { text: 'って', rt: '' }
        ], 
        label: 'Wash', 
        meaning: 'Washing fruit' 
      },
      { 
        te: '剥いて', 
        furigana: [
          { text: '剥', rt: 'む' },
          { text: 'いて', rt: '' }
        ], 
        label: 'Peel', 
        meaning: 'Peeling fruit' 
      },
      { 
        te: '送って', 
        furigana: [
          { text: '送', rt: 'おく' },
          { text: 'って', rt: '' }
        ], 
        label: 'Send', 
        meaning: 'Sending apples' 
      }
    ]
  },
  { 
    id: 'coffee', 
    name: 'コーヒー', 
    furigana: [
      { text: 'コーヒー', rt: 'こーひー' }
    ], 
    label: 'Coffee', 
    icon: Coffee,
    actions: [
      { 
        te: '淹れて', 
        furigana: [
          { text: '淹', rt: 'い' },
          { text: 'れて', rt: '' }
        ], 
        label: 'Brew', 
        meaning: 'Brewing coffee' 
      },
      { 
        te: '買って', 
        furigana: [
          { text: '買', rt: 'か' },
          { text: 'って', rt: '' }
        ], 
        label: 'Buy', 
        meaning: 'Buying coffee' 
      },
      { 
        te: '持ってきて', 
        furigana: [
          { text: '持', rt: 'も' },
          { text: 'ってきて', rt: '' }
        ], 
        label: 'Bring', 
        meaning: 'Bringing coffee' 
      },
      { 
        te: '注文して', 
        furigana: [
          { text: '注文', rt: 'ちゅうもん' },
          { text: 'して', rt: '' }
        ], 
        label: 'Order', 
        meaning: 'Ordering coffee' 
      }
    ]
  },
  { 
    id: 'letter', 
    name: '手紙', 
    furigana: [
      { text: '手紙', rt: 'てがみ' }
    ], 
    label: 'Letter', 
    icon: Mail,
    actions: [
      { 
        te: '書いて', 
        furigana: [
          { text: '書', rt: 'か' },
          { text: 'いて', rt: '' }
        ], 
        label: 'Write', 
        meaning: 'Writing a letter' 
      },
      { 
        te: '読んで', 
        furigana: [
          { text: '読', rt: 'よ' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Read', 
        meaning: 'Reading a letter' 
      },
      { 
        te: '翻訳して', 
        furigana: [
          { text: '翻訳', rt: 'ほんやく' },
          { text: 'して', rt: '' }
        ], 
        label: 'Translate', 
        meaning: 'Translating a letter' 
      },
      { 
        te: '出して', 
        furigana: [
          { text: '出', rt: 'だ' },
          { text: 'して', rt: '' }
        ], 
        label: 'Mail', 
        meaning: 'Mailing a letter' 
      }
    ]
  },
  { 
    id: 'money', 
    name: 'お金', 
    furigana: [
      { text: 'お', rt: '' },
      { text: '金', rt: 'かね' }
    ], 
    label: 'Money', 
    icon: Banknote,
    actions: [
      { 
        te: '貸して', 
        furigana: [
          { text: '貸', rt: 'か' },
          { text: 'して', rt: '' }
        ], 
        label: 'Lend', 
        meaning: 'Lending money' 
      },
      { 
        te: '払って', 
        furigana: [
          { text: '払', rt: 'はら' },
          { text: 'って', rt: '' }
        ], 
        label: 'Pay', 
        meaning: 'Paying for someone' 
      },
      { 
        te: '両替して', 
        furigana: [
          { text: '両替', rt: 'りょうがえ' },
          { text: 'して', rt: '' }
        ], 
        label: 'Exchange', 
        meaning: 'Exchanging money' 
      },
      { 
        te: '送金して', 
        furigana: [
          { text: '送金', rt: 'そうきん' },
          { text: 'して', rt: '' }
        ], 
        label: 'Wire', 
        meaning: 'Wiring money' 
      }
    ]
  },
  { 
    id: 'sweets', 
    name: 'お菓子', 
    furigana: [
      { text: 'お', rt: '' },
      { text: '菓子', rt: 'かし' }
    ], 
    label: 'Sweets', 
    english: 'sweets',
    icon: Candy,
    actions: [
      { 
        te: '作って', 
        furigana: [
          { text: '作', rt: 'つく' },
          { text: 'って', rt: '' }
        ], 
        label: 'Make', 
        meaning: 'Baking sweets' 
      },
      { 
        te: '選んで', 
        furigana: [
          { text: '選', rt: 'えら' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Choose', 
        meaning: 'Choosing sweets' 
      },
      { 
        te: '配って', 
        furigana: [
          { text: '配', rt: 'くば' },
          { text: 'って', rt: '' }
        ], 
        label: 'Distribute', 
        meaning: 'Handing out sweets' 
      },
      { 
        te: '買って', 
        furigana: [
          { text: '買', rt: 'か' },
          { text: 'って', rt: '' }
        ], 
        label: 'Buy', 
        meaning: 'Buying sweets' 
      }
    ]
  },
  { 
    id: 'flower', 
    name: '花', 
    furigana: [
      { text: '花', rt: 'はな' }
    ], 
    label: 'Flowers', 
    icon: Flower,
    actions: [
      { 
        te: '飾って', 
        furigana: [
          { text: '飾', rt: 'かざ' },
          { text: 'って', rt: '' }
        ], 
        label: 'Decorate', 
        meaning: 'Displaying flowers' 
      },
      { 
        te: '選んで', 
        furigana: [
          { text: '選', rt: 'えら' },
          { text: 'んで', rt: '' }
        ], 
        label: 'Choose', 
        meaning: 'Choosing flowers' 
      },
      { 
        te: '届けて', 
        furigana: [
          { text: '届', rt: 'とど' },
          { text: 'けて', rt: '' }
        ], 
        label: 'Deliver', 
        meaning: 'Delivering flowers' 
      },
      { 
        te: '生けて', 
        furigana: [
          { text: '生', rt: 'い' },
          { text: 'けて', rt: '' }
        ], 
        label: 'Arrange', 
        meaning: 'Arranging flowers' 
      }
    ]
  },
];
