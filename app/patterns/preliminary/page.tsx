/**
 * Preliminary Poomsae Page
 */

import PatternPage from '@/components/PatternPage';

const preliminaryPattern = {
  id: 'preliminary',
  name: 'Preliminary Poomsae',
  koreanName: '기본 품새',
  beltLevel: 'White Belt',
  beltColor: '#ffffff',
  description: 'The foundational pattern for all Taekwondo students, focusing on basic stances, blocks, and strikes.',
  keyPoints: [
    'Walking stance (앞서기)',
    'Low block (아래막기)',
    'Middle punch (몸통지르기)',
    'High block (위막기)',
    'Basic balance and coordination'
  ],
  videoPath: '/clips/preliminary-poomsae.mp4',
  difficulty: 'Beginner' as const,
  movements: 8,
  meaning: 'The Preliminary Poomsae serves as the foundation for all future patterns. It introduces students to the basic principles of Taekwondo movement, proper stancing, and fundamental techniques that will be built upon throughout their martial arts journey.',
  tips: [
    'Focus on maintaining proper stance width and depth',
    'Keep your back straight and shoulders relaxed',
    'Execute blocks and punches with crisp, decisive movements',
    'Practice breathing coordination with each technique',
    'Start slowly and gradually increase speed as you improve',
    'Pay attention to proper chamber positions for all techniques'
  ],
  prerequisites: [
    'Basic understanding of walking stance',
    'Familiarity with ready position',
    'Knowledge of basic counting in Korean'
  ]
};

export default function PreliminaryPage() {
  return <PatternPage pattern={preliminaryPattern} />;
}
