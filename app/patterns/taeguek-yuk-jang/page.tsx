/**
 * Taeguek Yuk (6) Jang Page
 */

import PatternPage from '@/components/PatternPage';

const taeguekyukjangPattern = {
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
  videoPath: '/clips/taeguek-yuk-jang.mp4',
  difficulty: 'Advanced' as const,
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
};

export default function TaeguekYukJangPage() {
  return <PatternPage pattern={taeguekyukjangPattern} />;
}