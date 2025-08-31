import Header from '@/components/Header'
import HeroCarousel from '@/components/HeroCarousel'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import AnimatedPage from '@/components/animations/AnimatedPage'
import ScrollReveal from '@/components/animations/ScrollReveal'
import HeroAnimations from '@/components/animations/HeroAnimations'
import HomeRedirect from '@/components/HomeRedirect'
import { Award, Users, Calendar, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const quickLinks = [
    {
      title: "About Us",
      description: "Learn about our academy, team, and certifications",
      href: "/about",
      icon: <Award className="w-8 h-8" />,
      color: "from-primary-500 to-primary-600"
    },
    {
      title: "Our Classes", 
      description: "Explore our training programs and schedules",
      href: "/classes",
      icon: <Users className="w-8 h-8" />,
      color: "from-accent-500 to-accent-600"
    },
    {
      title: "Patterns (Poomsae)",
      description: "Master taekwondo forms and techniques",
      href: "/patterns", 
      icon: <Calendar className="w-8 h-8" />,
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <HomeRedirect>
      <AnimatedPage showBeltProgress={true} beltColor="blue">
        <main className="min-h-screen">
          <Header />
        
          <HeroAnimations showLightingSweep={true} showDojoTexture={true}>
            <HeroCarousel />
          </HeroAnimations>
          
          {/* Quick Navigation Section */}
          <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-primary-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Welcome to Akira X Taekwondo
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Professional taekwondo training in Singapore. Discover our programs, meet our team, 
                  and start your martial arts journey with us.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {quickLinks.map((link, index) => (
                  <ScrollReveal key={index}>
                    <Link href={link.href}>
                      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer">
                        <div className={`h-32 bg-gradient-to-br ${link.color} relative`}>
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <div className="group-hover:scale-110 transition-transform duration-300">
                              {link.icon}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {link.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            {link.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors">
                              Learn More
                            </span>
                            <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">10+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-600 mb-2">5</div>
                  <div className="text-gray-600">Training Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
                  <div className="text-gray-600">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">6</div>
                  <div className="text-gray-600">Weekly Classes</div>
                </div>
              </div>
            </div>
          </section>
          
          <ScrollReveal>
            <ContactSection />
          </ScrollReveal>
          
          <Footer />
        </main>
      </AnimatedPage>
    </HomeRedirect>
  )
}
