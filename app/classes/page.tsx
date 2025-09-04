'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ClassesSection from '@/components/ClassesSection'
import AnimatedPage from '@/components/animations/AnimatedPage'
import ScrollReveal from '@/components/animations/ScrollReveal'
import { Calendar, Clock, MapPin, Users, Star, Award, Target } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function ClassesPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAuthenticated: checkAuthStatus, getStoredUser } = await import('@/lib/auth-client');
        if (checkAuthStatus()) {
          const userData = getStoredUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check error:', err);
      }
    };

    checkAuth();
  }, []);

  // 处理课程报名
  const handleRegisterClass = async (classData: any) => {
    if (!isAuthenticated) {
      // 未登录，重定向到登录页
      router.push(`/login?next=/classes&class=${encodeURIComponent(classData.day.toLowerCase().replace(/\s+/g, '-'))}`);
      return;
    }

    if (user?.role !== 'student') {
      error('Access Denied', 'Only students can register for classes');
      return;
    }

    // 已登录学生，显示报名确认
    if (confirm(`Register for ${classData.day} class?\n\nTime: ${classData.time}\nLocation: ${classData.location}`)) {
      try {
        // TODO: 调用报名API
        // const response = await classesApi.enroll(classId, { student_id: user.id });
        success('Registration Successful', `You have been registered for ${classData.day} class!`);
      } catch (err) {
        error('Registration Failed', 'Unable to register for class. Please try again.');
      }
    }
  };

  const scheduleDetails = [
    {
      day: "Monday",
      time: "8:00 PM - 9:00 PM",
      location: "604 Tampines Avenue 9",
      focus: "Technical Training & Belt Progression",
      instructor: "Jasterfer Kellen",
      capacity: "30 students",
      level: "All Levels"
    },
    {
      day: "Tuesday", 
      time: "7:30 PM - 8:30 PM",
      location: "211C Compassvale Lane",
      focus: "Poomsae Practice & Sparring Techniques",
      instructor: "Certified Instructor",
      capacity: "25 students",
      level: "All Levels"
    },
    {
      day: "Thursday",
      time: "7:30 PM - 9:00 PM", 
      location: "217C Compassvale Drive",
      focus: "Extended Practice & Competition Prep",
      instructor: "Jasterfer Kellen",
      capacity: "25 students",
      level: "All Levels"
    },
    {
      day: "Friday - Session 1",
      time: "6:30 PM - 8:00 PM",
      location: "Fengshan CC, Bedok North Street 2",
      focus: "Fundamentals & Technique Development",
      instructor: "Certified Instructor", 
      capacity: "20 students",
      level: "Beginner to Intermediate"
    },
    {
      day: "Friday - Session 2",
      time: "8:00 PM - 9:30 PM",
      location: "Fengshan CC, Bedok North Street 2", 
      focus: "Advanced Training & Competition",
      instructor: "Jasterfer Kellen",
      capacity: "20 students",
      level: "Advanced"
    },
    {
      day: "Saturday",
      time: "Contact for Schedule",
      location: "207A Compassvale Lane",
      focus: "Weekend Training & Community Building",
      instructor: "Available Instructor",
      capacity: "20 students", 
      level: "All Levels"
    }
  ];

  return (
    <AnimatedPage showBeltProgress={true} beltColor="green">
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-accent-600 via-accent-700 to-primary-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Our Classes
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Professional taekwondo training programs designed for all skill levels, 
              from beginners to competitive athletes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Calendar className="w-5 h-5" />
                <span>6 Weekly Sessions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Users className="w-5 h-5" />
                <span>Small Class Sizes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Class Overview */}
        <ScrollReveal>
          <ClassesSection />
        </ScrollReveal>

        {/* Detailed Schedule */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                DETAILED SCHEDULE
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Complete weekly schedule with locations, times, and class focus areas.
              </p>
            </div>

            <div className="space-y-6">
              {scheduleDetails.map((session, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Day & Time */}
                    <div className="lg:w-64 bg-gradient-to-br from-primary-500 to-accent-500 text-white p-6">
                      <div className="text-center lg:text-left">
                        <h3 className="text-2xl font-bold mb-2">{session.day}</h3>
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                          <Clock className="w-5 h-5" />
                          <span className="text-lg">{session.time}</span>
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          <Target className="w-4 h-4" />
                          <span className="text-sm opacity-90">{session.level}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900">Location</p>
                              <p className="text-gray-600 text-sm">{session.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Award className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900">Instructor</p>
                              <p className="text-gray-600 text-sm">{session.instructor}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Star className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900">Class Focus</p>
                              <p className="text-gray-600 text-sm">{session.focus}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900">Capacity</p>
                              <p className="text-gray-600 text-sm">{session.capacity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => handleRegisterClass(session)}
                          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                        >
                          {isAuthenticated ? 'Register for This Class' : 'Sign In to Register'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Start Your Journey?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join our classes and experience professional taekwondo training. 
                  Contact us to schedule a trial class or learn more about our programs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="tel:+6587668794" className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
                    Call +65 8766 8794
                  </a>
                  <a href="https://wa.me/6587668794" className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all">
                    WhatsApp Us
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
