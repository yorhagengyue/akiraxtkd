/**
 * Classes Management API - 完整的课程管理功能
 * GET /api/classes - 获取课程列表
 * POST /api/classes - 创建新课程
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { ValidationError } from '@/lib/models';

// 标准化错误响应
function createErrorResponse(error: any, status: number = 500) {
  console.error('Classes API Error:', error);

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

// Mock课程数据
const mockClasses = [
  {
    id: 1,
    class_name: 'Monday Evening Class',
    description: 'Technical training and belt progression for all levels',
    instructor_id: 1,
    instructor_name: 'Jasterfer Kellen',
    location_id: 1,
    location: 'Tampines Training Center - 604 Tampines Avenue 9',
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
  },
  {
    id: 2,
    class_name: 'Tuesday Evening Session',
    description: 'Poomsae practice and sparring techniques',
    instructor_id: 2,
    instructor_name: 'Assistant Instructor',
    location_id: 2,
    location: 'Compassvale Center - 211C Compassvale Lane',
    day_of_week: 'Tuesday',
    start_time: '19:30',
    end_time: '20:30',
    max_capacity: 25,
    current_enrollment: 18,
    age_group: 'All Ages',
    belt_requirements: 'All Levels',
    monthly_fee: 110,
    status: 'Active' as const,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    class_name: 'Thursday Extended Practice',
    description: 'Extended practice session and competition preparation',
    instructor_id: 1,
    instructor_name: 'Jasterfer Kellen',
    location_id: 3,
    location: 'Compassvale Drive - 217C Compassvale Drive',
    day_of_week: 'Thursday',
    start_time: '19:30',
    end_time: '21:00',
    max_capacity: 25,
    current_enrollment: 22,
    age_group: 'All Ages',
    belt_requirements: 'Green Belt and Above',
    monthly_fee: 130,
    status: 'Active' as const,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    class_name: 'Friday Beginner Session',
    description: 'Fundamentals and technique development for beginners',
    instructor_id: 2,
    instructor_name: 'Assistant Instructor',
    location_id: 4,
    location: 'Fengshan CC - Bedok North Street 2',
    day_of_week: 'Friday',
    start_time: '18:30',
    end_time: '20:00',
    max_capacity: 20,
    current_enrollment: 15,
    age_group: 'Children (6-12)',
    belt_requirements: 'White to Green Belt',
    monthly_fee: 100,
    status: 'Active' as const,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    class_name: 'Friday Advanced Training',
    description: 'Advanced training and competition preparation',
    instructor_id: 1,
    instructor_name: 'Jasterfer Kellen',
    location_id: 4,
    location: 'Fengshan CC - Bedok North Street 2',
    day_of_week: 'Friday',
    start_time: '20:00',
    end_time: '21:30',
    max_capacity: 15,
    current_enrollment: 12,
    age_group: 'Teens & Adults',
    belt_requirements: 'Blue Belt and Above',
    monthly_fee: 150,
    status: 'Active' as const,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    class_name: 'Saturday Morning Class',
    description: 'Weekend training for all skill levels',
    instructor_id: 1,
    instructor_name: 'Jasterfer Kellen',
    location_id: 5,
    location: 'Compassvale Lane - 207A Compassvale Lane',
    day_of_week: 'Saturday',
    start_time: '09:00',
    end_time: '10:30',
    max_capacity: 30,
    current_enrollment: 28,
    age_group: 'All Ages',
    belt_requirements: 'All Levels',
    monthly_fee: 120,
    status: 'Active' as const,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// GET /api/classes - 获取课程列表
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
    const search = url.searchParams.get('search');
    const dayOfWeek = url.searchParams.get('day_of_week');
    const status = url.searchParams.get('status');
    const instructorId = url.searchParams.get('instructor_id');
    const locationId = url.searchParams.get('location_id');

    let filteredClasses = [...mockClasses];

    // 应用筛选
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredClasses = filteredClasses.filter(cls =>
        cls.class_name.toLowerCase().includes(searchTerm) ||
        cls.description.toLowerCase().includes(searchTerm) ||
        cls.instructor_name.toLowerCase().includes(searchTerm) ||
        cls.location.toLowerCase().includes(searchTerm)
      );
    }

    if (dayOfWeek) {
      filteredClasses = filteredClasses.filter(cls => cls.day_of_week === dayOfWeek);
    }

    if (status) {
      filteredClasses = filteredClasses.filter(cls => cls.status === status);
    }

    if (instructorId) {
      filteredClasses = filteredClasses.filter(cls => cls.instructor_id === parseInt(instructorId));
    }

    if (locationId) {
      filteredClasses = filteredClasses.filter(cls => cls.location_id === parseInt(locationId));
    }

    // 排序（按日期和时间）
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    filteredClasses.sort((a, b) => {
      const dayComparison = dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week);
      if (dayComparison === 0) {
        return a.start_time.localeCompare(b.start_time);
      }
      return dayComparison;
    });

    // 分页
    const total = filteredClasses.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedClasses = filteredClasses.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedClasses,
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

// POST /api/classes - 创建新课程
export async function POST(request: NextRequest) {
  try {
    // 验证权限（需要管理员权限）
    const authResult = await requireAuth(request, 'admin');
    if (!authResult.success) {
      return authResult.response;
    }

    const body = await request.json();
    const {
      class_name,
      description,
      instructor_id,
      location_id,
      day_of_week,
      start_time,
      end_time,
      max_capacity,
      age_group,
      belt_requirements,
      monthly_fee,
      status
    } = body;

    // 验证必填字段
    const requiredFields = [
      'class_name', 'instructor_id', 'location_id', 
      'day_of_week', 'start_time', 'end_time', 'max_capacity', 'monthly_fee'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: `${field} is required`,
          field
        }, { status: 400 });
      }
    }

    // 验证时间格式
    const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(start_time)) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid start_time format. Use HH:MM format',
        field: 'start_time'
      }, { status: 400 });
    }

    if (!timePattern.test(end_time)) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid end_time format. Use HH:MM format',
        field: 'end_time'
      }, { status: 400 });
    }

    // 验证开始时间早于结束时间
    if (start_time >= end_time) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'start_time must be earlier than end_time',
        field: 'start_time'
      }, { status: 400 });
    }

    // 验证星期
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day_of_week)) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid day_of_week. Must be one of: ' + validDays.join(', '),
        field: 'day_of_week'
      }, { status: 400 });
    }

    // 验证容量
    if (max_capacity < 1 || max_capacity > 100) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'max_capacity must be between 1 and 100',
        field: 'max_capacity'
      }, { status: 400 });
    }

    // 验证费用
    if (monthly_fee < 0) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'monthly_fee must be non-negative',
        field: 'monthly_fee'
      }, { status: 400 });
    }

    // 检查时间冲突
    const conflictingClass = mockClasses.find(cls => 
      cls.day_of_week === day_of_week &&
      cls.location_id === location_id &&
      cls.status === 'Active' &&
      (
        (start_time >= cls.start_time && start_time < cls.end_time) ||
        (end_time > cls.start_time && end_time <= cls.end_time) ||
        (start_time <= cls.start_time && end_time >= cls.end_time)
      )
    );

    if (conflictingClass) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: `Time conflict with existing class: ${conflictingClass.class_name}`,
        field: 'start_time'
      }, { status: 409 });
    }

    // 创建新课程
    const newClass = {
      id: Math.max(...mockClasses.map(c => c.id)) + 1,
      class_name: class_name.trim(),
      description: description?.trim() || null,
      instructor_id: parseInt(instructor_id),
      instructor_name: 'Instructor Name', // 在实际环境中会从数据库查询
      location_id: parseInt(location_id),
      location: 'Location Name', // 在实际环境中会从数据库查询
      day_of_week,
      start_time,
      end_time,
      max_capacity: parseInt(max_capacity),
      current_enrollment: 0,
      age_group: age_group?.trim() || 'All Ages',
      belt_requirements: belt_requirements?.trim() || 'All Levels',
      monthly_fee: parseFloat(monthly_fee),
      status: status || 'Active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newClass,
      message: 'Class created successfully'
    }, { status: 201 });

  } catch (error) {
    return createErrorResponse(error);
  }
}