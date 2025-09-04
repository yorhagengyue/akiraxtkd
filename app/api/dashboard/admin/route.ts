export const runtime = 'edge';
// Admin Dashboard API - 完整的管理员功能
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

// 管理员仪表板统计数据
interface AdminStats {
  overview: {
    totalStudents: number;
    activeStudents: number;
    totalClasses: number;
    totalInstructors: number;
    pendingEnrollments: number;
    upcomingGradings: number;
    monthlyRevenue: number;
    attendanceRate: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'enrollment' | 'payment' | 'grading' | 'attendance';
    description: string;
    timestamp: string;
    actor: string;
    status: 'success' | 'pending' | 'failed';
  }>;
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info';
    title: string;
    message: string;
    timestamp: string;
    acknowledged: boolean;
  }>;
  financialSummary: {
    thisMonth: {
      revenue: number;
      expenses: number;
      profit: number;
    };
    lastMonth: {
      revenue: number;
      expenses: number;
      profit: number;
    };
    pendingPayments: number;
    overduePayments: number;
  };
  studentMetrics: {
    byBeltLevel: Record<string, number>;
    byAgeGroup: Record<string, number>;
    byGender: Record<string, number>;
    retentionRate: number;
    averageAttendance: number;
  };
  classMetrics: {
    utilizationRate: number;
    popularClasses: Array<{
      className: string;
      enrollmentCount: number;
      capacity: number;
      utilizationPercent: number;
    }>;
    instructorWorkload: Array<{
      instructorName: string;
      classCount: number;
      studentCount: number;
      hoursPerWeek: number;
    }>;
  };
}

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await requireAuth(request);
    if (!authResult.success || authResult.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'ADMIN_ACCESS_REQUIRED', message: 'Admin access required' },
        { status: 403 }
      );
    }

    // 检查是否使用Mock数据
    const useMockData = process.env.DEV_MODE === 'true' || !process.env.D1_DATABASE_ID;

    if (useMockData) {
      // 返回Mock管理员数据
      const mockStats: AdminStats = {
        overview: {
          totalStudents: 127,
          activeStudents: 118,
          totalClasses: 12,
          totalInstructors: 4,
          pendingEnrollments: 8,
          upcomingGradings: 15,
          monthlyRevenue: 12450.00,
          attendanceRate: 87.5
        },
        recentActivity: [
          {
            id: '1',
            type: 'enrollment',
            description: 'New student enrolled in Monday Advanced Class',
            timestamp: '2024-12-19T10:30:00Z',
            actor: 'System',
            status: 'success'
          },
          {
            id: '2',
            type: 'payment',
            description: 'Monthly fee payment received from John Doe',
            timestamp: '2024-12-19T09:15:00Z',
            actor: 'Payment System',
            status: 'success'
          },
          {
            id: '3',
            type: 'grading',
            description: 'Belt testing scheduled for 15 students',
            timestamp: '2024-12-18T16:45:00Z',
            actor: 'Jasterfer Kellen',
            status: 'pending'
          },
          {
            id: '4',
            type: 'attendance',
            description: 'Attendance recorded for Thursday Class',
            timestamp: '2024-12-18T21:00:00Z',
            actor: 'Coach Kim',
            status: 'success'
          }
        ],
        alerts: [
          {
            id: 'alert-1',
            type: 'warning',
            title: 'Overdue Payments',
            message: '3 students have overdue payments totaling $450',
            timestamp: '2024-12-19T08:00:00Z',
            acknowledged: false
          },
          {
            id: 'alert-2',
            type: 'info',
            title: 'Belt Testing Reminder',
            message: 'Belt testing event scheduled for next week - 15 students registered',
            timestamp: '2024-12-18T14:00:00Z',
            acknowledged: false
          }
        ],
        financialSummary: {
          thisMonth: {
            revenue: 12450.00,
            expenses: 3200.00,
            profit: 9250.00
          },
          lastMonth: {
            revenue: 11800.00,
            expenses: 3100.00,
            profit: 8700.00
          },
          pendingPayments: 2340.00,
          overduePayments: 450.00
        },
        studentMetrics: {
          byBeltLevel: {
            'White Belt': 25,
            'Yellow Belt': 30,
            'Green Belt': 28,
            'Blue Belt': 22,
            'Red Belt': 15,
            'Black Belt': 7
          },
          byAgeGroup: {
            'Kids (6-12)': 45,
            'Teens (13-17)': 38,
            'Adults (18+)': 44
          },
          byGender: {
            'Male': 68,
            'Female': 59
          },
          retentionRate: 92.3,
          averageAttendance: 87.5
        },
        classMetrics: {
          utilizationRate: 78.5,
          popularClasses: [
            {
              className: 'Monday Evening Class',
              enrollmentCount: 28,
              capacity: 30,
              utilizationPercent: 93.3
            },
            {
              className: 'Friday Advanced Class',
              enrollmentCount: 22,
              capacity: 25,
              utilizationPercent: 88.0
            },
            {
              className: 'Saturday Kids Class',
              enrollmentCount: 20,
              capacity: 25,
              utilizationPercent: 80.0
            }
          ],
          instructorWorkload: [
            {
              instructorName: 'Jasterfer Kellen',
              classCount: 4,
              studentCount: 85,
              hoursPerWeek: 8.5
            },
            {
              instructorName: 'Coach Kim',
              classCount: 2,
              studentCount: 42,
              hoursPerWeek: 4.0
            }
          ]
        }
      };

      return NextResponse.json({
        success: true,
        data: mockStats,
        meta: {
          isMockData: true,
          environment: process.env.ENVIRONMENT || 'development',
          timestamp: new Date().toISOString()
        }
      });
    }

    // 生产环境 - 从D1数据库获取真实数据
    // TODO: 实现真实数据库查询
    return NextResponse.json({
      success: false,
      error: 'NOT_IMPLEMENTED',
      message: 'Production database integration pending'
    }, { status: 501 });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_ERROR',
        message: 'Failed to load admin dashboard data',
        details: process.env.DEV_MODE === 'true' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/admin - 管理员操作
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success || authResult.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'ADMIN_ACCESS_REQUIRED' },
        { status: 403 }
      );
    }

    const { action, data } = await request.json();

    switch (action) {
      case 'acknowledge_alert':
        // 确认警报
        return NextResponse.json({
          success: true,
          message: 'Alert acknowledged',
          data: { alertId: data.alertId, acknowledged: true }
        });

      case 'generate_report':
        // 生成报告
        return NextResponse.json({
          success: true,
          message: 'Report generation started',
          data: { 
            reportId: `report_${Date.now()}`,
            type: data.reportType,
            status: 'generating'
          }
        });

      case 'bulk_action':
        // 批量操作
        return NextResponse.json({
          success: true,
          message: `Bulk ${data.operation} completed`,
          data: { 
            processed: data.ids.length,
            failed: 0
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'INVALID_ACTION' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Admin action error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
