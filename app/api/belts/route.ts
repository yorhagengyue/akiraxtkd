export const runtime = 'edge';
/**
 * Belt Levels API - 腰带等级管理
 * GET /api/belts - 获取所有腰带等级
 * POST /api/belts - 创建新腰带等级
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { ValidationError } from '@/lib/models';

// 标准化错误响应
function createErrorResponse(error: any, status: number = 500) {
  console.error('Belts API Error:', error);

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

// Mock腰带数据
const mockBelts = [
  {
    id: 1,
    belt_name: 'White Belt',
    belt_color: '#e5e7eb',
    level_order: 1,
    description: 'Beginner level - Learning basic stances and movements',
    requirements: 'Basic stances, simple kicks, respect and discipline',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    belt_name: 'Yellow Belt',
    belt_color: '#fbbf24',
    level_order: 2,
    description: 'Elementary level - Basic techniques and forms',
    requirements: 'Taeguek Il Jang, basic kicks, breaking techniques',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    belt_name: 'Yellow Belt with Green Tip',
    belt_color: '#fbbf24',
    level_order: 3,
    description: 'Intermediate elementary - Enhanced basic skills',
    requirements: 'Taeguek E Jang, improved kicking techniques',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    belt_name: 'Green Belt',
    belt_color: '#22c55e',
    level_order: 4,
    description: 'Intermediate level - Advanced techniques and sparring',
    requirements: 'Taeguek Sam Jang, sparring techniques, board breaking',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    belt_name: 'Green Belt with Blue Tip',
    belt_color: '#22c55e',
    level_order: 5,
    description: 'Advanced intermediate - Complex combinations',
    requirements: 'Taeguek Sa Jang, advanced sparring, leadership skills',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    belt_name: 'Blue Belt',
    belt_color: '#3b82f6',
    level_order: 6,
    description: 'Advanced level - Mastery of intermediate techniques',
    requirements: 'Taeguek O Jang, advanced combinations, teaching assistance',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 7,
    belt_name: 'Blue Belt with Red Tip',
    belt_color: '#3b82f6',
    level_order: 7,
    description: 'Pre-advanced level - Preparation for red belt',
    requirements: 'Taeguek Yuk Jang, competition readiness, mentoring',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 8,
    belt_name: 'Red Belt',
    belt_color: '#ef4444',
    level_order: 8,
    description: 'Senior level - Advanced mastery and leadership',
    requirements: 'Taeguek Chil Jang, tournament participation, teaching',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 9,
    belt_name: 'Red Belt with Black Tip',
    belt_color: '#ef4444',
    level_order: 9,
    description: 'Pre-black belt - Final preparation for black belt',
    requirements: 'Taeguek Pal Jang, advanced sparring, leadership demonstration',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 10,
    belt_name: 'Black Belt (1st Dan)',
    belt_color: '#1f2937',
    level_order: 10,
    description: 'Expert level - Beginning of mastery',
    requirements: 'All Taeguek forms, advanced techniques, teaching capability',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// GET /api/belts - 获取所有腰带等级
export async function GET(request: NextRequest) {
  try {
    // 验证权限
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    // 解析查询参数
    const url = new URL(request.url);
    const includeInactive = url.searchParams.get('include_inactive') === 'true';
    const sortBy = url.searchParams.get('sort_by') || 'level_order';
    const sortOrder = url.searchParams.get('sort_order') || 'ASC';

    let belts = [...mockBelts];

    // 排序
    belts.sort((a, b) => {
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

    return NextResponse.json({
      success: true,
      data: belts,
      meta: {
        total: belts.length,
        sort_by: sortBy,
        sort_order: sortOrder
      }
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}

// POST /api/belts - 创建新腰带等级
export async function POST(request: NextRequest) {
  try {
    // 验证权限（需要管理员权限）
    const authResult = await requireAuth(request, 'admin');
    if (!authResult.success) {
      return authResult.response;
    }

    const body = await request.json();
    const { belt_name, belt_color, level_order, description, requirements } = body;

    // 验证必填字段
    if (!belt_name || !belt_color || level_order === undefined) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required fields: belt_name, belt_color, level_order'
      }, { status: 400 });
    }

    // 验证腰带名称唯一性
    const existingBelt = mockBelts.find(belt => 
      belt.belt_name.toLowerCase() === belt_name.toLowerCase()
    );
    
    if (existingBelt) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Belt name already exists',
        field: 'belt_name'
      }, { status: 400 });
    }

    // 验证等级顺序唯一性
    const existingOrder = mockBelts.find(belt => belt.level_order === level_order);
    if (existingOrder) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Level order already exists',
        field: 'level_order'
      }, { status: 400 });
    }

    // 验证颜色格式
    if (!/^#[0-9A-Fa-f]{6}$/.test(belt_color)) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid color format. Use hex format (#RRGGBB)',
        field: 'belt_color'
      }, { status: 400 });
    }

    // 验证等级顺序范围
    if (level_order < 1 || level_order > 100) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Level order must be between 1 and 100',
        field: 'level_order'
      }, { status: 400 });
    }

    // 创建新腰带
    const newBelt = {
      id: Math.max(...mockBelts.map(b => b.id)) + 1,
      belt_name: belt_name.trim(),
      belt_color: belt_color.toLowerCase(),
      level_order: parseInt(level_order),
      description: description?.trim() || null,
      requirements: requirements?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newBelt,
      message: 'Belt level created successfully'
    }, { status: 201 });

  } catch (error) {
    return createErrorResponse(error);
  }
}