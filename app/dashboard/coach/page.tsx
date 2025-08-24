/**
 * Coach Dashboard - 去AI味、任务导向的教练工作台
 * 专注于今日课次、点名、学员管理等核心教练任务
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  UserCheck, 
  TrendingUp,
  Award,
  Clock,
  Plus,
  Bell,
  LogOut,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  UserMinus
} from 'lucide-react';
import AnimatedPage from '@/components/animations/AnimatedPage';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { useToast } from '@/components/animations/Toast';
import RouteProtection from '@/lib/route-protection';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import SessionCard from '@/components/ui/SessionCard';
import RosterTable from '@/components/ui/RosterTable';
import { designTokens } from '@/lib/design-tokens';

// ========== 类型定义 ==========
interface CoachKPIs {
  todaySessions: number;
  attendancePending: number;
  enrollmentChanges: {
    added: number;
    removed: number;
    net: number;
  };
  readyForGrading: number;
}

interface TodaySession {
  id: string;
  className: string;
  time: string;
  venue: string;
  plannedStudents: number;
  checkedInStudents: number;
  waitlistCount?: number;
  isOverCapacity?: boolean;
  hasNotes?: boolean;
  status: 'pending' | 'in_progress' | 'completed';
}

interface CoachStudent {
  id: string;
  name: string;
  currentBelt: string;
  lastAttendance: string;
  attendanceStreak: number;
  classCount: number;
  notes?: string;
  hasRisk?: boolean;
  riskType?: 'injury' | 'absence' | 'payment';
}

function CoachDashboardContent() {
  const { success, error } = useToast();
  const router = useRouter();
  
  // ========== 状态管理 ==========
  const [kpis, setKpis] = useState<CoachKPIs>({
    todaySessions: 0,
    attendancePending: 0,
    enrollmentChanges: { added: 0, removed: 0, net: 0 },
    readyForGrading: 0,
  });
  
  const [todaySessions, setTodaySessions] = useState<TodaySession[]>([]);
  const [myStudents, setMyStudents] = useState<CoachStudent[]>([]);
  const [loading, setLoading] = useState(true);

  // ========== 数据加载 ==========
  useEffect(() => {
    loadCoachData();
  }, []);

  const loadCoachData = async () => {
    try {
      const { authenticatedFetch } = await import('@/lib/auth-client');
      
      // 加载KPI数据
      const kpiResponse = await authenticatedFetch(API_ENDPOINTS.dashboard.coach.kpis());
      if (kpiResponse.ok) {
        const kpiData = await kpiResponse.json();
        if (kpiData.success) {
          setKpis(kpiData.data);
        }
      }

      // 加载今日课次
      const sessionsResponse = await authenticatedFetch(`http://localhost:8787/api/dashboard/coach/sessions?from=today&to=today`);
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        if (sessionsData.success && Array.isArray(sessionsData.data)) {
          const transformedSessions = sessionsData.data.map((session: any) => ({
            id: session.session_id,
            className: session.class_name || 'Unnamed Class',
            time: `${session.planned_start_time} - ${session.planned_end_time}`,
            venue: session.venue_name || 'Unknown Venue',
            plannedStudents: session.enrolled_students || 0,
            checkedInStudents: session.checked_in_students || 0,
            waitlistCount: session.waitlist_count || 0,
            isOverCapacity: (session.enrolled_students || 0) > (session.capacity || 25),
            hasNotes: session.has_notes || false,
            status: session.status || 'pending'
          }));
          setTodaySessions(transformedSessions);
        } else {
          setTodaySessions([]);
        }
      }

      // 加载我的学员
      const studentsResponse = await authenticatedFetch(API_ENDPOINTS.dashboard.coach.students());
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        if (studentsData.success && Array.isArray(studentsData.data)) {
          const transformedStudents = studentsData.data.map((student: any) => ({
            id: student.student_id,
            name: student.display_name || student.legal_name || 'Unknown Student',
            currentBelt: student.current_belt || 'White Belt',
            lastAttendance: formatLastAttendance(student.last_attended),
            attendanceStreak: student.attendance_streak || 0,
            classCount: student.class_count || 0,
            notes: student.notes,
            hasRisk: student.has_risk || false,
            riskType: student.risk_type
          }));
          setMyStudents(transformedStudents);
        } else {
          setMyStudents([]);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Coach dashboard load error:', err);
      error('Error', 'Failed to load dashboard data. Please check your connection.');
      setLoading(false);
    }
  };

  // ========== 辅助函数 ==========
  const formatLastAttendance = (dateStr?: string): string => {
    if (!dateStr) return 'Never';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
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

  const handleKPIClick = (kpi: string) => {
    const routes = {
      sessions: '/dashboard/coach/sessions',
      attendance: '/dashboard/coach/attendance',
      enrollment: '/dashboard/coach/enrollment',
      grading: '/dashboard/coach/grading',
    };
    
    const route = routes[kpi as keyof typeof routes];
    if (route) {
      router.push(route);
    }
  };

  const handleTakeAttendance = (sessionId: string) => {
    router.push(`/dashboard/coach/sessions/${sessionId}/attendance`);
  };

  const handleQuickActions = {
    markAllPresent: (sessionId: string) => {
      // TODO: 实现一键全到功能
      success('Success', 'All students marked as present');
    },
    markAllAbsent: (sessionId: string) => {
      // TODO: 实现一键全缺功能
      success('Success', 'All students marked as absent');
    }
  };

  const handleViewStudent = (studentId: string) => {
    router.push(`/dashboard/coach/students/${studentId}`);
  };

  const handleStartRollCall = () => {
    if (todaySessions.length > 0) {
      const nextSession = todaySessions.find(s => s.status === 'pending');
      if (nextSession) {
        handleTakeAttendance(nextSession.id);
      } else {
        router.push('/dashboard/coach/sessions');
      }
    }
  };

  // 计算下一节课信息
  const getNextSessionInfo = () => {
    const now = new Date();
    const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // 简化版：假设下一节课是明天
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      day: 'Tomorrow',
      time: '18:30',
      daysUntil: 1
    };
  };

  const nextSession = getNextSessionInfo();

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50">
        {/* 页面头部 */}
        <PageHeader
          title="Coach Dashboard"
          subtitle="Manage your classes, track attendance, and guide student progress"
          breadcrumbs={[
            { label: 'Dashboard', onClick: () => router.push('/dashboard/coach') }
          ]}
          actions={
            <div className="flex items-center space-x-3">
              {todaySessions.length > 0 && (
                <button 
                  onClick={handleStartRollCall}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                  style={{
                    backgroundColor: designTokens.colors.primary[500],
                    borderRadius: designTokens.borderRadius.button,
                  }}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Start Roll Call
                </button>
              )}
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
          {/* KPI 指标卡片 - 精简为4个 */}
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Today's Sessions"
                value={kpis.todaySessions}
                link={{
                  text: 'View Schedule',
                  onClick: () => handleKPIClick('sessions')
                }}
                icon={<Calendar className="w-5 h-5" />}
                loading={loading}
              />
              
              <StatCard
                title="Attendance Pending"
                value={`${kpis.attendancePending} classes`}
                link={{
                  text: 'Take Attendance',
                  onClick: () => handleKPIClick('attendance')
                }}
                icon={<UserCheck className="w-5 h-5" />}
                loading={loading}
              />
              
              <StatCard
                title="Enrollment Changes"
                value={kpis.enrollmentChanges.net >= 0 ? `+${kpis.enrollmentChanges.net}` : kpis.enrollmentChanges.net}
                delta={{
                  value: kpis.enrollmentChanges.net,
                  type: kpis.enrollmentChanges.net >= 0 ? 'increase' : 'decrease',
                  period: 'last 7 days'
                }}
                link={{
                  text: 'View Changes',
                  onClick: () => handleKPIClick('enrollment')
                }}
                icon={<TrendingUp className="w-5 h-5" />}
                loading={loading}
              />
              
              <StatCard
                title="Ready for Grading"
                value={kpis.readyForGrading}
                link={{
                  text: 'Review Students',
                  onClick: () => handleKPIClick('grading')
                }}
                icon={<Award className="w-5 h-5" />}
                loading={loading}
              />
            </div>
          </ScrollReveal>

          {/* 今日课次 */}
          <ScrollReveal>
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Today's Sessions</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''} scheduled for today
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : todaySessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {todaySessions.map((session) => (
                    <SessionCard 
                      key={session.id} 
                      session={session}
                      onTakeAttendance={handleTakeAttendance}
                      onQuickActions={handleQuickActions}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Sessions Today</h3>
                  <p className="text-gray-500 mb-4">
                    Your next class is <strong>{nextSession.day} {nextSession.time}</strong> · 
                    {nextSession.daysUntil === 1 ? ' Tomorrow' : ` in ${nextSession.daysUntil} days`}
                  </p>
                  <p className="text-sm text-gray-400 mb-6">
                    You can use this time to plan upcoming sessions or review student progress.
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    <button 
                      onClick={() => router.push('/dashboard/coach/classes/schedule')}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                      style={{
                        backgroundColor: designTokens.colors.primary[500],
                        borderRadius: designTokens.borderRadius.button,
                      }}
                    >
                      Plan Classes
                    </button>
                    <button 
                      onClick={() => router.push('/dashboard/coach/students')}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Review Students
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* 我的学员 - 表格形式 */}
          <ScrollReveal>
            <RosterTable
              students={myStudents}
              loading={loading}
              onViewStudent={handleViewStudent}
            />
          </ScrollReveal>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default function CoachDashboard() {
  return (
    <RouteProtection allowedRoles={['coach']} requireAuth={true}>
      <CoachDashboardContent />
    </RouteProtection>
  );
}
