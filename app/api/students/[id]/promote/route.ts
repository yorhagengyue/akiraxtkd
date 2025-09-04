/**
 * Student Belt Promotion API
 * POST /api/students/[id]/promote - 学员腰带升级
 */

export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { DatabaseQuery } from '@/lib/database';
import { StudentsService } from '@/lib/services/students';
import { ValidationError } from '@/lib/models';

// 标准化错误响应
function createErrorResponse(error: any, status: number = 500) {
  console.error('Student Promotion API Error:', error);

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

// POST /api/students/[id]/promote - 升级学员腰带
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

    const studentId = parseInt(params.id);
    if (isNaN(studentId)) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ID',
        message: 'Invalid student ID'
      }, { status: 400 });
    }

    const body = await request.json();
    const { new_belt_id, promotion_date, notes } = body;

    // 验证必填字段
    if (!new_belt_id) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'new_belt_id is required',
        field: 'new_belt_id'
      }, { status: 400 });
    }

    // 在开发环境中返回Mock响应
    if (process.env.NODE_ENV === 'development') {
      // Mock腰带数据
      const beltLevels = [
        { id: 1, belt_name: 'White Belt', level_order: 1 },
        { id: 2, belt_name: 'Yellow Belt', level_order: 2 },
        { id: 3, belt_name: 'Green Belt', level_order: 3 },
        { id: 4, belt_name: 'Blue Belt', level_order: 4 },
        { id: 5, belt_name: 'Red Belt', level_order: 5 },
        { id: 6, belt_name: 'Black Belt', level_order: 6 }
      ];

      // 验证腰带ID
      const targetBelt = beltLevels.find(belt => belt.id === new_belt_id);
      if (!targetBelt) {
        return NextResponse.json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Invalid belt level ID',
          field: 'new_belt_id'
        }, { status: 400 });
      }

      // Mock当前学员数据
      const currentBeltId = studentId <= 2 ? 3 : 2; // 假设学员1和2当前是绿带，其他是黄带
      const currentBelt = beltLevels.find(belt => belt.id === currentBeltId);

      // 验证升级逻辑
      if (!currentBelt || targetBelt.level_order <= currentBelt.level_order) {
        return NextResponse.json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Cannot promote to a lower or same belt level',
          field: 'new_belt_id'
        }, { status: 400 });
      }

      // 验证日期格式
      const promotionDateStr = promotion_date || new Date().toISOString().split('T')[0];
      if (promotion_date && isNaN(Date.parse(promotion_date))) {
        return NextResponse.json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Invalid promotion date format',
          field: 'promotion_date'
        }, { status: 400 });
      }

      // 创建升级记录
      const promotionRecord = {
        id: Math.floor(Math.random() * 1000) + 100,
        student_id: studentId,
        from_belt_id: currentBeltId,
        to_belt_id: new_belt_id,
        promotion_date: promotionDateStr,
        examiner: authResult.user.display_name || 'System',
        notes: notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: {
          promotion: promotionRecord,
          student: {
            id: studentId,
            previous_belt: currentBelt,
            new_belt: targetBelt,
            promotion_date: promotionDateStr
          }
        },
        message: `Student successfully promoted to ${targetBelt.belt_name}`
      });
    }

    // 生产环境中使用真实数据库
    const db = getMockDatabase();
    const studentsService = new StudentsService(db);

    await studentsService.promoteStudent(studentId, new_belt_id, promotion_date, notes);

    // 获取更新后的学员信息
    const updatedStudent = await studentsService.getStudentById(studentId);
    if (!updatedStudent) {
      throw new Error('Failed to retrieve updated student information');
    }

    return NextResponse.json({
      success: true,
      data: {
        student: updatedStudent,
        promotion_date: promotion_date || new Date().toISOString().split('T')[0]
      },
      message: `Student successfully promoted to ${updatedStudent.current_belt.belt_name}`
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}
