import Header from '@/components/Header'
import HeroCarousel from '@/components/HeroCarousel'
import WhySection from '@/components/WhySection'
import ClassesSection from '@/components/ClassesSection'
import AwardsSection from '@/components/AwardsSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import AnimatedPage from '@/components/animations/AnimatedPage'
import ScrollReveal from '@/components/animations/ScrollReveal'
import HeroAnimations from '@/components/animations/HeroAnimations'
import HomeRedirect from '@/components/HomeRedirect'

export default function Home() {
  return (
    <HomeRedirect>
      <AnimatedPage showBeltProgress={true} beltColor="blue">
        <main className="min-h-screen">
          <Header />
        
        <HeroAnimations showLightingSweep={true} showDojoTexture={true}>
          <HeroCarousel />
        </HeroAnimations>
        
        <ScrollReveal>
          <WhySection />
        </ScrollReveal>
        
        <ScrollReveal>
          <ClassesSection />
        </ScrollReveal>
        
        <ScrollReveal>
          <AwardsSection />
        </ScrollReveal>
        
        <ScrollReveal>
          <ContactSection />
        </ScrollReveal>
        
        <Footer />
        </main>
      </AnimatedPage>
    </HomeRedirect>
  )
}
