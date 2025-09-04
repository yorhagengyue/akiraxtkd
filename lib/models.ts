/**
 * Database Models and Validation
 * 数据库模型和验证系统
 */

// 基础模型接口
export interface BaseModel {
  id: number;
  created_at: string;
  updated_at: string;
}

// 学员模型
export interface Student extends BaseModel {
  student_code: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female';
  phone?: string;
  email?: string;
  address?: string;
  postal_code?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  joined_date: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  current_belt_id: number;
  notes?: string;
}

// 学员创建请求
export interface CreateStudentRequest {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female';
  phone?: string;
  email?: string;
  address?: string;
  postal_code?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  belt_level_id: number;
  status?: 'Active' | 'Inactive';
  notes?: string;
}

// 学员更新请求
export interface UpdateStudentRequest {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: 'Male' | 'Female';
  phone?: string;
  email?: string;
  address?: string;
  postal_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  status?: 'Active' | 'Inactive' | 'Suspended';
  notes?: string;
}

// 腰带等级模型
export interface BeltLevel extends BaseModel {
  belt_name: string;
  belt_color: string;
  level_order: number;
  description?: string;
  requirements?: string;
}

// 课程模型
export interface Class extends BaseModel {
  class_name: string;
  description?: string;
  instructor_id: number;
  location_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  age_group?: string;
  belt_requirements?: string;
  monthly_fee: number;
  status: 'Active' | 'Inactive';
}

// 地点模型
export interface Location extends BaseModel {
  location_name: string;
  address: string;
  postal_code?: string;
  contact_person?: string;
  contact_phone?: string;
  facilities?: string;
  status: 'Active' | 'Inactive';
}

// 教练模型
export interface Instructor extends BaseModel {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  certifications?: string;
  specializations?: string;
  bio?: string;
  status: 'Active' | 'Inactive';
}

// 出勤记录模型
export interface AttendanceRecord extends BaseModel {
  student_id: number;
  class_id: number;
  attendance_date: string;
  status: 'Present' | 'Late' | 'Absent';
  arrival_time?: string;
  notes?: string;
}

// 课程注册模型
export interface ClassEnrollment extends BaseModel {
  student_id: number;
  class_id: number;
  enrollment_date: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Cancelled';
  notes?: string;
}

// 腰带升级记录模型
export interface BeltPromotion extends BaseModel {
  student_id: number;
  from_belt_id: number;
  to_belt_id: number;
  promotion_date: string;
  examiner?: string;
  notes?: string;
}

// 验证错误类
export class ValidationError extends Error {
  public readonly field?: string;
  public readonly code?: string;

  constructor(message: string, field?: string, code?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
  }
}

// 验证规则接口
export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'phone' | 'date' | 'enum';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: string[];
  custom?: (value: any) => boolean | string;
}

// 验证器类
export class Validator {
  // 验证单个字段
  static validateField(value: any, rules: ValidationRule, fieldName: string): void {
    // 必填验证
    if (rules.required && (value === undefined || value === null || value === '')) {
      throw new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED');
    }

    // 如果值为空且不是必填，跳过其他验证
    if (!rules.required && (value === undefined || value === null || value === '')) {
      return;
    }

    // 类型验证
    if (rules.type) {
      switch (rules.type) {
        case 'string':
          if (typeof value !== 'string') {
            throw new ValidationError(`${fieldName} must be a string`, fieldName, 'INVALID_TYPE');
          }
          break;
        case 'number':
          if (typeof value !== 'number' || isNaN(value)) {
            throw new ValidationError(`${fieldName} must be a valid number`, fieldName, 'INVALID_TYPE');
          }
          break;
        case 'email':
          if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new ValidationError(`${fieldName} must be a valid email address`, fieldName, 'INVALID_EMAIL');
          }
          break;
        case 'phone':
          if (typeof value !== 'string' || !/^[\+]?[0-9\s\-\(\)]+$/.test(value)) {
            throw new ValidationError(`${fieldName} must be a valid phone number`, fieldName, 'INVALID_PHONE');
          }
          break;
        case 'date':
          if (typeof value !== 'string' || isNaN(Date.parse(value))) {
            throw new ValidationError(`${fieldName} must be a valid date`, fieldName, 'INVALID_DATE');
          }
          break;
        case 'enum':
          if (rules.enum && !rules.enum.includes(value)) {
            throw new ValidationError(
              `${fieldName} must be one of: ${rules.enum.join(', ')}`, 
              fieldName, 
              'INVALID_ENUM'
            );
          }
          break;
      }
    }

    // 字符串长度验证
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        throw new ValidationError(
          `${fieldName} must be at least ${rules.minLength} characters long`, 
          fieldName, 
          'MIN_LENGTH'
        );
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        throw new ValidationError(
          `${fieldName} must be no more than ${rules.maxLength} characters long`, 
          fieldName, 
          'MAX_LENGTH'
        );
      }
    }

    // 数值范围验证
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        throw new ValidationError(`${fieldName} must be at least ${rules.min}`, fieldName, 'MIN_VALUE');
      }
      if (rules.max !== undefined && value > rules.max) {
        throw new ValidationError(`${fieldName} must be no more than ${rules.max}`, fieldName, 'MAX_VALUE');
      }
    }

    // 正则表达式验证
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      throw new ValidationError(`${fieldName} format is invalid`, fieldName, 'INVALID_FORMAT');
    }

    // 自定义验证
    if (rules.custom) {
      const result = rules.custom(value);
      if (result !== true) {
        const message = typeof result === 'string' ? result : `${fieldName} is invalid`;
        throw new ValidationError(message, fieldName, 'CUSTOM_VALIDATION');
      }
    }
  }

  // 验证对象
  static validateObject(data: any, schema: Record<string, ValidationRule>): void {
    const errors: ValidationError[] = [];

    for (const [fieldName, rules] of Object.entries(schema)) {
      try {
        this.validateField(data[fieldName], rules, fieldName);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(error);
        }
      }
    }

    if (errors.length > 0) {
      // 抛出第一个错误，或者可以创建一个包含所有错误的复合错误
      throw errors[0];
    }
  }
}

// 学员验证模式
export const studentValidationSchema: Record<string, ValidationRule> = {
  first_name: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 50
  },
  last_name: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 50
  },
  date_of_birth: {
    required: true,
    type: 'date',
    custom: (value) => {
      const date = new Date(value);
      const now = new Date();
      if (date > now) {
        return 'Date of birth cannot be in the future';
      }
      return true;
    }
  },
  gender: {
    required: true,
    type: 'enum',
    enum: ['Male', 'Female']
  },
  phone: {
    type: 'phone',
    maxLength: 20
  },
  email: {
    type: 'email',
    maxLength: 100
  },
  address: {
    type: 'string',
    maxLength: 200
  },
  postal_code: {
    type: 'string',
    pattern: /^\d{6}$/,
    maxLength: 10
  },
  emergency_contact_name: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100
  },
  emergency_contact_phone: {
    required: true,
    type: 'phone',
    maxLength: 20
  },
  emergency_contact_relationship: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 50
  },
  belt_level_id: {
    required: true,
    type: 'number',
    min: 1
  },
  status: {
    type: 'enum',
    enum: ['Active', 'Inactive', 'Suspended']
  },
  notes: {
    type: 'string',
    maxLength: 500
  }
};

// 课程验证模式
export const classValidationSchema: Record<string, ValidationRule> = {
  class_name: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100
  },
  description: {
    type: 'string',
    maxLength: 500
  },
  instructor_id: {
    required: true,
    type: 'number',
    min: 1
  },
  location_id: {
    required: true,
    type: 'number',
    min: 1
  },
  day_of_week: {
    required: true,
    type: 'enum',
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  start_time: {
    required: true,
    type: 'string',
    pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  end_time: {
    required: true,
    type: 'string',
    pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  max_capacity: {
    required: true,
    type: 'number',
    min: 1,
    max: 100
  },
  age_group: {
    type: 'string',
    maxLength: 50
  },
  belt_requirements: {
    type: 'string',
    maxLength: 200
  },
  monthly_fee: {
    required: true,
    type: 'number',
    min: 0
  },
  status: {
    type: 'enum',
    enum: ['Active', 'Inactive']
  }
};

// 出勤记录验证模式
export const attendanceValidationSchema: Record<string, ValidationRule> = {
  student_id: {
    required: true,
    type: 'number',
    min: 1
  },
  class_id: {
    required: true,
    type: 'number',
    min: 1
  },
  attendance_date: {
    required: true,
    type: 'date'
  },
  status: {
    required: true,
    type: 'enum',
    enum: ['Present', 'Late', 'Absent']
  },
  arrival_time: {
    type: 'string',
    pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  notes: {
    type: 'string',
    maxLength: 200
  }
};
