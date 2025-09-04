/**
 * Classes Management Page (Admin)
 * 课程管理页面 - 管理员视图
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  UserCheck,
  CheckCircle
} from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { FilterBar, classFilters } from '@/components/ui/FilterBar';
import { LoadingPage } from '@/components/ui/Loading';
import { ErrorPage } from '@/components/ui/ErrorStates';
import { EmptyClasses } from '@/components/ui/EmptyStates';
import { useToast } from '@/components/ui/Toast';
import { classesApi } from '@/lib/api-client';

interface ClassItem {
  id: number;
  class_name: string;
  location: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_enrollment: number;
  instructor_name: string;
  instructor_id: number;
  status: 'Active' | 'Inactive';
  belt_levels: string[];
  age_group: string;
  monthly_fee: number;
  created_at: string;
}

export default function ClassesManagementPage() {
  const router = useRouter();
  const { success, error } = useToast();
  
  // 状态管理
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  
  // 筛选和分页状态
  const [filters, setFilters] = useState({
    search: '',
    day_of_week: [],
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false
  });

  // 加载课程数据
  const loadClasses = async () => {
    try {
      setLoading(true);
      setErrorState(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // 清除空值
      Object.keys(params).forEach(key => {
        if (!params[key as keyof typeof params] || 
            (Array.isArray(params[key as keyof typeof params]) && 
             (params[key as keyof typeof params] as any[]).length === 0)) {
          delete params[key as keyof typeof params];
        }
      });

      const response = await classesApi.list(params);
      
      if (response.success && response.data) {
        setClasses(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error(response.message || 'Failed to load classes');
      }
    } catch (err) {
      console.error('Error loading classes:', err);
      setErrorState(err instanceof Error ? err.message : 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadClasses();
  }, [pagination.page]);

  // 筛选变化时重新加载
  useEffect(() => {
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    } else {
      loadClasses();
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
      day_of_week: [],
      status: ''
    });
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // 处理选择变化
  const handleSelectionChange = (selectedRowKeys: string[]) => {
    setSelectedClasses(selectedRowKeys);
  };

  // 删除课程
  const handleDeleteClass = async (classId: number, className: string) => {
    if (!confirm(`Are you sure you want to delete "${className}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await classesApi.delete(classId);
      if (response.success) {
        success('Class Deleted', `${className} has been removed successfully.`);
        loadClasses();
      } else {
        throw new Error(response.message || 'Failed to delete class');
      }
    } catch (err) {
      console.error('Error deleting class:', err);
      error('Delete Failed', err instanceof Error ? err.message : 'Failed to delete class');
    }
  };

  // 表格列定义
  const columns: Column<ClassItem>[] = [
    {
      key: 'class_name',
      title: 'Class Name',
      dataIndex: 'class_name',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{record.age_group}</div>
        </div>
      )
    },
    {
      key: 'schedule',
      title: 'Schedule',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div>
            <div className="font-medium">{record.day_of_week}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {record.start_time} - {record.end_time}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      title: 'Location',
      dataIndex: 'location',
      render: (value) => (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'instructor',
      title: 'Instructor',
      dataIndex: 'instructor_name',
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'enrollment',
      title: 'Enrollment',
      render: (_, record) => (
        <div className="text-center">
          <div className="font-medium">
            {record.current_enrollment} / {record.max_capacity}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ 
                width: `${Math.min((record.current_enrollment / record.max_capacity) * 100, 100)}%` 
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round((record.current_enrollment / record.max_capacity) * 100)}% full
          </div>
        </div>
      )
    },
    {
      key: 'monthly_fee',
      title: 'Monthly Fee',
      dataIndex: 'monthly_fee',
      render: (value) => (
        <div className="font-medium">${value}</div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
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
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push(`/admin/classes/${record.id}`)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => router.push(`/admin/classes/${record.id}/attendance`)}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="Take Attendance"
          >
            <UserCheck className="h-4 w-4" />
          </button>
          <button
            onClick={() => {/* TODO: 打开编辑页 */}}
            className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
            title="Edit Class"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteClass(record.id, record.class_name)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Class"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return <LoadingPage message="Loading classes..." />;
  }

  if (errorState) {
    return (
      <ErrorPage
        title="Failed to Load Classes"
        message={errorState}
        onRetry={loadClasses}
      />
    );
  }

  const totalEnrollment = classes.reduce((sum, cls) => sum + cls.current_enrollment, 0);
  const totalCapacity = classes.reduce((sum, cls) => sum + cls.max_capacity, 0);
  const activeClasses = classes.filter(cls => cls.status === 'Active').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Classes Management</h1>
              <p className="mt-2 text-gray-600">
                Manage class schedules, enrollment, and attendance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {selectedClasses.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedClasses.length} selected
                  </span>
                  {/* TODO: 实现批量操作
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200">
                    Delete Selected
                  </button>
                  */}
                </div>
              )}
              <button 
                onClick={() => router.push('/admin/classes/new')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterBar
            filters={classFilters}
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
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-lg font-semibold text-gray-900">{classes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Classes</p>
                <p className="text-lg font-semibold text-gray-900">{activeClasses}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Enrollment</p>
                <p className="text-lg font-semibold text-gray-900">{totalEnrollment}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Capacity Utilization</p>
                <p className="text-lg font-semibold text-gray-900">
                  {totalCapacity > 0 ? Math.round((totalEnrollment / totalCapacity) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {classes.length === 0 && !loading ? (
          <EmptyClasses onAddClass={() => router.push('/admin/classes/new')} />
        ) : (
          <DataTable
            columns={columns}
            data={classes}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            rowSelection={{
              selectedRowKeys: selectedClasses,
              onChange: handleSelectionChange
            }}
            onRowClick={(record) => {
              router.push(`/admin/classes/${record.id}`);
            }}
          />
        )}
      </div>
    </div>
  );
}
