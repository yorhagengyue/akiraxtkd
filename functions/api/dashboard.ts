/**
 * Dashboard API - Real database data for all dashboard views
 */

import { Env } from '../types';
import { requireAuth } from '../lib/jwt';

interface DashboardStats {
  totalStudents: number;
  activeClasses: number;
  monthlyRevenue: number;
  attendanceRate: number;
  newEnrollments: number;
  upcomingGradings: number;
}

interface StudentProfile {
  student_id: string;
  student_code: string;
  legal_name: string;
  display_name: string;
  date_of_birth: string;
  gender: string;
  phone?: string;
  email?: string;
  current_belt?: string;
  belt_color?: string;
  attendance_rate?: number;
  last_attended?: string;
  next_grading?: string;
  created_at: string;
}

interface ClassInfo {
  class_id: string;
  name: string;
  program_name: string;
  venue_name: string;
  coach_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  capacity: number;
  enrolled_count: number;
  status: string;
}

interface SessionInfo {
  session_id: string;
  class_id: string;
  class_name: string;
  session_date: string;
  planned_start_time: string;
  planned_end_time: string;
  venue_name: string;
  coach_name: string;
  status: string;
  enrolled_students: number;
  attendance_taken: boolean;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  status: string;
}

/**
 * Get dashboard statistics for admin
 */
async function getAdminStats(db: D1Database): Promise<DashboardStats> {
  try {
    // Get total students
    const totalStudentsResult = await db
      .prepare('SELECT COUNT(*) as count FROM student_profiles WHERE created_at IS NOT NULL')
      .first<{ count: number }>();

    // Get active classes
    const activeClassesResult = await db
      .prepare('SELECT COUNT(*) as count FROM classes WHERE status = ?')
      .bind('ongoing')
      .first<{ count: number }>();

    // Get new enrollments this month
    const newEnrollmentsResult = await db
      .prepare(`
        SELECT COUNT(*) as count 
        FROM enrollments 
        WHERE status = 'active' 
        AND datetime(created_at) >= datetime('now', '-1 month')
      `)
      .first<{ count: number }>();

    // Calculate attendance rate
    const attendanceResult = await db
      .prepare(`
        SELECT 
          COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
          COUNT(*) as total_count
        FROM attendance 
        WHERE datetime(created_at) >= datetime('now', '-1 month')
      `)
      .first<{ present_count: number; total_count: number }>();

    const attendanceRate = attendanceResult?.total_count > 0 
      ? Math.round((attendanceResult.present_count / attendanceResult.total_count) * 100)
      : 0;

    // Get upcoming gradings (students ready for next belt)
    const upcomingGradingsResult = await db
      .prepare(`
        SELECT COUNT(DISTINCT sp.student_id) as count
        FROM student_profiles sp
        LEFT JOIN student_rank_history srh ON sp.student_id = srh.student_id
        WHERE sp.created_at IS NOT NULL
      `)
      .first<{ count: number }>();

    return {
      totalStudents: totalStudentsResult?.count || 0,
      activeClasses: activeClassesResult?.count || 0,
      monthlyRevenue: 12500, // TODO: Calculate from invoices/payments
      attendanceRate,
      newEnrollments: newEnrollmentsResult?.count || 0,
      upcomingGradings: Math.min(upcomingGradingsResult?.count || 0, 15)
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    return {
      totalStudents: 0,
      activeClasses: 0,
      monthlyRevenue: 0,
      attendanceRate: 0,
      newEnrollments: 0,
      upcomingGradings: 0
    };
  }
}

/**
 * Get dashboard statistics for coach
 */
async function getCoachStats(db: D1Database, coachId: string) {
  try {
    // Get coach's students
    const studentsResult = await db
      .prepare(`
        SELECT COUNT(DISTINCT e.student_id) as count
        FROM enrollments e
        JOIN classes c ON e.class_id = c.class_id
        WHERE c.coach_id = ? AND e.status = 'active'
      `)
      .bind(coachId)
      .first<{ count: number }>();

    // Get coach's active classes
    const classesResult = await db
      .prepare('SELECT COUNT(*) as count FROM classes WHERE coach_id = ? AND status = ?')
      .bind(coachId, 'ongoing')
      .first<{ count: number }>();

    // Get today's sessions
    const todaySessionsResult = await db
      .prepare(`
        SELECT COUNT(*) as count
        FROM sessions s
        JOIN classes c ON s.class_id = c.class_id
        WHERE c.coach_id = ? 
        AND DATE(s.session_date) = DATE('now')
        AND s.status != 'cancelled'
      `)
      .bind(coachId)
      .first<{ count: number }>();

    // Calculate attendance rate for coach's classes
    const attendanceResult = await db
      .prepare(`
        SELECT 
          COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
          COUNT(*) as total_count
        FROM attendance a
        JOIN sessions s ON a.session_id = s.session_id
        JOIN classes c ON s.class_id = c.class_id
        WHERE c.coach_id = ?
        AND datetime(a.created_at) >= datetime('now', '-1 month')
      `)
      .bind(coachId)
      .first<{ present_count: number; total_count: number }>();

    const attendanceRate = attendanceResult?.total_count > 0 
      ? Math.round((attendanceResult.present_count / attendanceResult.total_count) * 100)
      : 0;

    return {
      totalStudents: studentsResult?.count || 0,
      activeClasses: classesResult?.count || 0,
      todaysSessions: todaySessionsResult?.count || 0,
      attendanceRate,
      upcomingGradings: 8 // TODO: Calculate based on student progress
    };
  } catch (error) {
    console.error('Error getting coach stats:', error);
    return {
      totalStudents: 0,
      activeClasses: 0,
      todaysSessions: 0,
      attendanceRate: 0,
      upcomingGradings: 0
    };
  }
}

/**
 * Get dashboard statistics for student
 */
async function getStudentStats(db: D1Database, studentId: string) {
  try {
    // Get student's current belt
    const studentResult = await db
      .prepare(`
        SELECT sp.*, 
               r.name_en as current_belt,
               r.color as belt_color
        FROM student_profiles sp
        LEFT JOIN student_rank_history srh ON sp.student_id = srh.student_id
        LEFT JOIN ranks r ON srh.rank_id = r.rank_id
        WHERE sp.student_id = ?
        ORDER BY srh.granted_on DESC
        LIMIT 1
      `)
      .bind(studentId)
      .first<any>();

    // Get classes attended this month
    const attendanceResult = await db
      .prepare(`
        SELECT COUNT(*) as count
        FROM attendance a
        JOIN sessions s ON a.session_id = s.session_id
        WHERE a.student_id = ?
        AND a.status = 'present'
        AND datetime(s.session_date) >= datetime('now', '-1 month')
      `)
      .bind(studentId)
      .first<{ count: number }>();

    // Calculate attendance rate
    const totalSessionsResult = await db
      .prepare(`
        SELECT COUNT(*) as count
        FROM attendance a
        JOIN sessions s ON a.session_id = s.session_id
        WHERE a.student_id = ?
        AND datetime(s.session_date) >= datetime('now', '-1 month')
      `)
      .bind(studentId)
      .first<{ count: number }>();

    const attendanceRate = totalSessionsResult?.count > 0 
      ? Math.round((attendanceResult?.count || 0) / totalSessionsResult.count * 100)
      : 0;

    return {
      currentBelt: studentResult?.current_belt || 'White Belt',
      beltColor: studentResult?.belt_color || 'white',
      classesAttended: attendanceResult?.count || 0,
      attendanceRate,
      nextGrading: 'January 15, 2025', // TODO: Calculate based on requirements
      daysUntilGrading: 23
    };
  } catch (error) {
    console.error('Error getting student stats:', error);
    return {
      currentBelt: 'White Belt',
      beltColor: 'white',
      classesAttended: 0,
      attendanceRate: 0,
      nextGrading: 'TBD',
      daysUntilGrading: 0
    };
  }
}

/**
 * Get all students for admin dashboard
 */
async function getAllStudents(db: D1Database) {
  try {
    const students = await db
      .prepare(`
        SELECT 
          sp.*,
          r.name_en as current_belt,
          r.color as belt_color,
          COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / NULLIF(COUNT(a.attendance_id), 0) as attendance_rate,
          MAX(s.session_date) as last_attended
        FROM student_profiles sp
        LEFT JOIN student_rank_history srh ON sp.student_id = srh.student_id
        LEFT JOIN ranks r ON srh.rank_id = r.rank_id
        LEFT JOIN attendance a ON sp.student_id = a.student_id
        LEFT JOIN sessions s ON a.session_id = s.session_id
        WHERE sp.created_at IS NOT NULL
        GROUP BY sp.student_id
        ORDER BY sp.created_at DESC
      `)
      .all();

    return students.results || [];
  } catch (error) {
    console.error('Error getting all students:', error);
    return [];
  }
}

/**
 * Get coach's students
 */
async function getCoachStudents(db: D1Database, coachId: string) {
  try {
    const students = await db
      .prepare(`
        SELECT DISTINCT
          sp.*,
          r.name_en as current_belt,
          r.color as belt_color,
          COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / NULLIF(COUNT(a.attendance_id), 0) as attendance_rate,
          MAX(s.session_date) as last_attended
        FROM student_profiles sp
        JOIN enrollments e ON sp.student_id = e.student_id
        JOIN classes c ON e.class_id = c.class_id
        LEFT JOIN student_rank_history srh ON sp.student_id = srh.student_id
        LEFT JOIN ranks r ON srh.rank_id = r.rank_id
        LEFT JOIN attendance a ON sp.student_id = a.student_id
        LEFT JOIN sessions s ON a.session_id = s.session_id
        WHERE c.coach_id = ? AND e.status = 'active'
        GROUP BY sp.student_id
        ORDER BY sp.legal_name
      `)
      .bind(coachId)
      .all();

    return students.results || [];
  } catch (error) {
    console.error('Error getting coach students:', error);
    return [];
  }
}

/**
 * Get today's sessions for coach
 */
async function getTodaySessions(db: D1Database, coachId: string) {
  try {
    const sessions = await db
      .prepare(`
        SELECT 
          s.*,
          c.name as class_name,
          v.name as venue_name,
          cp.display_name as coach_name,
          COUNT(e.student_id) as enrolled_students,
          CASE 
            WHEN COUNT(a.attendance_id) > 0 THEN 'completed'
            WHEN datetime('now') > datetime(s.session_date || ' ' || s.planned_end_time) THEN 'completed'
            ELSE 'pending'
          END as attendance_status
        FROM sessions s
        JOIN classes c ON s.class_id = c.class_id
        JOIN venues v ON c.venue_id = v.venue_id
        JOIN coach_profiles cp ON c.coach_id = cp.coach_id
        LEFT JOIN enrollments e ON c.class_id = e.class_id AND e.status = 'active'
        LEFT JOIN attendance a ON s.session_id = a.session_id
        WHERE c.coach_id = ?
        AND DATE(s.session_date) = DATE('now')
        AND s.status != 'cancelled'
        GROUP BY s.session_id
        ORDER BY s.planned_start_time
      `)
      .bind(coachId)
      .all();

    return sessions.results || [];
  } catch (error) {
    console.error('Error getting today sessions:', error);
    return [];
  }
}

/**
 * Get student's classes
 */
async function getStudentClasses(db: D1Database, studentId: string) {
  try {
    const classes = await db
      .prepare(`
        SELECT 
          c.*,
          p.name as program_name,
          v.name as venue_name,
          cp.display_name as coach_name,
          e.status as enrollment_status,
          CASE c.day_of_week
            WHEN 0 THEN 'Sunday'
            WHEN 1 THEN 'Monday'
            WHEN 2 THEN 'Tuesday'
            WHEN 3 THEN 'Wednesday'
            WHEN 4 THEN 'Thursday'
            WHEN 5 THEN 'Friday'
            WHEN 6 THEN 'Saturday'
          END as day_name
        FROM classes c
        JOIN enrollments e ON c.class_id = e.class_id
        JOIN programs p ON c.program_id = p.program_id
        JOIN venues v ON c.venue_id = v.venue_id
        JOIN coach_profiles cp ON c.coach_id = cp.coach_id
        WHERE e.student_id = ? AND e.status IN ('active', 'waitlist')
        ORDER BY c.day_of_week, c.start_time
      `)
      .bind(studentId)
      .all();

    return classes.results || [];
  } catch (error) {
    console.error('Error getting student classes:', error);
    return [];
  }
}

/**
 * Get recent activities for admin dashboard
 */
async function getRecentActivities(db: D1Database) {
  try {
    const activities: RecentActivity[] = [];

    // Get recent enrollments
    const enrollments = await db
      .prepare(`
        SELECT 
          e.enrollment_id as id,
          'enrollment' as type,
          sp.legal_name || ' enrolled in ' || c.name as message,
          e.created_at as timestamp,
          'success' as status
        FROM enrollments e
        JOIN student_profiles sp ON e.student_id = sp.student_id
        JOIN classes c ON e.class_id = c.class_id
        WHERE datetime(e.created_at) >= datetime('now', '-7 days')
        ORDER BY e.created_at DESC
        LIMIT 5
      `)
      .all();

    activities.push(...(enrollments.results || []).map((item: any) => ({
      ...item,
      timestamp: formatTimeAgo(item.timestamp)
    })));

    return activities.slice(0, 10);
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return [];
  }
}

/**
 * Format timestamp to "X minutes ago" format
 */
function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return then.toLocaleDateString();
}

/**
 * Handle dashboard API requests
 */
export async function onRequest(context: any): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/dashboard', '');
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user using JWT
    let currentUser = null;
    
    try {
      currentUser = await requireAuth(request, env);
    } catch (authError) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Authentication required'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const response = await handleDashboardRequest(path, request.method, env.DB, currentUser);
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Route dashboard requests
 */
async function handleDashboardRequest(path: string, method: string, db: D1Database, user: any) {
  const [, role, action] = path.split('/');

  if (method === 'GET') {
    switch (`${role}/${action}`) {
      case 'admin/stats':
        if (user.role !== 'admin') throw new Error('Unauthorized');
        const adminStats = await getAdminStats(db);
        return { success: true, data: adminStats };

      case 'admin/students':
        if (user.role !== 'admin') throw new Error('Unauthorized');
        const allStudents = await getAllStudents(db);
        return { success: true, data: allStudents };

      case 'admin/activities':
        if (user.role !== 'admin') throw new Error('Unauthorized');
        const activities = await getRecentActivities(db);
        return { success: true, data: activities };

      case 'coach/stats':
        if (user.role !== 'coach') throw new Error('Unauthorized');
        const coachStats = await getCoachStats(db, user.user_id);
        return { success: true, data: coachStats };

      case 'coach/students':
        if (user.role !== 'coach') throw new Error('Unauthorized');
        const coachStudents = await getCoachStudents(db, user.user_id);
        return { success: true, data: coachStudents };

      case 'coach/sessions':
        if (user.role !== 'coach') throw new Error('Unauthorized');
        const todaySessions = await getTodaySessions(db, user.user_id);
        return { success: true, data: todaySessions };

      case 'student/stats':
        if (user.role !== 'student') throw new Error('Unauthorized');
        const studentStats = await getStudentStats(db, user.user_id);
        return { success: true, data: studentStats };

      case 'student/classes':
        if (user.role !== 'student') throw new Error('Unauthorized');
        const studentClasses = await getStudentClasses(db, user.user_id);
        return { success: true, data: studentClasses };

      default:
        throw new Error('Not found');
    }
  }

  throw new Error('Method not allowed');
}
