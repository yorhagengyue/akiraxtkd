/**
 * Class Attendance by Date API - 特定日期的课程出勤管理
 * GET /api/classes/[id]/attendance/[date] - 获取特定日期的出勤记录
 * POST /api/classes/[id]/attendance/[date] - 记录特定日期的出勤
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { ValidationError } from '@/lib/models';

// 标准化错误响应
function createErrorResponse(error: any, status: number = 500) {
  console.error('Class Attendance API Error:', error);

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
const mockAttendanceData = {
  '1_2024-12-16': [
    {
      id: 1,
      student_id: 1,
      student_code: 'AXT2024001',
      student_name: 'Alex Chen',
      class_id: 1,
      attendance_date: '2024-12-16',
      status: 'Present' as const,
      arrival_time: '20:00',
      notes: null,
      current_belt: {
        belt_name: 'Green Belt',
        belt_color: '#22c55e'
      },
      created_at: '2024-12-16T20:00:00Z',
      updated_at: '2024-12-16T20:00:00Z'
    },
    {
      id: 2,
      student_id: 2,
      student_code: 'AXT2024002',
      student_name: 'Sarah Wong',
      class_id: 1,
      attendance_date: '2024-12-16',
      status: 'Late' as const,
      arrival_time: '20:10',
      notes: 'Traffic jam',
      current_belt: {
        belt_name: 'Yellow Belt',
        belt_color: '#fbbf24'
      },
      created_at: '2024-12-16T20:10:00Z',
      updated_at: '2024-12-16T20:10:00Z'
    }
  ]
};

// Mock课程学员列表（用于生成出勤表）
const mockClassStudents = {
  1: [
    {
      id: 1,
      student_code: 'AXT2024001',
      full_name: 'Alex Chen',
      current_belt: {
        belt_name: 'Green Belt',
        belt_color: '#22c55e'
      }
    },
    {
      id: 2,
      student_code: 'AXT2024002',
      full_name: 'Sarah Wong',
      current_belt: {
        belt_name: 'Yellow Belt',
        belt_color: '#fbbf24'
      }
    },
    {
      id: 3,
      student_code: 'AXT2024003',
      full_name: 'Michael Tan',
      current_belt: {
        belt_name: 'Green Belt',
        belt_color: '#22c55e'
      }
    }
  ]
};

// GET /api/classes/[id]/attendance/[date] - 获取特定日期的出勤记录
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; date: string } }
) {
  try {
    // 验证权限
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const classId = parseInt(params.id);
    const attendanceDate = params.date;

    // 验证参数
    if (isNaN(classId)) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ID',
        message: 'Invalid class ID'
      }, { status: 400 });
    }

    if (isNaN(Date.parse(attendanceDate))) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_DATE',
        message: 'Invalid date format. Use YYYY-MM-DD format'
      }, { status: 400 });
    }

    const attendanceKey = `${classId}_${attendanceDate}`;
    
    // 获取已有的出勤记录
    const existingAttendance = mockAttendanceData[attendanceKey as keyof typeof mockAttendanceData] || [];
    
    // 获取课程的所有学员
    const classStudents = mockClassStudents[classId as keyof typeof mockClassStudents] || [];
    
    // 创建完整的出勤表（包括未记录的学员）
    const attendanceRecords = classStudents.map(student => {
      const existing = existingAttendance.find(record => record.student_id === student.id);
      
      if (existing) {
        return existing;
      } else {
        // 为未记录的学员创建默认记录
        return {
          id: null,
          student_id: student.id,
          student_code: student.student_code,
          student_name: student.full_name,
          class_id: classId,
          attendance_date: attendanceDate,
          status: 'Absent' as const,
          arrival_time: null,
          notes: null,
          current_belt: student.current_belt,
          created_at: null,
          updated_at: null
        };
      }
    });

    // 计算统计信息
    const stats = {
      total_students: attendanceRecords.length,
      present: attendanceRecords.filter(r => r.status === 'Present').length,
      late: attendanceRecords.filter(r => r.status === 'Late').length,
      absent: attendanceRecords.filter(r => r.status === 'Absent').length,
      attendance_rate: attendanceRecords.length > 0 
        ? Math.round(((attendanceRecords.filter(r => r.status === 'Present' || r.status === 'Late').length) / attendanceRecords.length) * 100)
        : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        class_id: classId,
        attendance_date: attendanceDate,
        records: attendanceRecords,
        statistics: stats,
        is_recorded: existingAttendance.length > 0
      }
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}

// POST /api/classes/[id]/attendance/[date] - 记录特定日期的出勤
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; date: string } }
) {
  try {
    // 验证权限（需要教练或管理员权限）
    const authResult = await requireAuth(request, 'coach');
    if (!authResult.success) {
      return authResult.response;
    }

    const classId = parseInt(params.id);
    const attendanceDate = params.date;

    // 验证参数
    if (isNaN(classId)) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ID',
        message: 'Invalid class ID'
      }, { status: 400 });
    }

    if (isNaN(Date.parse(attendanceDate))) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_DATE',
        message: 'Invalid date format. Use YYYY-MM-DD format'
      }, { status: 400 });
    }

    const body = await request.json();
    const { records } = body;

    // 验证记录数组
    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Records array is required and must not be empty',
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

    // 检查是否已有该日期的出勤记录
    const attendanceKey = `${classId}_${attendanceDate}`;
    const existingAttendance = mockAttendanceData[attendanceKey as keyof typeof mockAttendanceData];
    
    if (existingAttendance && existingAttendance.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Attendance already recorded for this date. Use PUT to update existing records.',
        field: 'attendance_date'
      }, { status: 409 });
    }

    // 获取课程学员信息（用于验证和补充数据）
    const classStudents = mockClassStudents[classId as keyof typeof mockClassStudents] || [];
    
    // 验证所有学员ID都属于该课程
    for (const record of records) {
      const student = classStudents.find(s => s.id === record.student_id);
      if (!student) {
        return NextResponse.json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: `Student ID ${record.student_id} is not enrolled in this class`,
          field: 'student_id'
        }, { status: 400 });
      }
    }

    // 创建出勤记录
    const now = new Date().toISOString();
    const createdRecords = records.map((record, index) => {
      const student = classStudents.find(s => s.id === record.student_id);
      
      return {
        id: Math.floor(Math.random() * 1000) + index + 1,
        student_id: record.student_id,
        student_code: student?.student_code || `AXT2024${record.student_id.toString().padStart(3, '0')}`,
        student_name: student?.full_name || `Student ${record.student_id}`,
        class_id: classId,
        attendance_date: attendanceDate,
        status: record.status,
        arrival_time: record.arrival_time || null,
        notes: record.notes || null,
        current_belt: student?.current_belt || {
          belt_name: 'Unknown',
          belt_color: '#gray'
        },
        created_at: now,
        updated_at: now
      };
    });

    // 计算统计信息
    const stats = {
      total_students: createdRecords.length,
      present: createdRecords.filter(r => r.status === 'Present').length,
      late: createdRecords.filter(r => r.status === 'Late').length,
      absent: createdRecords.filter(r => r.status === 'Absent').length,
      attendance_rate: Math.round(((createdRecords.filter(r => r.status === 'Present' || r.status === 'Late').length) / createdRecords.length) * 100)
    };

    return NextResponse.json({
      success: true,
      data: {
        class_id: classId,
        attendance_date: attendanceDate,
        records: createdRecords,
        statistics: stats
      },
      message: `Attendance recorded for ${createdRecords.length} students`
    }, { status: 201 });

  } catch (error) {
    return createErrorResponse(error);
  }
}
