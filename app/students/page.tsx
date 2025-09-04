/**
 * Students Management Page
 * 学员管理页面 - 完整的CRUD功能
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Eye, Trash2, Award, Calendar, Phone } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { FilterBar, studentFilters } from '@/components/ui/FilterBar';
import { LoadingPage } from '@/components/ui/Loading';
import { ErrorPage } from '@/components/ui/ErrorStates';
import { EmptyStudents } from '@/components/ui/EmptyStates';
import { useToast } from '@/components/ui/Toast';
import { studentsApi } from '@/lib/api-client';

interface Student {
  id: number;
  student_code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  joined_date: string;
  current_belt: {
    id: number;
    belt_name: string;
    belt_color: string;
    level_order: number;
  };
  emergency_contact_name: string;
  emergency_contact_phone: string;
  classes_count: number;
  attendance_rate: number;
}

export default function StudentsPage() {
  const router = useRouter();
  const { success, error } = useToast();
  
  // 状态管理
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  // 筛选和分页状态
  const [filters, setFilters] = useState({
    search: '',
    status: '' as '' | 'Active' | 'Inactive',
    gender: '' as '' | 'Male' | 'Female',
    belt_level_id: '' as string
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false
  });
  const [sortField, setSortField] = useState<string>('joined_date');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // 加载学员数据
  const loadStudents = async () => {
    try {
      setLoading(true);
      setErrorState(null);
      
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sort_field: sortField,
        sort_order: sortOrder,
        search: filters.search || undefined,
        status: filters.status || undefined,
        gender: filters.gender || undefined,
        belt_level_id: filters.belt_level_id ? parseInt(filters.belt_level_id) : undefined
      };

      // 清除空值
      Object.keys(params).forEach(key => {
        if (!params[key as keyof typeof params]) {
          delete params[key as keyof typeof params];
        }
      });

      const response = await studentsApi.list(params);
      
      if (response.success && response.data) {
        setStudents(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error(response.message || 'Failed to load students');
      }
    } catch (err) {
      console.error('Error loading students:', err);
      setErrorState(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadStudents();
  }, [pagination.page, sortField, sortOrder]);

  // 筛选变化时重新加载（重置到第一页）
  useEffect(() => {
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    } else {
      loadStudents();
    }
  }, [filters]);

  // 处理筛选变化
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      gender: '',
      belt_level_id: ''
    });
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // 处理排序变化
  const handleSortChange = (field: string, order: 'ASC' | 'DESC') => {
    setSortField(field);
    setSortOrder(order);
  };

  // 处理选择变化
  const handleSelectionChange = (selectedRowKeys: string[]) => {
    setSelectedStudents(selectedRowKeys);
  };

  // 删除学员
  const handleDeleteStudent = async (studentId: number, studentName: string) => {
    if (!confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await studentsApi.delete(studentId);
      if (response.success) {
        success('Student Deleted', `${studentName} has been removed successfully.`);
        loadStudents(); // 重新加载数据
      } else {
        throw new Error(response.message || 'Failed to delete student');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      error('Delete Failed', err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  // 学员升级
  const handlePromoteStudent = async (studentId: number, studentName: string) => {
    // 这里应该打开升级对话框，暂时用简单的确认
    if (!confirm(`Promote ${studentName} to next belt level?`)) {
      return;
    }

    try {
      // 假设升级到下一个等级
      const currentStudent = students.find(s => s.id === studentId);
      if (!currentStudent) return;

      const response = await studentsApi.promote(studentId, {
        new_belt_id: currentStudent.current_belt.id + 1,
        promotion_date: new Date().toISOString().split('T')[0],
        notes: 'Promoted via admin panel'
      });

      if (response.success) {
        success('Student Promoted', `${studentName} has been promoted successfully!`);
        loadStudents(); // 重新加载数据
      } else {
        throw new Error(response.message || 'Failed to promote student');
      }
    } catch (err) {
      console.error('Error promoting student:', err);
      error('Promotion Failed', err instanceof Error ? err.message : 'Failed to promote student');
    }
  };

  // 表格列定义
  const columns: Column<Student>[] = [
    {
      key: 'student_code',
      title: 'Student Code',
      dataIndex: 'student_code',
      sortable: true,
      render: (value, record) => (
        <div className="font-medium text-blue-600">
          {value}
        </div>
      )
    },
    {
      key: 'full_name',
      title: 'Name',
      dataIndex: 'full_name',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-gray-600">
              {record.first_name.charAt(0)}{record.last_name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'age',
      title: 'Age',
      dataIndex: 'age',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">{record.gender}</div>
        </div>
      )
    },
    {
      key: 'current_belt',
      title: 'Belt Level',
      render: (_, record) => (
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-2 border"
            style={{ backgroundColor: record.current_belt.belt_color }}
          />
          <span className="text-sm font-medium">{record.current_belt.belt_name}</span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      render: (value) => (
        <span className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${value === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
          }
        `}>
          {value}
        </span>
      )
    },
    {
      key: 'classes_count',
      title: 'Classes',
      dataIndex: 'classes_count',
      render: (value, record) => (
        <div className="text-center">
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">{record.attendance_rate}% attendance</div>
        </div>
      )
    },
    {
      key: 'joined_date',
      title: 'Joined',
      dataIndex: 'joined_date',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-900">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push(`/students/${record.id}`)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => {/* TODO: 打开编辑页 */}}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="Edit Student"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePromoteStudent(record.id, record.full_name)}
            className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
            title="Promote Belt"
          >
            <Award className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteStudent(record.id, record.full_name)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Student"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return <LoadingPage message="Loading students..." />;
  }

  if (errorState) {
    return (
      <ErrorPage
        title="Failed to Load Students"
        message={errorState}
        onRetry={loadStudents}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Students</h1>
              <p className="mt-2 text-gray-600">
                Manage academy students and track their progress
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {selectedStudents.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedStudents.length} selected
                  </span>
                  {/* TODO: 实现批量操作
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200">
                    Delete Selected
                  </button>
                  */}
                </div>
              )}
              <button 
                onClick={() => router.push('/students/new')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterBar
            filters={studentFilters}
            values={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-lg font-semibold text-gray-900">{pagination.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-lg font-semibold text-gray-900">
                  {students.filter(s => s.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Phone className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                <p className="text-lg font-semibold text-gray-900">
                  {students.length > 0 
                    ? Math.round(students.reduce((sum, s) => sum + s.attendance_rate, 0) / students.length)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-lg font-semibold text-gray-900">
                  {students.filter(s => {
                    const joinedDate = new Date(s.joined_date);
                    const thisMonth = new Date();
                    return joinedDate.getMonth() === thisMonth.getMonth() && 
                           joinedDate.getFullYear() === thisMonth.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {students.length === 0 && !loading ? (
          <EmptyStudents onAddStudent={() => router.push('/students/new')} />
        ) : (
          <DataTable
            columns={columns}
            data={students}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
            sortField={sortField}
            sortOrder={sortOrder}
            rowSelection={{
              selectedRowKeys: selectedStudents,
              onChange: handleSelectionChange
            }}
            onRowClick={(record) => {
              router.push(`/students/${record.id}`);
            }}
          />
        )}
      </div>
    </div>
  );
}
