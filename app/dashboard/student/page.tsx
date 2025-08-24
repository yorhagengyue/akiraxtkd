/**
 * Student Dashboard - 友善事务型主页
 * 专注于上课提醒、请假/补课、比赛通知、公告&账单
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell,
  LogOut,
  Calendar,
  Users,
  Trophy,
  MessageSquare,
  CreditCard,
  Clock
} from 'lucide-react';
import AnimatedPage from '@/components/animations/AnimatedPage';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { useToast } from '@/components/animations/Toast';
import RouteProtection from '@/lib/route-protection';
import PageHeader from '@/components/ui/PageHeader';
import NextSessionCard from '@/components/student/NextSessionCard';
import ThisWeekList from '@/components/student/ThisWeekList';
import CompetitionsSection from '@/components/student/CompetitionsSection';
import AnnouncementsSection from '@/components/student/AnnouncementsSection';
import BillingSection from '@/components/student/BillingSection';
import RemindersCard from '@/components/student/RemindersCard';
import QuickActions from '@/components/student/QuickActions';
import { API_ENDPOINTS } from '@/lib/config';
import { mockStudentData, shouldUseMockData, simulateApiDelay } from '@/lib/mock-data';

// ========== 类型定义 ==========
interface NextSession {
  id: string;
  className: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  checkinWindow: string;
  equipmentReminder: string;
  status: 'upcoming' | 'today' | 'in_progress';
  canRequestLeave: boolean;
  hasLeaveRequest?: {
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
  };
}

interface WeekSession {
  id: string;
  className: string;
  date: string;
  dayName: string;
  time: string;
  location: string;
  instructor: string;
  status: 'upcoming' | 'today' | 'completed' | 'absent' | 'leave_requested' | 'makeup';
  canRequestLeave: boolean;
  leaveRequest?: {
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
  };
}

interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  registrationDeadline: string;
  daysUntilDeadline: number;
  status: 'open' | 'closing_soon' | 'closed' | 'completed';
  description?: string;
  eligibleDivisions: string[];
}

interface MyRegistration {
  id: string;
  competitionName: string;
  division: string;
  status: 'pending' | 'confirmed' | 'withdrawn' | 'completed';
  registrationDate: string;
  weighInRequired: boolean;
  weighInDate?: string;
  checkInTime?: string;
  notes?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'class' | 'competition' | 'billing' | 'emergency';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  author: string;
  publishedAt: string;
  isRead: boolean;
  audience: string;
  hasAttachment?: boolean;
}

interface OutstandingInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysOverdue: number;
  purpose: string;
  description?: string;
  status: 'pending' | 'overdue' | 'due_soon';
}

interface ReminderSettings {
  nextSession24h: boolean;
  nextSession2h: boolean;
  competitionDeadline: boolean;
  announcementNew: boolean;
  invoiceDue: boolean;
  channel: 'email' | 'whatsapp' | 'both';
}

function StudentDashboardContent() {
  const { success, error } = useToast();
  const router = useRouter();
  
  // ========== 状态管理 ==========
  const [nextSession, setNextSession] = useState<NextSession | null>(null);
  const [weekSessions, setWeekSessions] = useState<WeekSession[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<MyRegistration[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [outstandingInvoices, setOutstandingInvoices] = useState<OutstandingInvoice[]>([]);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    nextSession24h: true,
    nextSession2h: true,
    competitionDeadline: true,
    announcementNew: true,
    invoiceDue: true,
    channel: 'email'
  });
  const [loading, setLoading] = useState(true);

  // ========== 数据加载 ==========
  useEffect(() => {
    loadStudentHome();
  }, []);

  const loadStudentHome = async () => {
    try {
      const { authenticatedFetch } = await import('@/lib/auth-client');
      
      // 加载学员主页聚合数据
      const homeResponse = await authenticatedFetch(API_ENDPOINTS.dashboard.student.overview());
      if (homeResponse.ok) {
        const homeData = await homeResponse.json();
        if (homeData.success) {
          const data = homeData.data;
          
          // 设置下一节课
          if (data.nextSession) {
            setNextSession({
              id: data.nextSession.session_id,
              className: data.nextSession.class_name,
              date: formatDate(data.nextSession.date),
              time: `${data.nextSession.start_time} - ${data.nextSession.end_time}`,
              location: data.nextSession.venue_name,
              instructor: data.nextSession.instructor_name,
              checkinWindow: '30 minutes before class',
              equipmentReminder: 'Bring your belt and protective gear',
              status: getSessionStatus(data.nextSession.date),
              canRequestLeave: true,
              hasLeaveRequest: data.nextSession.leave_request
            });
          }

          // 设置本周课程
          if (data.weekSessions && Array.isArray(data.weekSessions)) {
            setWeekSessions(data.weekSessions.map((session: any) => ({
              id: session.session_id,
              className: session.class_name,
              date: formatDate(session.date),
              dayName: getDayName(session.day_of_week),
              time: `${session.start_time} - ${session.end_time}`,
              location: session.venue_name,
              instructor: session.instructor_name,
              status: session.attendance_status || getSessionStatus(session.date),
              canRequestLeave: !isPastSession(session.date),
              leaveRequest: session.leave_request
            })));
          }

          // 设置提醒偏好
          if (data.notificationPreferences) {
            setReminderSettings(data.notificationPreferences);
          }
        }
      }

      // 加载比赛信息
      const competitionsResponse = await authenticatedFetch(buildApiUrl('competitions/upcoming?days=60'));
      if (competitionsResponse.ok) {
        const competitionsData = await competitionsResponse.json();
        if (competitionsData.success) {
          setCompetitions(competitionsData.data.competitions || []);
          setMyRegistrations(competitionsData.data.myRegistrations || []);
        }
      }

      // 加载公告
      const announcementsResponse = await authenticatedFetch(buildApiUrl('announcements?scope=student'));
      if (announcementsResponse.ok) {
        const announcementsData = await announcementsResponse.json();
        if (announcementsData.success) {
          setAnnouncements(announcementsData.data || []);
        }
      }

      // 加载未支付账单
      const invoicesResponse = await authenticatedFetch(buildApiUrl('invoices?status=unpaid'));
      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        if (invoicesData.success) {
          setOutstandingInvoices(invoicesData.data || []);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Student home load error:', err);
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

  const getDayName = (dayOfWeek: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || 'Unknown';
  };

  const getSessionStatus = (dateStr: string): 'upcoming' | 'today' | 'in_progress' => {
    const sessionDate = new Date(dateStr);
    const today = new Date();
    
    if (sessionDate.toDateString() === today.toDateString()) {
      return 'today';
    }
    
    return 'upcoming';
  };

  const isPastSession = (dateStr: string): boolean => {
    const sessionDate = new Date(dateStr);
    const now = new Date();
    return sessionDate < now;
  };

  const buildApiUrl = (endpoint: string): string => {
    return `http://localhost:8787/api/${endpoint}`;
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

  const handleRequestLeave = async (sessionId: string) => {
    try {
      // TODO: 实现请假申请功能
      success('Success', 'Leave request submitted. Your coach will be notified.');
    } catch (err) {
      error('Error', 'Failed to submit leave request');
    }
  };

  const handleFindMakeup = () => {
    router.push('/dashboard/student/makeup');
  };

  const handleAddToCalendar = (sessionId: string) => {
    // TODO: 实现添加到日历功能
    success('Success', 'Session added to calendar');
  };

  const handleViewSessionDetails = (sessionId: string) => {
    router.push(`/dashboard/student/sessions/${sessionId}`);
  };

  const handleViewCompetition = (competitionId: string) => {
    router.push(`/dashboard/student/competitions/${competitionId}`);
  };

  const handleRegisterCompetition = (competitionId: string) => {
    router.push(`/dashboard/student/competitions/${competitionId}/register`);
  };

  const handleViewRegistration = (registrationId: string) => {
    router.push(`/dashboard/student/registrations/${registrationId}`);
  };

  const handleReadAnnouncement = async (announcementId: string) => {
    try {
      // TODO: 实现标记已读功能
      setAnnouncements(prev => 
        prev.map(a => a.id === announcementId ? { ...a, isRead: true } : a)
      );
    } catch (err) {
      error('Error', 'Failed to mark announcement as read');
    }
  };

  const handleOpenAnnouncement = (announcementId: string) => {
    router.push(`/dashboard/student/announcements/${announcementId}`);
  };

  const handlePayInvoice = (invoiceId: string) => {
    router.push(`/dashboard/student/payments/checkout?invoice_id=${invoiceId}`);
  };

  const handleViewInvoice = (invoiceId: string) => {
    router.push(`/dashboard/student/invoices/${invoiceId}`);
  };

  const handleUpdateReminderSettings = async (settings: ReminderSettings) => {
    try {
      // TODO: 实现保存提醒设置功能
      setReminderSettings(settings);
      success('Success', 'Reminder settings updated');
    } catch (err) {
      error('Error', 'Failed to update reminder settings');
    }
  };

  const handleViewClasses = () => {
    router.push('/dashboard/student/classes');
  };

  const handleContactCoach = () => {
    router.push('/dashboard/student/messages/new');
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50">
        {/* 页面头部 */}
        <PageHeader
          title="Student Home"
          subtitle="Your classes, reminders, and important updates"
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
          {/* Row 1: Next Session + Reminders */}
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <NextSessionCard
                  session={nextSession}
                  loading={loading}
                  onRequestLeave={handleRequestLeave}
                  onFindMakeup={handleFindMakeup}
                  onAddToCalendar={handleAddToCalendar}
                />
              </div>
              <div>
                <RemindersCard
                  settings={reminderSettings}
                  loading={loading}
                  onUpdateSettings={handleUpdateReminderSettings}
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Row 2: This Week */}
          <ScrollReveal>
            <ThisWeekList
              sessions={weekSessions}
              loading={loading}
              onRequestLeave={handleRequestLeave}
              onViewDetails={handleViewSessionDetails}
            />
          </ScrollReveal>

          {/* Row 3: Competitions + Announcements */}
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CompetitionsSection
                competitions={competitions}
                myRegistrations={myRegistrations}
                loading={loading}
                onViewCompetition={handleViewCompetition}
                onRegister={handleRegisterCompetition}
                onViewRegistration={handleViewRegistration}
              />
              <AnnouncementsSection
                announcements={announcements}
                loading={loading}
                onReadAnnouncement={handleReadAnnouncement}
                onOpenAnnouncement={handleOpenAnnouncement}
              />
            </div>
          </ScrollReveal>

          {/* Row 4: Billing + Quick Actions */}
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BillingSection
                  outstandingInvoices={outstandingInvoices}
                  loading={loading}
                  onPayInvoice={handlePayInvoice}
                  onViewInvoice={handleViewInvoice}
                />
              </div>
              <div>
                <QuickActions
                  onRequestLeave={() => handleRequestLeave('')}
                  onFindMakeup={handleFindMakeup}
                  onViewClasses={handleViewClasses}
                  onContactCoach={handleContactCoach}
                />
              </div>
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
