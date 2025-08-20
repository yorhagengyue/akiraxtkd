import Header from '@/components/Header'
import HeroCarousel from '@/components/HeroCarousel'
import WhySection from '@/components/WhySection'
import ClassesSection from '@/components/ClassesSection'
import AwardsSection from '@/components/AwardsSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroCarousel />
      <WhySection />
      <ClassesSection />
      <AwardsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
