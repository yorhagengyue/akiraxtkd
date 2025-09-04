import { Award, Users, Trophy, Star } from 'lucide-react'

export default function WhySection() {
  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Award-Winning School",
      description: "Multiple accolades from local and Asia's auditing bodies"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Coaches",
      description: "Learn from the best trainers with international experience"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Global Standards",
      description: "Training that meets international taekwondo standards"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Boutique Experience",
      description: "Small classes with personalized attention and quality focus"
    }
  ]

  return (
    <section id="about" className="py-16 bg-gradient-to-br from-gray-50 via-white to-primary-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full opacity-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            ABOUT AKIRA X TAEKWONDO
          </h2>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">胜灵跆拳道</h3>
          
          {/* Brand Information */}
          <div className="max-w-4xl mx-auto space-y-6 mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong className="text-primary-600">Akira X Taekwondo 胜灵跆拳道</strong> is an affiliate of the Singapore Taekwondo Federation, dedicated to promoting the art and discipline of Taekwondo with excellence and integrity.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-xl font-bold text-primary-600 mb-2">MOTTO</h4>
                <p className="text-gray-700 italic">"To do better than one's best"</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-xl font-bold text-accent-600 mb-2">VALUES</h4>
                <p className="text-gray-700 font-medium">"Respect and Responsibility"</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-xl font-bold text-primary-600 mb-2">MISSION</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Committed to imparting knowledge and values while building character, integrity, and discipline
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-8 rounded-xl border border-primary-100 mt-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h4>
              <p className="text-gray-700 leading-relaxed">
                Akira X Taekwondo is committed to imparting the knowledge and values of Taekwondo. 
                We place strong emphasis on character-building programs that instill <strong className="text-primary-600">integrity</strong>, 
                <strong className="text-primary-600"> discipline</strong>, and <strong className="text-primary-600">sportsmanship</strong>, 
                while fostering a harmonious and inclusive community spirit.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              As a <strong className="text-primary-600">professional martial arts academy</strong>, we are the perfect choice for students looking for supervised training without compromise in quality of instructors and programs. Our <strong className="text-primary-600">martial arts classes</strong> are elevated to new heights through our affiliation with recognized martial arts federations and organizations.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Equipped with modern facilities and <strong className="text-primary-600">experienced instructors</strong>, we pride ourselves on providing exceptional coaching and training experiences. Our academy is recognized for excellence, offering students the opportunity to experience <strong className="text-primary-600">world-class martial arts training</strong> that meets international standards.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              We are an <strong className="text-accent-600">award-winning martial arts academy</strong> with multiple recognitions from various martial arts organizations. Our dedication to quality makes us the top choice for <strong className="text-accent-600">martial arts education</strong>, where students can learn under the guidance of certified professional instructors.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:scale-105"
              >
                <div className="text-primary-600 mb-4 group-hover:text-accent-600 transition-colors group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto mb-8">
            Whether you're searching for <strong className="text-primary-600">martial arts classes</strong> or want to join a <strong className="text-primary-600">professional training academy</strong>, we are the name to trust. Experience the difference of learning at our <strong className="text-accent-600">premier martial arts school</strong>, where passion meets precision, and excellence defines every training session.
          </p>
          <a href="/classes" className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105 hover:shadow-xl">
            Discover Our Programs
          </a>
        </div>
      </div>
    </section>
  )
}