// Akira X Taekwondo Database Types
// TypeScript type definitions for database models

export type StudentStatus = 'Active' | 'Inactive' | 'Suspended' | 'Graduated';
export type Gender = 'Male' | 'Female' | 'Other';
export type BeltType = 'Solid' | 'Tip' | 'Stripe';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type ClassType = 'Regular' | 'Competition' | 'Private' | 'Seminar';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';
export type PaymentType = 'Monthly Fee' | 'Registration' | 'Belt Test' | 'Equipment' | 'Competition' | 'Other';
export type PaymentMethod = 'Cash' | 'Card' | 'Bank Transfer' | 'PayNow' | 'Online';
export type PaymentStatus = 'Pending' | 'Paid' | 'Overdue' | 'Refunded';
export type CompetitionType = 'Local' | 'National' | 'International';
export type CompetitionResult = 'Gold' | 'Silver' | 'Bronze' | 'Participant' | 'Did Not Place';
export type InstructorStatus = 'Active' | 'Inactive' | 'Part-time';
export type EnrollmentStatus = 'Active' | 'Paused' | 'Dropped';

// =====================================================
// Core Database Models
// =====================================================

export interface Student {
  id: number;
  student_code: string;
  first_name: string;
  last_name: string;
  full_name?: string; // Generated field
  date_of_birth: string; // ISO date string
  gender: Gender;
  phone?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  address?: string;
  postal_code?: string;
  joined_date: string; // ISO date string
  status: StudentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BeltLevel {
  id: number;
  belt_name: string;
  belt_color: string;
  belt_type: BeltType;
  level_order: number;
  description?: string;
  min_training_hours: number;
  min_classes_attended: number;
  requirements?: string;
  created_at: string;
}

export interface StudentBeltHistory {
  id: number;
  student_id: number;
  belt_level_id: number;
  achieved_date: string; // ISO date string
  graded_by?: string;
  test_score?: number;
  comments?: string;
  certificate_issued: boolean;
  created_at: string;
}

export interface Location {
  id: number;
  location_name: string;
  address: string;
  postal_code?: string;
  contact_phone?: string;
  facilities?: string; // JSON string
  capacity?: number;
  rental_cost?: number;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

export interface Instructor {
  id: number;
  instructor_code: string;
  first_name: string;
  last_name: string;
  full_name?: string; // Generated field
  phone?: string;
  email?: string;
  current_belt_level_id?: number;
  certification_level?: string;
  years_experience?: number;
  specializations?: string; // JSON string
  hire_date?: string; // ISO date string
  hourly_rate?: number;
  status: InstructorStatus;
  bio?: string;
  profile_image_url?: string;
  created_at: string;
}

export interface Class {
  id: number;
  class_name: string;
  day_of_week: DayOfWeek;
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  location_id?: number;
  instructor_id?: number;
  max_capacity: number;
  age_group?: string;
  skill_level: SkillLevel;
  class_type: ClassType;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface ClassEnrollment {
  id: number;
  student_id: number;
  class_id: number;
  enrollment_date: string; // ISO date string
  status: EnrollmentStatus;
  notes?: string;
  created_at: string;
}

export interface Attendance {
  id: number;
  student_id: number;
  class_id: number;
  attendance_date: string; // ISO date string
  status: AttendanceStatus;
  arrival_time?: string; // HH:MM format
  departure_time?: string; // HH:MM format
  notes?: string;
  recorded_by?: number; // instructor_id
  created_at: string;
}

export interface Payment {
  id: number;
  student_id: number;
  amount: number;
  currency: string;
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  payment_date: string; // ISO date string
  due_date?: string; // ISO date string
  status: PaymentStatus;
  transaction_id?: string;
  notes?: string;
  processed_by?: number; // instructor_id
  created_at: string;
}

export interface Competition {
  id: number;
  competition_name: string;
  competition_date: string; // ISO date string
  location?: string;
  organizer?: string;
  competition_type: CompetitionType;
  registration_deadline?: string; // ISO date string
  entry_fee?: number;
  description?: string;
  created_at: string;
}

export interface CompetitionParticipant {
  id: number;
  student_id: number;
  competition_id: number;
  category?: string;
  weight_division?: string;
  result?: CompetitionResult;
  points_scored?: number;
  notes?: string;
  created_at: string;
}

// =====================================================
// Extended Models with Relationships
// =====================================================

export interface StudentWithBelt extends Student {
  current_belt?: BeltLevel;
  belt_history?: StudentBeltHistory[];
}

export interface StudentWithClasses extends Student {
  enrolled_classes?: (ClassEnrollment & {
    class: Class & {
      location?: Location;
      instructor?: Instructor;
    };
  })[];
}

export interface ClassWithDetails extends Class {
  location?: Location;
  instructor?: Instructor;
  enrolled_students?: (ClassEnrollment & {
    student: Student;
  })[];
  enrollment_count?: number;
}

export interface AttendanceWithDetails extends Attendance {
  student?: Student;
  class?: Class;
  recorded_by_instructor?: Instructor;
}

export interface PaymentWithDetails extends Payment {
  student?: Student;
  processed_by_instructor?: Instructor;
}

// =====================================================
// API Request/Response Types
// =====================================================

export interface CreateStudentRequest {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  phone?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  address?: string;
  postal_code?: string;
  notes?: string;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  status?: StudentStatus;
}

export interface CreateAttendanceRequest {
  student_id: number;
  class_id: number;
  attendance_date: string;
  status: AttendanceStatus;
  arrival_time?: string;
  departure_time?: string;
  notes?: string;
}

export interface CreatePaymentRequest {
  student_id: number;
  amount: number;
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  payment_date: string;
  due_date?: string;
  transaction_id?: string;
  notes?: string;
}

export interface BeltPromotionRequest {
  student_id: number;
  new_belt_level_id: number;
  achieved_date: string;
  graded_by?: string;
  test_score?: number;
  comments?: string;
}

// =====================================================
// Database Query Options
// =====================================================

export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortOptions {
  field: string;
  order: 'ASC' | 'DESC';
}

export interface FilterOptions {
  status?: StudentStatus | StudentStatus[];
  gender?: Gender | Gender[];
  belt_level_id?: number | number[];
  class_id?: number | number[];
  date_from?: string;
  date_to?: string;
  search?: string; // For name/email search
}

export interface QueryOptions extends PaginationOptions {
  sort?: SortOptions;
  filters?: FilterOptions;
  include_relationships?: boolean;
}

// =====================================================
// API Response Types
// =====================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface DashboardStats {
  total_students: number;
  active_students: number;
  total_classes: number;
  total_instructors: number;
  recent_enrollments: number;
  upcoming_belt_tests: number;
  monthly_revenue: number;
  attendance_rate: number;
}

// =====================================================
// Cloudflare D1 Environment Binding
// =====================================================

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  APP_NAME: string;
  CONTACT_EMAIL: string;
  WHATSAPP_NUMBER: string;
}

