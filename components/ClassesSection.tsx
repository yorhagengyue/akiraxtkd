export default function ClassesSection() {
  const classes = [
    {
      name: "Beginners",
      ageRange: "3-5 years",
      description: "Fun introduction to martial arts fundamentals with games and basic movements",
      image: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=Beginners+Class",
      features: ["Basic movements", "Coordination development", "Social skills", "Fun activities"]
    },
    {
      name: "Youth",
      ageRange: "6-12 years",
      description: "Structured learning with discipline, respect, and fundamental techniques",
      image: "https://via.placeholder.com/400x300/2563eb/ffffff?text=Youth+Class",
      features: ["Fundamental techniques", "Character building", "Belt progression", "Fitness development"]
    },
    {
      name: "Adult Programs",
      ageRange: "13+ years",
      description: "Comprehensive training for teens and working professionals",
      image: "https://via.placeholder.com/400x300/1d4ed8/ffffff?text=Adult+Programs",
      features: ["Advanced techniques", "Self-defense", "Fitness training", "Stress relief"]
    },
    {
      name: "Intensive Training",
      ageRange: "All levels",
      description: "Intensive training for rapid skill development and advancement",
      image: "https://via.placeholder.com/400x300/1e3a8a/ffffff?text=Intensive+Training",
      features: ["Accelerated learning", "Personal coaching", "Goal-oriented", "Flexible schedule"]
    },
    {
      name: "Competition Team",
      ageRange: "Advanced",
      description: "High-performance training for competitive athletes and tournaments",
      image: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Competition+Team",
      features: ["Competition preparation", "Advanced sparring", "Mental conditioning", "Tournament support"]
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