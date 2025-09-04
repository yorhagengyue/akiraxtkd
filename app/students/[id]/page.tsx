/**
 * Student Detail Page
 * 学员详情页面
 */

'use client';
export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Award, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  User,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import { LoadingPage } from '@/components/ui/Loading';
import { ErrorPage } from '@/components/ui/ErrorStates';
import { useToast } from '@/components/ui/Toast';
import { studentsApi } from '@/lib/api-client';

interface StudentDetail {
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
  address: string;
  postal_code: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  status: 'Active' | 'Inactive';
  joined_date: string;
  current_belt: {
    id: number;
    belt_name: string;
    belt_color: string;
    level_order: number;
  };
  belt_history: Array<{
    id: number;
    belt_name: string;
    belt_color: string;
    promotion_date: string;
    notes?: string;
  }>;
  classes: Array<{
    id: number;
    class_name: string;
    location: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    instructor_name: string;
  }>;
  attendance_stats: {
    total_sessions: number;
    attended: number;
    late: number;
    absent: number;
    attendance_rate: number;
  };
  recent_attendance: Array<{
    date: string;
    class_name: string;
    status: 'Present' | 'Late' | 'Absent';
    arrival_time?: string;
  }>;
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useToast();
  
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  const studentId = params.id as string;

  // 加载学员详情
  const loadStudentDetail = async () => {
    try {
      setLoading(true);
      setErrorState(null);
      
      const response = await studentsApi.get(studentId);
      
      if (response.success && response.data) {
        setStudent(response.data);
      } else {
        throw new Error(response.message || 'Failed to load student details');
      }
    } catch (err) {
      console.error('Error loading student:', err);
      setErrorState(err instanceof Error ? err.message : 'Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      loadStudentDetail();
    }
  }, [studentId]);

  // 学员升级
  const handlePromoteStudent = async () => {
    if (!student) return;
    
    if (!confirm(`Promote ${student.full_name} to the next belt level?`)) {
      return;
    }

    try {
      const response = await studentsApi.promote(student.id, {
        new_belt_id: student.current_belt.id + 1,
        promotion_date: new Date().toISOString().split('T')[0],
        notes: 'Promoted via student detail page'
      });

      if (response.success) {
        success('Student Promoted', `${student.full_name} has been promoted successfully!`);
        loadStudentDetail(); // 重新加载数据
      } else {
        throw new Error(response.message || 'Failed to promote student');
      }
    } catch (err) {
      console.error('Error promoting student:', err);
      error('Promotion Failed', err instanceof Error ? err.message : 'Failed to promote student');
    }
  };

  if (loading) {
    return <LoadingPage message="Loading student details..." />;
  }

  if (errorState) {
    return (
      <ErrorPage
        title="Failed to Load Student"
        message={errorState}
        onRetry={loadStudentDetail}
        onGoBack={() => router.push('/students')}
      />
    );
  }

  if (!student) {
    return (
      <ErrorPage
        title="Student Not Found"
        message="The student you're looking for doesn't exist or has been removed."
        onGoBack={() => router.push('/students')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/students')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{student.full_name}</h1>
                <p className="mt-1 text-gray-600">Student Code: {student.student_code}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handlePromoteStudent}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <Award className="h-4 w-4 mr-2" />
                Promote Belt
              </button>
              <button 
                onClick={() => router.push(`/students/${studentId}/edit`)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Student
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Student Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-blue-600">
                    {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{student.full_name}</h3>
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${student.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                    }
                  `}>
                    {student.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  Age {student.age} • {student.gender}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {new Date(student.joined_date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {student.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {student.email}
                </div>
                {student.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {student.address}
                    {student.postal_code && `, ${student.postal_code}`}
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">{student.emergency_contact_name}</span>
                  <span className="text-gray-500 ml-2">({student.emergency_contact_relationship})</span>
                </p>
                <p className="text-sm text-gray-600">{student.emergency_contact_phone}</p>
              </div>
            </div>

            {/* Current Belt */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Belt</h3>
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-full mr-3 border-2 border-gray-200"
                  style={{ backgroundColor: student.current_belt.belt_color }}
                />
                <div>
                  <p className="font-medium">{student.current_belt.belt_name}</p>
                  <p className="text-sm text-gray-500">Level {student.current_belt.level_order}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {student.attendance_stats.attendance_rate}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {student.attendance_stats.total_sessions}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Classes Enrolled</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {student.classes.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Classes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Enrolled Classes</h3>
              <div className="space-y-3">
                {student.classes.map((classItem) => (
                  <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{classItem.class_name}</p>
                      <p className="text-sm text-gray-600">
                        {classItem.day_of_week}s, {classItem.start_time} - {classItem.end_time}
                      </p>
                      <p className="text-sm text-gray-500">
                        {classItem.location} • Instructor: {classItem.instructor_name}
                      </p>
                    </div>
                  </div>
                ))}
                {student.classes.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No classes enrolled</p>
                )}
              </div>
            </div>

            {/* Recent Attendance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Attendance</h3>
              <div className="space-y-2">
                {student.recent_attendance.map((record, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium">{record.class_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                        {record.arrival_time && ` • Arrived at ${record.arrival_time}`}
                      </p>
                    </div>
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                        record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    `}>
                      {record.status}
                    </span>
                  </div>
                ))}
                {student.recent_attendance.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No recent attendance records</p>
                )}
              </div>
            </div>

            {/* Belt History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Belt Progression</h3>
              <div className="space-y-3">
                {student.belt_history.map((belt, index) => (
                  <div key={belt.id} className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full mr-3 border"
                      style={{ backgroundColor: belt.belt_color }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{belt.belt_name}</p>
                      <p className="text-sm text-gray-500">
                        Promoted on {new Date(belt.promotion_date).toLocaleDateString()}
                        {belt.notes && ` • ${belt.notes}`}
                      </p>
                    </div>
                    {index === 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                ))}
                {student.belt_history.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No belt progression history</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
