export default function ClassesSection() {
  const classes = [
    {
      name: "Monday Classes",
      ageRange: "8pm to 9pm",
      location: "604 Tampines Avenue 9",
      description: "Weekly taekwondo training sessions with focus on technique and discipline",
      image: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=Monday+Classes",
      features: ["Technical training", "Belt progression", "Fitness development", "Character building"]
    },
    {
      name: "Tuesday Classes",
      ageRange: "7:30pm to 8:30pm",
      location: "211C Compassvale Lane",
      description: "Mid-week training focusing on forms and sparring techniques",
      image: "https://via.placeholder.com/400x300/2563eb/ffffff?text=Tuesday+Classes",
      features: ["Poomsae practice", "Sparring techniques", "Flexibility training", "Mental focus"]
    },
    {
      name: "Thursday Classes",
      ageRange: "7:30pm to 9pm",
      location: "217C Compassvale Drive",
      description: "Extended training session with comprehensive skill development",
      image: "https://via.placeholder.com/400x300/1d4ed8/ffffff?text=Thursday+Classes",
      features: ["Extended practice", "Advanced techniques", "Competition prep", "Strength building"]
    },
    {
      name: "Friday Classes",
      ageRange: "6:30pm to 8pm & 8pm to 9:30pm",
      location: "Fengshan CC, Bedok North Street 2",
      description: "Two Friday sessions - fundamentals and advanced training",
      image: "https://via.placeholder.com/400x300/1e3a8a/ffffff?text=Friday+Classes",
      features: ["Fundamental techniques", "Advanced sparring", "Competition training", "Flexible timing"]
    },
    {
      name: "Saturday Classes",
      ageRange: "Time TBA",
      location: "207A Compassvale Lane",
      description: "Weekend training sessions for all skill levels",
      image: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Saturday+Classes",
      features: ["Weekend training", "All skill levels", "Flexible practice", "Community building"]
    }
  ]

  return (
    <section id="classes" className="py-16 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-accent-100 to-primary-100 rounded-full opacity-30 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            CLASSES
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you're a beginner or advanced practitioner, we offer comprehensive martial arts programs 
            designed to meet your individual goals and skill level.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((classItem, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:scale-105"
            >
              <div className="h-48 bg-cover bg-center relative overflow-hidden" 
                   style={{ backgroundImage: `url(${classItem.image})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-primary-900/80 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white group-hover:-translate-y-1 transition-transform duration-200">
                  <h3 className="text-xl font-bold group-hover:text-accent-400 transition-colors">
                    {classItem.name}
                  </h3>
                  <p className="text-sm opacity-90">{classItem.ageRange}</p>
                  <p className="text-xs opacity-80 mt-1">{classItem.location}</p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:rotate-12">
                  <div className="w-4 h-4 bg-accent-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {classItem.description}
                </p>
                
                <ul className="space-y-3 mb-6">
                  {classItem.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full mr-3 hover:scale-150 transition-transform duration-200"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-md hover:scale-105 hover:shadow-lg">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the difference of learning at our professional martial arts academy, where passion meets precision, 
            and excellence defines every training session.
          </p>
          <button className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-10 py-4 rounded-xl font-semibold transition-all shadow-lg text-lg hover:scale-105 hover:shadow-xl">
            View All Classes
          </button>
        </div>
      </div>
    </section>
  )
}