'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: "Premier Martial Arts Training",
    subtitle: "Excellence in Martial Arts Education",
    description: "Experience world-class martial arts training with our professional instructors",
    image: "https://via.placeholder.com/1920x600/1e40af/ffffff?text=Martial+Arts+Training"
  },
  {
    id: 2,
    title: "Professional Training Studio",
    subtitle: "Quality Training Without Compromise",
    description: "Small class sizes ensure personalized attention and rapid skill development",
    image: "https://via.placeholder.com/1920x600/2563eb/ffffff?text=Professional+Studio"
  },
  {
    id: 3,
    title: "International Standards",
    subtitle: "Certified Training Programs",
    description: "Training programs that meet international standards and prepare you for success",
    image: "https://via.placeholder.com/1920x600/1d4ed8/ffffff?text=International+Standards"
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
          className="w-full h-full bg-cover bg-center relative transition-all duration-1000"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${slides[currentSlide].image})`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent animate-fade-in">
                {slides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-accent-400 font-semibold animate-fade-in" style={{animationDelay: '0.2s'}}>
                {slides[currentSlide].subtitle}
              </p>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-gray-200 animate-fade-in" style={{animationDelay: '0.4s'}}>
                {slides[currentSlide].description}
              </p>
              <div className="space-x-4 animate-fade-in" style={{animationDelay: '0.6s'}}>
                <button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105 hover:shadow-xl">
                  Start Your Journey
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all backdrop-blur-sm hover:scale-105">
                  Learn More
                </button>
              </div>
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