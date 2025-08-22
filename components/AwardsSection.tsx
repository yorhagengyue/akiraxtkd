import { Trophy, Medal, Star, Award } from 'lucide-react'

export default function AwardsSection() {
  const awards = [
    {
      icon: <Trophy className="w-12 h-12" />,
      title: "Excellence in Martial Arts",
      year: "2023",
      organization: "Martial Arts Federation"
    },
    {
      icon: <Medal className="w-12 h-12" />,
      title: "Outstanding Training Program",
      year: "2023",
      organization: "Sports Excellence Council"
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: "Professional Instructor Award",
      year: "2022",
      organization: "Martial Arts Association"
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Quality Education Award",
      year: "2022",
      organization: "Education Standards Board"
    },
    {
      icon: <Trophy className="w-12 h-12" />,
      title: "Innovation in Training",
      year: "2021",
      organization: "Sports Innovation Awards"
    },
    {
      icon: <Medal className="w-12 h-12" />,
      title: "Community Service Award",
      year: "2021",
      organization: "Community Foundation"
    }
  ]

  return (
    <section id="awards" className="py-16 bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AWARDS
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join us today and discover why we're a leading martial arts academy and the top choice for 
            professional martial arts training. Explore our award-winning programs and see how 
            we've become leaders in martial arts education with our unmatched commitment to excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {awards.map((award, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-primary-600 mb-4 flex justify-center">
                  {award.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {award.title}
                </h3>
                <p className="text-accent-600 font-semibold mb-2">
                  {award.year}
                </p>
                <p className="text-gray-600 text-sm">
                  {award.organization}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors mr-4">
            MORE AWARDS
          </button>
          <button className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            View Certificates
          </button>
        </div>

        <div className="mt-12 bg-white rounded-lg p-8 shadow-md">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Recognition & Accreditation
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-primary-600 mb-2">
                  <Award className="w-8 h-8 mx-auto" />
                </div>
                <h4 className="font-semibold text-gray-900">Martial Arts Federation</h4>
                <p className="text-gray-600 text-sm">Certified Member</p>
              </div>
              <div>
                <div className="text-primary-600 mb-2">
                  <Trophy className="w-8 h-8 mx-auto" />
                </div>
                <h4 className="font-semibold text-gray-900">Singapore Taekwondo Federation</h4>
                <p className="text-gray-600 text-sm">Certificated Club</p>
              </div>
              <div>
                <div className="text-primary-600 mb-2">
                  <Star className="w-8 h-8 mx-auto" />
                </div>
                <h4 className="font-semibold text-gray-900">International Standards</h4>
                <p className="text-gray-600 text-sm">Excellent Safety Standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
