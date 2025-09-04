/**
 * Student Form Component
 * 学员新建/编辑表单
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { Input, Select, Textarea, FormGroup, FormActions, validateForm, FormErrors } from '@/components/ui/Form';
import { LoadingButton } from '@/components/ui/Loading';
import { useToast } from '@/components/ui/Toast';
import { studentsApi, beltsApi } from '@/lib/api-client';

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

interface StudentFormProps {
  studentId?: number;
  initialData?: Partial<StudentFormData>;
  onSubmit: (data: StudentFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const initialFormData: StudentFormData = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  postal_code: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relationship: '',
  belt_level_id: '',
  status: 'Active',
  notes: ''
};

export default function StudentForm({
  studentId,
  initialData,
  onSubmit,
  onCancel,
  loading = false
}: StudentFormProps) {
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState<StudentFormData>({
    ...initialFormData,
    ...initialData
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [belts, setBelts] = useState<Array<{ id: number; belt_name: string; level_order: number }>>([]);
  const [loadingBelts, setLoadingBelts] = useState(true);

  // 加载腰带等级选项
  useEffect(() => {
    const loadBelts = async () => {
      try {
        const response = await beltsApi.list();
        if (response.success && response.data) {
          setBelts(response.data.sort((a: any, b: any) => a.level_order - b.level_order));
        }
      } catch (err) {
        console.error('Failed to load belts:', err);
      } finally {
        setLoadingBelts(false);
      }
    };

    loadBelts();
  }, []);

  // 处理输入变化
  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除该字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 表单验证
  const validateFormData = (): boolean => {
    const validationRules = [
      { name: 'first_name', label: 'First Name', type: 'text' as const, required: true },
      { name: 'last_name', label: 'Last Name', type: 'text' as const, required: true },
      { name: 'date_of_birth', label: 'Date of Birth', type: 'date' as const, required: true },
      { name: 'gender', label: 'Gender', type: 'select' as const, required: true },
      { name: 'phone', label: 'Phone', type: 'tel' as const, required: true, 
        validation: { pattern: /^[\+]?[0-9\s\-\(\)]+$/, message: 'Invalid phone number format' } },
      { name: 'email', label: 'Email', type: 'email' as const, required: true,
        validation: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' } },
      { name: 'emergency_contact_name', label: 'Emergency Contact Name', type: 'text' as const, required: true },
      { name: 'emergency_contact_phone', label: 'Emergency Contact Phone', type: 'tel' as const, required: true },
      { name: 'emergency_contact_relationship', label: 'Emergency Contact Relationship', type: 'text' as const, required: true },
      { name: 'belt_level_id', label: 'Belt Level', type: 'select' as const, required: true }
    ];

    const formErrors = validateForm(formData, validationRules);
    
    // 额外验证：年龄不能超过当前日期
    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      if (birthDate > today) {
        formErrors.date_of_birth = 'Date of birth cannot be in the future';
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormData()) {
      error('Validation Error', 'Please correct the errors below');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  // 关系选项
  const relationshipOptions = [
    { label: 'Parent', value: 'Parent' },
    { label: 'Guardian', value: 'Guardian' },
    { label: 'Sibling', value: 'Sibling' },
    { label: 'Grandparent', value: 'Grandparent' },
    { label: 'Other', value: 'Other' }
  ];

  // 性别选项
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
  ];

  // 状态选项
  const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  // 腰带选项
  const beltOptions = belts.map(belt => ({
    label: belt.belt_name,
    value: belt.id.toString()
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {studentId ? 'Edit Student' : 'Add New Student'}
            </h2>
            <p className="text-sm text-gray-600">
              {studentId ? 'Update student information' : 'Enter student details to create a new record'}
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Information */}
        <FormGroup title="Basic Information" description="Student's personal details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              error={errors.first_name}
              required
              placeholder="Enter first name"
            />
            
            <Input
              label="Last Name"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              error={errors.last_name}
              required
              placeholder="Enter last name"
            />
            
            <Input
              type="date"
              label="Date of Birth"
              value={formData.date_of_birth}
              onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              error={errors.date_of_birth}
              required
            />
            
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              options={genderOptions}
              error={errors.gender}
              required
              placeholder="Select gender"
            />
          </div>
        </FormGroup>

        {/* Contact Information */}
        <FormGroup title="Contact Information" description="Phone, email and address details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="tel"
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              required
              placeholder="+65 8123 4567"
            />
            
            <Input
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
              placeholder="student@example.com"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                error={errors.address}
                placeholder="Enter full address"
              />
            </div>
            
            <Input
              label="Postal Code"
              value={formData.postal_code}
              onChange={(e) => handleInputChange('postal_code', e.target.value)}
              error={errors.postal_code}
              placeholder="123456"
            />
          </div>
        </FormGroup>

        {/* Emergency Contact */}
        <FormGroup title="Emergency Contact" description="Emergency contact person details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Name"
              value={formData.emergency_contact_name}
              onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
              error={errors.emergency_contact_name}
              required
              placeholder="Emergency contact name"
            />
            
            <Input
              type="tel"
              label="Contact Phone"
              value={formData.emergency_contact_phone}
              onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
              error={errors.emergency_contact_phone}
              required
              placeholder="+65 8765 4321"
            />
          </div>
          
          <Select
            label="Relationship"
            value={formData.emergency_contact_relationship}
            onChange={(e) => handleInputChange('emergency_contact_relationship', e.target.value)}
            options={relationshipOptions}
            error={errors.emergency_contact_relationship}
            required
            placeholder="Select relationship"
          />
        </FormGroup>

        {/* Academy Information */}
        <FormGroup title="Academy Information" description="Belt level and enrollment status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Initial Belt Level"
              value={formData.belt_level_id.toString()}
              onChange={(e) => handleInputChange('belt_level_id', parseInt(e.target.value))}
              options={beltOptions}
              error={errors.belt_level_id}
              required
              placeholder={loadingBelts ? "Loading belt levels..." : "Select belt level"}
              disabled={loadingBelts}
            />
            
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              options={statusOptions}
              error={errors.status}
              required
            />
          </div>
          
          <Textarea
            label="Notes"
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            error={errors.notes}
            placeholder="Additional notes about the student (optional)"
            rows={3}
          />
        </FormGroup>

        {/* Form Actions */}
        <FormActions>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            Cancel
          </button>
          
          <LoadingButton
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            {studentId ? 'Update Student' : 'Create Student'}
          </LoadingButton>
        </FormActions>
      </form>
    </div>
  );
}