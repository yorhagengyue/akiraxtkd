export const runtime = 'edge';
// Student Dashboard API - 简化的学生功能
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

// 学生仪表板数据结构（简化版）
interface StudentStats {
  profile: {
    studentId: string;
    name: string;
    studentCode: string;
    currentBelt: string;
    beltColor: string;
    joinedDate: string;
    nextBeltTarget: string;
  };
  currentClasses: Array<{
    classId: string;
    className: string;
    schedule: string;
    venue: string;
    instructor: string;
    nextSession: string;
    enrollmentStatus: 'active' | 'paused';
  }>;
  attendanceRecord: {
    thisMonth: {
      attended: number;
      total: number;
      rate: number;
    };
    recentSessions: Array<{
      date: string;
      className: string;
      status: 'present' | 'absent' | 'late';
      notes?: string;
    }>;
  };
  beltProgress: {
    currentRank: {
      name: string;
      color: string;
      achievedDate: string;
    };
    nextRank: {
      name: string;
      color: string;
      requirements: {
        minClasses: { required: number; completed: number };
        minWeeks: { required: number; completed: number };
        skillLevel: string;
      };
      eligibilityDate?: string;
    };
    progressHistory: Array<{
      beltName: string;
      achievedDate: string;
      gradedBy: string;
    }>;
  };
  upcomingEvents: Array<{
    id: string;
    type: 'class' | 'grading' | 'competition' | 'event';
    title: string;
    date: string;
    time: string;
    venue: string;
    description: string;
    actionRequired: boolean;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    priority: 'low' | 'medium' | 'high';
    read: boolean;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // 验证学生权限
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: 'AUTHENTICATION_REQUIRED', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const studentId = authResult.user.uid;
    const useMockData = process.env.DEV_MODE === 'true' || !process.env.D1_DATABASE_ID;

    if (useMockData) {
      // Mock学生数据
      const mockStats: StudentStats = {
        profile: {
          studentId: studentId,
          name: 'Demo Student',
          studentCode: 'AXT2024001',
          currentBelt: 'Green Belt',
          beltColor: '#22c55e',
          joinedDate: '2024-01-15',
          nextBeltTarget: 'Green Belt with Blue Tip'
        },
        currentClasses: [
          {
            classId: 'class-001',
            className: 'Monday Evening Class',
            schedule: 'Monday 8:00 PM - 9:00 PM',
            venue: 'Tampines Training Center',
            instructor: 'Jasterfer Kellen',
            nextSession: '2024-12-23',
            enrollmentStatus: 'active'
          },
          {
            classId: 'class-003',
            className: 'Thursday Practice',
            schedule: 'Thursday 7:30 PM - 9:00 PM',
            venue: 'Compassvale Drive',
            instructor: 'Jasterfer Kellen',
            nextSession: '2024-12-26',
            enrollmentStatus: 'active'
          }
        ],
        attendanceRecord: {
          thisMonth: {
            attended: 14,
            total: 16,
            rate: 87.5
          },
          recentSessions: [
            {
              date: '2024-12-18',
              className: 'Thursday Practice',
              status: 'present'
            },
            {
              date: '2024-12-16',
              className: 'Monday Evening Class',
              status: 'present'
            },
            {
              date: '2024-12-12',
              className: 'Thursday Practice',
              status: 'late',
              notes: 'Arrived 15 minutes late'
            },
            {
              date: '2024-12-09',
              className: 'Monday Evening Class',
              status: 'absent'
            }
          ]
        },
        beltProgress: {
          currentRank: {
            name: 'Green Belt',
            color: '#22c55e',
            achievedDate: '2024-08-15'
          },
          nextRank: {
            name: 'Green Belt with Blue Tip',
            color: '#22c55e',
            requirements: {
              minClasses: { required: 20, completed: 18 },
              minWeeks: { required: 12, completed: 10 },
              skillLevel: 'Intermediate techniques mastered'
            },
            eligibilityDate: '2025-02-15'
          },
          progressHistory: [
            {
              beltName: 'Green Belt',
              achievedDate: '2024-08-15',
              gradedBy: 'Jasterfer Kellen'
            },
            {
              beltName: 'Yellow Belt with Green Tip',
              achievedDate: '2024-05-20',
              gradedBy: 'Coach Kim'
            },
            {
              beltName: 'Yellow Belt',
              achievedDate: '2024-03-10',
              gradedBy: 'Jasterfer Kellen'
            }
          ]
        },
        upcomingEvents: [
          {
            id: 'event-001',
            type: 'class',
            title: 'Monday Evening Class',
            date: '2024-12-23',
            time: '8:00 PM',
            venue: 'Tampines Training Center',
            description: 'Regular training session',
            actionRequired: false
          },
          {
            id: 'event-002',
            type: 'grading',
            title: 'Belt Testing Event',
            date: '2025-01-15',
            time: '2:00 PM',
            venue: 'Main Dojo',
            description: 'Quarterly belt testing for eligible students',
            actionRequired: true
          }
        ],
        announcements: [
          {
            id: 'ann-001',
            title: 'Holiday Schedule Update',
            content: 'Classes will be suspended from Dec 25-31. Regular schedule resumes Jan 2.',
            date: '2024-12-15',
            priority: 'high',
            read: false
          },
          {
            id: 'ann-002',
            title: 'Belt Testing Registration Open',
            content: 'Registration for January belt testing is now open for eligible students.',
            date: '2024-12-10',
            priority: 'medium',
            read: true
          }
        ]
      };

      return NextResponse.json({
        success: true,
        data: mockStats,
        meta: {
          isMockData: true,
          studentId: studentId,
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
    console.error('Student dashboard error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_ERROR',
        message: 'Failed to load student dashboard data',
        details: process.env.DEV_MODE === 'true' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/student - 学生操作（简化版）
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: 'AUTHENTICATION_REQUIRED' },
        { status: 401 }
      );
    }

    const { action, data } = await request.json();

    switch (action) {
      case 'mark_announcement_read':
        // 标记公告为已读
        return NextResponse.json({
          success: true,
          message: 'Announcement marked as read',
          data: { announcementId: data.announcementId }
        });

      case 'request_makeup':
        // 请求补课
        return NextResponse.json({
          success: true,
          message: 'Makeup request submitted',
          data: {
            sessionId: data.sessionId,
            reason: data.reason,
            status: 'pending'
          }
        });

      case 'update_profile':
        // 更新基本信息（限制字段）
        const allowedFields = ['display_name', 'phone', 'emergency_contact'];
        const updates = {};
        
        Object.keys(data).forEach(key => {
          if (allowedFields.includes(key)) {
            updates[key] = data[key];
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Profile updated successfully',
          data: updates
        });

      default:
        return NextResponse.json(
          { success: false, error: 'INVALID_ACTION' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Student action error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
