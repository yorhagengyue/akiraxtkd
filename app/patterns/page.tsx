/**
 * Taekwondo Patterns (Poomsae) Main Page
 * Overview of all introductory patterns with belt progression
 */

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedPage from '@/components/animations/AnimatedPage';
import ScrollReveal from '@/components/animations/ScrollReveal';
import VideoPreview from '@/components/VideoPreview';
import { Play, Award, BookOpen, Target, Search, Filter, ChevronDown, Home, ArrowRight, Check, User } from 'lucide-react';

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
    videoPath: '/clips/preliminary-poomsae.mp4',
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
    videoPath: '/clips/taeguek-il-1-jang.mp4',
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
    videoPath: '/clips/taeguek-e-2-jang.mp4',
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
    videoPath: '/clips/taeguek-sam-3-jang.mp4',
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
    videoPath: '/clips/taeguek-sa-4-jang.mp4',
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
    videoPath: '/clips/taeguek-o-5-jang.mp4',
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
    videoPath: '/clips/taeguek-yuk-6-jang.mp4',
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
    videoPath: '/clips/taeguek-chil-7-jang.mp4',
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
    videoPath: '/clips/taeguek-pal-8-jang.mp4',
    difficulty: 'Advanced'
  }
];

export default function PatternsPage() {
  // Filter and sort states
  const [selectedBelt, setSelectedBelt] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'sequence' | 'difficulty'>('sequence');
  const [userProgress, setUserProgress] = useState<Record<string, 'learning' | 'mastered'>>({});
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Extract unique techniques for filtering
  const allTechniques = useMemo(() => {
    const techniques = new Set<string>();
    patterns.forEach(pattern => {
      pattern.keyPoints.forEach(point => {
        // Extract technique name (before parentheses)
        const technique = point.split('(')[0].trim();
        techniques.add(technique);
      });
    });
    return Array.from(techniques).sort();
  }, []);

  // Filter and sort patterns
  const filteredPatterns = useMemo(() => {
    let filtered = patterns.filter(pattern => {
      // Belt filter
      if (selectedBelt !== 'all' && !pattern.beltLevel.toLowerCase().includes(selectedBelt)) {
        return false;
      }
      
      // Level filter
      if (selectedLevel !== 'all' && pattern.difficulty.toLowerCase() !== selectedLevel) {
        return false;
      }
      
      // Technique filter
      if (selectedTechniques.length > 0) {
        const hasSelectedTechnique = selectedTechniques.some(tech => 
          pattern.keyPoints.some(point => point.toLowerCase().includes(tech.toLowerCase()))
        );
        if (!hasSelectedTechnique) return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return pattern.name.toLowerCase().includes(query) ||
               pattern.koreanName.includes(query) ||
               pattern.beltLevel.toLowerCase().includes(query);
      }
      
      return true;
    });

    // Sort patterns
    if (sortBy === 'difficulty') {
      const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
      filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    }
    // Default is sequence order (already in correct order)

    return filtered;
  }, [selectedBelt, selectedLevel, selectedTechniques, searchQuery, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'Intermediate': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getBeltColor = (beltColor: string) => {
    return beltColor === '#ffffff' ? '#e5e7eb' : beltColor;
  };

  const handleProgressToggle = (patternId: string, status: 'learning' | 'mastered') => {
    // Check if user is logged in (mock check for now)
    const isLoggedIn = false; // Replace with actual auth check
    
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }
    
    setUserProgress(prev => ({
      ...prev,
      [patternId]: prev[patternId] === status ? undefined : status
    }));
  };

  const toggleTechnique = (technique: string) => {
    setSelectedTechniques(prev => 
      prev.includes(technique) 
        ? prev.filter(t => t !== technique)
        : [...prev, technique]
    );
  };

  return (
    <AnimatedPage showBeltProgress={true} beltColor="blue">
      <Header />
      
      <main className="min-h-screen relative">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50"></div>
        <div className="absolute inset-0 opacity-5 bg-[url('/img/tatami-pattern.png')] bg-repeat"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 opacity-15 bg-[url('/img/belt-ribbon.svg')] bg-no-repeat bg-bottom bg-contain"></div>
        
        {/* Breadcrumb Navigation */}
        <section className="relative z-10 py-4 bg-white/90 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="flex items-center text-primary-600 hover:text-primary-700 transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-900 font-medium">Patterns</span>
            </nav>
          </div>
        </section>

        {/* Hero Section - Reduced Height */}
        <section className="relative z-10 py-12 bg-gradient-to-r from-primary-600/95 to-accent-600/95 text-white overflow-hidden">
          {/* Aurora Background */}
          <div className="absolute inset-0 bg-[url('/img/aurora_bg.svg')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-[url('/img/noise_overlay.png')] bg-repeat opacity-20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Taekwondo Patterns (Poomsae)
            </h1>
            <p className="text-lg md:text-xl mb-3 opacity-90">
              품새 - The Art of Form and Technique
            </p>
            <p className="text-base max-w-2xl mx-auto opacity-80">
              Master the fundamental patterns of Taekwondo, from basic movements to advanced techniques.
            </p>
          </div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-accent-400"></div>
        </section>

        {/* Sticky Filter Bar */}
        <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patterns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Belt Filter */}
                <select
                  value={selectedBelt}
                  onChange={(e) => setSelectedBelt(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Belts</option>
                  <option value="white">White Belt</option>
                  <option value="yellow">Yellow Belt</option>
                  <option value="green">Green Belt</option>
                  <option value="blue">Blue Belt</option>
                  <option value="red">Red Belt</option>
                </select>

                {/* Level Filter */}
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'sequence' | 'difficulty')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="sequence">By Sequence</option>
                  <option value="difficulty">By Difficulty</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600 whitespace-nowrap">
                {filteredPatterns.length} of {patterns.length} patterns
              </div>
            </div>

            {/* Selected Techniques */}
            {selectedTechniques.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedTechniques.map(technique => (
                  <button
                    key={technique}
                    onClick={() => toggleTechnique(technique)}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
                  >
                    {technique}
                    <span className="ml-2 text-primary-500">×</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Patterns Grid */}
        <section className="relative z-10 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Introductory Poomsae
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Progress through the belt system by mastering each pattern.
              </p>
            </div>

            {/* Dynamic Pattern Layout */}
            <div className="space-y-8">
              {/* Belt Level Sections */}
              {['White Belt', 'Yellow Belt', 'Green Belt', 'Blue Belt', 'Red Belt'].map(beltLevel => {
                const beltPatterns = filteredPatterns.filter(p => p.beltLevel.includes(beltLevel.split(' ')[0]));
                if (beltPatterns.length === 0) return null;
                
                return (
                  <div key={beltLevel} className="belt-section">
                    {/* Belt Level Header */}
                    <div className="flex items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-3 rounded-full shadow-sm border"
                          style={{ 
                            backgroundColor: beltPatterns[0]?.beltColor === '#ffffff' ? '#e5e7eb' : beltPatterns[0]?.beltColor 
                          }}
                        ></div>
                        <h3 className="text-xl font-bold text-gray-900">{beltLevel}</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {beltPatterns.length} pattern{beltPatterns.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex-1 ml-6 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>
                    
                    {/* Patterns for this belt level */}
                    <div className="grid gap-6">
                      {beltPatterns.map((pattern, index) => (
                        <ScrollReveal key={pattern.id} delay={index * 100}>
                          <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                            <div className="flex flex-col lg:flex-row">
                              {/* Left: Video Preview Area */}
                              <VideoPreview
                                videoSrc={pattern.videoPath}
                                patternName={pattern.name}
                                beltColor={pattern.beltColor}
                                difficulty={pattern.difficulty}
                                className="lg:w-80 h-48 lg:h-auto"
                                autoPreview={true}
                              />
                              
                              {/* Right: Content */}
                              <div className="flex-1 p-6 lg:p-8">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <div className="flex items-baseline gap-3 mb-2">
                                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                        {pattern.name}
                                      </h3>
                                      <span className="text-lg text-gray-500 font-medium">
                                        {pattern.koreanName}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium mb-3">
                                      {pattern.beltLevel}
                                    </p>
                                  </div>
                                  
                                  <Link href={`/patterns/${pattern.id}`}>
                                    <button className="p-3 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
                                      <Play className="w-5 h-5" />
                                    </button>
                                  </Link>
                                </div>
                                
                                {/* Description */}
                                <p className="text-gray-700 leading-relaxed mb-6">
                                  {pattern.description}
                                </p>
                                
                                {/* Key Techniques Grid */}
                                <div className="mb-6">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                    <Target className="w-4 h-4 mr-2 text-primary-600" />
                                    Key Techniques
                                  </h4>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {pattern.keyPoints.slice(0, 6).map((point, idx) => {
                                      const technique = point.split('(')[0].trim();
                                      return (
                                        <button
                                          key={idx}
                                          onClick={() => toggleTechnique(technique)}
                                          className="text-left px-3 py-2 bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 text-sm rounded-lg transition-colors border border-transparent hover:border-primary-200"
                                        >
                                          {technique}
                                        </button>
                                      );
                                    })}
                                    {pattern.keyPoints.length > 6 && (
                                      <div className="px-3 py-2 bg-gray-50 text-gray-600 text-sm rounded-lg border">
                                        +{pattern.keyPoints.length - 6} more
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                  <div className="flex gap-3">
                                    <button
                                      onClick={() => handleProgressToggle(pattern.id, 'learning')}
                                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        userProgress[pattern.id] === 'learning'
                                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                          : 'bg-gray-100 text-gray-700 hover:bg-blue-50 border border-gray-200'
                                      }`}
                                    >
                                      <BookOpen className="w-4 h-4" />
                                      Learning
                                    </button>
                                    <button
                                      onClick={() => handleProgressToggle(pattern.id, 'mastered')}
                                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        userProgress[pattern.id] === 'mastered'
                                          ? 'bg-green-100 text-green-700 border border-green-200'
                                          : 'bg-gray-100 text-gray-700 hover:bg-green-50 border border-gray-200'
                                      }`}
                                    >
                                      <Check className="w-4 h-4" />
                                      Mastered
                                    </button>
                                  </div>
                                  
                                  <Link 
                                    href={`/patterns/${pattern.id}`}
                                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                                  >
                                    View Full Details
                                    <ArrowRight className="w-4 h-4" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Results */}
            {filteredPatterns.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patterns found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => {
                    setSelectedBelt('all');
                    setSelectedLevel('all');
                    setSelectedTechniques([]);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Learning Tips - Updated Design */}
        <section className="relative z-10 py-16 bg-white/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Pattern Learning Tips
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Study the Form</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Watch demonstrations carefully and understand each movement's purpose and application.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-accent-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Practice Slowly</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Master each technique slowly before attempting full speed execution.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Build Consistency</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Regular practice builds muscle memory and improves technique quality.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Login Prompt Toast */}
        {showLoginPrompt && (
          <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Login to Track Progress</h4>
                <p className="text-sm text-gray-600 mb-3">Sign in to save your learning progress and sync across devices.</p>
                <Link href="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Sign In →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </AnimatedPage>
  );
}
