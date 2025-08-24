/**
 * Reusable Pattern Page Component
 * Displays individual pattern details with video player
 */

'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedPage from '@/components/animations/AnimatedPage';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Maximize,
  Award,
  Target,
  Clock,
  Users,
  BookOpen
} from 'lucide-react';
import PatternPoster from '@/components/PatternPoster';

interface PatternData {
  id: string;
  name: string;
  koreanName: string;
  beltLevel: string;
  beltColor: string;
  description: string;
  keyPoints: string[];
  videoPath: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  movements: number;
  meaning?: string;
  tips: string[];
  prerequisites?: string[];
}

interface PatternPageProps {
  pattern: PatternData;
}

export default function PatternPage({ pattern }: PatternPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'Intermediate': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <AnimatedPage showBeltProgress={true} beltColor="blue">
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
        {/* Breadcrumb */}
        <section className="py-4 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/patterns" className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Patterns
            </Link>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${getDifficultyColor(pattern.difficulty)} text-gray-800 bg-white`}>
                  {pattern.difficulty} Level
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {pattern.name}
                </h1>
                <p className="text-2xl mb-4 opacity-90">
                  {pattern.koreanName}
                </p>
                <p className="text-lg opacity-80 mb-6">
                  {pattern.description}
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    <span>{pattern.beltLevel}</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    <span>{pattern.movements} Movements</span>
                  </div>
                </div>
              </div>
              
              {/* Belt Visual */}
              <div className="text-center">
                <div className="w-32 h-8 rounded-lg mx-auto mb-4 border-2 border-white/20" 
                     style={{ backgroundColor: pattern.beltColor === '#ffffff' ? '#e5e7eb' : pattern.beltColor }}>
                </div>
                <p className="text-lg font-medium">{pattern.beltLevel}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Video Section */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        className="w-full aspect-video bg-black"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onMouseEnter={() => setShowControls(true)}
                        onMouseLeave={() => setShowControls(false)}
                        poster=""
                      >
                        <source src={pattern.videoPath} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      
                      {/* Custom Poster */}
                      <div className="absolute inset-0 pointer-events-none">
                        <PatternPoster 
                          patternName={pattern.name}
                          beltColor={pattern.beltColor}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                    
                    {/* Custom Video Controls */}
                    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={togglePlay}
                            className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                          >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                          </button>
                          
                          <button
                            onClick={restartVideo}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                          >
                            <RotateCcw className="w-5 h-5" />
                          </button>
                          
                          <button
                            onClick={toggleMute}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                          >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                          </button>
                        </div>
                        
                        <button
                          onClick={toggleFullscreen}
                          className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Maximize className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Pattern Demonstration</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Watch this detailed demonstration of {pattern.name}. Pay attention to the timing, 
                      stance transitions, and breathing patterns. Practice along with the video at your own pace.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Pattern Details */}
            <div className="space-y-8">
              {/* Key Techniques */}
              <ScrollReveal delay={200}>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="w-6 h-6 mr-2 text-primary-600" />
                    Key Techniques
                  </h3>
                  <div className="space-y-2">
                    {pattern.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Pattern Meaning */}
              {pattern.meaning && (
                <ScrollReveal delay={300}>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <BookOpen className="w-6 h-6 mr-2 text-accent-600" />
                      Pattern Meaning
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{pattern.meaning}</p>
                  </div>
                </ScrollReveal>
              )}

              {/* Training Tips */}
              <ScrollReveal delay={400}>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-green-600" />
                    Training Tips
                  </h3>
                  <div className="space-y-3">
                    {pattern.tips.map((tip, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Prerequisites */}
              {pattern.prerequisites && pattern.prerequisites.length > 0 && (
                <ScrollReveal delay={500}>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Clock className="w-6 h-6 mr-2 text-blue-600" />
                      Prerequisites
                    </h3>
                    <div className="space-y-2">
                      {pattern.prerequisites.map((prereq, index) => (
                        <div key={index} className="text-gray-700 text-sm">
                          • {prereq}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </AnimatedPage>
  );
}
