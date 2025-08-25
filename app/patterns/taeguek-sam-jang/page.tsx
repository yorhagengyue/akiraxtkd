/**
 * Taeguek Sam (3) Jang Page
 */

import PatternPage from '@/components/PatternPage';

const taeguekSamJangPattern = {
  id: 'taeguek-sam-jang',
  name: 'Taeguek Sam (3) Jang',
  koreanName: '태극 삼장',
  beltLevel: 'Green Belt',
  beltColor: '#22c55e',
  description: 'The third Taeguek pattern, representing "Ra" which symbolizes fire, sun, and heat - bringing passion and energy to your techniques.',
  keyPoints: [
    'Double knife hand block (쌍수도막기)',
    'Spear hand thrust (관수돌리기)',
    'Roundhouse kick (돌려차기)',
    'Cat stance (학다리서기)',
    'Inner forearm block (안팔목막기)',
    'Back stance transitions (뒤서기)'
  ],
  videoPath: '/clips/taeguek-sam-3-jang.mp4',
  difficulty: 'Intermediate' as const,
  movements: 20,
  meaning: 'Taeguek Sam Jang represents "Ra" (☲), one of the eight trigrams of the I-Ching. Ra symbolizes fire, the sun, and heat. This pattern embodies the bright, hot, and energetic nature of fire, requiring students to demonstrate power, precision, and dynamic movement throughout the form.',
  tips: [
    'Execute double knife hand blocks with both hands moving simultaneously',
    'Maintain proper cat stance with 90% weight on the back leg',
    'Focus on hip rotation during roundhouse kicks',
    'Keep spear hand techniques sharp and precise',
    'Practice smooth transitions between back stance and walking stance',
    'Emphasize the "fire" element through dynamic, energetic movements',
    'Pay special attention to proper chamber positions for all hand techniques'
  ],
  prerequisites: [
    'Mastery of Taeguek Il Jang and E Jang',
    'Proficiency in basic kicks including front kick and roundhouse kick',
    'Understanding of back stance and cat stance',
    'Knowledge of knife hand techniques'
  ]
};

export default function TaeguekSamJangPage() {
  return <PatternPage pattern={taeguekSamJangPattern} />;
}
