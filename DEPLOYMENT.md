# Cloudflare 部署指南

## 🚀 部署步骤

### 1. 准备工作

#### 1.1 创建生产数据库
```bash
# 创建生产数据库
wrangler d1 create akiraxtkd-db-production

# 创建预览数据库
wrangler d1 create akiraxtkd-db-preview
```

#### 1.2 更新 wrangler.toml
将创建的数据库ID填入 `wrangler.toml`:

```toml
# Production database
[[env.production.d1_databases]]
binding = "DB"
database_name = "akiraxtkd-db-production"
database_id = "YOUR_PRODUCTION_DATABASE_ID_HERE"

# Preview database
[[env.preview.d1_databases]]
binding = "DB"
database_name = "akiraxtkd-db-preview"
database_id = "YOUR_PREVIEW_DATABASE_ID_HERE"
```

#### 1.3 更新生产环境JWT密钥
在 `wrangler.toml` 中更新生产环境的JWT密钥:

```toml
[env.production.vars]
JWT_SECRET = "YOUR_SECURE_PRODUCTION_JWT_SECRET_HERE"

[env.preview.vars]
JWT_SECRET = "YOUR_SECURE_PREVIEW_JWT_SECRET_HERE"
```

#### 1.4 初始化生产数据库
```bash
# 初始化生产数据库结构
wrangler d1 execute akiraxtkd-db-production --file=database/schema-v2.sql --env production

# 添加种子数据
wrangler d1 execute akiraxtkd-db-production --file=database/seed-v2.sql --env production

# 初始化预览数据库
wrangler d1 execute akiraxtkd-db-preview --file=database/schema-v2.sql --env preview
wrangler d1 execute akiraxtkd-db-preview --file=database/seed-v2.sql --env preview
```

### 2. 更新API配置

#### 2.1 更新 lib/config.ts
将 `lib/config.ts` 中的Workers域名替换为您的实际域名:

```typescript
export const API_CONFIG = {
  production: {
    baseUrl: 'https://YOUR_WORKER_NAME.YOUR_SUBDOMAIN.workers.dev',
    workers: 'https://YOUR_WORKER_NAME.YOUR_SUBDOMAIN.workers.dev',
  },
  preview: {
    baseUrl: 'https://YOUR_WORKER_NAME-preview.YOUR_SUBDOMAIN.workers.dev',
    workers: 'https://YOUR_WORKER_NAME-preview.YOUR_SUBDOMAIN.workers.dev',
  }
};
```

### 3. 部署Backend (Cloudflare Workers)

#### 3.1 部署到预览环境
```bash
npm run deploy:preview
```

#### 3.2 部署到生产环境
```bash
npm run deploy:production
```

### 4. 部署Frontend (Cloudflare Pages)

#### 4.1 构建项目
```bash
npm run build
```

#### 4.2 方法一: Git集成 (推荐)
1. 将代码推送到Git仓库 (GitHub/GitLab)
2. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
3. 点击 "Create a project"
4. 连接Git仓库
5. 配置构建设置:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (留空)
   - **Node.js version**: `18.x`

#### 4.3 方法二: 直接上传
```bash
# 构建项目
npm run build

# 上传 out 文件夹到 Cloudflare Pages dashboard
```

### 5. 环境变量配置

在Cloudflare Pages中设置环境变量:

#### 5.1 生产环境变量
- `NODE_ENV`: `production`
- `NEXT_PUBLIC_API_URL`: 您的Workers URL

#### 5.2 预览环境变量
- `NODE_ENV`: `preview`
- `NEXT_PUBLIC_API_URL`: 您的预览Workers URL

### 6. 自定义域名 (可选)

#### 6.1 在Cloudflare Pages中添加自定义域名
1. 进入Pages项目设置
2. 点击 "Custom domains"
3. 添加您的域名 (如 `akiraxtkd.com`)
4. 配置DNS记录

#### 6.2 更新_redirects文件
确保 `_redirects` 文件中的域名正确:
```
http://yourdomain.com/* https://yourdomain.com/:splat 301!
https://www.yourdomain.com/* https://yourdomain.com/:splat 301!
```

## 🔧 常见问题解决

### 问题1: API调用失败
**症状**: Dashboard显示加载失败
**解决**: 检查 `lib/config.ts` 中的API URL是否正确

### 问题2: 数据库连接失败
**症状**: 后端API返回数据库错误
**解决**: 确保数据库ID在 `wrangler.toml` 中正确配置

### 问题3: 静态导出失败
**症状**: `npm run build` 失败
**解决**: 检查是否有服务端功能需要移除或客户端化

### 问题4: CORS错误
**症状**: 浏览器控制台显示CORS错误
**解决**: 检查Workers中的CORS设置

## 📊 部署验证清单

- [ ] 生产数据库已创建并初始化
- [ ] JWT密钥已更新为安全值
- [ ] API配置中的URL已更新
- [ ] Workers已成功部署
- [ ] Pages已成功构建和部署
- [ ] 所有Dashboard功能正常
- [ ] 登录/登出功能正常
- [ ] 数据显示正确

## 🚨 安全注意事项

1. **JWT密钥**: 生产环境必须使用强随机密钥
2. **数据库访问**: 确保只有授权用户可以访问
3. **API端点**: 检查所有API都有适当的认证
4. **环境变量**: 敏感信息不要提交到Git

## 📞 支持

如果遇到部署问题，请检查:
1. Cloudflare Workers日志
2. Cloudflare Pages构建日志
3. 浏览器开发者工具网络面板
4. 数据库连接状态

---

**部署完成后，您的跆拳道管理系统就可以在生产环境中使用了！** 🎉
