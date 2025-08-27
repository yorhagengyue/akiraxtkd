import { Award, Shield, Heart, Star, User, CheckCircle } from 'lucide-react'

interface Coach {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
  qualifications: string[];
  specialties: string[];
  experience: string;
}

export default function TeamSection() {
  const coaches: Coach[] = [
    {
      id: 'jasterfer-kellen',
      name: 'Jasterfer Kellen',
      title: 'Head Coach & Certified Instructor',
      image: 'https://via.placeholder.com/400x400/3b82f6/ffffff?text=Jasterfer+Kellen',
      bio: 'Dedicated taekwondo instructor with extensive experience in both competitive and educational aspects of martial arts. Committed to developing students through proper technique, discipline, and character building.',
      qualifications: [
        'NROC Certified Coach',
        'Taekwondo Kyorugi Referee',
        'Taekwondo Poomsae Referee',
        'First-Aid Certified',
        'MOE Certified Coach',
        'NCAP Technical Level 2'
      ],
      specialties: [
        'Competition Training',
        'Poomsae (Forms)',
        'Kyorugi (Sparring)',
        'Youth Development',
        'Technical Analysis',
        'Safety & First Aid'
      ],
      experience: '10+ years of coaching experience'
    }
  ];

  return (
    <section id="team" className="py-16 bg-gradient-to-br from-white via-primary-50/30 to-accent-50/30 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            OUR TEAM & COACHES
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet our experienced and certified instructors who are dedicated to helping you achieve your martial arts goals through expert guidance and personalized training.
          </p>
        </div>

        <div className="grid lg:grid-cols-1 gap-12 max-w-5xl mx-auto">
          {coaches.map((coach, index) => (
            <div
              key={coach.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Coach Image */}
                <div className="lg:w-80 h-80 lg:h-auto relative overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${coach.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Experience Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-accent-600" />
                      <span className="text-sm font-medium text-gray-900">{coach.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Coach Information */}
                <div className="flex-1 p-8 lg:p-10">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {coach.name}
                    </h3>
                    <p className="text-lg text-primary-600 font-semibold mb-4">
                      {coach.title}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {coach.bio}
                    </p>
                  </div>

                  {/* Qualifications */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-primary-600" />
                      Qualifications & Certifications
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {coach.qualifications.map((qualification, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg border border-primary-100 hover:bg-primary-100 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-800">{qualification}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-accent-600" />
                      Areas of Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {coach.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-2 bg-accent-50 text-accent-700 rounded-full text-sm font-medium border border-accent-200 hover:bg-accent-100 transition-colors"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact/Action */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Professional Instructor</span>
                      </div>
                      <button className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
                        <Heart className="w-4 h-4" />
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Training Programs
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Experience professional martial arts training under the guidance of our certified instructors. 
              Whether you're a beginner or advanced practitioner, our team is here to support your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
                Schedule a Trial Class
              </button>
              <button className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all">
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
