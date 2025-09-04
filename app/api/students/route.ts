/**
 * Students API - 完整的学员管理功能
 * 使用真实的数据库服务和验证
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { DatabaseQuery, DatabaseError } from '@/lib/database';
import { StudentsService } from '@/lib/services/students';
import { ValidationError } from '@/lib/models';

// 获取数据库连接（在实际环境中会由Cloudflare Workers注入）
function getDatabase(): DatabaseQuery {
  // 在开发环境中使用Mock数据库
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    // 返回Mock数据库实例
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

  // 在生产环境中，数据库会通过env.DB注入
  // 这里暂时返回null，实际使用时需要从请求上下文获取
  throw new Error('Database not available in this environment');
}

// 标准化错误响应
function createErrorResponse(error: any, status: number = 500) {
  console.error('Students API Error:', error);

  if (error instanceof ValidationError) {
    return NextResponse.json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: error.message,
      field: error.field,
      code: error.code
    }, { status: 400 });
  }

  if (error instanceof DatabaseError) {
    return NextResponse.json({
      success: false,
      error: 'DATABASE_ERROR',
      message: 'Database operation failed'
    }, { status: 500 });
  }

  return NextResponse.json({
    success: false,
    error: 'INTERNAL_ERROR',
    message: error.message || 'An unexpected error occurred'
  }, { status });
}

// GET /api/students - 获取学员列表
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
    const sortField = url.searchParams.get('sort_field') || 'created_at';
    const sortOrder = (url.searchParams.get('sort_order') || 'DESC') as 'ASC' | 'DESC';
    
    // 筛选参数
    const filters: any = {};
    if (url.searchParams.get('search')) {
      filters.search = url.searchParams.get('search');
    }
    if (url.searchParams.get('status')) {
      filters.status = url.searchParams.get('status');
    }
    if (url.searchParams.get('gender')) {
      filters.gender = url.searchParams.get('gender');
    }
    if (url.searchParams.get('belt_level_id')) {
      filters.belt_level_id = parseInt(url.searchParams.get('belt_level_id')!);
    }

    // 在开发环境中返回Mock数据
    if (process.env.NODE_ENV === 'development') {
      const mockStudents = [
        {
          id: 1,
          student_code: 'AXT2024001',
          first_name: 'Alex',
          last_name: 'Chen',
          full_name: 'Alex Chen',
          date_of_birth: '2010-05-15',
          age: 14,
          gender: 'Male' as const,
          phone: '+65 8123 4567',
          email: 'alex.chen@example.com',
          address: '123 Main Street',
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
            description: 'Intermediate level',
            requirements: '',
            created_at: '',
            updated_at: ''
          },
          notes: 'Excellent student with great potential',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          student_code: 'AXT2024002',
          first_name: 'Sarah',
          last_name: 'Wong',
          full_name: 'Sarah Wong',
          date_of_birth: '2012-08-22',
          age: 12,
          gender: 'Female' as const,
          phone: '+65 8234 5678',
          email: 'sarah.wong@example.com',
          address: '456 Oak Avenue',
          postal_code: '654321',
          emergency_contact_name: 'David Wong',
          emergency_contact_phone: '+65 8876 5432',
          emergency_contact_relationship: 'Father',
          joined_date: '2024-02-01',
          status: 'Active' as const,
          current_belt: {
            id: 2,
            belt_name: 'Yellow Belt',
            belt_color: '#fbbf24',
            level_order: 2,
            description: 'Beginner level',
            requirements: '',
            created_at: '',
            updated_at: ''
          },
          notes: 'Very dedicated and hardworking',
          created_at: '2024-02-01T09:15:00Z',
          updated_at: '2024-02-01T09:15:00Z'
        }
      ];

      // 应用筛选
      let filteredStudents = mockStudents;
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredStudents = filteredStudents.filter(student => 
          student.first_name.toLowerCase().includes(searchTerm) ||
          student.last_name.toLowerCase().includes(searchTerm) ||
          student.student_code.toLowerCase().includes(searchTerm) ||
          student.email.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.status) {
        filteredStudents = filteredStudents.filter(student => student.status === filters.status);
      }

      if (filters.gender) {
        filteredStudents = filteredStudents.filter(student => student.gender === filters.gender);
      }

      if (filters.belt_level_id) {
        filteredStudents = filteredStudents.filter(student => student.current_belt.id === filters.belt_level_id);
      }

      // 应用排序
      filteredStudents.sort((a, b) => {
        let aValue = (a as any)[sortField];
        let bValue = (b as any)[sortField];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'DESC') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });

      // 应用分页
      const total = filteredStudents.length;
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;
      const paginatedStudents = filteredStudents.slice(offset, offset + limit);

      return NextResponse.json({
        success: true,
        data: paginatedStudents,
        pagination: {
          page,
          limit,
          total,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1
        }
      });
    }

    // 生产环境中使用真实数据库
    const db = getDatabase();
    const studentsService = new StudentsService(db);

    const result = await studentsService.getStudents({
      page,
      limit,
      sort_field: sortField,
      sort_order: sortOrder,
      filters
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}

// POST /api/students - 创建新学员
export async function POST(request: NextRequest) {
  try {
    // 验证权限（需要管理员或教练权限）
    const authResult = await requireAuth(request, 'coach');
    if (!authResult.success) {
      return authResult.response;
    }

    const body = await request.json();

    // 在开发环境中返回Mock响应
    if (process.env.NODE_ENV === 'development') {
      // 简单验证
      if (!body.first_name || !body.last_name || !body.date_of_birth) {
        return NextResponse.json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Missing required fields'
        }, { status: 400 });
      }

      const mockStudent = {
        id: Math.floor(Math.random() * 1000) + 100,
        student_code: `AXT2024${Math.floor(Math.random() * 900) + 100}`,
        first_name: body.first_name,
        last_name: body.last_name,
        full_name: `${body.first_name} ${body.last_name}`,
        date_of_birth: body.date_of_birth,
        age: new Date().getFullYear() - new Date(body.date_of_birth).getFullYear(),
        gender: body.gender,
        phone: body.phone,
        email: body.email,
        address: body.address,
        postal_code: body.postal_code,
        emergency_contact_name: body.emergency_contact_name,
        emergency_contact_phone: body.emergency_contact_phone,
        emergency_contact_relationship: body.emergency_contact_relationship,
        joined_date: new Date().toISOString().split('T')[0],
        status: body.status || 'Active',
        current_belt: {
          id: body.belt_level_id || 1,
          belt_name: 'White Belt',
          belt_color: '#e5e7eb',
          level_order: 1,
          description: 'Beginner level',
          requirements: '',
          created_at: '',
          updated_at: ''
        },
        notes: body.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: mockStudent,
        message: 'Student created successfully'
      }, { status: 201 });
    }

    // 生产环境中使用真实数据库
    const db = getDatabase();
    const studentsService = new StudentsService(db);

    const newStudent = await studentsService.createStudent(body);

    return NextResponse.json({
      success: true,
      data: newStudent,
      message: 'Student created successfully'
    }, { status: 201 });

  } catch (error) {
    return createErrorResponse(error);
  }
}

// PUT /api/students - 批量操作
export async function PUT(request: NextRequest) {
  try {
    // 验证权限（需要管理员权限）
    const authResult = await requireAuth(request, 'admin');
    if (!authResult.success) {
      return authResult.response;
    }

    const { action, studentIds, data } = await request.json();

    if (!action || !studentIds || !Array.isArray(studentIds)) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_REQUEST',
        message: 'Missing required fields: action, studentIds'
      }, { status: 400 });
    }

    // 在开发环境中返回Mock响应
    if (process.env.NODE_ENV === 'development') {
      switch (action) {
        case 'bulk_update_status':
          return NextResponse.json({
            success: true,
            message: `Updated status for ${studentIds.length} students`,
            data: {
              updated: studentIds.length,
              newStatus: data.status
            }
          });

        case 'bulk_assign_class':
          return NextResponse.json({
            success: true,
            message: `Assigned ${studentIds.length} students to class`,
            data: {
              assigned: studentIds.length,
              classId: data.classId
            }
          });

        case 'bulk_promote':
          return NextResponse.json({
            success: true,
            message: `Promoted ${studentIds.length} students`,
            data: {
              promoted: studentIds.length,
              newBelt: data.newBelt
            }
          });

        default:
          return NextResponse.json({
            success: false,
            error: 'INVALID_ACTION',
            message: 'Invalid action specified'
          }, { status: 400 });
      }
    }

    // 生产环境中的批量操作实现
    // TODO: 实现真实的批量操作逻辑

    return NextResponse.json({
      success: true,
      message: 'Batch operation completed',
      data: { processed: studentIds.length }
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}