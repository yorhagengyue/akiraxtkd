/**
 * Unified API Client
 * 统一的API客户端，处理认证、错误处理、重试机制
 */

import { API_ENDPOINTS, buildApiUrl } from './config';
import { authenticatedFetch, getValidAccessToken, clearTokens } from './auth-client';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: any;
}

/**
 * API客户端类
 */
class ApiClient {
  private baseUrl: string = '';

  constructor() {
    // 在客户端环境中初始化
    if (typeof window !== 'undefined') {
      this.baseUrl = window.location.origin;
    }
  }

  /**
   * 通用请求方法
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : buildApiUrl(endpoint);
      
      // 默认headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>
      };

      // 如果需要认证，添加Authorization header
      const token = await getValidAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers
      });

      // 处理认证失败
      if (response.status === 401) {
        console.warn('API request failed: Unauthorized');
        clearTokens();
        // 可以触发重定向到登录页
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Authentication required');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * GET请求
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * POST请求
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * PUT请求
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * DELETE请求
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// 导出单例实例
export const apiClient = new ApiClient();

/**
 * 学员相关API
 */
export const studentsApi = {
  // 获取学员列表
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'Active' | 'Inactive';
    gender?: 'Male' | 'Female';
    belt_level_id?: number;
    sort_field?: string;
    sort_order?: 'ASC' | 'DESC';
  }) => apiClient.get('students', params),

  // 获取学员详情
  get: (id: string | number) => apiClient.get(`students/${id}`),

  // 创建学员
  create: (data: any) => apiClient.post('students', data),

  // 更新学员
  update: (id: string | number, data: any) => apiClient.put(`students/${id}`, data),

  // 删除学员
  delete: (id: string | number) => apiClient.delete(`students/${id}`),

  // 获取学员腰带历史
  getBeltHistory: (id: string | number) => apiClient.get(`students/${id}/belt-history`),

  // 学员升级
  promote: (id: string | number, data: { new_belt_id: number; promotion_date?: string; notes?: string }) => 
    apiClient.post(`students/${id}/promote`, data),

  // 获取学员出勤记录
  getAttendance: (id: string | number, params?: { start_date?: string; end_date?: string }) => 
    apiClient.get(`students/${id}/attendance`, params),

  // 获取学员付费记录
  getPayments: (id: string | number) => apiClient.get(`students/${id}/payments`),

  // 获取学员注册的课程
  getClasses: (id: string | number) => apiClient.get(`students/${id}/classes`),
};

/**
 * 课程相关API
 */
export const classesApi = {
  // 获取课程列表
  list: (params?: {
    page?: number;
    limit?: number;
    location_id?: number;
    instructor_id?: number;
    day_of_week?: string;
    status?: 'Active' | 'Inactive';
  }) => apiClient.get('classes', params),

  // 获取课程详情
  get: (id: string | number) => apiClient.get(`classes/${id}`),

  // 创建课程
  create: (data: any) => apiClient.post('classes', data),

  // 更新课程
  update: (id: string | number, data: any) => apiClient.put(`classes/${id}`, data),

  // 删除课程
  delete: (id: string | number) => apiClient.delete(`classes/${id}`),

  // 获取课程学员列表
  getStudents: (id: string | number) => apiClient.get(`classes/${id}/students`),

  // 学员报名课程
  enroll: (id: string | number, data: { student_id: number }) => 
    apiClient.post(`classes/${id}/enroll`, data),

  // 取消学员课程注册
  unenroll: (id: string | number, studentId: string | number) => 
    apiClient.delete(`classes/${id}/students/${studentId}`),

  // 获取特定日期出勤情况
  getAttendance: (id: string | number, date: string) => 
    apiClient.get(`classes/${id}/attendance/${date}`),

  // 记录出勤
  recordAttendance: (id: string | number, data: any) => 
    apiClient.post(`classes/${id}/attendance`, data),
};

/**
 * 出勤相关API
 */
export const attendanceApi = {
  // 获取出勤记录
  list: (params?: {
    start_date?: string;
    end_date?: string;
    class_id?: number;
    student_id?: number;
    status?: 'Present' | 'Late' | 'Absent';
  }) => apiClient.get('attendance', params),

  // 批量记录出勤
  record: (data: {
    class_id: number;
    attendance_date: string;
    records: Array<{
      student_id: number;
      status: 'Present' | 'Late' | 'Absent';
      arrival_time?: string;
      notes?: string;
    }>;
  }) => apiClient.post('attendance', data),

  // 获取出勤统计
  getStatistics: (params?: {
    start_date?: string;
    end_date?: string;
    class_id?: number;
    student_id?: number;
  }) => apiClient.get('attendance/statistics', params),

  // 更新出勤记录
  update: (id: string | number, data: any) => apiClient.put(`attendance/${id}`, data),

  // 删除出勤记录
  delete: (id: string | number) => apiClient.delete(`attendance/${id}`),
};

/**
 * 腰带相关API
 */
export const beltsApi = {
  // 获取所有腰带等级
  list: () => apiClient.get('belts'),

  // 获取腰带详情
  get: (id: string | number) => apiClient.get(`belts/${id}`),

  // 创建腰带等级
  create: (data: any) => apiClient.post('belts', data),

  // 更新腰带
  update: (id: string | number, data: any) => apiClient.put(`belts/${id}`, data),

  // 删除腰带
  delete: (id: string | number) => apiClient.delete(`belts/${id}`),

  // 获取腰带进度路径
  getProgression: () => apiClient.get('belts/progression'),
};

/**
 * Dashboard相关API
 */
export const dashboardApi = {
  admin: {
    getStats: () => apiClient.get('dashboard/admin'),
    getKpis: () => apiClient.get('dashboard/admin/kpis'),
    getActivities: () => apiClient.get('dashboard/admin/activities'),
    getRisks: () => apiClient.get('dashboard/admin/risks'),
  },
  coach: {
    getStats: () => apiClient.get('dashboard/coach'),
    getSessions: (params?: { date?: string }) => apiClient.get('dashboard/coach/sessions', params),
    getStudents: () => apiClient.get('dashboard/coach/students'),
  },
  student: {
    getOverview: () => apiClient.get('dashboard/student'),
    getClasses: () => apiClient.get('dashboard/student/classes'),
    getEvents: () => apiClient.get('dashboard/student/events'),
  },
};

export default apiClient;
