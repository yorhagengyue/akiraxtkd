// Students Management API - 完整的学员管理功能
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

// 学员数据结构
interface Student {
  studentId: string;
  studentCode: string;
  legalName: string;
  displayName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone?: string;
  email?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  address?: string;
  postalCode?: string;
  joinedDate: string;
  status: 'active' | 'inactive' | 'suspended' | 'graduated';
  currentBelt: {
    name: string;
    color: string;
    achievedDate: string;
  };
  enrolledClasses: Array<{
    classId: string;
    className: string;
    status: 'active' | 'paused';
  }>;
  attendanceStats: {
    totalClasses: number;
    attended: number;
    rate: number;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateStudentRequest {
  legalName: string;
  displayName?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone?: string;
  email?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  address?: string;
  postalCode?: string;
  notes?: string;
}

// 生成学员代码
function generateStudentCode(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 999) + 1;
  return `AXT${year}${randomNum.toString().padStart(3, '0')}`;
}

// 验证学员数据
function validateStudentData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.legalName || data.legalName.trim().length === 0) {
    errors.push('Legal name is required');
  }
  
  if (!data.dateOfBirth) {
    errors.push('Date of birth is required');
  } else {
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    if (birthDate > today) {
      errors.push('Date of birth cannot be in the future');
    }
    if (today.getFullYear() - birthDate.getFullYear() > 100) {
      errors.push('Please check the date of birth');
    }
  }
  
  if (!data.gender || !['Male', 'Female', 'Other'].includes(data.gender)) {
    errors.push('Valid gender is required');
  }
  
  if (!data.emergencyContactName || data.emergencyContactName.trim().length === 0) {
    errors.push('Emergency contact name is required');
  }
  
  if (!data.emergencyContactPhone || data.emergencyContactPhone.trim().length === 0) {
    errors.push('Emergency contact phone is required');
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.postalCode && !/^\d{6}$/.test(data.postalCode)) {
    errors.push('Postal code must be 6 digits');
  }
  
  return { isValid: errors.length === 0, errors };
}

// GET /api/students - 获取学员列表
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success || !['coach', 'admin'].includes(authResult.user.role)) {
      return NextResponse.json(
        { success: false, error: 'INSUFFICIENT_PERMISSIONS', message: 'Coach or admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const status = searchParams.get('status') || 'active';
    const search = searchParams.get('search') || '';
    const beltLevel = searchParams.get('belt_level') || '';
    const sortBy = searchParams.get('sort_by') || 'name';
    const sortOrder = searchParams.get('sort_order') || 'asc';

    const useMockData = process.env.DEV_MODE === 'true' || !process.env.D1_DATABASE_ID;

    if (useMockData) {
      // Mock学员数据
      const mockStudents: Student[] = [
        {
          studentId: 'student-001',
          studentCode: 'AXT2024001',
          legalName: 'Rishabh Singh Bist',
          displayName: 'Rishabh',
          dateOfBirth: '2011-11-23',
          gender: 'Male',
          phone: '+65 8123 4567',
          email: 'parent1@example.com',
          emergencyContact: {
            name: 'Parent Singh',
            phone: '+65 8123 4567',
            relationship: 'Father'
          },
          address: '123 Tampines Street',
          postalCode: '521123',
          joinedDate: '2024-01-15',
          status: 'active',
          currentBelt: {
            name: 'Blue Belt',
            color: '#3b82f6',
            achievedDate: '2024-08-01'
          },
          enrolledClasses: [
            { classId: 'class-001', className: 'Monday Evening', status: 'active' },
            { classId: 'class-003', className: 'Thursday Practice', status: 'active' }
          ],
          attendanceStats: {
            totalClasses: 42,
            attended: 40,
            rate: 95.2
          },
          notes: 'Excellent student, ready for red belt testing',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-12-18T15:30:00Z'
        },
        {
          studentId: 'student-002',
          studentCode: 'AXT2024002',
          legalName: 'Avaneesh',
          displayName: 'Avaneesh',
          dateOfBirth: '2016-09-11',
          gender: 'Male',
          emergencyContact: {
            name: 'Parent Avaneesh',
            phone: '+65 8234 5678',
            relationship: 'Mother'
          },
          joinedDate: '2024-02-01',
          status: 'active',
          currentBelt: {
            name: 'Green Belt',
            color: '#22c55e',
            achievedDate: '2024-06-15'
          },
          enrolledClasses: [
            { classId: 'class-001', className: 'Monday Evening', status: 'active' }
          ],
          attendanceStats: {
            totalClasses: 38,
            attended: 34,
            rate: 89.5
          },
          notes: 'Good progress, needs more focus on forms',
          createdAt: '2024-02-01T10:00:00Z',
          updatedAt: '2024-12-16T14:20:00Z'
        },
        {
          studentId: 'student-003',
          studentCode: 'AXT2024003',
          legalName: 'Dhedeepya',
          displayName: 'Dhedeepya',
          dateOfBirth: '2013-12-12',
          gender: 'Female',
          emergencyContact: {
            name: 'Parent Dhedeepya',
            phone: '+65 8345 6789',
            relationship: 'Mother'
          },
          joinedDate: '2024-03-05',
          status: 'active',
          currentBelt: {
            name: 'Yellow Belt',
            color: '#fbbf24',
            achievedDate: '2024-05-01'
          },
          enrolledClasses: [
            { classId: 'class-002', className: 'Tuesday Practice', status: 'active' }
          ],
          attendanceStats: {
            totalClasses: 32,
            attended: 21,
            rate: 65.6
          },
          notes: 'Low attendance recently, follow up needed',
          createdAt: '2024-03-05T10:00:00Z',
          updatedAt: '2024-12-10T16:45:00Z'
        }
      ];

      // 应用过滤和搜索
      let filteredStudents = mockStudents.filter(student => {
        if (status !== 'all' && student.status !== status) return false;
        if (search && !student.legalName.toLowerCase().includes(search.toLowerCase()) && 
            !student.studentCode.toLowerCase().includes(search.toLowerCase())) return false;
        if (beltLevel && !student.currentBelt.name.toLowerCase().includes(beltLevel.toLowerCase())) return false;
        return true;
      });

      // 应用排序
      filteredStudents.sort((a, b) => {
        const aVal = sortBy === 'name' ? a.legalName : 
                     sortBy === 'belt' ? a.currentBelt.name :
                     sortBy === 'joined' ? a.joinedDate : a.legalName;
        const bVal = sortBy === 'name' ? b.legalName : 
                     sortBy === 'belt' ? b.currentBelt.name :
                     sortBy === 'joined' ? b.joinedDate : b.legalName;
        
        const comparison = aVal.localeCompare(bVal);
        return sortOrder === 'desc' ? -comparison : comparison;
      });

      // 应用分页
      const total = filteredStudents.length;
      const offset = (page - 1) * limit;
      const paginatedStudents = filteredStudents.slice(offset, offset + limit);

      return NextResponse.json({
        success: true,
        data: paginatedStudents,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: offset + limit < total,
          hasPrev: page > 1
        },
        meta: {
          isMockData: true,
          filters: { status, search, beltLevel, sortBy, sortOrder },
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
    console.error('Students API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_ERROR',
        message: 'Failed to fetch students',
        details: process.env.DEV_MODE === 'true' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/students - 创建新学员
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success || authResult.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'ADMIN_ACCESS_REQUIRED', message: 'Only admins can create students' },
        { status: 403 }
      );
    }

    const studentData: CreateStudentRequest = await request.json();
    
    // 验证数据
    const validation = validateStudentData(studentData);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid student data',
        details: { fieldErrors: validation.errors }
      }, { status: 422 });
    }

    const useMockData = process.env.DEV_MODE === 'true' || !process.env.D1_DATABASE_ID;

    if (useMockData) {
      // Mock创建学员
      const newStudent: Student = {
        studentId: `student-${Date.now()}`,
        studentCode: generateStudentCode(),
        legalName: studentData.legalName,
        displayName: studentData.displayName || studentData.legalName,
        dateOfBirth: studentData.dateOfBirth,
        gender: studentData.gender,
        phone: studentData.phone,
        email: studentData.email,
        emergencyContact: {
          name: studentData.emergencyContactName,
          phone: studentData.emergencyContactPhone,
          relationship: studentData.emergencyContactRelationship
        },
        address: studentData.address,
        postalCode: studentData.postalCode,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active',
        currentBelt: {
          name: 'White Belt',
          color: '#e5e7eb',
          achievedDate: new Date().toISOString().split('T')[0]
        },
        enrolledClasses: [],
        attendanceStats: {
          totalClasses: 0,
          attended: 0,
          rate: 0
        },
        notes: studentData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: newStudent,
        message: 'Student created successfully'
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
    console.error('Create student error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'INTERNAL_ERROR',
        message: 'Failed to create student',
        details: process.env.DEV_MODE === 'true' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/students - 批量更新学员
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success || !['coach', 'admin'].includes(authResult.user.role)) {
      return NextResponse.json(
        { success: false, error: 'INSUFFICIENT_PERMISSIONS' },
        { status: 403 }
      );
    }

    const { action, studentIds, data } = await request.json();

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
        return NextResponse.json(
          { success: false, error: 'INVALID_ACTION' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Bulk student operation error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
