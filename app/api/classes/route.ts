// Classes Management API - 课程管理功能
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

// 课程数据结构
interface Class {
  classId: string;
  className: string;
  programId: string;
  programName: string;
  venueId: string;
  venueName: string;
  venueAddress: string;
  coachId: string;
  coachName: string;
  schedule: {
    dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
    dayName: string;
    startTime: string;
    endTime: string;
    duration: string;
  };
  capacity: number;
  currentEnrollment: number;
  waitlistCount: number;
  ageGroup: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  classType: 'Regular' | 'Competition' | 'Private' | 'Seminar';
  description: string;
  status: 'active' | 'paused' | 'full' | 'archived';
  enrolledStudents: Array<{
    studentId: string;
    studentName: string;
    studentCode: string;
    currentBelt: string;
    enrollmentDate: string;
    attendanceRate: number;
    status: 'active' | 'paused';
  }>;
  recentSessions: Array<{
    sessionId: string;
    date: string;
    status: 'completed' | 'cancelled' | 'upcoming';
    attendanceCount: number;
    notes?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CreateClassRequest {
  className: string;
  programId: string;
  venueId: string;
  coachId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  ageGroup?: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  classType: 'Regular' | 'Competition' | 'Private' | 'Seminar';
  description?: string;
}

// GET /api/classes - 获取课程列表
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
    const includeStudents = searchParams.get('include_students') === 'true';
    const status = searchParams.get('status') || 'active';
    const coachId = searchParams.get('coach_id');
    const venueId = searchParams.get('venue_id');

    const useMockData = process.env.DEV_MODE === 'true' || !process.env.D1_DATABASE_ID;

    if (useMockData) {
      // Mock课程数据
      const mockClasses: Class[] = [
        {
          classId: 'class-001',
          className: 'Monday Evening Class',
          programId: 'program-001',
          programName: 'General Taekwondo',
          venueId: 'venue-001',
          venueName: 'Tampines Training Center',
          venueAddress: '604 Tampines Avenue 9',
          coachId: 'coach-001',
          coachName: 'Jasterfer Kellen',
          schedule: {
            dayOfWeek: 1,
            dayName: 'Monday',
            startTime: '20:00',
            endTime: '21:00',
            duration: '1 hour'
          },
          capacity: 30,
          currentEnrollment: 28,
          waitlistCount: 3,
          ageGroup: 'All Ages',
          skillLevel: 'All Levels',
          classType: 'Regular',
          description: 'Weekly taekwondo training with focus on technique and discipline',
          status: 'active',
          enrolledStudents: includeStudents ? [
            {
              studentId: 'student-001',
              studentName: 'Rishabh Singh Bist',
              studentCode: 'AXT2024001',
              currentBelt: 'Blue Belt',
              enrollmentDate: '2024-01-15',
              attendanceRate: 95.2,
              status: 'active'
            },
            {
              studentId: 'student-002',
              studentName: 'Avaneesh',
              studentCode: 'AXT2024002',
              currentBelt: 'Green Belt',
              enrollmentDate: '2024-02-01',
              attendanceRate: 89.5,
              status: 'active'
            }
          ] : [],
          recentSessions: [
            {
              sessionId: 'session-001',
              date: '2024-12-16',
              status: 'completed',
              attendanceCount: 26,
              notes: 'Good session, practiced Taeguek forms'
            },
            {
              sessionId: 'session-002',
              date: '2024-12-23',
              status: 'upcoming',
              attendanceCount: 0
            }
          ],
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-12-18T15:30:00Z'
        },
        {
          classId: 'class-002',
          className: 'Tuesday Practice',
          programId: 'program-001',
          programName: 'General Taekwondo',
          venueId: 'venue-002',
          venueName: 'Compassvale Training Center A',
          venueAddress: '211C Compassvale Lane',
          coachId: 'coach-002',
          coachName: 'Coach Kim',
          schedule: {
            dayOfWeek: 2,
            dayName: 'Tuesday',
            startTime: '19:30',
            endTime: '20:30',
            duration: '1 hour'
          },
          capacity: 25,
          currentEnrollment: 22,
          waitlistCount: 1,
          ageGroup: 'All Ages',
          skillLevel: 'All Levels',
          classType: 'Regular',
          description: 'Mid-week training focusing on forms and sparring techniques',
          status: 'active',
          enrolledStudents: includeStudents ? [
            {
              studentId: 'student-003',
              studentName: 'Dhedeepya',
              studentCode: 'AXT2024003',
              currentBelt: 'Yellow Belt',
              enrollmentDate: '2024-03-05',
              attendanceRate: 65.6,
              status: 'active'
            }
          ] : [],
          recentSessions: [
            {
              sessionId: 'session-003',
              date: '2024-12-17',
              status: 'completed',
              attendanceCount: 20
            },
            {
              sessionId: 'session-004',
              date: '2024-12-24',
              status: 'upcoming',
              attendanceCount: 0
            }
          ],
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-12-17T21:00:00Z'
        },
        {
          classId: 'class-003',
          className: 'Thursday Practice',
          programId: 'program-001',
          programName: 'General Taekwondo',
          venueId: 'venue-003',
          venueName: 'Compassvale Training Center B',
          venueAddress: '217C Compassvale Drive',
          coachId: 'coach-001',
          coachName: 'Jasterfer Kellen',
          schedule: {
            dayOfWeek: 4,
            dayName: 'Thursday',
            startTime: '19:30',
            endTime: '21:00',
            duration: '1.5 hours'
          },
          capacity: 25,
          currentEnrollment: 24,
          waitlistCount: 2,
          ageGroup: 'All Ages',
          skillLevel: 'All Levels',
          classType: 'Regular',
          description: 'Extended training session with comprehensive skill development',
          status: 'active',
          enrolledStudents: includeStudents ? [
            {
              studentId: 'student-001',
              studentName: 'Rishabh Singh Bist',
              studentCode: 'AXT2024001',
              currentBelt: 'Blue Belt',
              enrollmentDate: '2024-01-15',
              attendanceRate: 95.2,
              status: 'active'
            }
          ] : [],
          recentSessions: [
            {
              sessionId: 'session-005',
              date: '2024-12-19',
              status: 'completed',
              attendanceCount: 23,
              notes: 'Sparring practice session'
            },
            {
              sessionId: 'session-006',
              date: '2024-12-26',
              status: 'upcoming',
              attendanceCount: 0
            }
          ],
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-12-19T21:30:00Z'
        },
        {
          classId: 'class-004',
          className: 'Friday Advanced Session 1',
          programId: 'program-002',
          programName: 'Advanced Training',
          venueId: 'venue-004',
          venueName: 'Fengshan Community Club',
          venueAddress: 'Fengshan CC, Bedok North Street 2',
          coachId: 'coach-002',
          coachName: 'Coach Kim',
          schedule: {
            dayOfWeek: 5,
            dayName: 'Friday',
            startTime: '18:30',
            endTime: '20:00',
            duration: '1.5 hours'
          },
          capacity: 20,
          currentEnrollment: 18,
          waitlistCount: 0,
          ageGroup: 'All Ages',
          skillLevel: 'Beginner',
          classType: 'Regular',
          description: 'Friday fundamentals training',
          status: 'active',
          enrolledStudents: [],
          recentSessions: [
            {
              sessionId: 'session-007',
              date: '2024-12-20',
              status: 'completed',
              attendanceCount: 17
            }
          ],
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-12-20T20:30:00Z'
        },
        {
          classId: 'class-005',
          className: 'Friday Advanced Session 2',
          programId: 'program-003',
          programName: 'Competition Training',
          venueId: 'venue-004',
          venueName: 'Fengshan Community Club',
          venueAddress: 'Fengshan CC, Bedok North Street 2',
          coachId: 'coach-001',
          coachName: 'Jasterfer Kellen',
          schedule: {
            dayOfWeek: 5,
            dayName: 'Friday',
            startTime: '20:00',
            endTime: '21:30',
            duration: '1.5 hours'
          },
          capacity: 20,
          currentEnrollment: 15,
          waitlistCount: 0,
          ageGroup: 'All Ages',
          skillLevel: 'Advanced',
          classType: 'Competition',
          description: 'Advanced Friday training for competition preparation',
          status: 'active',
          enrolledStudents: [],
          recentSessions: [
            {
              sessionId: 'session-008',
              date: '2024-12-20',
              status: 'completed',
              attendanceCount: 14
            }
          ],
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-12-20T22:00:00Z'
        },
        {
          classId: 'class-006',
          className: 'Saturday Community Class',
          programId: 'program-001',
          programName: 'General Taekwondo',
          venueId: 'venue-005',
          venueName: 'Compassvale Training Center C',
          venueAddress: '207A Compassvale Lane',
          coachId: 'coach-003',
          coachName: 'Coach Park',
          schedule: {
            dayOfWeek: 6,
            dayName: 'Saturday',
            startTime: '10:00',
            endTime: '11:30',
            duration: '1.5 hours'
          },
          capacity: 20,
          currentEnrollment: 16,
          waitlistCount: 1,
          ageGroup: 'All Ages',
          skillLevel: 'All Levels',
          classType: 'Regular',
          description: 'Weekend training sessions for all skill levels',
          status: 'active',
          enrolledStudents: [],
          recentSessions: [
            {
              sessionId: 'session-009',
              date: '2024-12-21',
              status: 'completed',
              attendanceCount: 15
            }
          ],
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-12-21T12:00:00Z'
        }
      ];

      // 应用过滤
      let filteredClasses = mockClasses.filter(cls => {
        if (status !== 'all' && cls.status !== status) return false;
        if (coachId && cls.coachId !== coachId) return false;
        if (venueId && cls.venueId !== venueId) return false;
        return true;
      });

      // 权限过滤 - 教练只能看到自己的课程
      if (authResult.user.role === 'coach') {
        filteredClasses = filteredClasses.filter(cls => cls.coachId === authResult.user.uid);
      }

      return NextResponse.json({
        success: true,
        data: filteredClasses,
        meta: {
          isMockData: true,
          totalClasses: filteredClasses.length,
          filters: { status, coachId, venueId },
          userRole: authResult.user.role,
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
    console.error('Classes API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_ERROR',
        message: 'Failed to fetch classes',
        details: process.env.DEV_MODE === 'true' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/classes - 创建新课程
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success || authResult.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'ADMIN_ACCESS_REQUIRED', message: 'Only admins can create classes' },
        { status: 403 }
      );
    }

    const classData: CreateClassRequest = await request.json();
    
    // 验证数据
    const validation = validateClassData(classData);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid class data',
        details: { fieldErrors: validation.errors }
      }, { status: 422 });
    }

    const useMockData = process.env.DEV_MODE === 'true' || !process.env.D1_DATABASE_ID;

    if (useMockData) {
      // Mock创建课程
      const newClass: Class = {
        classId: `class-${Date.now()}`,
        className: classData.className,
        programId: classData.programId,
        programName: 'General Taekwondo', // Mock program name
        venueId: classData.venueId,
        venueName: 'Training Center', // Mock venue name
        venueAddress: 'Training Address', // Mock address
        coachId: classData.coachId,
        coachName: 'Instructor', // Mock coach name
        schedule: {
          dayOfWeek: classData.dayOfWeek,
          dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][classData.dayOfWeek],
          startTime: classData.startTime,
          endTime: classData.endTime,
          duration: calculateDuration(classData.startTime, classData.endTime)
        },
        capacity: classData.capacity,
        currentEnrollment: 0,
        waitlistCount: 0,
        ageGroup: classData.ageGroup || 'All Ages',
        skillLevel: classData.skillLevel,
        classType: classData.classType,
        description: classData.description || '',
        status: 'active',
        enrolledStudents: [],
        recentSessions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: newClass,
        message: 'Class created successfully'
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
    console.error('Create class error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_ERROR',
        message: 'Failed to create class',
        details: process.env.DEV_MODE === 'true' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// 验证课程数据
function validateClassData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.className || data.className.trim().length === 0) {
    errors.push('Class name is required');
  }
  
  if (!data.programId || data.programId.trim().length === 0) {
    errors.push('Program ID is required');
  }
  
  if (!data.venueId || data.venueId.trim().length === 0) {
    errors.push('Venue ID is required');
  }
  
  if (!data.coachId || data.coachId.trim().length === 0) {
    errors.push('Coach ID is required');
  }
  
  if (data.dayOfWeek < 0 || data.dayOfWeek > 6) {
    errors.push('Day of week must be between 0 (Sunday) and 6 (Saturday)');
  }
  
  if (!data.startTime || !data.endTime) {
    errors.push('Start time and end time are required');
  }
  
  if (data.capacity && (data.capacity < 1 || data.capacity > 100)) {
    errors.push('Capacity must be between 1 and 100');
  }
  
  if (!['Beginner', 'Intermediate', 'Advanced', 'All Levels'].includes(data.skillLevel)) {
    errors.push('Invalid skill level');
  }
  
  if (!['Regular', 'Competition', 'Private', 'Seminar'].includes(data.classType)) {
    errors.push('Invalid class type');
  }
  
  return { isValid: errors.length === 0, errors };
}

// 计算课程时长
function calculateDuration(startTime: string, endTime: string): string {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  if (diffHours === 1) return '1 hour';
  if (diffHours === 1.5) return '1.5 hours';
  if (diffHours === 2) return '2 hours';
  return `${diffHours} hours`;
}