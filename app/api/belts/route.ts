// Belt System Management API - 腰带等级管理
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

// 腰带等级数据结构
interface BeltLevel {
  beltId: string;
  trackId: string;
  trackName: string;
  name: string;
  nameKorean?: string;
  color: string;
  orderIndex: number;
  isTip: boolean;
  isStripe: boolean;
  requirements: {
    minAge?: number;
    minWeeks: number;
    minClasses: number;
    skillLevel: string;
  };
  description?: string;
  createdAt: string;
}

interface BeltPromotion {
  promotionId: string;
  studentId: string;
  studentName: string;
  fromBeltId: string;
  fromBeltName: string;
  toBeltId: string;
  toBeltName: string;
  promotionDate: string;
  gradedBy: string;
  testScore?: number;
  comments?: string;
  certificateIssued: boolean;
  createdAt: string;
}

interface PromoteStudentRequest {
  studentId: string;
  newBeltId: string;
  promotionDate: string;
  testScore?: number;
  comments?: string;
}

// GET /api/belts - 获取腰带等级系统
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: 'AUTHENTICATION_REQUIRED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get('track_id');
    const includeRequirements = searchParams.get('include_requirements') !== 'false';

    const useMockData = process.env.DEV_MODE === 'true' || !process.env.D1_DATABASE_ID;

    if (useMockData) {
      // Mock腰带等级数据
      const mockBelts: BeltLevel[] = [
        {
          beltId: 'belt-001',
          trackId: 'track-color',
          trackName: 'Color Belts',
          name: 'White Belt',
          nameKorean: '백띠',
          color: '#e5e7eb',
          orderIndex: 1,
          isTip: false,
          isStripe: false,
          requirements: {
            minWeeks: 0,
            minClasses: 0,
            skillLevel: 'Beginner'
          },
          description: 'Starting level for all new students',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          beltId: 'belt-002',
          trackId: 'track-color',
          trackName: 'Color Belts',
          name: 'White Belt with Yellow Tip',
          nameKorean: '백띠 노란줄',
          color: '#e5e7eb',
          orderIndex: 2,
          isTip: true,
          isStripe: false,
          requirements: {
            minWeeks: 4,
            minClasses: 8,
            skillLevel: 'Basic techniques'
          },
          description: 'First advancement showing basic techniques',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          beltId: 'belt-003',
          trackId: 'track-color',
          trackName: 'Color Belts',
          name: 'Yellow Belt',
          nameKorean: '노란띠',
          color: '#fbbf24',
          orderIndex: 3,
          isTip: false,
          isStripe: false,
          requirements: {
            minWeeks: 8,
            minClasses: 16,
            skillLevel: 'Basic forms and techniques'
          },
          description: 'Basic techniques and forms mastered',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          beltId: 'belt-004',
          trackId: 'track-color',
          trackName: 'Color Belts',
          name: 'Yellow Belt with Green Tip',
          nameKorean: '노란띠 초록줄',
          color: '#fbbf24',
          orderIndex: 4,
          isTip: true,
          isStripe: false,
          requirements: {
            minWeeks: 12,
            minClasses: 24,
            skillLevel: 'Intermediate preparation'
          },
          description: 'Transition to intermediate level',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          beltId: 'belt-005',
          trackId: 'track-color',
          trackName: 'Color Belts',
          name: 'Green Belt',
          nameKorean: '초록띠',
          color: '#22c55e',
          orderIndex: 5,
          isTip: false,
          isStripe: false,
          requirements: {
            minWeeks: 16,
            minClasses: 32,
            skillLevel: 'Intermediate techniques'
          },
          description: 'Solid intermediate techniques',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          beltId: 'belt-006',
          trackId: 'track-color',
          trackName: 'Color Belts',
          name: 'Green Belt with Blue Tip',
          nameKorean: '초록띠 파란줄',
          color: '#22c55e',
          orderIndex: 6,
          isTip: true,
          isStripe: false,
          requirements: {
            minWeeks: 20,
            minClasses: 40,
            skillLevel: 'Advanced intermediate'
          },
          description: 'Advanced intermediate level',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          beltId: 'belt-007',
          trackId: 'track-color',
          trackName: 'Color Belts',
          name: 'Blue Belt',
          nameKorean: '파란띠',
          color: '#3b82f6',
          orderIndex: 7,
          isTip: false,
          isStripe: false,
          requirements: {
            minWeeks: 24,
            minClasses: 48,
            skillLevel: 'Advanced techniques'
          },
          description: 'Advanced techniques and sparring',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          beltId: 'belt-008',
          trackId: 'track-color',
          trackName: 'Color Belts',
          name: 'Blue Belt with Red Tip',
          nameKorean: '파란띠 빨간줄',
          color: '#3b82f6',
          orderIndex: 8,
          isTip: true,
          isStripe: false,
          requirements: {
            minWeeks: 28,
            minClasses: 56,
            skillLevel: 'Pre-red belt preparation'
          },
          description: 'Preparation for red belt',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          beltId: 'belt-009',
          trackId: 'track-color',
          trackName: 'Color Belts',
          name: 'Red Belt',
          nameKorean: '빨간띠',
          color: '#ef4444',
          orderIndex: 9,
          isTip: false,
          isStripe: false,
          requirements: {
            minWeeks: 32,
            minClasses: 64,
            skillLevel: 'Expert level techniques'
          },
          description: 'Expert level techniques',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          beltId: 'belt-010',
          trackId: 'track-color',
          trackName: 'Color Belts',
          name: 'Red Belt with Black Tip',
          nameKorean: '빨간띠 검은줄',
          color: '#ef4444',
          orderIndex: 10,
          isTip: true,
          isStripe: false,
          requirements: {
            minWeeks: 36,
            minClasses: 72,
            skillLevel: 'Black belt preparation'
          },
          description: 'Preparation for black belt',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          beltId: 'belt-011',
          trackId: 'track-black',
          trackName: 'Black Belts',
          name: 'Black Belt 1st Dan',
          nameKorean: '검은띠 1단',
          color: '#1f2937',
          orderIndex: 11,
          isTip: false,
          isStripe: false,
          requirements: {
            minAge: 16,
            minWeeks: 52,
            minClasses: 100,
            skillLevel: 'Master all color belt techniques'
          },
          description: 'First degree black belt',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      // 应用过滤
      let filteredBelts = mockBelts;
      if (trackId) {
        filteredBelts = filteredBelts.filter(belt => belt.trackId === trackId);
      }

      // 如果不需要requirements，移除该字段
      if (!includeRequirements) {
        filteredBelts = filteredBelts.map(belt => {
          const { requirements, ...beltWithoutRequirements } = belt;
          return beltWithoutRequirements as BeltLevel;
        });
      }

      return NextResponse.json({
        success: true,
        data: filteredBelts,
        meta: {
          isMockData: true,
          totalBelts: filteredBelts.length,
          filters: { trackId, includeRequirements },
          environment: process.env.ENVIRONMENT || 'development'
        }
      });
    }

    // 生产环境数据库查询
    // TODO: 实现D1数据库查询
    return NextResponse.json({
      success: false,
      error: 'NOT_IMPLEMENTED',
      message: 'Production database integration pending'
    }, { status: 501 });

  } catch (error) {
    console.error('Belts API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_ERROR',
        message: 'Failed to fetch belt levels',
        details: process.env.DEV_MODE === 'true' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/belts - 学员升级
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success || !['coach', 'admin'].includes(authResult.user.role)) {
      return NextResponse.json(
        { success: false, error: 'INSUFFICIENT_PERMISSIONS', message: 'Coach or admin access required' },
        { status: 403 }
      );
    }

    const promotionData: PromoteStudentRequest = await request.json();
    
    // 验证数据
    if (!promotionData.studentId || !promotionData.newBeltId || !promotionData.promotionDate) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Student ID, new belt ID, and promotion date are required'
      }, { status: 422 });
    }

    const useMockData = process.env.DEV_MODE === 'true' || !process.env.D1_DATABASE_ID;

    if (useMockData) {
      // Mock学员升级
      const promotion: BeltPromotion = {
        promotionId: `promotion-${Date.now()}`,
        studentId: promotionData.studentId,
        studentName: 'Student Name', // Would be fetched from DB
        fromBeltId: 'belt-005', // Mock current belt
        fromBeltName: 'Green Belt',
        toBeltId: promotionData.newBeltId,
        toBeltName: 'Green Belt with Blue Tip', // Would be fetched from DB
        promotionDate: promotionData.promotionDate,
        gradedBy: authResult.user.displayName || authResult.user.uid,
        testScore: promotionData.testScore,
        comments: promotionData.comments,
        certificateIssued: false,
        createdAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: promotion,
        message: 'Student promoted successfully'
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
    console.error('Belt promotion error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_ERROR',
        message: 'Failed to promote student',
        details: process.env.DEV_MODE === 'true' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
