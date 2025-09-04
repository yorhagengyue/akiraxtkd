/**
 * Class Attendance Page
 * 课程出勤打卡页面
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Clock, 
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { LoadingPage } from '@/components/ui/Loading';
import { ErrorPage } from '@/components/ui/ErrorStates';
import { LoadingButton } from '@/components/ui/Loading';
import { useToast } from '@/components/ui/Toast';
import { classesApi, attendanceApi } from '@/lib/api-client';

interface Student {
  id: number;
  student_code: string;
  full_name: string;
  current_belt: {
    belt_name: string;
    belt_color: string;
  };
}

interface AttendanceRecord {
  student_id: number;
  status: 'Present' | 'Late' | 'Absent';
  arrival_time?: string;
  notes?: string;
}

interface ClassDetail {
  id: number;
  class_name: string;
  location: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  instructor_name: string;
  students: Student[];
}

export default function ClassAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useToast();
  
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceRecords, setAttendanceRecords] = useState<Record<number, AttendanceRecord>>({});

  const classId = params.id as string;

  // 加载课程详情和学员列表
  const loadClassDetail = async () => {
    try {
      setLoading(true);
      setErrorState(null);
      
      // 获取课程详情
      const classResponse = await classesApi.get(classId);
      if (!classResponse.success || !classResponse.data) {
        throw new Error('Failed to load class details');
      }

      // 获取课程学员列表
      const studentsResponse = await classesApi.getStudents(classId);
      if (!studentsResponse.success || !studentsResponse.data) {
        throw new Error('Failed to load class students');
      }

      const classData = {
        ...classResponse.data,
        students: studentsResponse.data
      };

      setClassDetail(classData);

      // 初始化出勤记录 - 默认为缺席
      const initialRecords: Record<number, AttendanceRecord> = {};
      classData.students.forEach((student: Student) => {
        initialRecords[student.id] = {
          student_id: student.id,
          status: 'Absent',
          arrival_time: '',
          notes: ''
        };
      });
      setAttendanceRecords(initialRecords);

      // 尝试加载已有的出勤记录
      await loadExistingAttendance(classData.id);

    } catch (err) {
      console.error('Error loading class:', err);
      setErrorState(err instanceof Error ? err.message : 'Failed to load class details');
    } finally {
      setLoading(false);
    }
  };

  // 加载已有的出勤记录
  const loadExistingAttendance = async (classId: number) => {
    try {
      const response = await classesApi.getAttendance(classId, attendanceDate);
      if (response.success && response.data && response.data.length > 0) {
        const existingRecords: Record<number, AttendanceRecord> = {};
        response.data.forEach((record: any) => {
          existingRecords[record.student_id] = {
            student_id: record.student_id,
            status: record.status,
            arrival_time: record.arrival_time || '',
            notes: record.notes || ''
          };
        });
        setAttendanceRecords(prev => ({ ...prev, ...existingRecords }));
      }
    } catch (err) {
      console.log('No existing attendance records found for this date');
    }
  };

  useEffect(() => {
    if (classId) {
      loadClassDetail();
    }
  }, [classId]);

  // 当日期改变时重新加载出勤记录
  useEffect(() => {
    if (classDetail) {
      loadExistingAttendance(classDetail.id);
    }
  }, [attendanceDate, classDetail]);

  // 更新单个学员的出勤状态
  const updateAttendanceRecord = (studentId: number, field: keyof AttendanceRecord, value: any) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  // 批量设置出勤状态
  const setAllAttendance = (status: 'Present' | 'Late' | 'Absent') => {
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    setAttendanceRecords(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(studentIdStr => {
        const studentId = parseInt(studentIdStr);
        updated[studentId] = {
          ...updated[studentId],
          status,
          arrival_time: status !== 'Absent' ? currentTime : ''
        };
      });
      return updated;
    });
  };

  // 保存出勤记录
  const saveAttendance = async () => {
    if (!classDetail) return;

    try {
      setSaving(true);

      const records = Object.values(attendanceRecords).map(record => ({
        student_id: record.student_id,
        status: record.status,
        arrival_time: record.arrival_time || undefined,
        notes: record.notes || undefined
      }));

      const response = await attendanceApi.record({
        class_id: classDetail.id,
        attendance_date: attendanceDate,
        records
      });

      if (response.success) {
        success('Attendance Saved', 'Attendance records have been saved successfully!');
      } else {
        throw new Error(response.message || 'Failed to save attendance');
      }
    } catch (err) {
      console.error('Error saving attendance:', err);
      error('Save Failed', err instanceof Error ? err.message : 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingPage message="Loading class details..." />;
  }

  if (errorState) {
    return (
      <ErrorPage
        title="Failed to Load Class"
        message={errorState}
        onRetry={loadClassDetail}
        onGoBack={() => router.push('/admin/classes')}
      />
    );
  }

  if (!classDetail) {
    return (
      <ErrorPage
        title="Class Not Found"
        message="The class you're looking for doesn't exist."
        onGoBack={() => router.push('/admin/classes')}
      />
    );
  }

  const presentCount = Object.values(attendanceRecords).filter(r => r.status === 'Present').length;
  const lateCount = Object.values(attendanceRecords).filter(r => r.status === 'Late').length;
  const absentCount = Object.values(attendanceRecords).filter(r => r.status === 'Absent').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/classes')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Take Attendance</h1>
                <p className="mt-1 text-gray-600">{classDetail.class_name}</p>
              </div>
            </div>
            <LoadingButton
              onClick={saveAttendance}
              loading={saving}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Attendance
            </LoadingButton>
          </div>
        </div>

        {/* Class Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Schedule</p>
                <p className="font-medium">{classDetail.day_of_week}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">{classDetail.start_time} - {classDetail.end_time}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Instructor</p>
                <p className="font-medium">{classDetail.instructor_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection and Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendance Date
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setAllAttendance('Present')}
                className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
              >
                Mark All Present
              </button>
              <button
                onClick={() => setAllAttendance('Absent')}
                className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-sm text-gray-600">Present</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
              <p className="text-sm text-gray-600">Late</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-sm text-gray-600">Absent</p>
            </div>
          </div>
        </div>

        {/* Students Attendance List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Students ({classDetail.students.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {classDetail.students.map((student) => {
              const record = attendanceRecords[student.id];
              if (!record) return null;

              return (
                <div key={student.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.full_name}</p>
                        <p className="text-sm text-gray-500">
                          {student.student_code} • {student.current_belt.belt_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Status Buttons */}
                      <div className="flex space-x-2">
                        {(['Present', 'Late', 'Absent'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              updateAttendanceRecord(student.id, 'status', status);
                              if (status !== 'Absent') {
                                const currentTime = new Date().toLocaleTimeString('en-US', { 
                                  hour12: false, 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                });
                                updateAttendanceRecord(student.id, 'arrival_time', currentTime);
                              } else {
                                updateAttendanceRecord(student.id, 'arrival_time', '');
                              }
                            }}
                            className={`
                              px-3 py-1 text-sm rounded-md font-medium transition-colors
                              ${record.status === status
                                ? status === 'Present' ? 'bg-green-600 text-white' :
                                  status === 'Late' ? 'bg-yellow-600 text-white' :
                                  'bg-red-600 text-white'
                                : status === 'Present' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                  status === 'Late' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                                  'bg-red-100 text-red-700 hover:bg-red-200'
                              }
                            `}
                          >
                            {status}
                          </button>
                        ))}
                      </div>

                      {/* Arrival Time Input */}
                      {(record.status === 'Present' || record.status === 'Late') && (
                        <input
                          type="time"
                          value={record.arrival_time || ''}
                          onChange={(e) => updateAttendanceRecord(student.id, 'arrival_time', e.target.value)}
                          className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Add notes (optional)"
                      value={record.notes || ''}
                      onChange={(e) => updateAttendanceRecord(student.id, 'notes', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button (Mobile) */}
        <div className="mt-6 sm:hidden">
          <LoadingButton
            onClick={saveAttendance}
            loading={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Attendance
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
