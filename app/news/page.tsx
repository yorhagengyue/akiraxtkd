import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedPage from '@/components/animations/AnimatedPage'
import ScrollReveal from '@/components/animations/ScrollReveal'
import { Calendar, Clock, User, ArrowRight, Award, Trophy, Users, Bell, Target } from 'lucide-react'

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: 'announcement' | 'competition' | 'training' | 'achievement';
  image: string;
  featured: boolean;
}

export default function NewsPage() {
  const newsItems: NewsItem[] = [
    {
      id: 'welcome-2024',
      title: 'Welcome to Akira X Taekwondo 2024 Training Season',
      excerpt: 'We are excited to welcome new and returning students to our 2024 training programs across all our Singapore locations.',
      content: 'Our 2024 training season brings enhanced programs, updated facilities, and continued commitment to excellence in martial arts education. Join us for an exciting year of growth and achievement.',
      date: '2024-01-15',
      author: 'Jasterfer Kellen',
      category: 'announcement',
      image: 'https://via.placeholder.com/600x400/3b82f6/ffffff?text=2024+Training+Season',
      featured: true
    },
    {
      id: 'belt-testing-spring',
      title: 'Spring Belt Testing Schedule Announced',
      excerpt: 'Belt testing sessions scheduled for March and April 2024. Students who meet requirements are encouraged to register.',
      content: 'Belt testing provides an opportunity for students to demonstrate their progress and advance to the next level. Testing covers technique, forms, and sparring components.',
      date: '2024-02-01',
      author: 'Training Team',
      category: 'announcement',
      image: 'https://via.placeholder.com/600x400/22c55e/ffffff?text=Belt+Testing',
      featured: false
    },
    {
      id: 'safety-protocols',
      title: 'Updated Safety Protocols and First Aid Certification',
      excerpt: 'Enhanced safety measures and first aid protocols now in effect across all training centers for student wellbeing.',
      content: 'Student safety is our top priority. Our instructors maintain current first aid certifications and we have implemented comprehensive safety protocols.',
      date: '2024-01-30',
      author: 'Safety Team',
      category: 'training',
      image: 'https://via.placeholder.com/600x400/ef4444/ffffff?text=Safety+First',
      featured: false
    },
    {
      id: 'new-location-compassvale',
      title: 'New Training Location in Compassvale Area',
      excerpt: 'Expanding our reach with additional training facilities to better serve the Compassvale community.',
      content: 'We are pleased to announce our expanded presence in the Compassvale area with new training facilities equipped with modern equipment and safety features.',
      date: '2024-01-10',
      author: 'Management Team',
      category: 'announcement',
      image: 'https://via.placeholder.com/600x400/f59e0b/ffffff?text=New+Location',
      featured: false
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'competition': return 'text-red-700 bg-red-100 border-red-200';
      case 'training': return 'text-green-700 bg-green-100 border-green-200';
      case 'achievement': return 'text-purple-700 bg-purple-100 border-purple-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'announcement': return <Bell className="w-4 h-4" />;
      case 'competition': return <Trophy className="w-4 h-4" />;
      case 'training': return <Target className="w-4 h-4" />;
      case 'achievement': return <Award className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const featuredNews = newsItems.filter(item => item.featured);
  const regularNews = newsItems.filter(item => !item.featured);

  return (
    <AnimatedPage showBeltProgress={true} beltColor="accent">
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary-600 via-accent-600 to-primary-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              News & Updates
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Stay informed about the latest announcements, events, and achievements 
              from Akira X Taekwondo community.
            </p>
          </div>
        </section>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured News</h2>
              </div>
              
              {featuredNews.map((item, index) => (
                <ScrollReveal key={item.id}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div className="h-64 lg:h-auto bg-cover bg-center" 
                           style={{ backgroundImage: `url(${item.image})` }}>
                        <div className="h-full bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(item.category)}`}>
                            {getCategoryIcon(item.category)}
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-8 lg:p-10">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(item.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {item.author}
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-primary-600 transition-colors">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 leading-relaxed mb-6">
                          {item.excerpt}
                        </p>
                        
                        <p className="text-gray-700 leading-relaxed mb-6">
                          {item.content}
                        </p>
                        
                        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Regular News */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Updates</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Stay up to date with announcements, training updates, and community news.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularNews.map((item, index) => (
                <ScrollReveal key={item.id}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
                    <div className="h-48 bg-cover bg-center relative" 
                         style={{ backgroundImage: `url(${item.image})` }}>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
                      <div className="absolute top-4 left-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${getCategoryColor(item.category)}`}>
                          {getCategoryIcon(item.category)}
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.author}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {item.excerpt}
                      </p>
                      
                      <button className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors">
                        Read More
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-lg opacity-90 mb-8">
                Subscribe to receive the latest news, updates, and announcements from Akira X Taekwondo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
                  Subscribe
                </button>
              </div>
              
              <p className="text-sm opacity-75 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </ScrollReveal>
          </div>
        </section>
      </main>
      
      <Footer />
    </AnimatedPage>
  )
}
