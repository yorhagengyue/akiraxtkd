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
    <section id="why" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            WHY TAEKWONDONOMICS?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              As a <strong>boutique taekwondo studio</strong>, Taekwondonomics is the perfect choice for parents looking for supervised contact sports learning without compromise in quality of trainers and training. <strong>Taekwondo class Singapore</strong> is elevated to new heights with Taekwondonomics, as we are affiliated with the Singapore Taekwondo Federation (National Sports Association for Taekwondo).
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Equipped with the latest facilities and the <strong>best taekwondo Singapore</strong> has to offer, we pride ourselves on providing the finest coaching and training experiences. Our school is recognized as the <strong>best picked taekwondo school</strong> in Asia, offering trainees the opportunity to experience global <strong>taekwondo training in Singapore</strong> that meets international standards.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              We are also the only <strong>award-winning taekwondo school</strong> with multiple accolades and mandates from both local and Asia's auditing bodies. Our dedication to quality makes us the go-to for the <strong>best taekwondo classes in Singapore</strong>, where trainees can learn under the guidance of the best in the industry.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
            Whether you're searching for a <strong>taekwondo class Singapore</strong> or want to join a <strong>boutique taekwondo studio</strong>, Taekwondonomics is the name to trust. Experience the difference of learning at the <strong>best taekwondo Singapore</strong> school, where passion meets precision, and global standards define every session.
          </p>
        </div>
      </div>
    </section>
  )
}
