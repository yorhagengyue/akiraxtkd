/**
 * Taeguek Pal (8) Jang Page
 */

import PatternPage from '@/components/PatternPage';

const taeguekpaljangPattern = {
  id: 'taeguek-pal-jang',
  name: 'Taeguek Pal (8) Jang',
  koreanName: '태극 팔장',
  beltLevel: 'Red Belt with Black Tip',
  beltColor: '#ef4444',
  description: 'The eighth and final Taeguek pattern, representing "Gon" which symbolizes earth - the foundation and source of all life.',
  keyPoints: [
    'Complex combinations',
    'Multiple kick sequences',
    'Advanced hand techniques',
    'Difficult stance transitions',
    'Jump back kick (뛰어뒤차기)',
    'Preparation for black belt forms'
  ],
  videoPath: '/clips/taeguek-pal-8-jang.mp4',
  difficulty: 'Advanced' as const,
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
};

export default function TaeguekPalJangPage() {
  return <PatternPage pattern={taeguekpaljangPattern} />;
}