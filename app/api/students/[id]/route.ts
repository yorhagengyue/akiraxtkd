/**
 * Student Detail API - 单个学员的详细操作
 * GET /api/students/[id] - 获取学员详情
 * PUT /api/students/[id] - 更新学员信息
 * DELETE /api/students/[id] - 删除学员
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { DatabaseQuery } from '@/lib/database';
import { StudentsService } from '@/lib/services/students';
import { ValidationError } from '@/lib/models';

// 标准化错误响应
function createErrorResponse(error: any, status: number = 500) {
  console.error('Student Detail API Error:', error);

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

// Mock数据库
function getMockDatabase(): DatabaseQuery {
  return new DatabaseQuery({
    prepare: (query: string) => ({
      bind: (...params: any[]) => ({
        first: async () => null,
        all: async () => ({ results: [] }),
        run: async () => ({ success: true, meta: { last_row_id: 1, changes: 1, duration: 1, rows_read: 1, rows_written: 1 } })
      })
    }),
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 }),
    dump: async () => new ArrayBuffer(0)
  } as any);
}

// GET /api/students/[id] - 获取学员详情
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

    const studentId = parseInt(params.id);
    if (isNaN(studentId)) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ID',
        message: 'Invalid student ID'
      }, { status: 400 });
    }

    // 在开发环境中返回Mock数据
    if (process.env.NODE_ENV === 'development') {
      const mockStudentDetail = {
        id: studentId,
        student_code: 'AXT2024001',
        first_name: 'Alex',
        last_name: 'Chen',
        full_name: 'Alex Chen',
        date_of_birth: '2010-05-15',
        age: 14,
        gender: 'Male' as const,
        phone: '+65 8123 4567',
        email: 'alex.chen@example.com',
        address: '123 Main Street, Singapore',
        postal_code: '123456',
        emergency_contact_name: 'Linda Chen',
        emergency_contact_phone: '+65 8765 4321',
        emergency_contact_relationship: 'Mother',
        joined_date: '2024-01-15',
        status: 'Active' as const,
        current_belt: {
          id: 3,
          belt_name: 'Green Belt',
          belt_color: '#22c55e',
          level_order: 3,
          description: 'Intermediate level belt',
          requirements: 'Basic forms and sparring techniques',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        belt_history: [
          {
            id: 3,
            belt_name: 'Green Belt',
            belt_color: '#22c55e',
            promotion_date: '2024-06-15',
            notes: 'Excellent performance in grading'
          },
          {
            id: 2,
            belt_name: 'Yellow Belt',
            belt_color: '#fbbf24',
            promotion_date: '2024-03-15',
            notes: 'Good progress in basics'
          },
          {
            id: 1,
            belt_name: 'White Belt',
            belt_color: '#e5e7eb',
            promotion_date: '2024-01-15',
            notes: 'Starting belt'
          }
        ],
        classes: [
          {
            id: 1,
            class_name: 'Monday Evening Class',
            location: 'Tampines Training Center',
            day_of_week: 'Monday',
            start_time: '20:00',
            end_time: '21:00',
            instructor_name: 'Jasterfer Kellen'
          },
          {
            id: 2,
            class_name: 'Thursday Practice',
            location: 'Compassvale Drive Center',
            day_of_week: 'Thursday',
            start_time: '19:30',
            end_time: '21:00',
            instructor_name: 'Jasterfer Kellen'
          }
        ],
        attendance_stats: {
          total_sessions: 45,
          attended: 40,
          late: 3,
          absent: 2,
          attendance_rate: 89
        },
        recent_attendance: [
          {
            date: '2024-12-16',
            class_name: 'Monday Evening Class',
            status: 'Present' as const,
            arrival_time: '20:00'
          },
          {
            date: '2024-12-12',
            class_name: 'Thursday Practice',
            status: 'Present' as const,
            arrival_time: '19:35'
          },
          {
            date: '2024-12-09',
            class_name: 'Monday Evening Class',
            status: 'Late' as const,
            arrival_time: '20:10'
          },
          {
            date: '2024-12-05',
            class_name: 'Thursday Practice',
            status: 'Present' as const,
            arrival_time: '19:30'
          }
        ],
        notes: 'Excellent student with great potential. Shows leadership qualities.',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-12-16T15:45:00Z'
      };

      return NextResponse.json({
        success: true,
        data: mockStudentDetail
      });
    }

    // 生产环境中使用真实数据库
    const db = getMockDatabase(); // 实际环境中需要获取真实数据库连接
    const studentsService = new StudentsService(db);

    const student = await studentsService.getStudentById(studentId);
    if (!student) {
      return NextResponse.json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Student not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: student
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}

// PUT /api/students/[id] - 更新学员信息
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证权限（需要教练或管理员权限）
    const authResult = await requireAuth(request, 'coach');
    if (!authResult.success) {
      return authResult.response;
    }

    const studentId = parseInt(params.id);
    if (isNaN(studentId)) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ID',
        message: 'Invalid student ID'
      }, { status: 400 });
    }

    const body = await request.json();

    // 在开发环境中返回Mock响应
    if (process.env.NODE_ENV === 'development') {
      // 简单验证
      if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return NextResponse.json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Invalid email format',
          field: 'email'
        }, { status: 400 });
      }

      const updatedStudent = {
        id: studentId,
        student_code: 'AXT2024001',
        first_name: body.first_name || 'Alex',
        last_name: body.last_name || 'Chen',
        full_name: `${body.first_name || 'Alex'} ${body.last_name || 'Chen'}`,
        date_of_birth: body.date_of_birth || '2010-05-15',
        age: 14,
        gender: body.gender || 'Male',
        phone: body.phone || '+65 8123 4567',
        email: body.email || 'alex.chen@example.com',
        address: body.address || '123 Main Street, Singapore',
        postal_code: body.postal_code || '123456',
        emergency_contact_name: body.emergency_contact_name || 'Linda Chen',
        emergency_contact_phone: body.emergency_contact_phone || '+65 8765 4321',
        emergency_contact_relationship: body.emergency_contact_relationship || 'Mother',
        joined_date: '2024-01-15',
        status: body.status || 'Active',
        current_belt: {
          id: 3,
          belt_name: 'Green Belt',
          belt_color: '#22c55e',
          level_order: 3,
          description: 'Intermediate level belt',
          requirements: '',
          created_at: '',
          updated_at: ''
        },
        notes: body.notes || 'Excellent student with great potential.',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: updatedStudent,
        message: 'Student updated successfully'
      });
    }

    // 生产环境中使用真实数据库
    const db = getMockDatabase();
    const studentsService = new StudentsService(db);

    const updatedStudent = await studentsService.updateStudent(studentId, body);

    return NextResponse.json({
      success: true,
      data: updatedStudent,
      message: 'Student updated successfully'
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}

// DELETE /api/students/[id] - 删除学员
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

    const studentId = parseInt(params.id);
    if (isNaN(studentId)) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ID',
        message: 'Invalid student ID'
      }, { status: 400 });
    }

    // 在开发环境中返回Mock响应
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        message: 'Student deleted successfully'
      });
    }

    // 生产环境中使用真实数据库
    const db = getMockDatabase();
    const studentsService = new StudentsService(db);

    await studentsService.deleteStudent(studentId);

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}
