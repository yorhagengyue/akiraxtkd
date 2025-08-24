/**
 * Script to generate all pattern pages
 * Run with: node scripts/create-pattern-pages.js
 */

const fs = require('fs');
const path = require('path');

const patterns = [
  {
    id: 'taeguek-il-jang',
    name: 'Taeguek IL Jang',
    koreanName: '태극 일장',
    beltLevel: 'Yellow Belt',
    beltColor: '#ffd700',
    description: 'The first Taeguek pattern, representing "Keon" which symbolizes heaven and light - the beginning of all creation.',
    keyPoints: [
      'Walking stance (앞서기)',
      'Low block (아래막기)',
      'Middle punch (몸통지르기)',
      'Front kick (앞차기)',
      'High block (위막기)',
      'Inner forearm block (안팔목막기)'
    ],
    difficulty: 'Beginner',
    movements: 18,
    meaning: 'Taeguek Il Jang represents "Keon" (☰), symbolizing heaven, light, and the creative force. As the first Taeguek pattern, it establishes the foundation for all subsequent forms and represents the beginning of the student\'s journey toward mastery.',
    tips: [
      'Maintain consistent walking stance throughout the pattern',
      'Execute blocks with proper timing and distance',
      'Keep punches at solar plexus level',
      'Practice front kicks with proper knee chamber',
      'Focus on smooth, flowing movements',
      'Breathe naturally with each technique'
    ],
    prerequisites: [
      'Mastery of Preliminary Poomsae',
      'Understanding of walking stance',
      'Basic knowledge of front kick',
      'Familiarity with ready position and bow'
    ]
  },
  {
    id: 'taeguek-e-jang',
    name: 'Taeguek E (2) Jang',
    koreanName: '태극 이장',
    beltLevel: 'Yellow Belt with Green Stripe',
    beltColor: '#ffd700',
    description: 'The second Taeguek pattern, representing "Tae" which symbolizes joyfulness, serenity, and inner strength.',
    keyPoints: [
      'Inner forearm block (안팔목막기)',
      'Knife hand strike (손날치기)',
      'Side kick (옆차기)',
      'Back stance (뒤서기)',
      'Double punch (두번지르기)',
      'High block (위막기)'
    ],
    difficulty: 'Beginner',
    movements: 18,
    meaning: 'Taeguek E Jang represents "Tae" (☱), symbolizing joyfulness and the lake. This trigram embodies serenity on the surface with firmness beneath, teaching students to maintain composure while demonstrating strong technique.',
    tips: [
      'Master the transition into back stance',
      'Execute side kicks with proper knee chamber',
      'Keep knife hand strikes sharp and focused',
      'Maintain balance during stance changes',
      'Practice inner blocks with proper forearm position',
      'Coordinate breathing with movement flow'
    ],
    prerequisites: [
      'Mastery of Taeguek Il Jang',
      'Understanding of back stance',
      'Basic side kick technique',
      'Knowledge of knife hand positions'
    ]
  },
  {
    id: 'taeguek-sa-jang',
    name: 'Taeguek Sa (4) Jang',
    koreanName: '태극 사장',
    beltLevel: 'Green Belt with Blue Stripe',
    beltColor: '#008000',
    description: 'The fourth Taeguek pattern, representing "Jin" which symbolizes thunder, great power, and dignity.',
    keyPoints: [
      'Double forearm block (쌍팔목막기)',
      'Back fist strike (등주먹치기)',
      'Side kick (옆차기)',
      'Cross stance (꼬아서기)',
      'Knife hand strike (손날치기)',
      'Elbow strike (팔꿈치치기)'
    ],
    difficulty: 'Intermediate',
    movements: 20,
    meaning: 'Taeguek Sa Jang represents "Jin" (☳), symbolizing thunder and lightning. This pattern embodies great power, dignity, and the sudden, decisive nature of thunder, requiring students to demonstrate explosive power and precise timing.',
    tips: [
      'Execute double blocks with both arms moving simultaneously',
      'Generate power from hip rotation in back fist strikes',
      'Master the cross stance for proper balance',
      'Practice elbow strikes with proper chamber position',
      'Emphasize explosive power like thunder',
      'Maintain strong stances throughout transitions'
    ],
    prerequisites: [
      'Mastery of Taeguek Sam Jang',
      'Understanding of cross stance',
      'Proficiency in back fist techniques',
      'Knowledge of elbow strike applications'
    ]
  },
  {
    id: 'taeguek-o-jang',
    name: 'Taeguek O (5) Jang',
    koreanName: '태극 오장',
    beltLevel: 'Blue Belt',
    beltColor: '#0000ff',
    description: 'The fifth Taeguek pattern, representing "Seon" which symbolizes wind - gentle but sometimes violent and penetrating.',
    keyPoints: [
      'Hammer fist strike (메주먹치기)',
      'Elbow strike (팔꿈치치기)',
      'Hook kick (갈고리차기)',
      'Crane stance (학다리서기)',
      'Palm heel strike (바탕손치기)',
      'Roundhouse kick (돌려차기)'
    ],
    difficulty: 'Intermediate',
    movements: 20,
    meaning: 'Taeguek O Jang represents "Seon" (☴), symbolizing wind. Wind can be gentle and soothing or powerful and destructive. This pattern teaches students to be flexible like wind while maintaining the ability to strike with sudden, penetrating force.',
    tips: [
      'Master the crane stance with proper balance',
      'Execute hammer fist strikes with proper wrist position',
      'Practice hook kicks with controlled leg movement',
      'Focus on fluid transitions like flowing wind',
      'Develop timing for elbow strike combinations',
      'Maintain flexibility while demonstrating power'
    ],
    prerequisites: [
      'Mastery of Taeguek Sa Jang',
      'Understanding of crane stance',
      'Proficiency in hook kick technique',
      'Knowledge of various hand strike methods'
    ]
  },
  {
    id: 'taeguek-yuk-jang',
    name: 'Taeguek Yuk (6) Jang',
    koreanName: '태극 육장',
    beltLevel: 'Blue Belt with Red Stripe',
    beltColor: '#0000ff',
    description: 'The sixth Taeguek pattern, representing "Gam" which symbolizes water - flowing, persistent, and adaptable.',
    keyPoints: [
      'High block (위막기)',
      'Palm heel strike (바탕손치기)',
      'Axe kick (내려차기)',
      'Twist stance (비틀어서기)',
      'Ridge hand strike (손날등치기)',
      'Turning kick (돌려차기)'
    ],
    difficulty: 'Advanced',
    movements: 19,
    meaning: 'Taeguek Yuk Jang represents "Gam" (☵), symbolizing water. Water is soft and yielding yet persistent and powerful, capable of overcoming the hardest obstacles through constant pressure. This pattern teaches adaptability and persistent effort.',
    tips: [
      'Flow smoothly between techniques like water',
      'Master the twist stance for proper balance',
      'Execute axe kicks with controlled descent',
      'Practice palm heel strikes with proper wrist alignment',
      'Develop continuous movement without stopping',
      'Emphasize adaptability in technique application'
    ],
    prerequisites: [
      'Mastery of Taeguek O Jang',
      'Understanding of twist stance',
      'Proficiency in axe kick technique',
      'Knowledge of ridge hand applications'
    ]
  },
  {
    id: 'taeguek-chil-jang',
    name: 'Taeguek Chil (7) Jang',
    koreanName: '태극 칠장',
    beltLevel: 'Red Belt',
    beltColor: '#ff0000',
    description: 'The seventh Taeguek pattern, representing "Gan" which symbolizes mountain - ponderance, firmness, and immovability.',
    keyPoints: [
      'Tiger stance (범서기)',
      'Ridge hand strike (손날등치기)',
      'Turning kick (돌려차기)',
      'Jump front kick (뛰어앞차기)',
      'Knee strike (무릎치기)',
      'Double punch (두번지르기)'
    ],
    difficulty: 'Advanced',
    movements: 25,
    meaning: 'Taeguek Chil Jang represents "Gan" (☶), symbolizing the mountain. Mountains are firm, immovable, and ponderant, representing strength, stability, and the ability to endure. This pattern requires students to demonstrate unwavering determination and solid technique.',
    tips: [
      'Master the tiger stance with proper weight distribution',
      'Execute jump techniques with proper timing',
      'Demonstrate mountain-like stability in all stances',
      'Practice ridge hand strikes with precision',
      'Develop explosive power for jumping techniques',
      'Maintain ponderant, deliberate movements'
    ],
    prerequisites: [
      'Mastery of Taeguek Yuk Jang',
      'Understanding of tiger stance',
      'Proficiency in jumping kicks',
      'Knowledge of knee strike techniques'
    ]
  },
  {
    id: 'taeguek-pal-jang',
    name: 'Taeguek Pal (8) Jang',
    koreanName: '태극 팔장',
    beltLevel: 'Red Belt with Black Stripe',
    beltColor: '#ff0000',
    description: 'The eighth and final Taeguek pattern, representing "Gon" which symbolizes earth - the foundation and source of all life.',
    keyPoints: [
      'Complex combinations',
      'Multiple kick sequences',
      'Advanced hand techniques',
      'Difficult stance transitions',
      'Jump back kick (뛰어뒤차기)',
      'Preparation for black belt forms'
    ],
    difficulty: 'Advanced',
    movements: 24,
    meaning: 'Taeguek Pal Jang represents "Gon" (☷), symbolizing earth and the receptive principle. Earth is the foundation that supports all life, representing completion, receptivity, and the culmination of the Taeguek series. This pattern prepares students for black belt level training.',
    tips: [
      'Master all complex combination techniques',
      'Execute jump back kicks with proper form',
      'Demonstrate mastery of all previous Taeguek elements',
      'Focus on perfecting timing and rhythm',
      'Show readiness for black belt level training',
      'Embody the completeness and foundation of earth'
    ],
    prerequisites: [
      'Mastery of Taeguek Chil Jang',
      'Understanding of all basic and intermediate techniques',
      'Proficiency in jump back kick',
      'Readiness for black belt examination'
    ]
  }
];

// Create directories and pages for each pattern
patterns.forEach(pattern => {
  const dirPath = path.join(__dirname, '..', 'app', 'patterns', pattern.id);
  const filePath = path.join(dirPath, 'page.tsx');

  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Generate page content
  const pageContent = `/**
 * ${pattern.name} Page
 */

import PatternPage from '@/components/PatternPage';

const ${pattern.id.replace(/-/g, '')}Pattern = {
  id: '${pattern.id}',
  name: '${pattern.name}',
  koreanName: '${pattern.koreanName}',
  beltLevel: '${pattern.beltLevel}',
  beltColor: '${pattern.beltColor}',
  description: '${pattern.description}',
  keyPoints: [
${pattern.keyPoints.map(point => `    '${point}'`).join(',\n')}
  ],
  videoPath: '/clips/${pattern.id}.mp4',
  difficulty: '${pattern.difficulty}' as const,
  movements: ${pattern.movements},
  meaning: '${pattern.meaning}',
  tips: [
${pattern.tips.map(tip => `    '${tip}'`).join(',\n')}
  ],
  prerequisites: [
${pattern.prerequisites.map(prereq => `    '${prereq}'`).join(',\n')}
  ]
};

export default function ${pattern.name.replace(/[^a-zA-Z]/g, '')}Page() {
  return <PatternPage pattern={${pattern.id.replace(/-/g, '')}Pattern} />;
}`;

  // Write the file
  fs.writeFileSync(filePath, pageContent);
  console.log(`Created: ${filePath}`);
});

console.log('All pattern pages created successfully!');
