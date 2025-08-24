/**
 * Admin Dashboard - 去AI味、业务导向的运营总览
 * 基于真实跆拳道道馆管理需求设计
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  LogOut,
  BarChart3,
  UserCheck,
  CreditCard,
  UserX,
  Building2,
  Target,
  Plus,
  Bell,
  Search,
  Filter
} from 'lucide-react';
import AnimatedPage from '@/components/animations/AnimatedPage';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { useToast } from '@/components/animations/Toast';
import RouteProtection from '@/lib/route-protection';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import BeltChip from '@/components/ui/BeltChip';
import CapacityBar from '@/components/ui/CapacityBar';
import { designTokens } from '@/lib/design-tokens';

// ========== 类型定义 ==========
interface AdminKPIs {
  activeStudents: number;
  activeStudentsDelta: number;
  occupancyRate: number;
  occupancyDelta: number;
  arOutstanding: number;
  arDelta: number;
  weeklyAttendance: number;
  attendanceDelta: number;
  todaySessions: number;
  upcomingEvents: number;
}

interface RiskAlert {
  id: string;
  type: 'overdue_payment' | 'over_capacity' | 'poor_attendance' | 'grading_overdue';
  title: string;
  description: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
  actionText: string;
  actionUrl: string;
}

interface ActivityItem {
  id: string;
  type: 'enrollment' | 'payment' | 'grading' | 'competition';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  amount?: number;
}

interface StudentOverview {
  student_id: string;
  display_name: string;
  legal_name: string;
  student_code: string;
  current_belt: string;
  attendance_rate: number;
  last_attended: string;
  classes_enrolled: number;
  outstanding_balance: number;
}

function AdminDashboardContent() {
  const { success, error } = useToast();
  const router = useRouter();
  
  // ========== 状态管理 ==========
  const [kpis, setKpis] = useState<AdminKPIs>({
    activeStudents: 0,
    activeStudentsDelta: 0,
    occupancyRate: 0,
    occupancyDelta: 0,
    arOutstanding: 0,
    arDelta: 0,
    weeklyAttendance: 0,
    attendanceDelta: 0,
    todaySessions: 0,
    upcomingEvents: 0,
  });
  
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [studentOverview, setStudentOverview] = useState<StudentOverview[]>([]);
  const [loading, setLoading] = useState(true);

  // ========== 数据加载 ==========
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { authenticatedFetch } = await import('@/lib/auth-client');
      
      // 加载KPI数据
      const kpiResponse = await authenticatedFetch('http://localhost:8787/api/dashboard/admin/kpis');
      if (kpiResponse.ok) {
        const kpiData = await kpiResponse.json();
        if (kpiData.success) {
          setKpis(kpiData.data);
        }
      }

      // 加载风险告警
      const riskResponse = await authenticatedFetch('http://localhost:8787/api/dashboard/admin/risks');
      if (riskResponse.ok) {
        const riskData = await riskResponse.json();
        if (riskData.success) {
          setRiskAlerts(riskData.data);
        }
      }

      // 加载最近活动
      const activityResponse = await authenticatedFetch('http://localhost:8787/api/dashboard/admin/activities');
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        if (activityData.success) {
          setRecentActivities(activityData.data);
        }
      }

      // 加载学员概览
      const studentsResponse = await authenticatedFetch('http://localhost:8787/api/dashboard/admin/students-overview');
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        if (studentsData.success) {
          setStudentOverview(studentsData.data.slice(0, 10)); // 显示前10个
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Dashboard load error:', err);
      error('Error', 'Failed to load dashboard data. Please check your connection.');
      setLoading(false);
    }
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

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add_student':
        router.push('/dashboard/admin/students/new');
        break;
      case 'create_class':
        router.push('/dashboard/admin/classes/new');
        break;
      case 'schedule_grading':
        router.push('/dashboard/admin/grading/new');
        break;
      case 'create_invoice':
        router.push('/dashboard/admin/finance/invoices/new');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleRiskClick = (risk: RiskAlert) => {
    router.push(risk.actionUrl);
  };

  const handleKPIClick = (kpi: string) => {
    const routes = {
      students: '/dashboard/admin/students',
      occupancy: '/dashboard/admin/classes',
      ar: '/dashboard/admin/finance/invoices',
      attendance: '/dashboard/admin/reports/attendance',
      sessions: '/dashboard/admin/classes/sessions',
      events: '/dashboard/admin/events',
    };
    
    const route = routes[kpi as keyof typeof routes];
    if (route) {
      router.push(route);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50">
        {/* 页面头部 */}
        <PageHeader
          title="Admin Dashboard"
          subtitle="Complete system overview and management center"
          breadcrumbs={[
            { label: 'Dashboard', onClick: () => router.push('/dashboard/admin') }
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
          {/* KPI 指标卡片 */}
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <StatCard
                title="Active Students"
                value={kpis.activeStudents}
                delta={{
                  value: kpis.activeStudentsDelta,
                  type: kpis.activeStudentsDelta >= 0 ? 'increase' : 'decrease',
                  period: 'vs last month'
                }}
                link={{
                  text: 'View All',
                  onClick: () => handleKPIClick('students')
                }}
                icon={<Users className="w-5 h-5" />}
                loading={loading}
              />
              
              <StatCard
                title="Occupancy Rate"
                value={`${kpis.occupancyRate}%`}
                delta={{
                  value: kpis.occupancyDelta,
                  type: kpis.occupancyDelta >= 0 ? 'increase' : 'decrease',
                  period: 'vs last month'
                }}
                link={{
                  text: 'Manage Classes',
                  onClick: () => handleKPIClick('occupancy')
                }}
                icon={<Building2 className="w-5 h-5" />}
                loading={loading}
              />
              
              <StatCard
                title="AR Outstanding"
                value={`$${kpis.arOutstanding.toLocaleString()}`}
                delta={{
                  value: kpis.arDelta,
                  type: kpis.arDelta <= 0 ? 'increase' : 'decrease',
                  period: 'vs last month'
                }}
                link={{
                  text: 'View Invoices',
                  onClick: () => handleKPIClick('ar')
                }}
                icon={<CreditCard className="w-5 h-5" />}
                loading={loading}
              />
              
              <StatCard
                title="Weekly Attendance"
                value={`${kpis.weeklyAttendance}%`}
                delta={{
                  value: kpis.attendanceDelta,
                  type: kpis.attendanceDelta >= 0 ? 'increase' : 'decrease',
                  period: 'vs last week'
                }}
                link={{
                  text: 'View Report',
                  onClick: () => handleKPIClick('attendance')
                }}
                icon={<UserCheck className="w-5 h-5" />}
                loading={loading}
              />
              
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
                title="Upcoming Events"
                value={kpis.upcomingEvents}
                link={{
                  text: 'Manage Events',
                  onClick: () => handleKPIClick('events')
                }}
                icon={<Target className="w-5 h-5" />}
                loading={loading}
              />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 风险告警面板 */}
            <ScrollReveal className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Risk Alerts</h3>
                      <p className="text-sm text-gray-600 mt-1">Items requiring immediate attention</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Filter className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="w-16 h-6 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : riskAlerts.length > 0 ? (
                    <div className="space-y-4">
                      {riskAlerts.map((risk) => (
                        <div 
                          key={risk.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 cursor-pointer transition-colors"
                          onClick={() => handleRiskClick(risk)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              risk.severity === 'high' ? 'bg-red-100 text-red-600' :
                              risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{risk.title}</h4>
                              <p className="text-sm text-gray-600">{risk.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">{risk.count}</div>
                            <div className="text-xs text-blue-600 hover:text-blue-700">{risk.actionText} →</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<CheckCircle />}
                      title="All Clear!"
                      description="No risk alerts at this time. System is running smoothly."
                    />
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* 快捷操作 */}
            <ScrollReveal>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                  <p className="text-sm text-gray-600 mt-1">Common administrative tasks</p>
                </div>
                
                <div className="p-6 space-y-3">
                  {[
                    { id: 'add_student', label: 'Add New Student', icon: Users, desc: 'Register a new student' },
                    { id: 'create_class', label: 'Create Class', icon: Calendar, desc: 'Schedule new class' },
                    { id: 'schedule_grading', label: 'Schedule Grading', icon: Award, desc: 'Plan grading event' },
                    { id: 'create_invoice', label: 'Create Invoice', icon: CreditCard, desc: 'Generate billing' },
                  ].map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <action.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{action.label}</div>
                        <div className="text-xs text-gray-600">{action.desc}</div>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* 学员概览 */}
          <ScrollReveal>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Student Overview</h3>
                    <p className="text-sm text-gray-600 mt-1">Recent student activity and status</p>
                  </div>
                  <button 
                    onClick={() => router.push('/dashboard/admin/students')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Students →
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                          </div>
                          <div className="w-20 h-6 bg-gray-200 rounded"></div>
                          <div className="w-16 h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : studentOverview.length > 0 ? (
                  <div className="space-y-4">
                    {studentOverview.map((student) => (
                      <div key={student.student_id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {(student.display_name || student.legal_name || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {student.display_name || student.legal_name || 'Unknown Student'}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-gray-600">{student.student_code || 'No Code'}</span>
                              <span className="text-gray-300">•</span>
                              <BeltChip belt={student.current_belt || 'White Belt'} size="sm" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-right">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.attendance_rate ? `${Math.round(student.attendance_rate)}%` : 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">Attendance</div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.classes_enrolled || 0}
                            </div>
                            <div className="text-xs text-gray-500">Classes</div>
                          </div>
                          
                          {student.outstanding_balance > 0 && (
                            <div>
                              <div className="text-sm font-medium text-red-600">
                                ${student.outstanding_balance.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">Outstanding</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Users />}
                    title="No Students Found"
                    description="Students will appear here once registered"
                    action={{
                      label: 'Add First Student',
                      onClick: () => handleQuickAction('add_student')
                    }}
                  />
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* 最近活动 */}
          <ScrollReveal>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                    <p className="text-sm text-gray-600 mt-1">Latest system events and changes</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Activities →
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="w-16 h-3 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'enrollment' ? 'bg-green-100 text-green-600' :
                          activity.type === 'payment' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'grading' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'enrollment' && <Users className="w-4 h-4" />}
                          {activity.type === 'payment' && <CreditCard className="w-4 h-4" />}
                          {activity.type === 'grading' && <Award className="w-4 h-4" />}
                          {activity.type === 'competition' && <Target className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                            <span>{activity.user}</span>
                            <span>•</span>
                            <span>{activity.timestamp}</span>
                            {activity.amount && (
                              <>
                                <span>•</span>
                                <span className="font-medium">${activity.amount.toFixed(2)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Activity />}
                    title="No Recent Activity"
                    description="System activities will appear here as they occur"
                  />
                )}
              </div>
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
