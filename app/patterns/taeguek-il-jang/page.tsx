/**
 * Taeguek IL Jang Page
 */

import PatternPage from '@/components/PatternPage';

const taeguekiljangPattern = {
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
  videoPath: '/clips/taeguek-il-1-jang.mp4',
  difficulty: 'Beginner' as const,
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
};

export default function TaeguekILJangPage() {
  return <PatternPage pattern={taeguekiljangPattern} />;
}