/**
 * Taeguek Chil (7) Jang Page
 */

import PatternPage from '@/components/PatternPage';

const taeguekchiljangPattern = {
  id: 'taeguek-chil-jang',
  name: 'Taeguek Chil (7) Jang',
  koreanName: '태극 칠장',
  beltLevel: 'Red Belt',
  beltColor: '#ef4444',
  description: 'The seventh Taeguek pattern, representing "Gan" which symbolizes mountain - ponderance, firmness, and immovability.',
  keyPoints: [
    'Tiger stance (범서기)',
    'Ridge hand strike (손날등치기)',
    'Turning kick (돌려차기)',
    'Jump front kick (뛰어앞차기)',
    'Knee strike (무릎치기)',
    'Double punch (두번지르기)'
  ],
  videoPath: '/clips/taeguek-chil-7-jang.mp4',
  difficulty: 'Advanced' as const,
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
};

export default function TaeguekChilJangPage() {
  return <PatternPage pattern={taeguekchiljangPattern} />;
}