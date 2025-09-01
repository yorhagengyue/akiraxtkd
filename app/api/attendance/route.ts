// Attendance Management API - 出勤管理功能
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

// 出勤记录数据结构
interface AttendanceRecord {
  attendanceId: string;
  sessionId: string;
  sessionDate: string;
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  status: 'present' | 'absent' | 'late' | 'makeup';
  arrivalTime?: string;
  departureTime?: string;
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

interface SessionAttendance {
  sessionId: string;
  classId: string;
  className: string;
  sessionDate: string;
  venue: string;
  instructor: string;
  plannedStartTime: string;
  plannedEndTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  enrolledStudents: Array<{
    studentId: string;
    studentName: string;
    studentCode: string;
    currentBelt: string;
    attendanceStatus?: 'present' | 'absent' | 'late' | 'makeup';
    arrivalTime?: string;
    notes?: string;
  }>;
  attendanceStats: {
    total: number;
    present: number;
    absent: number;
    late: number;
    rate: number;
  };
  recordedBy?: string;
  recordedAt?: string;
}

interface RecordAttendanceRequest {
  sessionId: string;
  attendance: Array<{
    studentId: string;
    status: 'present' | 'absent' | 'late' | 'makeup';
    arrivalTime?: string;
    departureTime?: string;
    notes?: string;
  }>;
}

// GET /api/attendance - 获取出勤记录
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success || !['coach', 'admin'].includes(authResult.user.role)) {
      return NextResponse.json(
        { success: false, error: 'INSUFFICIENT_PERMISSIONS', message: 'Coach or admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const classId = searchParams.get('class_id');
    const studentId = searchParams.get('student_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const type = searchParams.get('type') || 'records'; // 'records' | 'sessions'

    const useMockData = process.env.DEV_MODE === 'true' || !process.env.D1_DATABASE_ID;

    if (useMockData) {
      if (type === 'sessions') {
        // 返回会话出勤概览
        const mockSessions: SessionAttendance[] = [
          {
            sessionId: 'session-001',
            classId: 'class-001',
            className: 'Monday Evening Class',
            sessionDate: '2024-12-16',
            venue: 'Tampines Training Center',
            instructor: 'Jasterfer Kellen',
            plannedStartTime: '20:00',
            plannedEndTime: '21:00',
            status: 'completed',
            enrolledStudents: [
              {
                studentId: 'student-001',
                studentName: 'Rishabh Singh Bist',
                studentCode: 'AXT2024001',
                currentBelt: 'Blue Belt',
                attendanceStatus: 'present',
                arrivalTime: '19:58'
              },
              {
                studentId: 'student-002',
                studentName: 'Avaneesh',
                studentCode: 'AXT2024002',
                currentBelt: 'Green Belt',
                attendanceStatus: 'present',
                arrivalTime: '20:02'
              },
              {
                studentId: 'student-004',
                studentName: 'Aska',
                studentCode: 'AXT2024004',
                currentBelt: 'Green Belt',
                attendanceStatus: 'late',
                arrivalTime: '20:15',
                notes: 'Traffic delay'
              },
              {
                studentId: 'student-005',
                studentName: 'Aadvik',
                studentCode: 'AXT2024005',
                currentBelt: 'Yellow Belt',
                attendanceStatus: 'absent'
              }
            ],
            attendanceStats: {
              total: 4,
              present: 2,
              absent: 1,
              late: 1,
              rate: 75.0
            },
            recordedBy: 'coach-001',
            recordedAt: '2024-12-16T21:05:00Z'
          },
          {
            sessionId: 'session-002',
            classId: 'class-002',
            className: 'Tuesday Practice',
            sessionDate: '2024-12-17',
            venue: 'Compassvale Training Center A',
            instructor: 'Coach Kim',
            plannedStartTime: '19:30',
            plannedEndTime: '20:30',
            status: 'completed',
            enrolledStudents: [
              {
                studentId: 'student-003',
                studentName: 'Dhedeepya',
                studentCode: 'AXT2024003',
                currentBelt: 'Yellow Belt',
                attendanceStatus: 'present',
                arrivalTime: '19:28'
              },
              {
                studentId: 'student-006',
                studentName: 'Saira',
                studentCode: 'AXT2024006',
                currentBelt: 'Green Belt',
                attendanceStatus: 'present',
                arrivalTime: '19:30'
              }
            ],
            attendanceStats: {
              total: 2,
              present: 2,
              absent: 0,
              late: 0,
              rate: 100.0
            },
            recordedBy: 'coach-002',
            recordedAt: '2024-12-17T20:35:00Z'
          },
          {
            sessionId: 'session-003',
            classId: 'class-001',
            className: 'Monday Evening Class',
            sessionDate: '2024-12-23',
            venue: 'Tampines Training Center',
            instructor: 'Jasterfer Kellen',
            plannedStartTime: '20:00',
            plannedEndTime: '21:00',
            status: 'scheduled',
            enrolledStudents: [
              {
                studentId: 'student-001',
                studentName: 'Rishabh Singh Bist',
                studentCode: 'AXT2024001',
                currentBelt: 'Blue Belt'
              },
              {
                studentId: 'student-002',
                studentName: 'Avaneesh',
                studentCode: 'AXT2024002',
                currentBelt: 'Green Belt'
              }
            ],
            attendanceStats: {
              total: 2,
              present: 0,
              absent: 0,
              late: 0,
              rate: 0
            }
          }
        ];

        // 应用过滤
        let filteredSessions = mockSessions;
        if (classId) {
          filteredSessions = filteredSessions.filter(s => s.classId === classId);
        }
        if (dateFrom) {
          filteredSessions = filteredSessions.filter(s => s.sessionDate >= dateFrom);
        }
        if (dateTo) {
          filteredSessions = filteredSessions.filter(s => s.sessionDate <= dateTo);
        }

        // 权限过滤 - 教练只能看到自己的课程
        if (authResult.user.role === 'coach') {
          filteredSessions = filteredSessions.filter(s => s.instructor === authResult.user.displayName);
        }

        return NextResponse.json({
          success: true,
          data: filteredSessions,
          meta: {
            isMockData: true,
            type: 'sessions',
            filters: { classId, dateFrom, dateTo },
            userRole: authResult.user.role
          }
        });
      } else {
        // 返回出勤记录列表
        const mockRecords: AttendanceRecord[] = [
          {
            attendanceId: 'att-001',
            sessionId: 'session-001',
            sessionDate: '2024-12-16',
            classId: 'class-001',
            className: 'Monday Evening Class',
            studentId: 'student-001',
            studentName: 'Rishabh Singh Bist',
            studentCode: 'AXT2024001',
            status: 'present',
            arrivalTime: '19:58',
            recordedBy: 'coach-001',
            recordedAt: '2024-12-16T21:05:00Z'
          },
          {
            attendanceId: 'att-002',
            sessionId: 'session-001',
            sessionDate: '2024-12-16',
            classId: 'class-001',
            className: 'Monday Evening Class',
            studentId: 'student-002',
            studentName: 'Avaneesh',
            studentCode: 'AXT2024002',
            status: 'present',
            arrivalTime: '20:02',
            recordedBy: 'coach-001',
            recordedAt: '2024-12-16T21:05:00Z'
          },
          {
            attendanceId: 'att-003',
            sessionId: 'session-001',
            sessionDate: '2024-12-16',
            classId: 'class-001',
            className: 'Monday Evening Class',
            studentId: 'student-004',
            studentName: 'Aska',
            studentCode: 'AXT2024004',
            status: 'late',
            arrivalTime: '20:15',
            notes: 'Traffic delay',
            recordedBy: 'coach-001',
            recordedAt: '2024-12-16T21:05:00Z'
          }
        ];

        // 应用过滤
        let filteredRecords = mockRecords;
        if (sessionId) {
          filteredRecords = filteredRecords.filter(r => r.sessionId === sessionId);
        }
        if (classId) {
          filteredRecords = filteredRecords.filter(r => r.classId === classId);
        }
        if (studentId) {
          filteredRecords = filteredRecords.filter(r => r.studentId === studentId);
        }
        if (dateFrom) {
          filteredRecords = filteredRecords.filter(r => r.sessionDate >= dateFrom);
        }
        if (dateTo) {
          filteredRecords = filteredRecords.filter(r => r.sessionDate <= dateTo);
        }

        return NextResponse.json({
          success: true,
          data: filteredRecords,
          meta: {
            isMockData: true,
            type: 'records',
            filters: { sessionId, classId, studentId, dateFrom, dateTo },
            userRole: authResult.user.role
          }
        });
      }
    }

    // 生产环境数据库查询
    // TODO: 实现D1数据库查询
    return NextResponse.json({
      success: false,
      error: 'NOT_IMPLEMENTED',
      message: 'Production database integration pending'
    }, { status: 501 });

  } catch (error) {
    console.error('Attendance API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_ERROR',
        message: 'Failed to fetch attendance data',
        details: process.env.DEV_MODE === 'true' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/attendance - 记录出勤
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success || !['coach', 'admin'].includes(authResult.user.role)) {
      return NextResponse.json(
        { success: false, error: 'INSUFFICIENT_PERMISSIONS', message: 'Coach or admin access required' },
        { status: 403 }
      );
    }

    const attendanceData: RecordAttendanceRequest = await request.json();
    
    // 验证数据
    if (!attendanceData.sessionId || !Array.isArray(attendanceData.attendance) || attendanceData.attendance.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Session ID and attendance records are required'
      }, { status: 422 });
    }

    const useMockData = process.env.DEV_MODE === 'true' || !process.env.D1_DATABASE_ID;

    if (useMockData) {
      // Mock记录出勤
      const recordedAttendance = attendanceData.attendance.map((record, index) => ({
        attendanceId: `att-${Date.now()}-${index}`,
        sessionId: attendanceData.sessionId,
        studentId: record.studentId,
        status: record.status,
        arrivalTime: record.arrivalTime,
        departureTime: record.departureTime,
        notes: record.notes,
        recordedBy: authResult.user.uid,
        recordedAt: new Date().toISOString()
      }));

      // 计算统计
      const stats = {
        total: attendanceData.attendance.length,
        present: attendanceData.attendance.filter(a => a.status === 'present').length,
        absent: attendanceData.attendance.filter(a => a.status === 'absent').length,
        late: attendanceData.attendance.filter(a => a.status === 'late').length,
        makeup: attendanceData.attendance.filter(a => a.status === 'makeup').length
      };

      return NextResponse.json({
        success: true,
        data: {
          sessionId: attendanceData.sessionId,
          recordedCount: recordedAttendance.length,
          stats,
          recordedBy: authResult.user.uid,
          recordedAt: new Date().toISOString()
        },
        message: 'Attendance recorded successfully'
      }, { status: 201 });
    }

    // 生产环境数据库操作
    // TODO: 实现D1数据库插入
    return NextResponse.json({
      success: false,
      error: 'NOT_IMPLEMENTED',
      message: 'Production database integration pending'
    }, { status: 501 });

  } catch (error) {
    console.error('Record attendance error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_ERROR',
        message: 'Failed to record attendance',
        details: process.env.DEV_MODE === 'true' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/attendance - 更新出勤记录
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success || !['coach', 'admin'].includes(authResult.user.role)) {
      return NextResponse.json(
        { success: false, error: 'INSUFFICIENT_PERMISSIONS' },
        { status: 403 }
      );
    }

    const { attendanceId, updates } = await request.json();
    
    if (!attendanceId) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Attendance ID is required'
      }, { status: 422 });
    }

    const useMockData = process.env.DEV_MODE === 'true' || !process.env.D1_DATABASE_ID;

    if (useMockData) {
      // Mock更新出勤记录
      return NextResponse.json({
        success: true,
        data: {
          attendanceId,
          updates,
          updatedBy: authResult.user.uid,
          updatedAt: new Date().toISOString()
        },
        message: 'Attendance record updated successfully'
      });
    }

    // 生产环境数据库操作
    // TODO: 实现D1数据库更新
    return NextResponse.json({
      success: false,
      error: 'NOT_IMPLEMENTED',
      message: 'Production database integration pending'
    }, { status: 501 });

  } catch (error) {
    console.error('Update attendance error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
