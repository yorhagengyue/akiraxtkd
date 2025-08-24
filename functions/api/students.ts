// Cloudflare Worker Function for Students API
// /api/students endpoint

import { Env, Student, CreateStudentRequest, UpdateStudentRequest, ApiResponse, PaginatedResponse, QueryOptions } from '../../types/database';
import { requireAuth } from '../lib/jwt';

interface RequestContext {
  request: Request;
  env: Env;
  params?: { id?: string };
}

// Generate student code
function generateStudentCode(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 999) + 1;
  return `AXT${year}${randomNum.toString().padStart(3, '0')}`;
}

// Validate student data
function validateStudentData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.first_name || data.first_name.trim().length === 0) {
    errors.push('First name is required');
  }
  
  if (!data.last_name || data.last_name.trim().length === 0) {
    errors.push('Last name is required');
  }
  
  if (!data.date_of_birth) {
    errors.push('Date of birth is required');
  } else {
    const birthDate = new Date(data.date_of_birth);
    const today = new Date();
    if (birthDate > today) {
      errors.push('Date of birth cannot be in the future');
    }
  }
  
  if (!data.gender || !['Male', 'Female', 'Other'].includes(data.gender)) {
    errors.push('Valid gender is required');
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Build WHERE clause for filtering
function buildWhereClause(filters: any): { where: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;
  
  if (filters.status) {
    if (Array.isArray(filters.status)) {
      const placeholders = filters.status.map(() => `?${paramIndex++}`).join(',');
      conditions.push(`status IN (${placeholders})`);
      params.push(...filters.status);
    } else {
      conditions.push(`status = ?${paramIndex++}`);
      params.push(filters.status);
    }
  }
  
  if (filters.gender) {
    if (Array.isArray(filters.gender)) {
      const placeholders = filters.gender.map(() => `?${paramIndex++}`).join(',');
      conditions.push(`gender IN (${placeholders})`);
      params.push(...filters.gender);
    } else {
      conditions.push(`gender = ?${paramIndex++}`);
      params.push(filters.gender);
    }
  }
  
  if (filters.search) {
    conditions.push(`(first_name LIKE ?${paramIndex} OR last_name LIKE ?${paramIndex + 1} OR email LIKE ?${paramIndex + 2})`);
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
    paramIndex += 3;
  }
  
  if (filters.date_from) {
    conditions.push(`joined_date >= ?${paramIndex++}`);
    params.push(filters.date_from);
  }
  
  if (filters.date_to) {
    conditions.push(`joined_date <= ?${paramIndex++}`);
    params.push(filters.date_to);
  }
  
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, params };
}

// GET /api/students - List all students with pagination and filtering
async function getStudents(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 100);
    const offset = (page - 1) * limit;
    
    // Parse filters
    const filters = {
      status: url.searchParams.get('status'),
      gender: url.searchParams.get('gender'),
      search: url.searchParams.get('search'),
      date_from: url.searchParams.get('date_from'),
      date_to: url.searchParams.get('date_to'),
    };
    
    // Parse sorting
    const sortField = url.searchParams.get('sort_field') || 'created_at';
    const sortOrder = url.searchParams.get('sort_order') || 'DESC';
    
    // Build query
    const { where, params } = buildWhereClause(filters);
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM students ${where}`;
    const countResult = await context.env.DB.prepare(countQuery).bind(...params).first();
    const total = countResult?.total || 0;
    
    // Get students with current belt information
    const studentsQuery = `
      SELECT 
        s.*,
        bl.belt_name,
        bl.belt_color,
        bl.level_order
      FROM students s
      LEFT JOIN (
        SELECT 
          sbh.student_id,
          sbh.belt_level_id,
          ROW_NUMBER() OVER (PARTITION BY sbh.student_id ORDER BY sbh.achieved_date DESC) as rn
        FROM student_belt_history sbh
      ) latest_belt ON s.id = latest_belt.student_id AND latest_belt.rn = 1
      LEFT JOIN belt_levels bl ON latest_belt.belt_level_id = bl.id
      ${where}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ?${params.length + 1} OFFSET ?${params.length + 2}
    `;
    
    const studentsResult = await context.env.DB.prepare(studentsQuery)
      .bind(...params, limit, offset)
      .all();
    
    const students = studentsResult.results.map((row: any) => ({
      id: row.id,
      student_code: row.student_code,
      first_name: row.first_name,
      last_name: row.last_name,
      full_name: row.full_name,
      date_of_birth: row.date_of_birth,
      gender: row.gender,
      phone: row.phone,
      email: row.email,
      joined_date: row.joined_date,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      current_belt: row.belt_name ? {
        belt_name: row.belt_name,
        belt_color: row.belt_color,
        level_order: row.level_order
      } : null
    }));
    
    const response: PaginatedResponse<Student> = {
      data: students,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
        has_next: offset + limit < total,
        has_prev: page > 1
      }
    };
    
    return new Response(JSON.stringify({ success: true, ...response }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error fetching students:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch students'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/students - Create new student
async function createStudent(context: RequestContext): Promise<Response> {
  try {
    const data: CreateStudentRequest = await context.request.json();
    
    // Validate data
    const validation = validateStudentData(data);
    if (!validation.isValid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid student data',
        details: { field_errors: validation.errors }
      }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate unique student code
    let studentCode = generateStudentCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await context.env.DB.prepare(
        'SELECT id FROM students WHERE student_code = ?'
      ).bind(studentCode).first();
      
      if (!existing) break;
      studentCode = generateStudentCode();
      attempts++;
    }
    
    if (attempts >= 10) {
      return new Response(JSON.stringify({
        success: false,
        error: 'GENERATION_ERROR',
        message: 'Failed to generate unique student code'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Insert new student
    const insertQuery = `
      INSERT INTO students (
        student_code, first_name, last_name, date_of_birth, gender,
        phone, email, emergency_contact_name, emergency_contact_phone,
        emergency_contact_relationship, address, postal_code, joined_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const joinedDate = new Date().toISOString().split('T')[0];
    const result = await context.env.DB.prepare(insertQuery).bind(
      studentCode,
      data.first_name,
      data.last_name,
      data.date_of_birth,
      data.gender,
      data.phone || null,
      data.email || null,
      data.emergency_contact_name || null,
      data.emergency_contact_phone || null,
      data.emergency_contact_relationship || null,
      data.address || null,
      data.postal_code || null,
      joinedDate,
      data.notes || null
    ).run();
    
    if (!result.success) {
      throw new Error('Failed to insert student');
    }
    
    // Fetch the created student
    const newStudent = await context.env.DB.prepare(
      'SELECT * FROM students WHERE id = ?'
    ).bind(result.meta.last_row_id).first();
    
    return new Response(JSON.stringify({
      success: true,
      data: newStudent,
      message: 'Student created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error creating student:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to create student'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// GET /api/students/{id} - Get specific student
async function getStudent(context: RequestContext): Promise<Response> {
  try {
    const studentId = context.params?.id;
    if (!studentId || isNaN(parseInt(studentId))) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_ID',
        message: 'Valid student ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get student with current belt and belt history
    const studentQuery = `
      SELECT 
        s.*,
        bl.belt_name as current_belt_name,
        bl.belt_color as current_belt_color,
        bl.level_order as current_belt_order
      FROM students s
      LEFT JOIN (
        SELECT 
          sbh.student_id,
          sbh.belt_level_id,
          ROW_NUMBER() OVER (PARTITION BY sbh.student_id ORDER BY sbh.achieved_date DESC) as rn
        FROM student_belt_history sbh
      ) latest_belt ON s.id = latest_belt.student_id AND latest_belt.rn = 1
      LEFT JOIN belt_levels bl ON latest_belt.belt_level_id = bl.id
      WHERE s.id = ?
    `;
    
    const student = await context.env.DB.prepare(studentQuery).bind(studentId).first();
    
    if (!student) {
      return new Response(JSON.stringify({
        success: false,
        error: 'NOT_FOUND',
        message: 'Student not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get belt history
    const beltHistoryQuery = `
      SELECT 
        sbh.*,
        bl.belt_name,
        bl.belt_color,
        bl.level_order
      FROM student_belt_history sbh
      LEFT JOIN belt_levels bl ON sbh.belt_level_id = bl.id
      WHERE sbh.student_id = ?
      ORDER BY sbh.achieved_date DESC
    `;
    
    const beltHistory = await context.env.DB.prepare(beltHistoryQuery).bind(studentId).all();
    
    const studentWithDetails = {
      ...student,
      current_belt: student.current_belt_name ? {
        belt_name: student.current_belt_name,
        belt_color: student.current_belt_color,
        level_order: student.current_belt_order
      } : null,
      belt_history: beltHistory.results
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: studentWithDetails
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error fetching student:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch student'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT /api/students/{id} - Update student
async function updateStudent(context: RequestContext): Promise<Response> {
  try {
    const studentId = context.params?.id;
    if (!studentId || isNaN(parseInt(studentId))) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_ID',
        message: 'Valid student ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data: UpdateStudentRequest = await context.request.json();
    
    // Validate data if provided
    if (Object.keys(data).length > 0) {
      const validation = validateStudentData({ ...data, first_name: data.first_name || 'dummy', last_name: data.last_name || 'dummy', date_of_birth: data.date_of_birth || '2000-01-01', gender: data.gender || 'Male' });
      if (!validation.isValid && (data.first_name || data.last_name || data.date_of_birth || data.gender || data.email)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Invalid student data',
          details: { field_errors: validation.errors }
        }), {
          status: 422,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Check if student exists
    const existing = await context.env.DB.prepare('SELECT id FROM students WHERE id = ?').bind(studentId).first();
    if (!existing) {
      return new Response(JSON.stringify({
        success: false,
        error: 'NOT_FOUND',
        message: 'Student not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Build update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    if (data.first_name !== undefined) {
      updateFields.push('first_name = ?');
      updateValues.push(data.first_name);
    }
    if (data.last_name !== undefined) {
      updateFields.push('last_name = ?');
      updateValues.push(data.last_name);
    }
    if (data.date_of_birth !== undefined) {
      updateFields.push('date_of_birth = ?');
      updateValues.push(data.date_of_birth);
    }
    if (data.gender !== undefined) {
      updateFields.push('gender = ?');
      updateValues.push(data.gender);
    }
    if (data.phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(data.phone);
    }
    if (data.email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(data.email);
    }
    if (data.status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(data.status);
    }
    
    if (updateFields.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'NO_UPDATES',
        message: 'No fields to update'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(studentId);
    
    const updateQuery = `UPDATE students SET ${updateFields.join(', ')} WHERE id = ?`;
    await context.env.DB.prepare(updateQuery).bind(...updateValues).run();
    
    // Fetch updated student
    const updatedStudent = await context.env.DB.prepare('SELECT * FROM students WHERE id = ?').bind(studentId).first();
    
    return new Response(JSON.stringify({
      success: true,
      data: updatedStudent,
      message: 'Student updated successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error updating student:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to update student'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE /api/students/{id} - Soft delete student
async function deleteStudent(context: RequestContext): Promise<Response> {
  try {
    const studentId = context.params?.id;
    if (!studentId || isNaN(parseInt(studentId))) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_ID',
        message: 'Valid student ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if student exists
    const existing = await context.env.DB.prepare('SELECT id FROM students WHERE id = ?').bind(studentId).first();
    if (!existing) {
      return new Response(JSON.stringify({
        success: false,
        error: 'NOT_FOUND',
        message: 'Student not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Soft delete (mark as inactive)
    await context.env.DB.prepare(
      'UPDATE students SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind('Inactive', studentId).run();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Student deleted successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error deleting student:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to delete student'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Main handler function
export async function onRequest(context: any): Promise<Response> {
  const { request, env, params } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // 🔐 AUTHENTICATION REQUIRED
    let currentUser;
    try {
      currentUser = await requireAuth(request, env);
    } catch (authError) {
      return new Response(JSON.stringify({
        success: false,
        error: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication required to access student data'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 🛡️ ROLE-BASED ACCESS CONTROL
    // Only admin and coach can manage students
    if (!['admin', 'coach'].includes(currentUser.role)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INSUFFICIENT_PERMISSIONS',
        message: 'Insufficient permissions to access student data'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const ctx: RequestContext = { request, env, params };
    
    switch (request.method) {
      case 'GET':
        return params?.id ? await getStudent(ctx) : await getStudents(ctx);
      case 'POST':
        // Only admin can create students
        if (currentUser.role !== 'admin') {
          return new Response(JSON.stringify({
            success: false,
            error: 'INSUFFICIENT_PERMISSIONS',
            message: 'Only administrators can create students'
          }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        return await createStudent(ctx);
      case 'PUT':
        // Only admin can update students
        if (currentUser.role !== 'admin') {
          return new Response(JSON.stringify({
            success: false,
            error: 'INSUFFICIENT_PERMISSIONS',
            message: 'Only administrators can update students'
          }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        return await updateStudent(ctx);
      case 'DELETE':
        // Only admin can delete students
        if (currentUser.role !== 'admin') {
          return new Response(JSON.stringify({
            success: false,
            error: 'INSUFFICIENT_PERMISSIONS',
            message: 'Only administrators can delete students'
          }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        return await deleteStudent(ctx);
      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'METHOD_NOT_ALLOWED',
          message: 'Method not allowed'
        }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
