/**
 * About Page
 */

'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedPage from '@/components/animations/AnimatedPage'
import ScrollReveal from '@/components/animations/ScrollReveal'

export default function AboutPage() {
  return (
    <AnimatedPage showBeltProgress={false}>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">About</h1>
            <p className="text-lg opacity-90">Akira X Taekwondo 胜灵跆拳道</p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16" id="introduction">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-4">ABOUT</h2>
                <p className="text-gray-700 leading-relaxed">
                  Akira X Taekwondo 胜灵跆拳道 is an affiliate of the Singapore Taekwondo Federation, dedicated to promoting the art and discipline of Taekwondo with excellence and integrity.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <ScrollReveal>
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                  <h3 className="text-xl font-semibold mb-3">MOTTO</h3>
                  <p className="text-gray-700">"To do better than one's best"</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                  <h3 className="text-xl font-semibold mb-3">VALUES</h3>
                  <p className="text-gray-700">"Respect and Responsibility"</p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={150}>
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 mt-8">
                <h3 className="text-xl font-semibold mb-3">MISSION</h3>
                <p className="text-gray-700 leading-relaxed">
                  Akira X Taekwondo is committed to imparting the knowledge and values of Taekwondo. We place strong emphasis on character-building programs that instill integrity, discipline, and sportsmanship, while fostering a harmonious and inclusive community spirit.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <a href="/#contact" className="inline-block mt-10 px-6 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                Get in touch with us
              </a>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </AnimatedPage>
  )
}


