/**
 * Design Tokens - 统一的设计系统基础
 * 去AI味、可落地的UI改造基础
 */

// ========== 颜色系统 ==========
export const colors = {
  // 主品牌色 - 深墨绿
  primary: {
    50: '#f0f9f4',
    100: '#dcf2e4',
    200: '#bbe5cc',
    300: '#8dd1a8',
    400: '#5bb67d',
    500: '#369857', // 主色
    600: '#2a7a45',
    700: '#236138',
    800: '#1e4d2f',
    900: '#1a4027',
  },
  
  // 功能色
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  danger: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  
  // 角色色（细节用，不做大面积底色）
  student: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  coach: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
  },
  admin: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  
  // 灰阶
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // 腰带颜色系统
  belt: {
    white: { bg: '#ffffff', border: '#e5e7eb', text: '#374151' },
    yellow: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    orange: { bg: '#fed7aa', border: '#ea580c', text: '#9a3412' },
    green: { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
    blue: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
    brown: { bg: '#fef3c7', border: '#a3a3a3', text: '#525252' },
    red: { bg: '#fee2e2', border: '#ef4444', text: '#b91c1c' },
    black: { bg: '#1f2937', border: '#374151', text: '#ffffff' },
  }
};

// ========== 间距系统 (8pt Grid) ==========
export const spacing = {
  // 基础间距
  xs: '4px',   // 0.5
  sm: '8px',   // 1
  md: '12px',  // 1.5
  lg: '16px',  // 2
  xl: '24px',  // 3
  '2xl': '32px', // 4
  '3xl': '48px', // 6
  
  // 页面级间距
  page: {
    padding: '24px',
    paddingLarge: '32px',
  },
  
  // 组件内边距阶梯
  component: {
    tight: '12px',
    normal: '16px',
    loose: '24px',
  },
  
  // 栅格间距
  grid: {
    gap: '24px',
    gapLarge: '32px',
  }
};

// ========== 圆角系统 ==========
export const borderRadius = {
  // 只用两档
  button: '8px',      // rounded-lg - 按钮/输入框
  card: '16px',       // rounded-2xl - 卡片/容器
  
  // 特殊用途
  full: '9999px',     // rounded-full - 头像/徽章
  none: '0px',        // rounded-none - 表格/特殊场景
};

// ========== 阴影系统 ==========
export const shadows = {
  // 只有两档
  static: '0 1px 2px 0 rgb(0 0 0 / 0.05)',           // shadow-sm - 静态元素
  interactive: '0 4px 6px -1px rgb(0 0 0 / 0.1)',    // shadow-md - 悬浮/可点击
  
  // 特殊场景
  none: 'none',
  focus: '0 0 0 3px rgb(59 130 246 / 0.1)', // focus ring
};

// ========== 字体系统 ==========
export const typography = {
  // 字体族
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    heading: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
  },
  
  // 字号阶梯
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
  },
  
  // 行高
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  
  // 字重
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // 语义化字体规格
  scale: {
    h1: { size: '32px', weight: '700', lineHeight: '1.25' },
    h2: { size: '24px', weight: '600', lineHeight: '1.25' },
    h3: { size: '20px', weight: '600', lineHeight: '1.25' },
    h4: { size: '18px', weight: '600', lineHeight: '1.25' },
    body: { size: '16px', weight: '400', lineHeight: '1.5' },
    bodySmall: { size: '14px', weight: '400', lineHeight: '1.5' },
    caption: { size: '12px', weight: '400', lineHeight: '1.25' },
  }
};

// ========== 组件规格 ==========
export const components = {
  // 密度规格
  density: {
    tableRowHeight: '48px',
    cardHeaderMinHeight: '56px',
    buttonHeight: '44px',
    inputHeight: '44px',
    touchTarget: '44px', // 最小可点击区域
  },
  
  // 微交互
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
    },
    scale: {
      hover: '1.01',
      press: '0.98',
    }
  },
  
  // Z-index 层级
  zIndex: {
    dropdown: 50,
    modal: 100,
    toast: 200,
    tooltip: 300,
  }
};

// ========== 状态系统 ==========
export const states = {
  loading: {
    skeleton: colors.gray[200],
    spinner: colors.primary[500],
  },
  empty: {
    icon: colors.gray[300],
    text: colors.gray[500],
    subtext: colors.gray[400],
  },
  error: {
    bg: colors.danger[50],
    border: colors.danger[200],
    text: colors.danger[700],
  },
  success: {
    bg: colors.success[50],
    border: colors.success[200],
    text: colors.success[700],
  }
};

// ========== 导出默认配置 ==========
export const designTokens = {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  components,
  states,
};

export default designTokens;
