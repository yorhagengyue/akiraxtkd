// API Client for Akira X Taekwondo Backend
// Frontend utility functions for API calls

import { Student, CreateStudentRequest, UpdateStudentRequest, ApiResponse, PaginatedResponse } from '../types/database';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://akiraxtkd.pages.dev/api'
  : 'http://localhost:8788/api';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Students API
export const studentsApi = {
  // Get students with pagination and filtering
  async getStudents(params: {
    page?: number;
    limit?: number;
    status?: string;
    gender?: string;
    search?: string;
    sort_field?: string;
    sort_order?: 'ASC' | 'DESC';
  } = {}): Promise<PaginatedResponse<Student>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/students${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiRequest<PaginatedResponse<Student>>(endpoint);
    return response.data!;
  },

  // Get specific student by ID
  async getStudent(id: number): Promise<Student> {
    const response = await apiRequest<Student>(`/students/${id}`);
    return response.data!;
  },

  // Create new student
  async createStudent(studentData: CreateStudentRequest): Promise<Student> {
    const response = await apiRequest<Student>('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
    return response.data!;
  },

  // Update student
  async updateStudent(id: number, studentData: UpdateStudentRequest): Promise<Student> {
    const response = await apiRequest<Student>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
    return response.data!;
  },

  // Delete student (soft delete)
  async deleteStudent(id: number): Promise<void> {
    await apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
  },

  // Get student's belt history
  async getStudentBeltHistory(id: number) {
    const response = await apiRequest(`/students/${id}/belt-history`);
    return response.data;
  },

  // Get student's attendance
  async getStudentAttendance(id: number, params: {
    date_from?: string;
    date_to?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    
    const queryString = searchParams.toString();
    const endpoint = `/students/${id}/attendance${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiRequest(endpoint);
    return response.data;
  },

  // Get student's payments
  async getStudentPayments(id: number) {
    const response = await apiRequest(`/students/${id}/payments`);
    return response.data;
  },
};

// Classes API
export const classesApi = {
  async getClasses() {
    const response = await apiRequest('/classes');
    return response.data;
  },

  async getClass(id: number) {
    const response = await apiRequest(`/classes/${id}`);
    return response.data;
  },

  async getClassStudents(id: number) {
    const response = await apiRequest(`/classes/${id}/students`);
    return response.data;
  },

  async enrollStudent(classId: number, studentId: number) {
    const response = await apiRequest(`/classes/${classId}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId }),
    });
    return response.data;
  },
};

// Attendance API
export const attendanceApi = {
  async recordAttendance(data: {
    class_id: number;
    attendance_date: string;
    records: Array<{
      student_id: number;
      status: 'Present' | 'Absent' | 'Late' | 'Excused';
      arrival_time?: string;
      departure_time?: string;
      notes?: string;
    }>;
  }) {
    const response = await apiRequest('/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async getAttendance(params: {
    class_id?: number;
    student_id?: number;
    date_from?: string;
    date_to?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    
    const queryString = searchParams.toString();
    const endpoint = `/attendance${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiRequest(endpoint);
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  async getStats() {
    const response = await apiRequest('/dashboard/stats');
    return response.data;
  },

  async getRecentActivities() {
    const response = await apiRequest('/dashboard/recent-activities');
    return response.data;
  },
};

// Belt System API
export const beltsApi = {
  async getBeltLevels() {
    const response = await apiRequest('/belts');
    return response.data;
  },

  async promoteStudent(data: {
    student_id: number;
    new_belt_level_id: number;
    achieved_date: string;
    graded_by?: string;
    test_score?: number;
    comments?: string;
  }) {
    const response = await apiRequest(`/students/${data.student_id}/promote`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },
};

// Payments API
export const paymentsApi = {
  async getPayments(params: {
    student_id?: number;
    status?: string;
    date_from?: string;
    date_to?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    
    const queryString = searchParams.toString();
    const endpoint = `/payments${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiRequest(endpoint);
    return response.data;
  },

  async createPayment(data: {
    student_id: number;
    amount: number;
    payment_type: string;
    payment_method: string;
    payment_date: string;
    due_date?: string;
    transaction_id?: string;
    notes?: string;
  }) {
    const response = await apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async updatePaymentStatus(id: number, status: string) {
    const response = await apiRequest(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data;
  },
};

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Type guards and utilities
export function isApiError(error: any): error is ApiError {
  return error instanceof ApiError;
}

export function handleApiError(error: any) {
  if (isApiError(error)) {
    // Handle specific API errors
    switch (error.code) {
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again.';
      case 'NOT_FOUND':
        return 'The requested resource was not found.';
      case 'UNAUTHORIZED':
        return 'You are not authorized to perform this action.';
      default:
        return error.message;
    }
  }
  
  // Handle network or other errors
  return 'An unexpected error occurred. Please try again.';
}
