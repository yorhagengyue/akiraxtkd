/**
 * Students Service Layer
 * 学员业务逻辑服务层
 */

import { DatabaseQuery, PaginatedResult, createQueryBuilder, createPaginationBuilder } from '@/lib/database';
import { 
  Student, 
  CreateStudentRequest, 
  UpdateStudentRequest, 
  BeltLevel,
  Validator, 
  studentValidationSchema,
  ValidationError 
} from '@/lib/models';

export interface StudentWithBelt extends Omit<Student, 'current_belt_id'> {
  current_belt: BeltLevel;
  full_name: string;
  age: number;
}

export interface StudentFilters {
  search?: string;
  status?: 'Active' | 'Inactive' | 'Suspended';
  gender?: 'Male' | 'Female';
  belt_level_id?: number;
  age_min?: number;
  age_max?: number;
  joined_after?: string;
  joined_before?: string;
}

export interface StudentListOptions {
  page?: number;
  limit?: number;
  sort_field?: string;
  sort_order?: 'ASC' | 'DESC';
  filters?: StudentFilters;
}

export class StudentsService {
  constructor(private db: DatabaseQuery) {}

  // 生成学员代码
  private async generateStudentCode(): Promise<string> {
    const year = new Date().getFullYear();
    
    // 获取今年已有的最大学员编号
    const lastStudent = await this.db.first<{ student_code: string }>(
      'SELECT student_code FROM students WHERE student_code LIKE ? ORDER BY student_code DESC LIMIT 1',
      [`AXT${year}%`]
    );

    let nextNumber = 1;
    if (lastStudent?.student_code) {
      const match = lastStudent.student_code.match(/AXT\d{4}(\d{3})$/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    return `AXT${year}${nextNumber.toString().padStart(3, '0')}`;
  }

  // 计算年龄
  private calculateAge(dateOfBirth: string): number {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  // 获取学员列表（分页）
  async getStudents(options: StudentListOptions = {}): Promise<PaginatedResult<StudentWithBelt>> {
    const {
      page = 1,
      limit = 10,
      sort_field = 'created_at',
      sort_order = 'DESC',
      filters = {}
    } = options;

    // 构建基础查询
    const queryBuilder = createQueryBuilder()
      .select([
        's.*',
        'b.belt_name',
        'b.belt_color',
        'b.level_order',
        'b.description as belt_description',
        's.first_name || " " || s.last_name as full_name'
      ])
      .from('students s')
      .leftJoin('belt_levels b', 's.current_belt_id = b.id');

    // 添加筛选条件
    if (filters.search) {
      queryBuilder.where(
        '(s.first_name LIKE ? OR s.last_name LIKE ? OR s.student_code LIKE ? OR s.email LIKE ?)',
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`
      );
    }

    if (filters.status) {
      queryBuilder.where('s.status = ?', filters.status);
    }

    if (filters.gender) {
      queryBuilder.where('s.gender = ?', filters.gender);
    }

    if (filters.belt_level_id) {
      queryBuilder.where('s.current_belt_id = ?', filters.belt_level_id);
    }

    if (filters.joined_after) {
      queryBuilder.where('s.joined_date >= ?', filters.joined_after);
    }

    if (filters.joined_before) {
      queryBuilder.where('s.joined_date <= ?', filters.joined_before);
    }

    // 添加排序
    const validSortFields = ['first_name', 'last_name', 'student_code', 'joined_date', 'created_at', 'status'];
    const sortField = validSortFields.includes(sort_field) ? sort_field : 'created_at';
    queryBuilder.orderBy(`s.${sortField}`, sort_order);

    // 构建查询
    const { query: baseQuery, params } = queryBuilder.build();
    
    // 构建计数查询
    const countQuery = `
      SELECT COUNT(*) as count 
      FROM students s 
      LEFT JOIN belt_levels b ON s.current_belt_id = b.id
      ${baseQuery.includes('WHERE') ? 'WHERE ' + baseQuery.split('WHERE')[1].split('ORDER BY')[0] : ''}
    `;

    // 执行分页查询
    const result = await createPaginationBuilder(this.db)
      .setBaseQuery(baseQuery)
      .setCountQuery(countQuery)
      .setParams(params)
      .setPage(page)
      .setLimit(limit)
      .execute<any>();

    // 处理结果数据
    const studentsWithBelt: StudentWithBelt[] = result.data.map(row => ({
      id: row.id,
      student_code: row.student_code,
      first_name: row.first_name,
      last_name: row.last_name,
      full_name: row.full_name,
      date_of_birth: row.date_of_birth,
      age: this.calculateAge(row.date_of_birth),
      gender: row.gender,
      phone: row.phone,
      email: row.email,
      address: row.address,
      postal_code: row.postal_code,
      emergency_contact_name: row.emergency_contact_name,
      emergency_contact_phone: row.emergency_contact_phone,
      emergency_contact_relationship: row.emergency_contact_relationship,
      joined_date: row.joined_date,
      status: row.status,
      current_belt: {
        id: row.current_belt_id,
        belt_name: row.belt_name,
        belt_color: row.belt_color,
        level_order: row.level_order,
        description: row.belt_description,
        requirements: '',
        created_at: '',
        updated_at: ''
      },
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    return {
      data: studentsWithBelt,
      pagination: result.pagination
    };
  }

  // 获取单个学员详情
  async getStudentById(id: number): Promise<StudentWithBelt | null> {
    const query = `
      SELECT 
        s.*,
        b.belt_name,
        b.belt_color,
        b.level_order,
        b.description as belt_description,
        s.first_name || ' ' || s.last_name as full_name
      FROM students s
      LEFT JOIN belt_levels b ON s.current_belt_id = b.id
      WHERE s.id = ?
    `;

    const row = await this.db.first<any>(query, [id]);
    
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      student_code: row.student_code,
      first_name: row.first_name,
      last_name: row.last_name,
      full_name: row.full_name,
      date_of_birth: row.date_of_birth,
      age: this.calculateAge(row.date_of_birth),
      gender: row.gender,
      phone: row.phone,
      email: row.email,
      address: row.address,
      postal_code: row.postal_code,
      emergency_contact_name: row.emergency_contact_name,
      emergency_contact_phone: row.emergency_contact_phone,
      emergency_contact_relationship: row.emergency_contact_relationship,
      joined_date: row.joined_date,
      status: row.status,
      current_belt: {
        id: row.current_belt_id,
        belt_name: row.belt_name,
        belt_color: row.belt_color,
        level_order: row.level_order,
        description: row.belt_description,
        requirements: '',
        created_at: '',
        updated_at: ''
      },
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  // 创建学员
  async createStudent(data: CreateStudentRequest): Promise<StudentWithBelt> {
    // 验证输入数据
    Validator.validateObject(data, studentValidationSchema);

    // 检查邮箱是否已存在
    if (data.email) {
      const existingStudent = await this.db.first<{ id: number }>(
        'SELECT id FROM students WHERE email = ?',
        [data.email]
      );
      
      if (existingStudent) {
        throw new ValidationError('Email address already exists', 'email', 'DUPLICATE_EMAIL');
      }
    }

    // 验证腰带等级是否存在
    const beltLevel = await this.db.first<BeltLevel>(
      'SELECT * FROM belt_levels WHERE id = ?',
      [data.belt_level_id]
    );
    
    if (!beltLevel) {
      throw new ValidationError('Invalid belt level', 'belt_level_id', 'INVALID_BELT_LEVEL');
    }

    // 生成学员代码
    const studentCode = await this.generateStudentCode();
    
    // 准备插入数据
    const now = new Date().toISOString();
    const insertData = {
      student_code: studentCode,
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      postal_code: data.postal_code || null,
      emergency_contact_name: data.emergency_contact_name,
      emergency_contact_phone: data.emergency_contact_phone,
      emergency_contact_relationship: data.emergency_contact_relationship,
      joined_date: new Date().toISOString().split('T')[0],
      status: data.status || 'Active',
      current_belt_id: data.belt_level_id,
      notes: data.notes || null,
      created_at: now,
      updated_at: now
    };

    // 插入学员记录
    const insertQuery = `
      INSERT INTO students (
        student_code, first_name, last_name, date_of_birth, gender,
        phone, email, address, postal_code,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        joined_date, status, current_belt_id, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await this.db.run(insertQuery, [
      insertData.student_code,
      insertData.first_name,
      insertData.last_name,
      insertData.date_of_birth,
      insertData.gender,
      insertData.phone,
      insertData.email,
      insertData.address,
      insertData.postal_code,
      insertData.emergency_contact_name,
      insertData.emergency_contact_phone,
      insertData.emergency_contact_relationship,
      insertData.joined_date,
      insertData.status,
      insertData.current_belt_id,
      insertData.notes,
      insertData.created_at,
      insertData.updated_at
    ]);

    if (!result.success || !result.meta.last_row_id) {
      throw new Error('Failed to create student');
    }

    // 返回创建的学员信息
    const newStudent = await this.getStudentById(result.meta.last_row_id);
    if (!newStudent) {
      throw new Error('Failed to retrieve created student');
    }

    return newStudent;
  }

  // 更新学员
  async updateStudent(id: number, data: UpdateStudentRequest): Promise<StudentWithBelt> {
    // 验证学员是否存在
    const existingStudent = await this.getStudentById(id);
    if (!existingStudent) {
      throw new ValidationError('Student not found', 'id', 'NOT_FOUND');
    }

    // 验证输入数据（只验证提供的字段）
    const updateSchema: Record<string, any> = {};
    Object.keys(data).forEach(key => {
      if (studentValidationSchema[key]) {
        updateSchema[key] = { ...studentValidationSchema[key], required: false };
      }
    });
    
    Validator.validateObject(data, updateSchema);

    // 检查邮箱唯一性
    if (data.email && data.email !== existingStudent.email) {
      const emailExists = await this.db.first<{ id: number }>(
        'SELECT id FROM students WHERE email = ? AND id != ?',
        [data.email, id]
      );
      
      if (emailExists) {
        throw new ValidationError('Email address already exists', 'email', 'DUPLICATE_EMAIL');
      }
    }

    // 构建更新查询
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    });

    if (updateFields.length === 0) {
      return existingStudent; // 没有更新的字段
    }

    // 添加更新时间
    updateFields.push('updated_at = ?');
    updateValues.push(new Date().toISOString());
    updateValues.push(id);

    const updateQuery = `
      UPDATE students 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `;

    const result = await this.db.run(updateQuery, updateValues);
    
    if (!result.success) {
      throw new Error('Failed to update student');
    }

    // 返回更新后的学员信息
    const updatedStudent = await this.getStudentById(id);
    if (!updatedStudent) {
      throw new Error('Failed to retrieve updated student');
    }

    return updatedStudent;
  }

  // 删除学员（软删除）
  async deleteStudent(id: number): Promise<void> {
    // 验证学员是否存在
    const existingStudent = await this.getStudentById(id);
    if (!existingStudent) {
      throw new ValidationError('Student not found', 'id', 'NOT_FOUND');
    }

    // 检查是否有相关记录（出勤、课程注册等）
    const hasAttendance = await this.db.first<{ count: number }>(
      'SELECT COUNT(*) as count FROM attendance_records WHERE student_id = ?',
      [id]
    );

    const hasEnrollments = await this.db.first<{ count: number }>(
      'SELECT COUNT(*) as count FROM class_enrollments WHERE student_id = ?',
      [id]
    );

    if ((hasAttendance?.count || 0) > 0 || (hasEnrollments?.count || 0) > 0) {
      // 如果有相关记录，执行软删除（更改状态为Inactive）
      await this.db.run(
        'UPDATE students SET status = ?, updated_at = ? WHERE id = ?',
        ['Inactive', new Date().toISOString(), id]
      );
    } else {
      // 如果没有相关记录，可以直接删除
      const result = await this.db.run('DELETE FROM students WHERE id = ?', [id]);
      if (!result.success) {
        throw new Error('Failed to delete student');
      }
    }
  }

  // 升级学员腰带
  async promoteStudent(id: number, toBeltId: number, promotionDate?: string, notes?: string): Promise<void> {
    // 验证学员是否存在
    const student = await this.getStudentById(id);
    if (!student) {
      throw new ValidationError('Student not found', 'id', 'NOT_FOUND');
    }

    // 验证目标腰带是否存在
    const targetBelt = await this.db.first<BeltLevel>(
      'SELECT * FROM belt_levels WHERE id = ?',
      [toBeltId]
    );
    
    if (!targetBelt) {
      throw new ValidationError('Invalid belt level', 'toBeltId', 'INVALID_BELT_LEVEL');
    }

    // 验证升级逻辑（目标腰带等级应该高于当前腰带）
    if (targetBelt.level_order <= student.current_belt.level_order) {
      throw new ValidationError('Cannot promote to a lower or same belt level', 'toBeltId', 'INVALID_PROMOTION');
    }

    const promotionDateStr = promotionDate || new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    // 使用事务执行升级操作
    const operations = [
      {
        query: 'UPDATE students SET current_belt_id = ?, updated_at = ? WHERE id = ?',
        params: [toBeltId, now, id]
      },
      {
        query: `
          INSERT INTO belt_promotions (student_id, from_belt_id, to_belt_id, promotion_date, notes, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        params: [id, student.current_belt.id, toBeltId, promotionDateStr, notes || null, now, now]
      }
    ];

    const results = await this.db.batch(operations);
    
    if (!results.every(result => result.success)) {
      throw new Error('Failed to promote student');
    }
  }

  // 获取学员统计信息
  async getStudentStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    by_gender: { Male: number; Female: number };
    by_belt: Array<{ belt_name: string; count: number }>;
    recent_joins: number; // 最近30天加入的学员数
  }> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [
      totalStats,
      genderStats,
      beltStats,
      recentJoins
    ] = await Promise.all([
      // 总体统计
      this.db.all<{ status: string; count: number }>(`
        SELECT status, COUNT(*) as count 
        FROM students 
        GROUP BY status
      `),
      
      // 性别统计
      this.db.all<{ gender: string; count: number }>(`
        SELECT gender, COUNT(*) as count 
        FROM students 
        WHERE status = 'Active'
        GROUP BY gender
      `),
      
      // 腰带统计
      this.db.all<{ belt_name: string; count: number }>(`
        SELECT b.belt_name, COUNT(*) as count
        FROM students s
        LEFT JOIN belt_levels b ON s.current_belt_id = b.id
        WHERE s.status = 'Active'
        GROUP BY b.belt_name, b.level_order
        ORDER BY b.level_order
      `),
      
      // 最近加入统计
      this.db.first<{ count: number }>(`
        SELECT COUNT(*) as count 
        FROM students 
        WHERE joined_date >= ?
      `, [thirtyDaysAgo])
    ]);

    const total = totalStats.reduce((sum, stat) => sum + stat.count, 0);
    const active = totalStats.find(stat => stat.status === 'Active')?.count || 0;
    const inactive = total - active;

    const byGender = {
      Male: genderStats.find(stat => stat.gender === 'Male')?.count || 0,
      Female: genderStats.find(stat => stat.gender === 'Female')?.count || 0
    };

    return {
      total,
      active,
      inactive,
      by_gender: byGender,
      by_belt: beltStats,
      recent_joins: recentJoins?.count || 0
    };
  }
}
