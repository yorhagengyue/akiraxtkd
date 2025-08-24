/**
 * Student Dashboard - 去AI味、进度导向的学员工作台
 * 专注于腰带进度、出勤连击、即将到来的课程和考级
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock,
  MapPin,
  User,
  Award,
  Target,
  TrendingUp,
  Bell,
  LogOut,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Plus
} from 'lucide-react';
import AnimatedPage from '@/components/animations/AnimatedPage';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { useToast } from '@/components/animations/Toast';
import RouteProtection from '@/lib/route-protection';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import BeltChip from '@/components/ui/BeltChip';
import ProgressMilestone from '@/components/ui/ProgressMilestone';
import GradingReadiness from '@/components/ui/GradingReadiness';
import EventCard from '@/components/ui/EventCard';
import { designTokens } from '@/lib/design-tokens';

// ========== 类型定义 ==========
interface NextSession {
  id: string;
  className: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  status: 'confirmed' | 'pending';
}

interface BeltProgress {
  currentBelt: string;
  nextBelt: string;
  daysUntilEligible: number;
  progressPercentage: number;
}

interface AttendanceStreak {
  current: number;
  thisMonth: number;
  thisMonthTarget: number;
  lastAttended: string;
}

interface StudentClass {
  id: string;
  name: string;
  day: string;
  time: string;
  location: string;
  instructor: string;
  nextSession: string;
  status: 'active' | 'paused' | 'full';
}

interface StudentEvent {
  id: string;
  title: string;
  type: 'class' | 'grading' | 'competition' | 'workshop';
  date: string;
  time: string;
  location: string;
  instructor?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'full';
  description?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  completedDate?: string;
}

interface ReadinessCheck {
  id: string;
  requirement: string;
  status: 'met' | 'not_met' | 'pending';
  details: string;
  actionText?: string;
  actionUrl?: string;
}

function StudentDashboardContent() {
  const { success, error } = useToast();
  const router = useRouter();
  
  // ========== 状态管理 ==========
  const [nextSession, setNextSession] = useState<NextSession | null>(null);
  const [beltProgress, setBeltProgress] = useState<BeltProgress>({
    currentBelt: 'White Belt',
    nextBelt: 'Yellow Belt',
    daysUntilEligible: 30,
    progressPercentage: 65,
  });
  const [attendanceStreak, setAttendanceStreak] = useState<AttendanceStreak>({
    current: 0,
    thisMonth: 0,
    thisMonthTarget: 8,
    lastAttended: '',
  });
  const [myClasses, setMyClasses] = useState<StudentClass[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<StudentEvent[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [gradingReadiness, setGradingReadiness] = useState<ReadinessCheck[]>([]);
  const [loading, setLoading] = useState(true);

  // ========== 数据加载 ==========
  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      const { authenticatedFetch } = await import('@/lib/auth-client');
      
      // 加载学员总览数据
      const overviewResponse = await authenticatedFetch('http://localhost:8787/api/dashboard/student/overview');
      if (overviewResponse.ok) {
        const overviewData = await overviewResponse.json();
        if (overviewData.success) {
          const data = overviewData.data;
          
          // 设置下一节课
          if (data.nextSession) {
            setNextSession({
              id: data.nextSession.session_id,
              className: data.nextSession.class_name,
              date: formatDate(data.nextSession.date),
              time: `${data.nextSession.start_time} - ${data.nextSession.end_time}`,
              location: data.nextSession.venue_name,
              instructor: data.nextSession.instructor_name,
              status: 'confirmed'
            });
          }
          
          // 设置腰带进度
          if (data.beltProgress) {
            setBeltProgress({
              currentBelt: data.beltProgress.current_belt || 'White Belt',
              nextBelt: data.beltProgress.next_belt || 'Yellow Belt',
              daysUntilEligible: data.beltProgress.days_until_eligible || 30,
              progressPercentage: data.beltProgress.progress_percentage || 0,
            });
          }
          
          // 设置出勤连击
          if (data.attendance) {
            setAttendanceStreak({
              current: data.attendance.streak || 0,
              thisMonth: data.attendance.this_month || 0,
              thisMonthTarget: data.attendance.monthly_target || 8,
              lastAttended: formatLastAttendance(data.attendance.last_attended),
            });
          }
        }
      }

      // 加载我的班级
      const classesResponse = await authenticatedFetch('http://localhost:8787/api/dashboard/student/classes');
      if (classesResponse.ok) {
        const classesData = await classesResponse.json();
        if (classesData.success && Array.isArray(classesData.data)) {
          const transformedClasses = classesData.data.map((cls: any) => ({
            id: cls.class_id,
            name: cls.name || 'Unnamed Class',
            day: getDayName(cls.day_of_week),
            time: `${cls.start_time} - ${cls.end_time}`,
            location: cls.venue_name || 'Unknown Venue',
            instructor: cls.instructor_name || 'Unknown Instructor',
            nextSession: getNextSessionDate(cls.day_of_week, cls.start_time),
            status: cls.status || 'active'
          }));
          setMyClasses(transformedClasses);
        }
      }

      // 加载即将到来的事件
      const eventsResponse = await authenticatedFetch('http://localhost:8787/api/dashboard/student/events');
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        if (eventsData.success && Array.isArray(eventsData.data)) {
          setUpcomingEvents(eventsData.data);
        }
      }

      // 设置模拟进度里程碑
      setMilestones([
        {
          id: '1',
          title: 'Basic Forms Mastery',
          description: 'Master Taeguek Il-Jang through Sa-Jang',
          completed: true,
          required: false,
          completedDate: 'Nov 15, 2024'
        },
        {
          id: '2',
          title: 'Sparring Fundamentals',
          description: 'Demonstrate basic sparring techniques and combinations',
          completed: true,
          required: false,
          completedDate: 'Dec 1, 2024'
        },
        {
          id: '3',
          title: 'Board Breaking',
          description: 'Successfully break boards with front kick and side kick',
          completed: false,
          required: true
        },
        {
          id: '4',
          title: 'Self-Defense Techniques',
          description: 'Master 5 basic self-defense techniques',
          completed: false,
          required: true
        },
        {
          id: '5',
          title: 'Leadership Skills',
          description: 'Assist with junior classes and demonstrate leadership',
          completed: false,
          required: false
        }
      ]);

      // 设置考级资格检查
      setGradingReadiness([
        {
          id: '1',
          requirement: 'Minimum Class Attendance',
          status: 'not_met',
          details: 'Attend 1 more session (7/8 required)',
          actionText: 'Find a class',
          actionUrl: '/dashboard/student/classes'
        },
        {
          id: '2',
          requirement: 'Time Since Last Grading',
          status: 'pending',
          details: 'Wait 1 week since last grading (3/4 weeks)',
        },
        {
          id: '3',
          requirement: 'Required Techniques',
          status: 'met',
          details: 'All required techniques demonstrated',
        },
        {
          id: '4',
          requirement: 'Payment Status',
          status: 'met',
          details: 'Account is up to date',
        }
      ]);

      setLoading(false);
    } catch (err) {
      console.error('Student dashboard load error:', err);
      error('Error', 'Failed to load dashboard data. Please check your connection.');
      setLoading(false);
    }
  };

  // ========== 辅助函数 ==========
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatLastAttendance = (dateStr?: string): string => {
    if (!dateStr) return 'Never';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const getDayName = (dayOfWeek: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || 'Unknown';
  };

  const getNextSessionDate = (dayOfWeek: number, time: string): string => {
    // 简化版计算下次课程时间
    const today = new Date();
    const currentDay = today.getDay();
    const daysUntil = (dayOfWeek - currentDay + 7) % 7;
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + (daysUntil === 0 ? 7 : daysUntil));
    
    return nextDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // ========== 事件处理 ==========
  const handleLogout = async () => {
    try {
      const { logout } = await import('@/lib/auth-client');
      await logout();
      success('Success', 'Logged out successfully');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      error('Error', 'Failed to logout');
    }
  };

  const handleCheckInInfo = () => {
    if (nextSession) {
      router.push(`/dashboard/student/sessions/${nextSession.id}/info`);
    }
  };

  const handleFindClass = () => {
    router.push('/dashboard/student/classes/find');
  };

  const handleViewRules = () => {
    router.push('/dashboard/student/grading/rules');
  };

  const handleAddToCalendar = (eventId: string) => {
    const event = upcomingEvents.find(e => e.id === eventId);
    if (event) {
      // TODO: 实现添加到日历功能
      success('Success', `${event.title} added to calendar`);
    }
  };

  const handleViewEventDetails = (eventId: string) => {
    router.push(`/dashboard/student/events/${eventId}`);
  };

  const isGradingEligible = gradingReadiness.every(check => check.status === 'met');

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50">
        {/* 页面头部 */}
        <PageHeader
          title="Student Dashboard"
          subtitle="Track your belt progress and upcoming sessions"
          breadcrumbs={[
            { label: 'Dashboard', onClick: () => router.push('/dashboard/student') }
          ]}
          actions={
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          }
        />

        <div className="px-6 py-6 space-y-8">
          {/* 顶部3枚关键卡片 */}
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Next Session */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Next Session</h3>
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ) : nextSession ? (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{nextSession.className}</h4>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{nextSession.date} · {nextSession.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{nextSession.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{nextSession.instructor}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleCheckInInfo}
                      className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                      style={{
                        backgroundColor: designTokens.colors.primary[500],
                        borderRadius: designTokens.borderRadius.button,
                      }}
                    >
                      Check-In Info
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-4">No upcoming sessions</p>
                    <button
                      onClick={handleFindClass}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Find a class →
                    </button>
                  </div>
                )}
              </div>

              {/* Current Belt Progress */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Current Belt</h3>
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <BeltChip belt={beltProgress.currentBelt} size="lg" showStripe />
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress to {beltProgress.nextBelt}</span>
                        <span className="font-medium">{beltProgress.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${beltProgress.progressPercentage}%`,
                            backgroundColor: designTokens.colors.primary[500]
                          }}
                        />
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {beltProgress.daysUntilEligible > 0 
                        ? `${beltProgress.daysUntilEligible} days until eligible`
                        : 'Eligible for grading!'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Attendance Streak */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Streak</h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline space-x-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {attendanceStreak.current}
                      </span>
                      <span className="text-sm text-gray-600">days</span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">This month</span>
                        <span className="font-medium">
                          {attendanceStreak.thisMonth}/{attendanceStreak.thisMonthTarget}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(attendanceStreak.thisMonth / attendanceStreak.thisMonthTarget) * 100}%`,
                            backgroundColor: designTokens.colors.success[500]
                          }}
                        />
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Last attended: {attendanceStreak.lastAttended}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 进度里程碑 */}
            <ScrollReveal className="lg:col-span-2">
              <ProgressMilestone milestones={milestones} loading={loading} />
            </ScrollReveal>

            {/* 考级资格 */}
            <ScrollReveal>
              <GradingReadiness
                checks={gradingReadiness}
                nextGradingDate="Jan 15, 2025"
                isEligible={isGradingEligible}
                loading={loading}
                onFindClass={handleFindClass}
                onViewRules={handleViewRules}
              />
            </ScrollReveal>
          </div>

          {/* 我的班级 */}
          <ScrollReveal>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">My Classes</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {myClasses.length} active class{myClasses.length !== 1 ? 'es' : ''}
                    </p>
                  </div>
                  <button 
                    onClick={() => router.push('/dashboard/student/classes')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Manage Classes →
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center justify-between p-4 rounded-lg">
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                          <div className="w-20 h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : myClasses.length > 0 ? (
                  <div className="space-y-2">
                    {myClasses.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <h4 className="font-medium text-gray-900">{cls.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>{cls.day} {cls.time}</span>
                            <span>•</span>
                            <span>{cls.location}</span>
                            <span>•</span>
                            <span>{cls.instructor}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            Next: {cls.nextSession}
                          </div>
                          <div className={`text-xs font-medium ${
                            cls.status === 'active' ? 'text-green-600' :
                            cls.status === 'paused' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Calendar />}
                    title="No Classes Enrolled"
                    description="Join a class to start your Taekwondo journey"
                    action={{
                      label: 'Find Classes',
                      onClick: handleFindClass
                    }}
                  />
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* 即将到来的事件 */}
          <ScrollReveal>
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Classes, gradings, and competitions in the next 14 days
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onAddToCalendar={handleAddToCalendar}
                      onViewDetails={handleViewEventDetails}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Calendar />}
                  title="No Upcoming Events"
                  description="Events will appear here when scheduled"
                />
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default function StudentDashboard() {
  return (
    <RouteProtection allowedRoles={['student']} requireAuth={true}>
      <StudentDashboardContent />
    </RouteProtection>
  );
}
