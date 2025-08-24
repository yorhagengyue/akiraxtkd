/**
 * Environment Configuration
 * 处理开发和生产环境的API端点配置
 */

// 检测环境
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// API基础URL配置
export const API_CONFIG = {
  // 开发环境使用本地Wrangler服务器
  development: {
    baseUrl: 'http://localhost:8787',
    workers: 'http://localhost:8787',
  },
  
  // 生产环境使用实际的Cloudflare Workers
  production: {
    baseUrl: 'https://akiraxtkd.gengy.workers.dev', // 替换为您的实际Workers域名
    workers: 'https://akiraxtkd.gengy.workers.dev',
  },
  
  // 预览环境
  preview: {
    baseUrl: 'https://akiraxtkd-preview.gengy.workers.dev', // 替换为您的预览Workers域名
    workers: 'https://akiraxtkd-preview.gengy.workers.dev',
  }
};

// 获取当前环境的API配置
export function getApiConfig() {
  if (isDevelopment) {
    return API_CONFIG.development;
  }
  
  // 检查是否为预览环境
  if (typeof window !== 'undefined' && window.location.hostname.includes('preview')) {
    return API_CONFIG.preview;
  }
  
  return API_CONFIG.production;
}

// 构建完整的API URL
export function buildApiUrl(endpoint: string): string {
  const config = getApiConfig();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${config.baseUrl}/api/${cleanEndpoint}`;
}

// 导出常用的API端点
export const API_ENDPOINTS = {
  // 认证相关
  auth: {
    login: () => buildApiUrl('auth/login'),
    logout: () => buildApiUrl('auth/logout'),
    refresh: () => buildApiUrl('auth/refresh'),
    devUsers: () => buildApiUrl('auth/dev-users'),
  },
  
  // Dashboard相关
  dashboard: {
    admin: {
      kpis: () => buildApiUrl('dashboard/admin/kpis'),
      risks: () => buildApiUrl('dashboard/admin/risks'),
      activities: () => buildApiUrl('dashboard/admin/activities'),
      studentsOverview: () => buildApiUrl('dashboard/admin/students-overview'),
    },
    coach: {
      kpis: () => buildApiUrl('dashboard/coach/kpis'),
      sessions: (params?: string) => buildApiUrl(`dashboard/coach/sessions${params ? `?${params}` : ''}`),
      students: () => buildApiUrl('dashboard/coach/students'),
    },
    student: {
      overview: () => buildApiUrl('dashboard/student/overview'),
      classes: () => buildApiUrl('dashboard/student/classes'),
      events: () => buildApiUrl('dashboard/student/events'),
    }
  },
  
  // 学员管理
  students: {
    list: () => buildApiUrl('students'),
    detail: (id: string) => buildApiUrl(`students/${id}`),
  },
  
  // 环境信息
  envInfo: () => buildApiUrl('env-info'),
};

// 环境检测工具
export const ENV_UTILS = {
  isDevelopment,
  isProduction,
  isClient: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
};

export default {
  API_CONFIG,
  getApiConfig,
  buildApiUrl,
  API_ENDPOINTS,
  ENV_UTILS,
};
