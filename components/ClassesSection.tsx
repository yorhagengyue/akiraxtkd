export default function ClassesSection() {
  const classes = [
    {
      name: "Super Junior",
      ageRange: "3-5 years",
      description: "Fun introduction to taekwondo fundamentals with games and basic movements",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["Basic movements", "Coordination development", "Social skills", "Fun activities"]
    },
    {
      name: "Kids",
      ageRange: "6-12 years",
      description: "Structured learning with discipline, respect, and fundamental techniques",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["Fundamental techniques", "Character building", "Belt progression", "Fitness development"]
    },
    {
      name: "Teens/Adult Executive",
      ageRange: "13+ years",
      description: "Comprehensive training for teens and working professionals",
      image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["Advanced techniques", "Self-defense", "Fitness training", "Stress relief"]
    },
    {
      name: "Pace Challenger",
      ageRange: "All levels",
      description: "Intensive training for rapid skill development and advancement",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["Accelerated learning", "Personal coaching", "Goal-oriented", "Flexible schedule"]
    },
    {
      name: "Elite Competition Team",
      ageRange: "Advanced",
      description: "High-performance training for competitive athletes and tournaments",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["Competition preparation", "Advanced sparring", "Mental conditioning", "Tournament support"]
    }
  ]

  return (
    <section id="classes" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            CLASSES
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you're searching for a taekwondo class Singapore or want to join a boutique taekwondo studio, 
            Taekwondonomics is the name to trust.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((classItem, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-cover bg-center relative" 
                   style={{ backgroundImage: `url(${classItem.image})` }}>
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{classItem.name}</h3>
                  <p className="text-sm opacity-90">{classItem.ageRange}</p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {classItem.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {classItem.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Experience the difference of learning at the best taekwondo Singapore school, where passion meets precision, 
            and global standards define every session.
          </p>
          <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            View All Classes
          </button>
        </div>
      </div>
    </section>
  )
}
