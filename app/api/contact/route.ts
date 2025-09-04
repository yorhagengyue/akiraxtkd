/**
 * Contact Form API
 * 联系表单提交处理
 */

export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { ValidationError, Validator } from '@/lib/models';

// 联系表单数据接口
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  class?: string;
  message: string;
}

// 验证模式
const contactValidationSchema = {
  name: {
    required: true,
    type: 'string' as const,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    type: 'email' as const,
    maxLength: 100
  },
  phone: {
    type: 'phone' as const,
    maxLength: 20
  },
  class: {
    type: 'string' as const,
    maxLength: 50
  },
  message: {
    required: true,
    type: 'string' as const,
    minLength: 10,
    maxLength: 1000
  }
};

// 简单的速率限制（内存存储，实际应用中应使用Redis或数据库）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15分钟
const RATE_LIMIT_MAX = 3; // 15分钟内最多3次提交

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // 重置或创建新记录
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  rateLimitStore.set(identifier, record);
  return true;
}

// 获取客户端IP（用于速率限制）
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  return 'unknown';
}

// 标准化错误响应
function createErrorResponse(error: any, status: number = 500) {
  console.error('Contact API Error:', error);

  if (error instanceof ValidationError) {
    return NextResponse.json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: error.message,
      field: error.field,
      code: error.code
    }, { status: 400 });
  }

  return NextResponse.json({
    success: false,
    error: 'INTERNAL_ERROR',
    message: error.message || 'An unexpected error occurred'
  }, { status });
}

// POST /api/contact - 提交联系表单
export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // 验证输入数据
    Validator.validateObject(body, contactValidationSchema);

    // 速率限制检查
    const clientIP = getClientIP(request);
    const rateLimitKey = `contact_${clientIP}`;
    
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many submissions. Please wait 15 minutes before trying again.',
        retry_after: 900 // 15 minutes in seconds
      }, { status: 429 });
    }

    // 清理和格式化数据
    const cleanedData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || null,
      class: body.class?.trim() || null,
      message: body.message.trim(),
      submitted_at: new Date().toISOString(),
      client_ip: clientIP,
      user_agent: request.headers.get('user-agent') || 'unknown'
    };

    // 在开发环境中，只记录到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Contact Form Submission:', {
        name: cleanedData.name,
        email: cleanedData.email,
        phone: cleanedData.phone,
        interested_class: cleanedData.class,
        message: cleanedData.message,
        timestamp: cleanedData.submitted_at
      });

      // 模拟处理延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      return NextResponse.json({
        success: true,
        message: 'Thank you for your message! We will get back to you within 24 hours.',
        data: {
          id: Math.random().toString(36).substr(2, 9),
          submitted_at: cleanedData.submitted_at,
          name: cleanedData.name,
          email: cleanedData.email
        }
      }, { status: 201 });
    }

    // 生产环境中的处理逻辑
    // TODO: 实现邮件发送或消息队列
    // 可以集成 Cloudflare Email Workers 或第三方邮件服务

    // 暂时存储到数据库（如果有联系表单表）
    // const db = getDatabase();
    // await db.run(`
    //   INSERT INTO contact_submissions (name, email, phone, interested_class, message, submitted_at, client_ip)
    //   VALUES (?, ?, ?, ?, ?, ?, ?)
    // `, [cleanedData.name, cleanedData.email, cleanedData.phone, cleanedData.class, cleanedData.message, cleanedData.submitted_at, cleanedData.client_ip]);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will contact you within 24 hours.',
      data: {
        id: Math.random().toString(36).substr(2, 9),
        submitted_at: cleanedData.submitted_at,
        name: cleanedData.name,
        email: cleanedData.email
      }
    }, { status: 201 });

  } catch (error) {
    return createErrorResponse(error);
  }
}

// GET /api/contact - 获取联系表单配置信息
export async function GET(request: NextRequest) {
  try {
    // 返回表单配置信息
    return NextResponse.json({
      success: true,
      data: {
        available_classes: [
          'Monday Classes',
          'Tuesday Classes', 
          'Thursday Classes',
          'Friday Classes',
          'Saturday Classes'
        ],
        contact_methods: {
          whatsapp: '+65 8766 8794',
          email: 'teamakiraxtaekwondo@gmail.com',
          instagram: '@akiraxtaekwondo',
          tiktok: '@akirax_taekwondo'
        },
        response_time: '24 hours',
        office_hours: 'Monday-Saturday, 6:30 PM - 9:30 PM'
      }
    });

  } catch (error) {
    return createErrorResponse(error);
  }
}
