/**
 * Taeguek Sa (4) Jang Page
 */

import PatternPage from '@/components/PatternPage';

const taegueksajangPattern = {
  id: 'taeguek-sa-jang',
  name: 'Taeguek Sa (4) Jang',
  koreanName: '태극 사장',
  beltLevel: 'Green Belt with Blue Tip',
  beltColor: '#22c55e',
  description: 'The fourth Taeguek pattern, representing "Jin" which symbolizes thunder, great power, and dignity.',
  keyPoints: [
    'Double forearm block (쌍팔목막기)',
    'Back fist strike (등주먹치기)',
    'Side kick (옆차기)',
    'Cross stance (꼬아서기)',
    'Knife hand strike (손날치기)',
    'Elbow strike (팔꿈치치기)'
  ],
  videoPath: '/clips/taeguek-sa-4-jang.mp4',
  difficulty: 'Intermediate' as const,
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
};

export default function TaeguekSaJangPage() {
  return <PatternPage pattern={taegueksajangPattern} />;
}