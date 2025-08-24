'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandRing, AnimatedCTA, FloatingElement } from '@/components/animations/HeroAnimations'
import { sectionVariants, staggerContainer, staggerItem } from '@/lib/animations'
const slides = [
  {
    id: 1,
    title: "Premier Martial Arts Training",
    subtitle: "Excellence in Martial Arts Education",
    description: "Experience world-class martial arts training with our professional instructors",
    color: '#1e40af', // Deep Blue
    bgText: "Martial Arts Training"
  },
  {
    id: 2,
    title: "Professional Training Studio",
    subtitle: "Quality Training Without Compromise",
    description: "Small class sizes ensure personalized attention and rapid skill development",
    color: '#2563eb', // Blue
    bgText: "Professional Studio"
  },
  {
    id: 3,
    title: "International Standards",
    subtitle: "Certified Training Programs",
    description: "Training programs that meet international standards and prepare you for success",
    color: '#1e3a8a', // Dark Blue
    bgText: "International Standards"
  }
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="relative h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-gray-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-accent-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-primary-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-accent-400 rounded-full opacity-25 animate-spin"></div>
      </div>

             {/* Slides */}
       <div className="absolute inset-0">
         <div 
           className="w-full h-full relative transition-all duration-1000"
           style={{
             background: `
               linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.3) 100%),
               linear-gradient(45deg, ${slides[currentSlide].color}20 0%, ${slides[currentSlide].color}40 100%),
               radial-gradient(circle at 30% 70%, ${slides[currentSlide].color}30 0%, transparent 50%)
             `
           }}
         >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="text-center text-white max-w-4xl px-4 relative"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              key={currentSlide}
            >
              {/* Brand Ring */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                <BrandRing size={100} />
              </div>

              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-4 leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
                variants={staggerItem}
              >
                {slides[currentSlide].title}
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl mb-6 text-accent-400 font-semibold"
                variants={staggerItem}
              >
                {slides[currentSlide].subtitle}
              </motion.p>
              
              <motion.p 
                className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-gray-200"
                variants={staggerItem}
              >
                {slides[currentSlide].description}
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={staggerItem}
              >
                <AnimatedCTA 
                  variant="primary"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3 text-lg shadow-lg"
                >
                  Start Your Journey
                </AnimatedCTA>
                
                <AnimatedCTA 
                  variant="secondary"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg backdrop-blur-sm"
                >
                  Learn More
                </AnimatedCTA>
              </motion.div>
            </motion.div>

            {/* Floating Elements */}
            <div className="absolute right-10 top-1/4 hidden lg:block">
              <FloatingElement delay={0} amplitude={15} duration={8}>
                <div className="w-20 h-20 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-20">
                  <span className="text-2xl">🥋</span>
                </div>
              </FloatingElement>
            </div>
            
            <div className="absolute right-32 bottom-1/4 hidden lg:block">
              <FloatingElement delay={2} amplitude={12} duration={6}>
                <div className="w-16 h-16 bg-accent-500 bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-accent-400 border-opacity-30">
                  <span className="text-xl">🏆</span>
                </div>
              </FloatingElement>
            </div>

            <div className="absolute left-10 bottom-1/3 hidden lg:block">
              <FloatingElement delay={4} amplitude={10} duration={7}>
                <div className="w-12 h-12 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary-400 border-opacity-30">
                  <span className="text-lg">⭐</span>
                </div>
              </FloatingElement>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-3 rounded-full transition-all backdrop-blur-sm border border-white border-opacity-20 hover:scale-110 hover:-translate-x-1"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-3 rounded-full transition-all backdrop-blur-sm border border-white border-opacity-20 hover:scale-110 hover:translate-x-1"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-300 hover:scale-125 ${
              index === currentSlide ? 'w-8 h-3' : 'w-3 h-3'
            }`}
          >
            <div
              className={`w-full h-full rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white shadow-lg'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-70'
              }`}
            />
            {index === currentSlide && (
              <div className="absolute inset-0 bg-accent-500 rounded-full transition-all duration-300" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}