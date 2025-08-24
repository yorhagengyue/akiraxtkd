/**
 * Taeguek E (2) Jang Page
 */

import PatternPage from '@/components/PatternPage';

const taeguekejangPattern = {
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
  videoPath: '/clips/taeguek-e-jang.mp4',
  difficulty: 'Beginner' as const,
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
};

export default function TaeguekEJangPage() {
  return <PatternPage pattern={taeguekejangPattern} />;
}