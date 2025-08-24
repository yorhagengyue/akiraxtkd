/**
 * Admin Dashboard - Full System Overview
 * Complete management interface for administrators
 */

'use client';

import React, { useState, useEffect } from 'react';
import RouteProtection from '@/lib/route-protection';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Award, 
  MapPin,
  BookOpen,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Settings
} from 'lucide-react';
import AnimatedPage from '@/components/animations/AnimatedPage';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { useToast } from '@/components/animations/Toast';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalStudents: number;
  activeClasses: number;
  monthlyRevenue: number;
  attendanceRate: number;
  newEnrollments: number;
  upcomingGradings: number;
}

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'payment' | 'attendance' | 'grading';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

const StatCard = ({ icon: Icon, title, value, change, changeType }: any) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {change && (
        <div className={`flex items-center space-x-1 text-sm ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className="h-4 w-4" />
          <span>{change}</span>
        </div>
      )}
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, title, description, onClick }: any) => (
  <button
    onClick={onClick}
    className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
  >
    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100">
      <Icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
    </div>
    <div className="text-left">
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </button>
);

function AdminDashboardContent() {
  const { success, error } = useToast();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeClasses: 0,
    monthlyRevenue: 0,
    attendanceRate: 0,
    newEnrollments: 0,
    upcomingGradings: 0
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { authenticatedFetch } = await import('@/lib/auth-client');
      
      // Load dashboard stats
      const statsResponse = await authenticatedFetch('http://localhost:8787/api/dashboard/admin/stats');
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        } else {
          throw new Error(statsData.error || 'Failed to load stats');
        }
      } else {
        throw new Error(`API Error: ${statsResponse.status}`);
      }

      // Load recent activities
      try {
        const activitiesResponse = await authenticatedFetch('http://localhost:8787/api/dashboard/admin/activities');
        
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          if (activitiesData.success) {
            setActivities(activitiesData.data);
          }
        }
      } catch (activitiesError) {
        console.warn('Activities load failed:', activitiesError);
        // Continue without activities - not critical
        setActivities([]);
      }

      // Load student list for admin overview
      try {
        const studentsResponse = await authenticatedFetch('http://localhost:8787/api/dashboard/admin/students');
        
        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json();
          if (studentsData.success) {
            setStudentsList(studentsData.data.slice(0, 5)); // Show first 5 students
          }
        }
      } catch (studentsError) {
        console.warn('Students load failed:', studentsError);
        setStudentsList([]);
      }

      setLoading(false);
    } catch (err) {
      console.error('Dashboard load error:', err);
      error('Error', 'Failed to load dashboard data. Please check your connection.');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { logout } = await import('@/lib/auth-client');
      await logout();
      success('Logged out', 'You have been logged out successfully');
      setTimeout(() => router.push('/login'), 1000);
    } catch (err) {
      console.error('Logout error:', err);
      error('Logout failed', 'Failed to logout properly');
    }
  };

  const quickActions = [
    {
      icon: Users,
      title: 'Add New Student',
      description: 'Register a new student in the system',
      onClick: () => success('Coming Soon', 'Student registration form will open')
    },
    {
      icon: Calendar,
      title: 'Schedule Class',
      description: 'Create a new class or session',
      onClick: () => success('Coming Soon', 'Class scheduling interface will open')
    },
    {
      icon: Award,
      title: 'Plan Grading Event',
      description: 'Organize belt testing ceremony',
      onClick: () => success('Coming Soon', 'Grading event planner will open')
    },
    {
      icon: DollarSign,
      title: 'Generate Invoice',
      description: 'Create billing for students',
      onClick: () => success('Coming Soon', 'Invoice generator will open')
    }
  ];

  if (loading) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage showBeltProgress={true} beltColor="red">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Complete system overview and management</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              <StatCard
                icon={Users}
                title="Total Students"
                value={stats.totalStudents}
                change="+12%"
                changeType="positive"
              />
              <StatCard
                icon={BookOpen}
                title="Active Classes"
                value={stats.activeClasses}
                change="+3"
                changeType="positive"
              />
              <StatCard
                icon={DollarSign}
                title="Monthly Revenue"
                value={`$${stats.monthlyRevenue.toLocaleString()}`}
                change="+8%"
                changeType="positive"
              />
              <StatCard
                icon={TrendingUp}
                title="Attendance Rate"
                value={`${stats.attendanceRate}%`}
                change="-2%"
                changeType="negative"
              />
              <StatCard
                icon={Plus}
                title="New Enrollments"
                value={stats.newEnrollments}
                change="+5"
                changeType="positive"
              />
              <StatCard
                icon={Award}
                title="Upcoming Gradings"
                value={stats.upcomingGradings}
              />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <ScrollReveal>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    <Plus className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <QuickAction key={index} {...action} />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Recent Activities */}
            <ScrollReveal>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Filter className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`p-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-100 text-green-600' :
                          activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {activity.type === 'enrollment' && <Users className="h-4 w-4" />}
                          {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                          {activity.type === 'attendance' && <AlertCircle className="h-4 w-4" />}
                          {activity.type === 'grading' && <Award className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Management Sections */}
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Student Management</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">View and manage all student profiles, enrollment status, and progress tracking.</p>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Manage Students →
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Class Scheduling</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Create and manage class schedules, assign instructors, and track capacity.</p>
                <button className="text-sm font-medium text-green-600 hover:text-green-700">
                  Manage Classes →
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Financial Management</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Handle billing, payments, invoices, and financial reporting.</p>
                <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                  Manage Finances →
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Grading & Events</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Organize belt testing, competitions, and track student progress.</p>
                <button className="text-sm font-medium text-orange-600 hover:text-orange-700">
                  Manage Events →
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Recent Students Section */}
          <ScrollReveal>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
                  <p className="text-sm text-gray-600">Latest student registrations</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All →
                </button>
              </div>
              
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                        <div className="w-16 h-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : studentsList.length > 0 ? (
                <div className="space-y-4">
                  {studentsList.map((student, index) => (
                    <div key={student.student_id || index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {(student.display_name || student.legal_name || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.display_name || student.legal_name || 'Unknown Student'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {student.student_code || 'No Code'} • {student.current_belt || 'White Belt'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {student.attendance_rate ? `${Math.round(student.attendance_rate)}%` : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">Attendance</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No students found</p>
                  <p className="text-sm text-gray-400 mt-1">Students will appear here once registered</p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default function AdminDashboard() {
  return (
    <RouteProtection allowedRoles={['admin']} requireAuth={true}>
      <AdminDashboardContent />
    </RouteProtection>
  );
}
