/**
 * Taeguek O (5) Jang Page
 */

import PatternPage from '@/components/PatternPage';

const taeguekojangPattern = {
  id: 'taeguek-o-jang',
  name: 'Taeguek O (5) Jang',
  koreanName: '태극 오장',
  beltLevel: 'Blue Belt',
  beltColor: '#3b82f6',
  description: 'The fifth Taeguek pattern, representing "Seon" which symbolizes wind - gentle but sometimes violent and penetrating.',
  keyPoints: [
    'Hammer fist strike (메주먹치기)',
    'Elbow strike (팔꿈치치기)',
    'Hook kick (갈고리차기)',
    'Crane stance (학다리서기)',
    'Palm heel strike (바탕손치기)',
    'Roundhouse kick (돌려차기)'
  ],
  videoPath: '/clips/taeguek-o-5-jang.mp4',
  difficulty: 'Intermediate' as const,
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
};

export default function TaeguekOJangPage() {
  return <PatternPage pattern={taeguekojangPattern} />;
}