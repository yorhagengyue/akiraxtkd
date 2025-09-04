import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhySection from '@/components/WhySection'
import TeamSection from '@/components/TeamSection'
import AwardsSection from '@/components/AwardsSection'
import AnimatedPage from '@/components/animations/AnimatedPage'
import ScrollReveal from '@/components/animations/ScrollReveal'
import { Award, Users, MapPin, Clock, Phone, Mail } from 'lucide-react'

export default function AboutPage() {
  return (
    <AnimatedPage showBeltProgress={true} beltColor="blue">
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              About Akira X Taekwondo
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Dedicated to excellence in martial arts education through professional training, 
              character development, and community building.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Award className="w-5 h-5" />
                <span>Certified Training Center</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Users className="w-5 h-5" />
                <span>Expert Instructors</span>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction - Why Choose Us */}
        <ScrollReveal>
          <WhySection />
        </ScrollReveal>

        {/* Our Team & Coaches */}
        <ScrollReveal>
          <TeamSection />
        </ScrollReveal>

        {/* Awards & Recognition */}
        <ScrollReveal>
          <AwardsSection />
        </ScrollReveal>

        {/* Locations */}
        <section id="locations" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                OUR LOCATIONS
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Training centers conveniently located across Singapore to serve our community.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Location Cards */}
              {[
                {
                  name: "Tampines Training Center",
                  address: "604 Tampines Avenue 9",
                  schedule: "Monday: 8:00 PM - 9:00 PM",
                  phone: "+65 8766 8794"
                },
                {
                  name: "Compassvale Center A",
                  address: "211C Compassvale Lane",
                  schedule: "Tuesday: 7:30 PM - 8:30 PM",
                  phone: "+65 8766 8794"
                },
                {
                  name: "Compassvale Center B",
                  address: "217C Compassvale Drive",
                  schedule: "Thursday: 7:30 PM - 9:00 PM",
                  phone: "+65 8766 8794"
                },
                {
                  name: "Fengshan Community Club",
                  address: "Fengshan CC, Bedok North Street 2",
                  schedule: "Friday: 6:30 PM - 9:30 PM",
                  phone: "+65 8766 8794"
                },
                {
                  name: "Compassvale Center C",
                  address: "207A Compassvale Lane",
                  schedule: "Saturday: Contact for schedule",
                  phone: "+65 8766 8794"
                }
              ].map((location, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
                  <div className="h-48 bg-gradient-to-br from-primary-500 to-accent-500 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <MapPin className="w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold">{location.name}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Address</p>
                          <p className="text-gray-600 text-sm">{location.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Schedule</p>
                          <p className="text-gray-600 text-sm">{location.schedule}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Contact</p>
                          <a href={`tel:${location.phone}`} className="text-primary-600 hover:text-primary-700 text-sm transition-colors">
                            {location.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} target="_blank" rel="noopener noreferrer" className="block w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-2 px-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-center">
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Visit Our Training Centers
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  All our locations are equipped with professional training facilities and safety equipment. 
                  Contact us to schedule a visit or trial class at any of our centers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://wa.me/6587668794?text=Hi%2C%20I%20would%20like%20to%20schedule%20a%20trial%20class" target="_blank" rel="noopener noreferrer" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center">
                    Schedule Trial Class
                  </a>
                  <a href="mailto:teamakiraxtaekwondo@gmail.com?subject=Training%20Enquiry" className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center">
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </AnimatedPage>
  )
}