/**
 * Attendance Management API - 出勤管理
 * GET /api/attendance - 获取出勤记录
 * POST /api/attendance - 批量记录出勤
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { ValidationError } from '@/lib/models';

// 标准化错误响应
function createErrorResponse(error: any, status: number = 500) {
  console.error('Attendance API Error:', error);

  if (error instanceof ValidationError) {
    return NextResponse.json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: error.message,
      field: error.field,
      code: error.code
    }, { status: 400 });
  }

  return NextResponse.json({
    success: false,
    error: 'INTERNAL_ERROR',
    message: error.message || 'An unexpected error occurred'
  }, { status });
}

// Mock出勤数据
const mockAttendanceRecords = [
  {
    id: 1,
    student_id: 1,
    class_id: 1,
    attendance_date: '2024-12-16',
    status: 'Present' as const,
    arrival_time: '20:00',
    notes: null,
    student_name: 'Alex Chen',
    student_code: 'AXT2024001',
    class_name: 'Monday Evening Class',
    instructor_name: 'Jasterfer Kellen',
    created_at: '2024-12-16T20:00:00Z',
    updated_at: '2024-12-16T20:00:00Z'
  },
  {
    id: 2,
    student_id: 2,
    class_id: 1,
    attendance_date: '2024-12-16',
    status: 'Late' as const,
    arrival_time: '20:10',
    notes: 'Traffic jam',
    student_name: 'Sarah Wong',
    student_code: 'AXT2024002',
    class_name: 'Monday Evening Class',
    instructor_name: 'Jasterfer Kellen',
    created_at: '2024-12-16T20:10:00Z',
    updated_at: '2024-12-16T20:10:00Z'
  },
  {
    id: 3,
    student_id: 1,
    class_id: 2,
    attendance_date: '2024-12-12',
    status: 'Present' as const,
    arrival_time: '19:30',
    notes: null,
    student_name: 'Alex Chen',
    student_code: 'AXT2024001',
    class_name: 'Thursday Practice',
    instructor_name: 'Jasterfer Kellen',
    created_at: '2024-12-12T19:30:00Z',
    updated_at: '2024-12-12T19:30:00Z'
  },
  {
    id: 4,
    student_id: 3,
    class_id: 1,
    attendance_date: '2024-12-16',
    status: 'Absent' as const,
    arrival_time: null,
    notes: 'Sick',
    student_name: 'Michael Tan',
    student_code: 'AXT2024003',
    class_name: 'Monday Evening Class',
    instructor_name: 'Jasterfer Kellen',
    created_at: '2024-12-16T21:00:00Z',
    updated_at: '2024-12-16T21:00:00Z'
  }
];

// GET /api/attendance - 获取出勤记录
export async function GET(request: NextRequest) {
  try {
    // 验证权限
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    // 解析查询参数
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const classId = url.searchParams.get('class_id');
    const studentId = url.searchParams.get('student_id');
    const status = url.searchParams.get('status');

    let filteredRecords = [...mockAttendanceRecords];

    // 应用筛选
    if (startDate) {
      filteredRecords = filteredRecords.filter(record => 
        record.attendance_date >= startDate
      );
    }

    if (endDate) {
      filteredRecords = filteredRecords.filter(record => 
        record.attendance_date <= endDate
      );
    }

    if (classId) {
      filteredRecords = filteredRecords.filter(record => 
        record.class_id === parseInt(classId)
      );
    }

    if (studentId) {
      filteredRecords = filteredRecords.filter(record => 
        record.student_id === parseInt(studentId)
      );
    }

    if (status) {
      filteredRecords = filteredRecords.filter(record => 
        record.status === status
      );
    }

    // 排序（最新的在前）
    filteredRecords.sort((a, b) => {
      const dateComparison = b.attendance_date.localeCompare(a.attendance_date);
      if (dateComparison === 0) {
        return b.created_at.localeCompare(a.created_at);
      }
      return dateComparison;
    });

    // 分页
    const total = filteredRecords.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedRecords = filteredRecords.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedRecords,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}

// POST /api/attendance - 批量记录出勤
export async function POST(request: NextRequest) {
  try {
    // 验证权限（需要教练或管理员权限）
    const authResult = await requireAuth(request, 'coach');
    if (!authResult.success) {
      return authResult.response;
    }

    const body = await request.json();
    const { class_id, attendance_date, records } = body;

    // 验证必填字段
    if (!class_id || !attendance_date || !records || !Array.isArray(records)) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required fields: class_id, attendance_date, records'
      }, { status: 400 });
    }

    // 验证日期格式
    if (isNaN(Date.parse(attendance_date))) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid attendance_date format',
        field: 'attendance_date'
      }, { status: 400 });
    }

    // 验证记录数组
    if (records.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'At least one attendance record is required',
        field: 'records'
      }, { status: 400 });
    }

    // 验证每条记录
    const validStatuses = ['Present', 'Late', 'Absent'];
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      if (!record.student_id || !record.status) {
        return NextResponse.json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: `Record ${i + 1}: Missing student_id or status`,
          field: `records[${i}]`
        }, { status: 400 });
      }

      if (!validStatuses.includes(record.status)) {
        return NextResponse.json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: `Record ${i + 1}: Invalid status. Must be Present, Late, or Absent`,
          field: `records[${i}].status`
        }, { status: 400 });
      }

      // 验证到达时间格式（如果提供）
      if (record.arrival_time && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(record.arrival_time)) {
        return NextResponse.json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: `Record ${i + 1}: Invalid arrival_time format. Use HH:MM format`,
          field: `records[${i}].arrival_time`
        }, { status: 400 });
      }
    }

    // 检查重复记录
    const existingRecords = mockAttendanceRecords.filter(record => 
      record.class_id === class_id && record.attendance_date === attendance_date
    );

    const duplicateStudents = records.filter(record => 
      existingRecords.some(existing => existing.student_id === record.student_id)
    );

    if (duplicateStudents.length > 0) {
      const duplicateIds = duplicateStudents.map(r => r.student_id).join(', ');
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: `Attendance already recorded for students: ${duplicateIds}`,
        field: 'records'
      }, { status: 409 });
    }

    // 创建出勤记录
    const now = new Date().toISOString();
    const createdRecords = records.map((record, index) => ({
      id: Math.max(...mockAttendanceRecords.map(r => r.id)) + index + 1,
      student_id: record.student_id,
      class_id: class_id,
      attendance_date: attendance_date,
      status: record.status,
      arrival_time: record.arrival_time || null,
      notes: record.notes || null,
      student_name: `Student ${record.student_id}`, // 在实际环境中会从数据库查询
      student_code: `AXT2024${record.student_id.toString().padStart(3, '0')}`,
      class_name: `Class ${class_id}`, // 在实际环境中会从数据库查询
      instructor_name: authResult.user.display_name || 'Instructor',
      created_at: now,
      updated_at: now
    }));

    // 统计结果
    const stats = {
      total: createdRecords.length,
      present: createdRecords.filter(r => r.status === 'Present').length,
      late: createdRecords.filter(r => r.status === 'Late').length,
      absent: createdRecords.filter(r => r.status === 'Absent').length
    };

    return NextResponse.json({
      success: true,
      data: {
        records: createdRecords,
        statistics: stats
      },
      message: `Attendance recorded for ${createdRecords.length} students`
    }, { status: 201 });

  } catch (error) {
    return createErrorResponse(error);
  }
}

// GET /api/attendance/statistics - 获取出勤统计
export async function GET_STATISTICS(request: NextRequest) {
  try {
    // 验证权限
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const url = new URL(request.url);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const classId = url.searchParams.get('class_id');
    const studentId = url.searchParams.get('student_id');

    let filteredRecords = [...mockAttendanceRecords];

    // 应用筛选
    if (startDate) {
      filteredRecords = filteredRecords.filter(record => 
        record.attendance_date >= startDate
      );
    }

    if (endDate) {
      filteredRecords = filteredRecords.filter(record => 
        record.attendance_date <= endDate
      );
    }

    if (classId) {
      filteredRecords = filteredRecords.filter(record => 
        record.class_id === parseInt(classId)
      );
    }

    if (studentId) {
      filteredRecords = filteredRecords.filter(record => 
        record.student_id === parseInt(studentId)
      );
    }

    // 计算统计
    const totalRecords = filteredRecords.length;
    const presentCount = filteredRecords.filter(r => r.status === 'Present').length;
    const lateCount = filteredRecords.filter(r => r.status === 'Late').length;
    const absentCount = filteredRecords.filter(r => r.status === 'Absent').length;
    
    const attendanceRate = totalRecords > 0 ? 
      Math.round(((presentCount + lateCount) / totalRecords) * 100) : 0;

    // 按日期统计
    const dailyStats = filteredRecords.reduce((acc, record) => {
      const date = record.attendance_date;
      if (!acc[date]) {
        acc[date] = { present: 0, late: 0, absent: 0, total: 0 };
      }
      acc[date][record.status.toLowerCase() as 'present' | 'late' | 'absent']++;
      acc[date].total++;
      return acc;
    }, {} as Record<string, any>);

    // 按学员统计
    const studentStats = filteredRecords.reduce((acc, record) => {
      const studentId = record.student_id;
      if (!acc[studentId]) {
        acc[studentId] = {
          student_name: record.student_name,
          student_code: record.student_code,
          present: 0,
          late: 0,
          absent: 0,
          total: 0,
          attendance_rate: 0
        };
      }
      acc[studentId][record.status.toLowerCase() as 'present' | 'late' | 'absent']++;
      acc[studentId].total++;
      acc[studentId].attendance_rate = Math.round(
        ((acc[studentId].present + acc[studentId].late) / acc[studentId].total) * 100
      );
      return acc;
    }, {} as Record<number, any>);

    return NextResponse.json({
      success: true,
      data: {
        overall: {
          total_records: totalRecords,
          present: presentCount,
          late: lateCount,
          absent: absentCount,
          attendance_rate: attendanceRate
        },
        daily: dailyStats,
        by_student: Object.values(studentStats)
      }
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}