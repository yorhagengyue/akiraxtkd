export const runtime = 'edge';
// Coach Dashboard API - 教练专用功能
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

// 教练仪表板数据结构
interface CoachStats {
  overview: {
    todaysSessions: number;
    totalStudents: number;
    pendingAttendance: number;
    upcomingGradings: number;
    thisWeekSessions: number;
    averageAttendance: number;
  };
  todaySchedule: Array<{
    sessionId: string;
    className: string;
    time: string;
    duration: string;
    venue: string;
    enrolledCount: number;
    capacity: number;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    attendanceRecorded: boolean;
  }>;
  myStudents: Array<{
    studentId: string;
    name: string;
    currentBelt: string;
    beltColor: string;
    lastAttendance: string;
    attendanceRate: number;
    classesEnrolled: string[];
    nextGradingEligible: boolean;
    notes: string;
    hasRisk: boolean;
    riskType?: 'attendance' | 'payment' | 'behavior';
  }>;
  attendanceSummary: {
    thisWeek: {
      totalSessions: number;
      recordedSessions: number;
      pendingSessions: number;
    };
    lastWeek: {
      averageAttendance: number;
      totalPresent: number;
      totalAbsent: number;
    };
  };
  gradingCandidates: Array<{
    studentId: string;
    name: string;
    currentBelt: string;
    targetBelt: string;
    readinessScore: number;
    requirements: {
      minClasses: { required: number; completed: number; met: boolean };
      minWeeks: { required: number; completed: number; met: boolean };
      skillAssessment: { score: number; required: number; met: boolean };
    };
    recommendedAction: 'ready' | 'needs_practice' | 'not_ready';
  }>;
  classPerformance: Array<{
    classId: string;
    className: string;
    averageAttendance: number;
    studentProgress: number;
    retentionRate: number;
    lastUpdated: string;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // 验证教练权限
    const authResult = await requireAuth(request);
    if (!authResult.success || !['coach', 'admin'].includes(authResult.user.role)) {
      return NextResponse.json(
        { success: false, error: 'COACH_ACCESS_REQUIRED', message: 'Coach or admin access required' },
        { status: 403 }
      );
    }

    const coachId = authResult.user.uid;
    const useMockData = process.env.DEV_MODE === 'true' || !process.env.D1_DATABASE_ID;

    if (useMockData) {
      // Mock教练数据
      const mockStats: CoachStats = {
        overview: {
          todaysSessions: 2,
          totalStudents: 45,
          pendingAttendance: 1,
          upcomingGradings: 8,
          thisWeekSessions: 6,
          averageAttendance: 89.2
        },
        todaySchedule: [
          {
            sessionId: 'session-001',
            className: 'Monday Evening Class',
            time: '20:00',
            duration: '1h',
            venue: 'Tampines Training Center',
            enrolledCount: 28,
            capacity: 30,
            status: 'completed',
            attendanceRecorded: true
          },
          {
            sessionId: 'session-002',
            className: 'Friday Advanced Class',
            time: '20:00',
            duration: '1.5h',
            venue: 'Fengshan CC',
            enrolledCount: 22,
            capacity: 25,
            status: 'upcoming',
            attendanceRecorded: false
          }
        ],
        myStudents: [
          {
            studentId: 'student-001',
            name: 'Rishabh Singh Bist',
            currentBelt: 'Blue Belt',
            beltColor: '#3b82f6',
            lastAttendance: '2024-12-16',
            attendanceRate: 95.2,
            classesEnrolled: ['Monday Evening', 'Thursday Practice'],
            nextGradingEligible: true,
            notes: 'Excellent technique, ready for red belt testing',
            hasRisk: false
          },
          {
            studentId: 'student-002',
            name: 'Avaneesh',
            currentBelt: 'Green Belt',
            beltColor: '#22c55e',
            lastAttendance: '2024-12-18',
            attendanceRate: 88.7,
            classesEnrolled: ['Monday Evening'],
            nextGradingEligible: false,
            notes: 'Needs more practice on forms',
            hasRisk: false
          },
          {
            studentId: 'student-003',
            name: 'Dhedeepya',
            currentBelt: 'Yellow Belt',
            beltColor: '#fbbf24',
            lastAttendance: '2024-12-10',
            attendanceRate: 65.3,
            classesEnrolled: ['Tuesday Practice'],
            nextGradingEligible: false,
            notes: 'Low attendance - need to follow up',
            hasRisk: true,
            riskType: 'attendance'
          }
        ],
        attendanceSummary: {
          thisWeek: {
            totalSessions: 4,
            recordedSessions: 3,
            pendingSessions: 1
          },
          lastWeek: {
            averageAttendance: 91.5,
            totalPresent: 87,
            totalAbsent: 8
          }
        },
        gradingCandidates: [
          {
            studentId: 'student-001',
            name: 'Rishabh Singh Bist',
            currentBelt: 'Blue Belt',
            targetBelt: 'Red Belt',
            readinessScore: 92,
            requirements: {
              minClasses: { required: 20, completed: 24, met: true },
              minWeeks: { required: 12, completed: 16, met: true },
              skillAssessment: { score: 88, required: 80, met: true }
            },
            recommendedAction: 'ready'
          },
          {
            studentId: 'student-004',
            name: 'Havish',
            currentBelt: 'Yellow Belt',
            targetBelt: 'Green Belt',
            readinessScore: 75,
            requirements: {
              minClasses: { required: 15, completed: 18, met: true },
              minWeeks: { required: 8, completed: 10, met: true },
              skillAssessment: { score: 72, required: 75, met: false }
            },
            recommendedAction: 'needs_practice'
          }
        ],
        classPerformance: [
          {
            classId: 'class-001',
            className: 'Monday Evening Class',
            averageAttendance: 91.2,
            studentProgress: 85.5,
            retentionRate: 96.7,
            lastUpdated: '2024-12-18T21:00:00Z'
          },
          {
            classId: 'class-002',
            className: 'Thursday Practice',
            averageAttendance: 87.8,
            studentProgress: 82.1,
            retentionRate: 94.2,
            lastUpdated: '2024-12-17T21:30:00Z'
          }
        ]
      };

      return NextResponse.json({
        success: true,
        data: mockStats,
        meta: {
          isMockData: true,
          coachId: coachId,
          environment: process.env.ENVIRONMENT || 'development',
          timestamp: new Date().toISOString()
        }
      });
    }

    // 生产环境数据库查询
    // TODO: 实现D1数据库查询
    return NextResponse.json({
      success: false,
      error: 'NOT_IMPLEMENTED',
      message: 'Production database integration pending'
    }, { status: 501 });

  } catch (error) {
    console.error('Coach dashboard error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_ERROR',
        message: 'Failed to load coach dashboard data',
        details: process.env.DEV_MODE === 'true' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/coach - 教练操作
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success || !['coach', 'admin'].includes(authResult.user.role)) {
      return NextResponse.json(
        { success: false, error: 'COACH_ACCESS_REQUIRED' },
        { status: 403 }
      );
    }

    const { action, data } = await request.json();

    switch (action) {
      case 'record_attendance':
        // 记录出勤
        return NextResponse.json({
          success: true,
          message: 'Attendance recorded successfully',
          data: {
            sessionId: data.sessionId,
            recordedCount: data.attendance.length,
            timestamp: new Date().toISOString()
          }
        });

      case 'update_student_notes':
        // 更新学员备注
        return NextResponse.json({
          success: true,
          message: 'Student notes updated',
          data: {
            studentId: data.studentId,
            notes: data.notes,
            updatedBy: authResult.user.uid
          }
        });

      case 'recommend_grading':
        // 推荐升级
        return NextResponse.json({
          success: true,
          message: 'Grading recommendation submitted',
          data: {
            studentId: data.studentId,
            targetBelt: data.targetBelt,
            recommendation: data.recommendation,
            submittedBy: authResult.user.uid
          }
        });

      case 'schedule_makeup':
        // 安排补课
        return NextResponse.json({
          success: true,
          message: 'Makeup session scheduled',
          data: {
            studentId: data.studentId,
            originalSessionId: data.originalSessionId,
            makeupDate: data.makeupDate
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'INVALID_ACTION' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Coach action error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
