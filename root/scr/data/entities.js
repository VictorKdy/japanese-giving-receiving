import { User, Briefcase, UserCheck, GraduationCap, Smile } from 'lucide-react';

// --- Game Entities ---
// Hierarchy levels: 'superior' (teacher, boss), 'equal' (peers), 'inferior' (younger siblings), 'self' (私)
export const ENTITIES = [
  { 
    id: 'me', 
    name: '私', 
    furigana: [
      { text: '私', rt: 'わたし' }
    ],
    label: 'Me',
    english: 'I',
    type: 'self', group: 'in', hierarchy: 'self',
    icon: User 
  },
  { 
    id: 'tanaka', 
    name: '田中さん', 
    furigana: [
      { text: '田中', rt: 'たなか' },
      { text: 'さん', rt: '' }
    ], 
    label: 'Tanaka-san',
    english: 'Tanaka',
    type: 'other', group: 'out', hierarchy: 'equal',
    icon: Briefcase 
  },
  { 
    id: 'satou', 
    name: '佐藤さん', 
    furigana: [
      { text: '佐藤', rt: 'さとう' },
      { text: 'さん', rt: '' }
    ], 
    label: 'Satou-san',
    english: 'Satou',
    type: 'other', group: 'out', hierarchy: 'equal',
    icon: UserCheck 
  },
  { 
    id: 'sensei', 
    name: '先生', 
    furigana: [
      { text: '先生', rt: 'せんせい' }
    ], 
    label: 'Teacher',
    english: 'Teacher',
    type: 'other', group: 'out', hierarchy: 'superior',
    icon: GraduationCap 
  },
  { 
    id: 'imouto', 
    name: '私の妹', 
    furigana: [
      { text: '私の妹', rt: 'わたしのいもうと' }
    ], 
    label: 'Younger Sister',
    english: 'my younger sister',
    type: 'family', group: 'in', hierarchy: 'inferior',
    icon: Smile 
  },
];
