/**
 * Class Students API - 课程学员管理
 * GET /api/classes/[id]/students - 获取课程学员列表
 * POST /api/classes/[id]/students - 添加学员到课程
 */

export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { ValidationError } from '@/lib/models';

// 标准化错误响应
function createErrorResponse(error: any, status: number = 500) {
  console.error('Class Students API Error:', error);

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

// Mock课程学员数据
const mockClassStudents = {
  1: [
    {
      id: 1,
      student_code: 'AXT2024001',
      full_name: 'Alex Chen',
      age: 14,
      gender: 'Male',
      phone: '+65 8123 4567',
      email: 'alex.chen@example.com',
      current_belt: {
        id: 3,
        belt_name: 'Green Belt',
        belt_color: '#22c55e',
        level_order: 3
      },
      enrollment_date: '2024-01-15',
      enrollment_status: 'Active',
      attendance_stats: {
        total_sessions: 45,
        attended: 40,
        late: 3,
        absent: 2,
        attendance_rate: 89
      },
      last_attendance: {
        date: '2024-12-16',
        status: 'Present',
        arrival_time: '20:00'
      },
      emergency_contact: {
        name: 'Linda Chen',
        phone: '+65 8765 4321',
        relationship: 'Mother'
      },
      notes: 'Excellent student with leadership potential'
    },
    {
      id: 2,
      student_code: 'AXT2024002',
      full_name: 'Sarah Wong',
      age: 12,
      gender: 'Female',
      phone: '+65 8234 5678',
      email: 'sarah.wong@example.com',
      current_belt: {
        id: 2,
        belt_name: 'Yellow Belt',
        belt_color: '#fbbf24',
        level_order: 2
      },
      enrollment_date: '2024-02-01',
      enrollment_status: 'Active',
      attendance_stats: {
        total_sessions: 42,
        attended: 39,
        late: 2,
        absent: 1,
        attendance_rate: 92
      },
      last_attendance: {
        date: '2024-12-16',
        status: 'Late',
        arrival_time: '20:10'
      },
      emergency_contact: {
        name: 'David Wong',
        phone: '+65 8876 5432',
        relationship: 'Father'
      },
      notes: 'Very dedicated and hardworking student'
    }
  ]
};

// GET /api/classes/[id]/students - 获取课程学员列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证权限
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const classId = parseInt(params.id);
    if (isNaN(classId)) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ID',
        message: 'Invalid class ID'
      }, { status: 400 });
    }

    // 解析查询参数
    const url = new URL(request.url);
    const includeStats = url.searchParams.get('include_stats') === 'true';
    const status = url.searchParams.get('status'); // Active, Paused, Completed
    const sortBy = url.searchParams.get('sort_by') || 'enrollment_date';
    const sortOrder = url.searchParams.get('sort_order') || 'ASC';

    // 获取课程学员
    let students = mockClassStudents[classId as keyof typeof mockClassStudents] || [];

    // 应用筛选
    if (status) {
      students = students.filter(student => student.enrollment_status === status);
    }

    // 排序
    students.sort((a, b) => {
      let aValue = (a as any)[sortBy];
      let bValue = (b as any)[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'DESC') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // 如果不需要详细统计，移除部分数据
    if (!includeStats) {
      students = students.map(student => ({
        id: student.id,
        student_code: student.student_code,
        full_name: student.full_name,
        age: student.age,
        gender: student.gender,
        current_belt: student.current_belt,
        enrollment_date: student.enrollment_date,
        enrollment_status: student.enrollment_status,
        attendance_rate: student.attendance_stats.attendance_rate
      }));
    }

    // 计算课程统计
    const classStats = {
      total_enrolled: students.length,
      active_students: students.filter(s => s.enrollment_status === 'Active').length,
      average_attendance: students.length > 0 
        ? Math.round(students.reduce((sum, s) => sum + (s.attendance_stats?.attendance_rate || 0), 0) / students.length)
        : 0,
      belt_distribution: students.reduce((acc, student) => {
        const beltName = student.current_belt.belt_name;
        acc[beltName] = (acc[beltName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      gender_distribution: {
        Male: students.filter(s => s.gender === 'Male').length,
        Female: students.filter(s => s.gender === 'Female').length
      }
    };

    return NextResponse.json({
      success: true,
      data: students,
      meta: {
        class_id: classId,
        statistics: classStats,
        total: students.length,
        include_stats: includeStats
      }
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}

// POST /api/classes/[id]/students - 添加学员到课程（报名）
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证权限（需要教练或管理员权限）
    const authResult = await requireAuth(request, 'coach');
    if (!authResult.success) {
      return authResult.response;
    }

    const classId = parseInt(params.id);
    if (isNaN(classId)) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ID',
        message: 'Invalid class ID'
      }, { status: 400 });
    }

    const body = await request.json();
    const { student_id, enrollment_date, notes } = body;

    // 验证必填字段
    if (!student_id) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'student_id is required',
        field: 'student_id'
      }, { status: 400 });
    }

    // 验证学员ID
    if (!Number.isInteger(student_id) || student_id < 1) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid student_id',
        field: 'student_id'
      }, { status: 400 });
    }

    // 验证报名日期
    const enrollmentDate = enrollment_date || new Date().toISOString().split('T')[0];
    if (isNaN(Date.parse(enrollmentDate))) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid enrollment_date format',
        field: 'enrollment_date'
      }, { status: 400 });
    }

    // 检查学员是否已经注册该课程
    const existingStudents = mockClassStudents[classId as keyof typeof mockClassStudents] || [];
    const alreadyEnrolled = existingStudents.find(student => student.id === student_id);
    
    if (alreadyEnrolled) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Student is already enrolled in this class',
        field: 'student_id'
      }, { status: 409 });
    }

    // Mock学员数据（在实际环境中会从数据库查询）
    const mockStudent = {
      id: student_id,
      student_code: `AXT2024${student_id.toString().padStart(3, '0')}`,
      full_name: `Student ${student_id}`,
      age: 12,
      gender: 'Male' as const,
      phone: '+65 8000 0000',
      email: `student${student_id}@example.com`,
      current_belt: {
        id: 1,
        belt_name: 'White Belt',
        belt_color: '#e5e7eb',
        level_order: 1
      },
      enrollment_date: enrollmentDate,
      enrollment_status: 'Active' as const,
      attendance_stats: {
        total_sessions: 0,
        attended: 0,
        late: 0,
        absent: 0,
        attendance_rate: 0
      },
      last_attendance: null,
      emergency_contact: {
        name: 'Emergency Contact',
        phone: '+65 9000 0000',
        relationship: 'Parent'
      },
      notes: notes || null
    };

    // 创建报名记录
    const enrollmentRecord = {
      id: Math.floor(Math.random() * 1000) + 100,
      student_id,
      class_id: classId,
      enrollment_date: enrollmentDate,
      status: 'Active',
      notes: notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: {
        enrollment: enrollmentRecord,
        student: mockStudent
      },
      message: 'Student enrolled successfully'
    }, { status: 201 });

  } catch (error) {
    return createErrorResponse(error);
  }
}
