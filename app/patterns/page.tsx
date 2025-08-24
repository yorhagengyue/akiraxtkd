/**
 * Taekwondo Patterns (Poomsae) Main Page
 * Overview of all introductory patterns with belt progression
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedPage from '@/components/animations/AnimatedPage';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { Play, Award, BookOpen, Target } from 'lucide-react';

interface Pattern {
  id: string;
  name: string;
  koreanName: string;
  beltLevel: string;
  beltColor: string;
  description: string;
  keyPoints: string[];
  videoPath: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const patterns: Pattern[] = [
  {
    id: 'preliminary',
    name: 'Preliminary Poomsae',
    koreanName: '기본 품새',
    beltLevel: 'White Belt',
    beltColor: '#ffffff',
    description: 'The foundational pattern for beginners, focusing on basic stances, blocks, and strikes.',
    keyPoints: ['Basic stances', 'Fundamental blocks', 'Simple strikes', 'Balance and coordination'],
    videoPath: '/clips/preliminary.mp4',
    difficulty: 'Beginner'
  },
  {
    id: 'taeguek-il-jang',
    name: 'Taeguek IL Jang',
    koreanName: '태극 일장',
    beltLevel: 'Yellow Belt',
    beltColor: '#ffd700',
    description: 'First of the Taeguek series, representing the symbol of "Keon" - heaven and light.',
    keyPoints: ['Walking stance', 'Low block', 'Middle punch', 'Front kick'],
    videoPath: '/clips/taeguek-il-jang.mp4',
    difficulty: 'Beginner'
  },
  {
    id: 'taeguek-e-jang',
    name: 'Taeguek E (2) Jang',
    koreanName: '태극 이장',
    beltLevel: 'Yellow Belt with Green Stripe',
    beltColor: '#ffd700',
    description: 'Second Taeguek pattern, representing "Tae" - joyfulness and firmness.',
    keyPoints: ['Inner block', 'Knife hand strike', 'Side kick', 'Back stance'],
    videoPath: '/clips/taeguek-e-jang.mp4',
    difficulty: 'Beginner'
  },
  {
    id: 'taeguek-sam-jang',
    name: 'Taeguek Sam (3) Jang',
    koreanName: '태극 삼장',
    beltLevel: 'Green Belt',
    beltColor: '#008000',
    description: 'Third Taeguek pattern, representing "Ra" - fire, sun, and heat.',
    keyPoints: ['Double knife hand block', 'Spear hand thrust', 'Roundhouse kick', 'Cat stance'],
    videoPath: '/clips/taeguek-sam-jang.mp4',
    difficulty: 'Intermediate'
  },
  {
    id: 'taeguek-sa-jang',
    name: 'Taeguek Sa (4) Jang',
    koreanName: '태극 사장',
    beltLevel: 'Green Belt with Blue Stripe',
    beltColor: '#008000',
    description: 'Fourth Taeguek pattern, representing "Jin" - thunder, great power and dignity.',
    keyPoints: ['Double forearm block', 'Back fist strike', 'Side kick', 'Cross stance'],
    videoPath: '/clips/taeguek-sa-jang.mp4',
    difficulty: 'Intermediate'
  },
  {
    id: 'taeguek-o-jang',
    name: 'Taeguek O (5) Jang',
    koreanName: '태극 오장',
    beltLevel: 'Blue Belt',
    beltColor: '#0000ff',
    description: 'Fifth Taeguek pattern, representing "Seon" - wind, gentle but sometimes violent.',
    keyPoints: ['Hammer fist strike', 'Elbow strike', 'Hook kick', 'Crane stance'],
    videoPath: '/clips/taeguek-o-jang.mp4',
    difficulty: 'Intermediate'
  },
  {
    id: 'taeguek-yuk-jang',
    name: 'Taeguek Yuk (6) Jang',
    koreanName: '태극 육장',
    beltLevel: 'Blue Belt with Red Stripe',
    beltColor: '#0000ff',
    description: 'Sixth Taeguek pattern, representing "Gam" - water, flowing and adaptable.',
    keyPoints: ['High block', 'Palm heel strike', 'Axe kick', 'Twist stance'],
    videoPath: '/clips/taeguek-yuk-jang.mp4',
    difficulty: 'Advanced'
  },
  {
    id: 'taeguek-chil-jang',
    name: 'Taeguek Chil (7) Jang',
    koreanName: '태극 칠장',
    beltLevel: 'Red Belt',
    beltColor: '#ff0000',
    description: 'Seventh Taeguek pattern, representing "Gan" - mountain, ponderance and firmness.',
    keyPoints: ['Tiger stance', 'Ridge hand strike', 'Turning kick', 'Jump techniques'],
    videoPath: '/clips/taeguek-chil-jang.mp4',
    difficulty: 'Advanced'
  },
  {
    id: 'taeguek-pal-jang',
    name: 'Taeguek Pal (8) Jang',
    koreanName: '태극 팔장',
    beltLevel: 'Red Belt with Black Stripe',
    beltColor: '#ff0000',
    description: 'Eighth and final Taeguek pattern, representing "Gon" - earth, the foundation.',
    keyPoints: ['Complex combinations', 'Multiple kicks', 'Advanced techniques', 'Preparation for black belt'],
    videoPath: '/clips/taeguek-pal-jang.mp4',
    difficulty: 'Advanced'
  }
];

export default function PatternsPage() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50';
      case 'Intermediate': return 'text-blue-600 bg-blue-50';
      case 'Advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <AnimatedPage showBeltProgress={true} beltColor="blue">
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Taekwondo Patterns (Poomsae)
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              품새 - The Art of Form and Technique
            </p>
            <p className="text-lg max-w-3xl mx-auto opacity-80">
              Master the fundamental patterns of Taekwondo, from basic movements to advanced techniques. 
              Each pattern represents a step in your martial arts journey.
            </p>
          </div>
        </section>

        {/* Patterns Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Introductory Poomsae
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Progress through the belt system by mastering each pattern. 
                  Click on any pattern to view detailed instructions and video demonstrations.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {patterns.map((pattern, index) => (
                <ScrollReveal key={pattern.id} delay={index * 100}>
                  <Link href={`/patterns/${pattern.id}`}>
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:scale-105">
                      {/* Belt Color Bar */}
                      <div 
                        className="h-2 w-full"
                        style={{ backgroundColor: pattern.beltColor === '#ffffff' ? '#e5e7eb' : pattern.beltColor }}
                      ></div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(pattern.difficulty)}`}>
                            {pattern.difficulty}
                          </div>
                          <Play className="w-6 h-6 text-primary-600 group-hover:text-accent-600 transition-colors" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {pattern.name}
                        </h3>
                        <p className="text-gray-600 font-medium mb-2">
                          {pattern.koreanName}
                        </p>
                        <p className="text-sm text-primary-600 font-medium mb-3">
                          {pattern.beltLevel}
                        </p>
                        
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                          {pattern.description}
                        </p>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                            <Target className="w-4 h-4 mr-2" />
                            Key Techniques
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {pattern.keyPoints.slice(0, 3).map((point, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {point}
                              </span>
                            ))}
                            {pattern.keyPoints.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{pattern.keyPoints.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Tips */}
        <ScrollReveal>
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Pattern Learning Tips
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Study the Form</h3>
                  <p className="text-gray-600 text-sm">
                    Watch the video demonstrations carefully and understand each movement's purpose.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-accent-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Practice Slowly</h3>
                  <p className="text-gray-600 text-sm">
                    Master each technique slowly before attempting full speed execution.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Perfect with Repetition</h3>
                  <p className="text-gray-600 text-sm">
                    Consistent practice builds muscle memory and improves technique quality.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>
      
      <Footer />
    </AnimatedPage>
  );
}
