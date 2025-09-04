/**
 * Class Detail API - 单个课程的详细操作
 * GET /api/classes/[id] - 获取课程详情
 * PUT /api/classes/[id] - 更新课程信息
 * DELETE /api/classes/[id] - 删除课程
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { ValidationError } from '@/lib/models';

// 标准化错误响应
function createErrorResponse(error: any, status: number = 500) {
  console.error('Class Detail API Error:', error);

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

// Mock课程详情数据
const mockClassDetails = {
  1: {
    id: 1,
    class_name: 'Monday Evening Class',
    description: 'Technical training and belt progression for all levels',
    instructor_id: 1,
    instructor_name: 'Jasterfer Kellen',
    instructor_qualifications: ['NROC Certified Coach', 'Taekwondo Kyorugi Referee', 'First-Aid Certified'],
    location_id: 1,
    location: 'Tampines Training Center - 604 Tampines Avenue 9',
    location_details: {
      address: '604 Tampines Avenue 9',
      facilities: 'Air-conditioned, Matted floor, Changing rooms',
      parking: 'Available',
      public_transport: 'Near Tampines MRT'
    },
    day_of_week: 'Monday',
    start_time: '20:00',
    end_time: '21:00',
    max_capacity: 30,
    current_enrollment: 25,
    age_group: 'All Ages',
    belt_requirements: 'All Levels',
    monthly_fee: 120,
    status: 'Active' as const,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
};

// Mock学员数据
const mockClassStudents = {
  1: [
    {
      id: 1,
      student_code: 'AXT2024001',
      full_name: 'Alex Chen',
      age: 14,
      gender: 'Male',
      current_belt: {
        id: 3,
        belt_name: 'Green Belt',
        belt_color: '#22c55e'
      },
      enrollment_date: '2024-01-15',
      status: 'Active',
      attendance_rate: 89,
      last_attendance: '2024-12-16'
    },
    {
      id: 2,
      student_code: 'AXT2024002',
      full_name: 'Sarah Wong',
      age: 12,
      gender: 'Female',
      current_belt: {
        id: 2,
        belt_name: 'Yellow Belt',
        belt_color: '#fbbf24'
      },
      enrollment_date: '2024-02-01',
      status: 'Active',
      attendance_rate: 92,
      last_attendance: '2024-12-16'
    }
  ]
};

// GET /api/classes/[id] - 获取课程详情
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

    // 获取课程详情
    const classDetail = mockClassDetails[classId as keyof typeof mockClassDetails];
    if (!classDetail) {
      return NextResponse.json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Class not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: classDetail
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}

// PUT /api/classes/[id] - 更新课程信息
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证权限（需要管理员权限）
    const authResult = await requireAuth(request, 'admin');
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

    // 验证课程是否存在
    const existingClass = mockClassDetails[classId as keyof typeof mockClassDetails];
    if (!existingClass) {
      return NextResponse.json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Class not found'
      }, { status: 404 });
    }

    // 验证时间格式（如果提供）
    const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (body.start_time && !timePattern.test(body.start_time)) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid start_time format. Use HH:MM format',
        field: 'start_time'
      }, { status: 400 });
    }

    if (body.end_time && !timePattern.test(body.end_time)) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid end_time format. Use HH:MM format',
        field: 'end_time'
      }, { status: 400 });
    }

    // 验证开始时间早于结束时间
    const startTime = body.start_time || existingClass.start_time;
    const endTime = body.end_time || existingClass.end_time;
    if (startTime >= endTime) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'start_time must be earlier than end_time',
        field: 'start_time'
      }, { status: 400 });
    }

    // 验证容量
    if (body.max_capacity !== undefined && (body.max_capacity < 1 || body.max_capacity > 100)) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'max_capacity must be between 1 and 100',
        field: 'max_capacity'
      }, { status: 400 });
    }

    // 验证费用
    if (body.monthly_fee !== undefined && body.monthly_fee < 0) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'monthly_fee must be non-negative',
        field: 'monthly_fee'
      }, { status: 400 });
    }

    // 更新课程信息
    const updatedClass = {
      ...existingClass,
      ...body,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedClass,
      message: 'Class updated successfully'
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}

// DELETE /api/classes/[id] - 删除课程
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证权限（需要管理员权限）
    const authResult = await requireAuth(request, 'admin');
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

    // 验证课程是否存在
    const existingClass = mockClassDetails[classId as keyof typeof mockClassDetails];
    if (!existingClass) {
      return NextResponse.json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Class not found'
      }, { status: 404 });
    }

    // 检查是否有学员注册
    const enrolledStudents = mockClassStudents[classId as keyof typeof mockClassStudents] || [];
    if (enrolledStudents.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: `Cannot delete class with ${enrolledStudents.length} enrolled students. Please transfer students to other classes first.`,
        field: 'enrolled_students'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      message: 'Class deleted successfully'
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}
