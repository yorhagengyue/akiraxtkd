/**
 * Student Dashboard - 简化版学生面板
 * 专注于基本信息查看：课程安排、出勤记录、腰带进度、公告
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell,
  LogOut,
  Calendar,
  Award,
  Clock,
  MapPin,
  User,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import AnimatedPage from '@/components/animations/AnimatedPage';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { useToast } from '@/components/animations/Toast';
import RouteProtection from '@/lib/route-protection';

// 简化的数据类型
interface StudentDashboardData {
  profile: {
    name: string;
    studentCode: string;
    currentBelt: string;
    beltColor: string;
    joinedDate: string;
  };
  upcomingClasses: Array<{
    className: string;
    date: string;
    time: string;
    venue: string;
    instructor: string;
  }>;
  attendanceRecord: Array<{
    date: string;
    className: string;
    status: 'present' | 'absent' | 'late';
  }>;
  beltProgress: {
    current: string;
    next: string;
    progress: number;
  };
  announcements: Array<{
    title: string;
    content: string;
    date: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

function StudentDashboardContent() {
  const { success, error } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudentDashboardData | null>(null);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      
      // 使用简化的Mock数据
      const mockData: StudentDashboardData = {
        profile: {
          name: 'Demo Student',
          studentCode: 'AXT2024001',
          currentBelt: 'Green Belt',
          beltColor: '#22c55e',
          joinedDate: '2024-01-15'
        },
        upcomingClasses: [
          {
            className: 'Monday Evening Class',
            date: '2024-12-23',
            time: '8:00 PM - 9:00 PM',
            venue: 'Tampines Training Center',
            instructor: 'Jasterfer Kellen'
          },
          {
            className: 'Thursday Practice',
            date: '2024-12-26',
            time: '7:30 PM - 9:00 PM',
            venue: 'Compassvale Drive',
            instructor: 'Jasterfer Kellen'
          }
        ],
        attendanceRecord: [
          { date: '2024-12-18', className: 'Thursday Practice', status: 'present' },
          { date: '2024-12-16', className: 'Monday Evening', status: 'present' },
          { date: '2024-12-12', className: 'Thursday Practice', status: 'late' },
          { date: '2024-12-09', className: 'Monday Evening', status: 'absent' }
        ],
        beltProgress: {
          current: 'Green Belt',
          next: 'Green Belt with Blue Tip',
          progress: 75
        },
        announcements: [
          {
            title: 'Holiday Schedule',
            content: 'Classes suspended Dec 25-31. Resume Jan 2.',
            date: '2024-12-15',
            priority: 'high'
          },
          {
            title: 'Belt Testing Registration',
            content: 'January belt testing registration now open.',
            date: '2024-12-10',
            priority: 'medium'
          }
        ]
      };

      setData(mockData);
      setLoading(false);
      
    } catch (err) {
      console.error('Student dashboard load error:', err);
      error('Error', 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { logout } = await import('@/lib/auth-client');
      await logout();
      success('Logged Out', 'You have been successfully logged out');
      router.push('/login');
    } catch (err) {
      error('Error', 'Failed to logout');
    }
  };

  // 辅助函数
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'late': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'absent': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-50';
      case 'late': return 'text-yellow-600 bg-yellow-50';
      case 'absent': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
          <button 
            onClick={loadStudentData}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage showBeltProgress={true} beltColor="green">
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-white">
                  <img
                    src="/img/logo.jpg"
                    alt="Akira X Taekwondo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {data.profile.name}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Summary */}
              <ScrollReveal>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <User className="w-8 h-8 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900">Your Profile</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Student Code</label>
                          <p className="text-gray-900">{data.profile.studentCode}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Current Belt</label>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-2 rounded-full"
                              style={{ backgroundColor: data.profile.beltColor }}
                            ></div>
                            <span className="text-gray-900 font-medium">{data.profile.currentBelt}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Joined Date</label>
                          <p className="text-gray-900">{new Date(data.profile.joinedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Belt Progress</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Current: {data.beltProgress.current}</span>
                            <span>Next: {data.beltProgress.next}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${data.beltProgress.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600">{data.beltProgress.progress}% to next belt</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Upcoming Classes */}
              <ScrollReveal>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Calendar className="w-8 h-8 text-accent-600" />
                    <h2 className="text-xl font-bold text-gray-900">Upcoming Classes</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {data.upcomingClasses.map((classItem, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{classItem.className}</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(classItem.date).toLocaleDateString()} at {classItem.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{classItem.venue}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>Instructor: {classItem.instructor}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Enrolled
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Recent Attendance */}
              <ScrollReveal>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <h2 className="text-xl font-bold text-gray-900">Recent Attendance</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {data.attendanceRecord.slice(0, 6).map((record, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(record.status)}
                          <div>
                            <p className="font-medium text-gray-900">{record.className}</p>
                            <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">This Month Attendance</span>
                      <span className="font-semibold text-primary-600">87.5%</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Belt Progress Card */}
              <ScrollReveal>
                <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-8 h-8" />
                    <h3 className="text-lg font-bold">Belt Progress</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm opacity-90">Current Belt</p>
                      <p className="text-xl font-bold">{data.beltProgress.current}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm opacity-90">Next Target</p>
                      <p className="font-semibold">{data.beltProgress.next}</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{data.beltProgress.progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full transition-all duration-500"
                          style={{ width: `${data.beltProgress.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Quick Stats */}
              <ScrollReveal>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700">Classes This Month</span>
                      </div>
                      <span className="font-semibold text-gray-900">14</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Attendance Rate</span>
                      </div>
                      <span className="font-semibold text-green-600">87.5%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-accent-600" />
                        <span className="text-gray-700">Training Hours</span>
                      </div>
                      <span className="font-semibold text-gray-900">24h</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Announcements */}
              <ScrollReveal>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Bell className="w-6 h-6 text-accent-600" />
                    <h3 className="text-lg font-bold text-gray-900">Announcements</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {data.announcements.map((announcement, index) => (
                      <div key={index} className={`border-l-4 p-3 rounded-r-lg ${getPriorityColor(announcement.priority)}`}>
                        <h4 className="font-semibold text-gray-900 mb-1">{announcement.title}</h4>
                        <p className="text-sm text-gray-700 mb-2">{announcement.content}</p>
                        <p className="text-xs text-gray-500">{new Date(announcement.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Contact Information */}
              <ScrollReveal>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
                  
                  <div className="space-y-3">
                    <a 
                      href="tel:+6587668794"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 text-sm">📞</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Call Us</p>
                        <p className="text-sm text-gray-600">+65 8766 8794</p>
                      </div>
                    </a>
                    
                    <a 
                      href="https://wa.me/6587668794"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">💬</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">WhatsApp</p>
                        <p className="text-sm text-gray-600">Quick message</p>
                      </div>
                    </a>
                    
                    <a 
                      href="mailto:teamakiraxtaekwondo@gmail.com"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">✉️</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">Send message</p>
                      </div>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>
    </AnimatedPage>
  );
}

export default function StudentDashboard() {
  return (
    <RouteProtection allowedRoles={['student', 'coach', 'admin']}>
      <StudentDashboardContent />
    </RouteProtection>
  );
}