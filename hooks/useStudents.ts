// React Hooks for Students Management
// Custom hooks for frontend state management

'use client'
import { useState, useEffect, useCallback, useMemo } from 'react';
import { studentsApi, handleApiError } from '../lib/api';
import { Student, CreateStudentRequest, UpdateStudentRequest } from '../types/database';

// Hook for students list with pagination and filtering
export function useStudents(params: {
  page?: number;
  limit?: number;
  status?: string;
  gender?: string;
  search?: string;
  sort_field?: string;
  sort_order?: 'ASC' | 'DESC';
  autoFetch?: boolean;
} = {}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });

  const { autoFetch = true, ...apiParams } = params;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await studentsApi.getStudents(apiParams);
      setStudents(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(apiParams)]);

  useEffect(() => {
    if (autoFetch) {
      fetchStudents();
    }
  }, [fetchStudents, autoFetch]);

  const refetch = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    pagination,
    refetch,
  };
}

// Hook for single student management
export function useStudent(id: number | null, autoFetch: boolean = true) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = useCallback(async () => {
    if (!id) {
      setStudent(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await studentsApi.getStudent(id);
      setStudent(response);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setStudent(null);
      console.error('Error fetching student:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchStudent();
    }
  }, [fetchStudent, autoFetch]);

  const refetch = useCallback(() => {
    fetchStudent();
  }, [fetchStudent]);

  return {
    student,
    loading,
    error,
    refetch,
  };
}

// Hook for creating students
export function useCreateStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStudent = useCallback(async (studentData: CreateStudentRequest): Promise<Student | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newStudent = await studentsApi.createStudent(studentData);
      return newStudent;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error creating student:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createStudent,
    loading,
    error,
    clearError: () => setError(null),
  };
}

// Hook for updating students
export function useUpdateStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStudent = useCallback(async (
    id: number, 
    studentData: UpdateStudentRequest
  ): Promise<Student | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedStudent = await studentsApi.updateStudent(id, studentData);
      return updatedStudent;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error updating student:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateStudent,
    loading,
    error,
    clearError: () => setError(null),
  };
}

// Hook for deleting students
export function useDeleteStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteStudent = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await studentsApi.deleteStudent(id);
      return true;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error deleting student:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteStudent,
    loading,
    error,
    clearError: () => setError(null),
  };
}

// Hook for student search with debouncing
export function useStudentSearch(initialQuery: string = '', debounceMs: number = 300) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Use the students hook with the debounced query
  const {
    students,
    loading,
    error,
    pagination,
    refetch,
  } = useStudents({
    search: debouncedQuery,
    autoFetch: debouncedQuery.length > 2 || debouncedQuery.length === 0,
  });

  return {
    query,
    setQuery,
    students,
    loading,
    error,
    pagination,
    refetch,
  };
}

// Hook for student statistics
export function useStudentStats() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    recent: 0,
    by_belt: {} as Record<string, number>,
    by_gender: {} as Record<string, number>,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get all students to calculate stats (in a real app, this would be a dedicated endpoint)
      const response = await studentsApi.getStudents({ limit: 1000 });
      const allStudents = response.data;
      
      const total = allStudents.length;
      const active = allStudents.filter(s => s.status === 'Active').length;
      const inactive = allStudents.filter(s => s.status !== 'Active').length;
      
      // Recent students (joined in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recent = allStudents.filter(s => 
        new Date(s.joined_date) > thirtyDaysAgo
      ).length;
      
      // Group by belt (using current_belt if available)
      const by_belt: Record<string, number> = {};
      allStudents.forEach(student => {
        const belt = (student as any).current_belt?.belt_name || 'Unassigned';
        by_belt[belt] = (by_belt[belt] || 0) + 1;
      });
      
      // Group by gender
      const by_gender: Record<string, number> = {};
      allStudents.forEach(student => {
        by_gender[student.gender] = (by_gender[student.gender] || 0) + 1;
      });
      
      setStats({
        total,
        active,
        inactive,
        recent,
        by_belt,
        by_gender,
      });
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching student stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

// Hook for managing student filters
export function useStudentFilters() {
  const [filters, setFilters] = useState({
    status: '',
    gender: '',
    search: '',
    sort_field: 'created_at',
    sort_order: 'DESC' as 'ASC' | 'DESC',
  });

  const updateFilter = useCallback((key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      status: '',
      gender: '',
      search: '',
      sort_field: 'created_at',
      sort_order: 'DESC',
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return filters.status !== '' || filters.gender !== '' || filters.search !== '';
  }, [filters]);

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
}

// Utility hook for form validation
export function useStudentValidation() {
  const validateStudent = useCallback((data: Partial<CreateStudentRequest | UpdateStudentRequest>) => {
    const errors: Record<string, string> = {};
    
    if (data.first_name !== undefined) {
      if (!data.first_name || data.first_name.trim().length === 0) {
        errors.first_name = 'First name is required';
      } else if (data.first_name.length > 50) {
        errors.first_name = 'First name must be 50 characters or less';
      }
    }
    
    if (data.last_name !== undefined) {
      if (!data.last_name || data.last_name.trim().length === 0) {
        errors.last_name = 'Last name is required';
      } else if (data.last_name.length > 50) {
        errors.last_name = 'Last name must be 50 characters or less';
      }
    }
    
    if (data.date_of_birth !== undefined) {
      if (!data.date_of_birth) {
        errors.date_of_birth = 'Date of birth is required';
      } else {
        const birthDate = new Date(data.date_of_birth);
        const today = new Date();
        if (birthDate > today) {
          errors.date_of_birth = 'Date of birth cannot be in the future';
        }
        if (birthDate < new Date('1900-01-01')) {
          errors.date_of_birth = 'Please enter a valid date of birth';
        }
      }
    }
    
    if (data.gender !== undefined) {
      if (!data.gender || !['Male', 'Female', 'Other'].includes(data.gender)) {
        errors.gender = 'Please select a valid gender';
      }
    }
    
    if (data.email !== undefined && data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    if (data.phone !== undefined && data.phone) {
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(data.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
    }
    
    if (data.postal_code !== undefined && data.postal_code) {
      const postalRegex = /^\d{6}$/;
      if (!postalRegex.test(data.postal_code)) {
        errors.postal_code = 'Please enter a valid 6-digit postal code';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, []);

  return { validateStudent };
}
