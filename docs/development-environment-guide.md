# Akira X Taekwondo 开发环境配置指南

## 📋 目录
1. [环境概述](#1-环境概述)
2. [开发模式配置](#2-开发模式配置)
3. [认证系统开关](#3-认证系统开关)
4. [开发用户管理](#4-开发用户管理)
5. [数据库环境](#5-数据库环境)
6. [API端点配置](#6-api端点配置)
7. [前端开发配置](#7-前端开发配置)
8. [测试数据管理](#8-测试数据管理)
9. [部署环境对比](#9-部署环境对比)
10. [环境切换流程](#10-环境切换流程)

---

## 1. 环境概述

### 1.1 环境类型
- **Development (dev)**: 本地开发环境
- **Preview**: 预览/测试环境
- **Production (prod)**: 生产环境

### 1.2 核心差异

| 特性 | Development | Preview | Production |
|------|-------------|---------|------------|
| 认证系统 | 可开关 | 完整启用 | 完整启用 |
| Dev Users | 自动创建 | 手动创建 | 禁用 |
| 数据库 | 本地/预览DB | 预览DB | 生产DB |
| 日志级别 | DEBUG | INFO | WARN |
| 错误显示 | 详细堆栈 | 简化信息 | 用户友好 |
| CORS | 宽松 | 限制 | 严格 |

---

## 2. 开发模式配置

### 2.1 环境变量配置

#### `.env.local` (开发环境)
```bash
# 环境标识
NODE_ENV=development
ENVIRONMENT=development
DEV_MODE=true

# 认证开关
AUTH_ENABLED=false  # 开发时可关闭认证
DEV_USERS_ENABLED=true  # 启用开发用户

# Firebase配置 (开发项目)
FIREBASE_PROJECT_ID=akiraxtkd-dev
FIREBASE_API_KEY=your-dev-api-key
FIREBASE_AUTH_DOMAIN=akiraxtkd-dev.firebaseapp.com
FIREBASE_STORAGE_BUCKET=akiraxtkd-dev.appspot.com

# Cloudflare配置
CLOUDFLARE_ACCOUNT_ID=your-account-id
D1_DATABASE_ID=your-dev-database-id

# 开发特性
DEBUG_MODE=true
VERBOSE_LOGGING=true
MOCK_EXTERNAL_APIS=true

# 安全设置 (开发环境宽松)
CORS_ORIGINS=http://localhost:3000,http://localhost:8788
RATE_LIMITING_ENABLED=false
```

#### `.env.preview` (预览环境)
```bash
NODE_ENV=production
ENVIRONMENT=preview
DEV_MODE=false

AUTH_ENABLED=true
DEV_USERS_ENABLED=false

FIREBASE_PROJECT_ID=akiraxtkd-preview
# ... 其他预览环境配置
```

#### `.env.production` (生产环境)
```bash
NODE_ENV=production
ENVIRONMENT=production
DEV_MODE=false

AUTH_ENABLED=true
DEV_USERS_ENABLED=false

FIREBASE_PROJECT_ID=akiraxtkd-prod
# ... 其他生产环境配置
```

### 2.2 Wrangler配置更新

#### `wrangler.toml`
```toml
name = "akiraxtkd"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# 开发环境
[env.development]
vars = { 
  ENVIRONMENT = "development",
  DEV_MODE = "true",
  AUTH_ENABLED = "false",
  DEV_USERS_ENABLED = "true"
}
[[env.development.d1_databases]]
binding = "DB"
database_name = "akiraxtkd-dev"
database_id = "your-dev-database-id"

# 预览环境
[env.preview]
vars = { 
  ENVIRONMENT = "preview",
  DEV_MODE = "false",
  AUTH_ENABLED = "true",
  DEV_USERS_ENABLED = "false"
}
[[env.preview.d1_databases]]
binding = "DB"
database_name = "akiraxtkd-preview"
database_id = "your-preview-database-id"

# 生产环境
[env.production]
vars = { 
  ENVIRONMENT = "production",
  DEV_MODE = "false",
  AUTH_ENABLED = "true",
  DEV_USERS_ENABLED = "false"
}
[[env.production.d1_databases]]
binding = "DB"
database_name = "akiraxtkd-prod"
database_id = "your-prod-database-id"
```

---

## 3. 认证系统开关

### 3.1 认证中间件

#### `lib/auth-middleware.ts`
```typescript
interface Env {
  AUTH_ENABLED: string;
  DEV_MODE: string;
  DEV_USERS_ENABLED: string;
}

export class AuthManager {
  private authEnabled: boolean;
  private devMode: boolean;
  private devUsersEnabled: boolean;

  constructor(env: Env) {
    this.authEnabled = env.AUTH_ENABLED === 'true';
    this.devMode = env.DEV_MODE === 'true';
    this.devUsersEnabled = env.DEV_USERS_ENABLED === 'true';
  }

  async authenticate(request: Request): Promise<AuthResult> {
    // 开发模式且认证关闭时，使用开发用户
    if (this.devMode && !this.authEnabled) {
      return this.getDevUser(request);
    }

    // 正常认证流程
    if (this.authEnabled) {
      return this.verifyFirebaseToken(request);
    }

    // 认证关闭时返回匿名用户
    return this.getAnonymousUser();
  }

  private async getDevUser(request: Request): Promise<AuthResult> {
    const url = new URL(request.url);
    const devUserId = url.searchParams.get('dev_user') || 'dev-admin';
    
    const devUsers = {
      'dev-admin': {
        uid: 'dev-admin-001',
        email: 'admin@dev.local',
        role: 'admin',
        display_name: 'Dev Admin'
      },
      'dev-coach': {
        uid: 'dev-coach-001',
        email: 'coach@dev.local',
        role: 'coach',
        display_name: 'Dev Coach'
      },
      'dev-student': {
        uid: 'dev-student-001',
        email: 'student@dev.local',
        role: 'student',
        display_name: 'Dev Student'
      }
    };

    return {
      success: true,
      user: devUsers[devUserId] || devUsers['dev-admin'],
      isDev: true
    };
  }

  private async verifyFirebaseToken(request: Request): Promise<AuthResult> {
    // Firebase token验证逻辑
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthError('MISSING_TOKEN', 'Authorization header required');
    }

    const token = authHeader.substring(7);
    // ... Firebase验证逻辑
  }

  private getAnonymousUser(): AuthResult {
    return {
      success: true,
      user: {
        uid: 'anonymous',
        email: 'anonymous@local',
        role: 'student',
        display_name: 'Anonymous User'
      },
      isAnonymous: true
    };
  }
}
```

### 3.2 API路由保护

#### `functions/api/_middleware.ts`
```typescript
export async function onRequest(context: any): Promise<Response> {
  const { request, env, next } = context;
  
  const authManager = new AuthManager(env);
  
  try {
    const authResult = await authManager.authenticate(request);
    
    // 将认证信息添加到上下文
    context.user = authResult.user;
    context.isDev = authResult.isDev || false;
    context.isAnonymous = authResult.isAnonymous || false;
    
    // 开发模式添加调试头
    if (env.DEV_MODE === 'true') {
      const response = await next();
      response.headers.set('X-Dev-Mode', 'true');
      response.headers.set('X-Auth-Enabled', env.AUTH_ENABLED);
      response.headers.set('X-Current-User', authResult.user.uid);
      return response;
    }
    
    return next();
  } catch (error) {
    if (env.DEV_MODE === 'true') {
      // 开发模式返回详细错误
      return new Response(JSON.stringify({
        error: error.message,
        stack: error.stack,
        devMode: true
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 生产模式返回简化错误
    return new Response(JSON.stringify({
      error: 'Authentication failed'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

---

## 4. 开发用户管理

### 4.1 冷启动时创建开发用户

#### `scripts/setup-dev-users.ts`
```typescript
interface DevUser {
  user_id: string;
  email: string;
  role: 'admin' | 'coach' | 'student';
  display_name: string;
  firebase_uid: string;
}

const DEV_USERS: DevUser[] = [
  {
    user_id: 'dev-admin-001',
    email: 'admin@dev.local',
    role: 'admin',
    display_name: 'Development Admin',
    firebase_uid: 'dev-admin-001'
  },
  {
    user_id: 'dev-coach-001',
    email: 'coach@dev.local',
    role: 'coach',
    display_name: 'Development Coach',
    firebase_uid: 'dev-coach-001'
  },
  {
    user_id: 'dev-student-001',
    email: 'student@dev.local',
    role: 'student',
    display_name: 'Development Student',
    firebase_uid: 'dev-student-001'
  }
];

export async function setupDevUsers(db: D1Database, env: any) {
  if (env.DEV_USERS_ENABLED !== 'true') {
    console.log('Dev users disabled, skipping setup');
    return;
  }

  console.log('Setting up development users...');

  for (const user of DEV_USERS) {
    // 检查用户是否已存在
    const existing = await db.prepare(
      'SELECT user_id FROM user_accounts WHERE user_id = ?'
    ).bind(user.user_id).first();

    if (!existing) {
      // 创建用户账户
      await db.prepare(`
        INSERT INTO user_accounts (
          user_id, firebase_uid, email, role, display_name,
          email_verified, provider, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        user.user_id,
        user.firebase_uid,
        user.email,
        user.role,
        user.display_name,
        true,
        'dev',
        'active',
        new Date().toISOString()
      ).run();

      // 创建对应的profile
      if (user.role === 'student') {
        await createDevStudentProfile(db, user);
      } else if (user.role === 'coach') {
        await createDevCoachProfile(db, user);
      } else if (user.role === 'admin') {
        await createDevAdminProfile(db, user);
      }

      console.log(`Created dev user: ${user.email} (${user.role})`);
    } else {
      console.log(`Dev user already exists: ${user.email}`);
    }
  }

  console.log('Development users setup complete');
}

async function createDevStudentProfile(db: D1Database, user: DevUser) {
  await db.prepare(`
    INSERT INTO student_profiles (
      student_id, student_code, legal_name, display_name,
      date_of_birth, gender, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    user.user_id,
    'DEV-S-001',
    user.display_name,
    user.display_name,
    '2000-01-01',
    'Male',
    new Date().toISOString()
  ).run();
}

async function createDevCoachProfile(db: D1Database, user: DevUser) {
  await db.prepare(`
    INSERT INTO coach_profiles (
      coach_id, coach_code, legal_name, display_name,
      email, in_service_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    user.user_id,
    'DEV-C-001',
    user.display_name,
    user.display_name,
    user.email,
    'active',
    new Date().toISOString()
  ).run();
}

async function createDevAdminProfile(db: D1Database, user: DevUser) {
  await db.prepare(`
    INSERT INTO admin_profiles (
      admin_id, admin_code, legal_name, display_name,
      scope_notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    user.user_id,
    'DEV-A-001',
    user.display_name,
    user.display_name,
    'Development Administrator',
    new Date().toISOString()
  ).run();
}
```

### 4.2 开发用户切换器

#### `components/DevUserSwitcher.tsx`
```typescript
'use client';

import { useState, useEffect } from 'react';

interface DevUser {
  id: string;
  name: string;
  role: string;
  email: string;
}

const DEV_USERS: DevUser[] = [
  { id: 'dev-admin', name: 'Dev Admin', role: 'admin', email: 'admin@dev.local' },
  { id: 'dev-coach', name: 'Dev Coach', role: 'coach', email: 'coach@dev.local' },
  { id: 'dev-student', name: 'Dev Student', role: 'student', email: 'student@dev.local' }
];

export default function DevUserSwitcher() {
  const [isDevMode, setIsDevMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('dev-admin');

  useEffect(() => {
    // 检查是否为开发模式
    setIsDevMode(process.env.NODE_ENV === 'development');
  }, []);

  const switchUser = (userId: string) => {
    setCurrentUser(userId);
    // 更新URL参数
    const url = new URL(window.location.href);
    url.searchParams.set('dev_user', userId);
    window.history.replaceState({}, '', url.toString());
    // 刷新页面以应用新用户
    window.location.reload();
  };

  if (!isDevMode) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 shadow-lg">
      <div className="text-sm font-bold text-yellow-800 mb-2">
        🚧 DEV MODE
      </div>
      <div className="text-xs text-yellow-700 mb-3">
        Current: {DEV_USERS.find(u => u.id === currentUser)?.name}
      </div>
      <div className="space-y-1">
        {DEV_USERS.map(user => (
          <button
            key={user.id}
            onClick={() => switchUser(user.id)}
            className={`block w-full text-left px-2 py-1 text-xs rounded ${
              currentUser === user.id
                ? 'bg-yellow-300 text-yellow-900'
                : 'bg-white text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            {user.name} ({user.role})
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 5. 数据库环境

### 5.1 数据库初始化脚本

#### `scripts/init-dev-database.sh`
```bash
#!/bin/bash

echo "🚀 Initializing development database..."

# 检查环境
if [ "$ENVIRONMENT" != "development" ]; then
    echo "❌ This script should only run in development environment"
    exit 1
fi

# 创建开发数据库
echo "📊 Creating development database..."
wrangler d1 create akiraxtkd-dev

# 应用schema
echo "🏗️ Applying database schema..."
wrangler d1 execute akiraxtkd-dev --file=./database/schema.sql

# 插入种子数据
echo "🌱 Inserting seed data..."
wrangler d1 execute akiraxtkd-dev --file=./database/seed.sql

# 插入开发数据
echo "🧪 Inserting development test data..."
wrangler d1 execute akiraxtkd-dev --file=./database/dev-data.sql

# 创建开发用户
echo "👥 Creating development users..."
node scripts/setup-dev-users.js

echo "✅ Development database initialization complete!"
echo "🔗 Database ID: $(wrangler d1 list | grep akiraxtkd-dev | awk '{print $2}')"
```

### 5.2 开发测试数据

#### `database/dev-data.sql`
```sql
-- 开发环境测试数据
-- 仅在开发环境使用

-- 插入测试项目
INSERT INTO programs (program_id, name, description) VALUES
('dev-beginner', 'Dev Beginner Program', 'Development beginner program'),
('dev-advanced', 'Dev Advanced Program', 'Development advanced program');

-- 插入测试场地
INSERT INTO venues (venue_id, name, address, capacity) VALUES
('dev-venue-1', 'Dev Training Center', '123 Dev Street', 30),
('dev-venue-2', 'Dev Dojo', '456 Test Avenue', 25);

-- 插入测试课程
INSERT INTO classes (class_id, name, program_id, venue_id, coach_id, day_of_week, start_time, end_time) VALUES
('dev-class-1', 'Dev Monday Class', 'dev-beginner', 'dev-venue-1', 'dev-coach-001', 1, '19:00', '20:00'),
('dev-class-2', 'Dev Wednesday Class', 'dev-advanced', 'dev-venue-2', 'dev-coach-001', 3, '20:00', '21:00');

-- 插入测试会话
INSERT INTO sessions (session_id, class_id, session_date, planned_start_time, planned_end_time, status) VALUES
('dev-session-1', 'dev-class-1', '2024-12-23', '19:00', '20:00', 'scheduled'),
('dev-session-2', 'dev-class-1', '2024-12-30', '19:00', '20:00', 'scheduled'),
('dev-session-3', 'dev-class-2', '2024-12-25', '20:00', '21:00', 'scheduled');

-- 插入测试注册
INSERT INTO enrollments (enrollment_id, student_id, class_id, status, join_at, first_activated_at) VALUES
('dev-enrollment-1', 'dev-student-001', 'dev-class-1', 'active', '2024-12-01T00:00:00Z', '2024-12-01T00:00:00Z');

-- 插入测试出勤
INSERT INTO attendance (attendance_id, session_id, student_id, status, taken_by_coach_id, taken_at) VALUES
('dev-attendance-1', 'dev-session-1', 'dev-student-001', 'present', 'dev-coach-001', '2024-12-23T19:00:00Z');
```

---

## 6. API端点配置

### 6.1 开发模式API响应

#### `functions/api/dev/status.ts`
```typescript
export async function onRequestGet(context: any): Promise<Response> {
  const { env } = context;
  
  if (env.DEV_MODE !== 'true') {
    return new Response('Not Found', { status: 404 });
  }

  const devStatus = {
    environment: env.ENVIRONMENT,
    devMode: env.DEV_MODE === 'true',
    authEnabled: env.AUTH_ENABLED === 'true',
    devUsersEnabled: env.DEV_USERS_ENABLED === 'true',
    timestamp: new Date().toISOString(),
    features: {
      mockExternalApis: env.MOCK_EXTERNAL_APIS === 'true',
      verboseLogging: env.VERBOSE_LOGGING === 'true',
      rateLimiting: env.RATE_LIMITING_ENABLED === 'true'
    }
  };

  return new Response(JSON.stringify(devStatus, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 6.2 开发用户管理API

#### `functions/api/dev/users.ts`
```typescript
export async function onRequestGet(context: any): Promise<Response> {
  const { env, request } = context;
  
  if (env.DEV_MODE !== 'true') {
    return new Response('Not Found', { status: 404 });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  switch (action) {
    case 'list':
      return listDevUsers(context);
    case 'switch':
      return switchDevUser(context);
    case 'reset':
      return resetDevUsers(context);
    default:
      return new Response('Invalid action', { status: 400 });
  }
}

async function listDevUsers(context: any): Promise<Response> {
  const { env } = context;
  
  const users = await env.DB.prepare(`
    SELECT user_id, email, role, display_name, status, created_at
    FROM user_accounts 
    WHERE provider = 'dev'
    ORDER BY role, display_name
  `).all();

  return new Response(JSON.stringify({
    devUsers: users.results,
    count: users.results.length
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function switchDevUser(context: any): Promise<Response> {
  const { request } = context;
  const { userId } = await request.json();
  
  // 在实际应用中，这里会设置session或返回token
  return new Response(JSON.stringify({
    success: true,
    message: `Switched to user: ${userId}`,
    redirectUrl: `/?dev_user=${userId}`
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

## 7. 前端开发配置

### 7.1 开发模式检测

#### `lib/dev-utils.ts`
```typescript
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || 
         process.env.ENVIRONMENT === 'development';
};

export const isAuthEnabled = () => {
  return process.env.AUTH_ENABLED === 'true';
};

export const getDevUser = () => {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  return params.get('dev_user') || 'dev-admin';
};

export const getApiBaseUrl = () => {
  if (isDevelopment()) {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8788/api';
  }
  return '/api';
};

export class DevLogger {
  static log(message: string, data?: any) {
    if (isDevelopment()) {
      console.log(`[DEV] ${message}`, data || '');
    }
  }

  static warn(message: string, data?: any) {
    if (isDevelopment()) {
      console.warn(`[DEV] ${message}`, data || '');
    }
  }

  static error(message: string, error?: any) {
    if (isDevelopment()) {
      console.error(`[DEV] ${message}`, error || '');
    }
  }
}
```

### 7.2 开发模式布局

#### `components/DevLayout.tsx`
```typescript
'use client';

import { ReactNode } from 'react';
import DevUserSwitcher from './DevUserSwitcher';
import DevToolbar from './DevToolbar';
import { isDevelopment } from '@/lib/dev-utils';

interface DevLayoutProps {
  children: ReactNode;
}

export default function DevLayout({ children }: DevLayoutProps) {
  if (!isDevelopment()) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* 开发工具栏 */}
      <DevToolbar />
      
      {/* 用户切换器 */}
      <DevUserSwitcher />
      
      {/* 主要内容 */}
      <div className="min-h-screen">
        {children}
      </div>
      
      {/* 开发模式水印 */}
      <div className="fixed bottom-4 left-4 bg-red-500 text-white px-2 py-1 text-xs rounded opacity-75">
        DEV MODE
      </div>
    </div>
  );
}
```

---

## 8. 测试数据管理

### 8.1 测试数据重置

#### `scripts/reset-dev-data.ts`
```typescript
export async function resetDevData(db: D1Database, env: any) {
  if (env.ENVIRONMENT !== 'development') {
    throw new Error('Can only reset data in development environment');
  }

  console.log('🔄 Resetting development data...');

  // 清除测试数据（保留schema）
  const tables = [
    'attendance',
    'enrollments', 
    'sessions',
    'classes',
    'venues',
    'programs',
    'student_profiles',
    'coach_profiles',
    'admin_profiles',
    'user_accounts'
  ];

  for (const table of tables) {
    await db.prepare(`DELETE FROM ${table} WHERE 1=1`).run();
    console.log(`Cleared table: ${table}`);
  }

  // 重新插入种子数据
  console.log('🌱 Reinserting seed data...');
  // 这里可以调用seed脚本或直接插入数据

  // 重新创建开发用户
  await setupDevUsers(db, env);

  console.log('✅ Development data reset complete');
}
```

### 8.2 数据快照管理

#### `scripts/dev-snapshots.ts`
```typescript
export class DevDataSnapshots {
  static async createSnapshot(db: D1Database, name: string) {
    console.log(`📸 Creating snapshot: ${name}`);
    
    // 导出当前数据状态
    const snapshot = {
      name,
      timestamp: new Date().toISOString(),
      data: {}
    };

    const tables = ['user_accounts', 'student_profiles', 'classes', 'enrollments'];
    
    for (const table of tables) {
      const result = await db.prepare(`SELECT * FROM ${table}`).all();
      snapshot.data[table] = result.results;
    }

    // 保存到本地文件
    const fs = require('fs');
    fs.writeFileSync(
      `./dev-snapshots/${name}.json`, 
      JSON.stringify(snapshot, null, 2)
    );

    console.log(`✅ Snapshot saved: ${name}`);
  }

  static async restoreSnapshot(db: D1Database, name: string) {
    console.log(`🔄 Restoring snapshot: ${name}`);
    
    const fs = require('fs');
    const snapshot = JSON.parse(
      fs.readFileSync(`./dev-snapshots/${name}.json`, 'utf8')
    );

    // 清除现有数据
    for (const table of Object.keys(snapshot.data)) {
      await db.prepare(`DELETE FROM ${table}`).run();
    }

    // 恢复数据
    for (const [table, rows] of Object.entries(snapshot.data)) {
      for (const row of rows as any[]) {
        const columns = Object.keys(row);
        const placeholders = columns.map(() => '?').join(',');
        const values = columns.map(col => row[col]);
        
        await db.prepare(
          `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`
        ).bind(...values).run();
      }
    }

    console.log(`✅ Snapshot restored: ${name}`);
  }
}
```

---

## 9. 部署环境对比

### 9.1 环境特性对比表

| 特性 | Development | Preview | Production |
|------|-------------|---------|------------|
| **认证** |
| Firebase Auth | 可选 | 必需 | 必需 |
| Dev Users | 启用 | 禁用 | 禁用 |
| Token验证 | 可跳过 | 严格 | 严格 |
| **数据库** |
| 数据库实例 | 开发DB | 预览DB | 生产DB |
| 测试数据 | 包含 | 清理版本 | 仅生产数据 |
| 数据重置 | 允许 | 限制 | 禁止 |
| **API** |
| 错误详情 | 完整堆栈 | 简化信息 | 用户友好 |
| 调试端点 | 启用 | 部分启用 | 禁用 |
| 速率限制 | 宽松 | 中等 | 严格 |
| **前端** |
| 开发工具 | 显示 | 隐藏 | 隐藏 |
| 用户切换 | 启用 | 禁用 | 禁用 |
| 调试信息 | 详细 | 基础 | 隐藏 |
| **安全** |
| CORS | 宽松 | 限制 | 严格 |
| HTTPS | 可选 | 必需 | 必需 |
| 敏感数据 | 可见 | 部分可见 | 隐藏 |

### 9.2 配置文件对比

#### Development
```json
{
  "environment": "development",
  "features": {
    "auth": "optional",
    "devUsers": true,
    "debugging": true,
    "dataReset": true,
    "mockApis": true
  },
  "security": {
    "cors": "permissive",
    "rateLimit": false,
    "errorDetails": "full"
  }
}
```

#### Preview
```json
{
  "environment": "preview",
  "features": {
    "auth": "required",
    "devUsers": false,
    "debugging": "limited",
    "dataReset": false,
    "mockApis": false
  },
  "security": {
    "cors": "restricted",
    "rateLimit": true,
    "errorDetails": "sanitized"
  }
}
```

#### Production
```json
{
  "environment": "production",
  "features": {
    "auth": "required",
    "devUsers": false,
    "debugging": false,
    "dataReset": false,
    "mockApis": false
  },
  "security": {
    "cors": "strict",
    "rateLimit": true,
    "errorDetails": "minimal"
  }
}
```

---

## 10. 环境切换流程

### 10.1 开发到预览环境

```bash
# 1. 确保代码提交
git add .
git commit -m "Ready for preview deployment"

# 2. 切换到预览配置
cp .env.preview .env.local

# 3. 构建预览版本
npm run build

# 4. 部署到预览环境
wrangler pages deploy --env preview

# 5. 验证预览环境
curl https://preview.akiraxtkd.pages.dev/api/dev/status
```

### 10.2 预览到生产环境

```bash
# 1. 最终测试确认
npm run test
npm run lint

# 2. 切换到生产配置
cp .env.production .env.local

# 3. 生产构建
npm run build

# 4. 部署到生产环境
wrangler pages deploy --env production

# 5. 验证生产环境
curl https://akiraxtkd.pages.dev/api/health
```

### 10.3 紧急回滚流程

```bash
# 1. 回滚到上一个版本
wrangler pages deployment list
wrangler pages deployment rollback <deployment-id>

# 2. 或者重新部署稳定版本
git checkout <stable-commit>
wrangler pages deploy --env production
```

---

## 最终说明

这个开发环境配置指南提供了：

1. **灵活的认证开关** - 开发时可以关闭认证专注于功能开发
2. **自动开发用户创建** - 冷启动时自动创建测试用户
3. **环境隔离** - 清晰的开发/预览/生产环境分离
4. **调试工具** - 丰富的开发调试功能
5. **数据管理** - 测试数据的创建、重置和快照功能
6. **安全配置** - 不同环境的安全策略配置

通过这套配置，您可以：
- 在开发阶段快速迭代功能
- 在认证完成后轻松启用认证系统
- 在不同环境间安全切换
- 保持生产环境的安全性和稳定性

*本指南确保开发效率和生产安全的平衡。*
