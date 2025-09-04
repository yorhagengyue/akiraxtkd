/**
 * New Student Page
 * 新建学员页面
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentForm from '@/components/students/StudentForm';
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

export default function NewStudentPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: StudentFormData) => {
    try {
      setLoading(true);
      
      // 转换数据格式以匹配API
      const apiData = {
        ...formData,
        belt_level_id: Number(formData.belt_level_id)
      };

      const response = await studentsApi.create(apiData);
      
      if (response.success) {
        success('Student Created', `${formData.first_name} ${formData.last_name} has been added successfully!`);
        
        // 重定向到学员详情页
        if (response.data?.id) {
          router.push(`/students/${response.data.id}`);
        } else {
          router.push('/students');
        }
      } else {
        throw new Error(response.message || 'Failed to create student');
      }
    } catch (err) {
      console.error('Error creating student:', err);
      error('Creation Failed', err instanceof Error ? err.message : 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/students');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <StudentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
}
