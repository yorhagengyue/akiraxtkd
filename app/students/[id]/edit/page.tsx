/**
 * Edit Student Page
 * 编辑学员页面
 */

'use client';
export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StudentForm from '@/components/students/StudentForm';
import { LoadingPage } from '@/components/ui/Loading';
import { ErrorPage } from '@/components/ui/ErrorStates';
import { useToast } from '@/components/ui/Toast';
import { studentsApi } from '@/lib/api-client';

interface StudentFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | '';
  phone: string;
  email: string;
  address: string;
  postal_code: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  belt_level_id: number | '';
  status: 'Active' | 'Inactive';
  notes?: string;
}

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useToast();
  
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  const studentId = parseInt(params.id as string);

  // 加载学员数据
  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        setErrorState(null);
        
        const response = await studentsApi.get(studentId);
        
        if (response.success && response.data) {
          setStudent(response.data);
        } else {
          throw new Error(response.message || 'Failed to load student');
        }
      } catch (err) {
        console.error('Error loading student:', err);
        setErrorState(err instanceof Error ? err.message : 'Failed to load student');
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(studentId)) {
      loadStudent();
    } else {
      setErrorState('Invalid student ID');
      setLoading(false);
    }
  }, [studentId]);

  // 处理表单提交
  const handleSubmit = async (formData: StudentFormData) => {
    try {
      setSaving(true);
      
      // 转换数据格式
      const updateData = {
        ...formData,
        belt_level_id: Number(formData.belt_level_id)
      };

      const response = await studentsApi.update(studentId, updateData);
      
      if (response.success) {
        success('Student Updated', `${formData.first_name} ${formData.last_name} has been updated successfully!`);
        
        // 重定向到学员详情页
        router.push(`/students/${studentId}`);
      } else {
        throw new Error(response.message || 'Failed to update student');
      }
    } catch (err) {
      console.error('Error updating student:', err);
      error('Update Failed', err instanceof Error ? err.message : 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/students/${studentId}`);
  };

  if (loading) {
    return <LoadingPage message="Loading student details..." />;
  }

  if (errorState) {
    return (
      <ErrorPage
        title="Failed to Load Student"
        message={errorState}
        onGoBack={() => router.push('/students')}
      />
    );
  }

  if (!student) {
    return (
      <ErrorPage
        title="Student Not Found"
        message="The student you're trying to edit doesn't exist."
        onGoBack={() => router.push('/students')}
      />
    );
  }

  // 准备表单初始数据
  const initialData: Partial<StudentFormData> = {
    first_name: student.first_name,
    last_name: student.last_name,
    date_of_birth: student.date_of_birth,
    gender: student.gender,
    phone: student.phone || '',
    email: student.email || '',
    address: student.address || '',
    postal_code: student.postal_code || '',
    emergency_contact_name: student.emergency_contact_name,
    emergency_contact_phone: student.emergency_contact_phone,
    emergency_contact_relationship: student.emergency_contact_relationship,
    belt_level_id: student.current_belt.id,
    status: student.status,
    notes: student.notes || ''
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <StudentForm
          studentId={studentId}
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>
    </div>
  );
}
