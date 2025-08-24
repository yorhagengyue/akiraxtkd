# Akira X Taekwondo - System Architecture

## Overview
A modern full-stack web application for taekwondo academy management with development-friendly authentication system.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Carousel**: Swiper.js
- **Language**: TypeScript
- **Deployment**: Cloudflare Pages (next-on-pages)

### Backend
- **Runtime**: Cloudflare Workers (Edge Runtime)
- **Framework**: Next.js Route Handlers with next-on-pages
- **Database**: Cloudflare D1 (SQLite)
- **API**: REST endpoints with TypeScript
- **Authentication**: JWT tokens with demo accounts

### Development Environment
- **Local Frontend**: http://localhost:3000 (Next.js with API routes)
- **Local API**: Integrated with Next.js dev server
- **Database**: Mock data for development, D1 for production
- **Edge Runtime**: Compatible with Cloudflare Workers

## Project Structure

```
akiraxtkd.com/
├── app/                    # Next.js App Router
│   ├── api/               # Next.js Route Handlers (Edge Runtime)
│   │   ├── auth/login/    # Login endpoint
│   │   ├── auth/logout/   # Logout endpoint
│   │   ├── env-info/      # Environment info
│   │   └── test/          # Test endpoint
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── dashboard/         # Protected dashboards
│   │   ├── admin/         # Admin dashboard
│   │   ├── coach/         # Coach dashboard
│   │   └── student/       # Student dashboard
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── AuthProvider.tsx   # Global auth context
│   └── [Other components] # Homepage sections
├── lib/                   # Shared utilities
│   ├── auth-server.ts     # Server-side auth logic
│   ├── auth-client.ts     # Client-side auth utilities
│   └── config.ts          # API configuration
├── functions/             # Legacy Cloudflare Workers (deprecated)
├── database/              # Database files
│   ├── schema-v2.sql      # Database schema
│   └── seed-v2.sql        # Seed data
├── docs/                  # Documentation
└── types/                 # TypeScript definitions
```

## Authentication System

### Demo Accounts
| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@akiraxtkd.com | admin123 | Full system access |
| Coach | coach@akiraxtkd.com | coach123 | Manage classes/students |
| Student | student@akiraxtkd.com | student123 | View classes/progress |

### Authentication Flow
1. **Demo Login**: Email/password authentication with hardcoded accounts
2. **JWT Tokens**: Access and refresh token generation with Edge Runtime
3. **Client Storage**: Tokens stored in localStorage with auto-refresh
4. **Route Protection**: Frontend and backend role-based access control
5. **Session Management**: Persistent login status across page refreshes

## API Endpoints

### Authentication (Next.js Route Handlers)
- `POST /api/auth/login` - User login with JWT token generation
- `POST /api/auth/logout` - User logout with token blacklisting
- `GET /api/env-info` - Environment information and configuration

### System
- `GET /api/test` - API health check and deployment verification
- `GET /api/dashboard/*` - Role-based dashboard data (legacy)
- `GET /api/students` - Student management (legacy)

## Database Schema

### Core Tables
- `user_accounts` - User authentication and profiles
- `student_profiles` - Student-specific information
- `coach_profiles` - Coach-specific information
- `admin_profiles` - Admin-specific information
- `venues` - Training locations
- `classes` - Class schedules
- `programs` - Training programs

### Features
- **30 tables** total for complete academy management
- **ULID/UUIDv7** primary keys
- **Audit logging** for all changes
- **Role-based data access**
- **Development seed data**

## Environment Configuration

### Development
```toml
ENVIRONMENT = "development"
DEV_MODE = "true"
AUTH_ENABLED = "false"
DEV_USERS_ENABLED = "true"
```

### Production
```toml
ENVIRONMENT = "production"
DEV_MODE = "false"
AUTH_ENABLED = "true"
DEV_USERS_ENABLED = "false"
```

## Key Features

### ✅ Completed (v0.2 - Next.js Route Handlers)
- **Authentication System**: Complete JWT-based login/logout with demo accounts
- **Next.js Route Handlers**: Edge Runtime compatible API endpoints
- **Unified Development**: Single `npm run dev` for frontend + backend
- **Auto-deployment**: Git push triggers Cloudflare Pages deployment
- **Route Protection**: Frontend and backend role-based access control
- **Session Management**: Persistent login with auto-refresh tokens
- **Professional UI**: Clean login/register pages with consistent design
- **Responsive Design**: Desktop + mobile compatibility
- **TypeScript**: Complete type safety across frontend and backend

### 🚀 Ready for Extension
- Google Sign-In integration
- Firebase Authentication
- Production database setup
- Student management dashboard
- Class booking system
- Payment processing
- Notification system

## Development Commands

```bash
# Development (Unified)
npm run dev                    # Start Next.js with API routes (port 3000)

# Building & Deployment
npm run build                  # Build Next.js application with next-on-pages
git push origin master        # Auto-deploy to Cloudflare Pages

# Database management (Legacy - for production setup)
npm run db:schema             # Apply schema to remote D1
npm run db:seed               # Apply seed data to remote D1
npm run db:query -- "SELECT * FROM users"  # Run SQL query

# Legacy Backend (Deprecated)
npm run dev:workers           # Start Cloudflare Workers (port 8787)
```

## Security Considerations

### Development Mode
- Demo accounts with visible passwords
- No real authentication required
- Local database with test data
- CORS enabled for development

### Production Mode (Future)
- Google OAuth integration
- Encrypted password storage
- JWT with proper signing
- Rate limiting and security headers
- Production database with backups

## Performance

### Frontend
- Static site generation with Next.js
- Optimized images and assets
- Lazy loading for components
- Responsive design patterns

### Backend
- Edge computing with Cloudflare Workers
- Global CDN distribution
- D1 database with automatic scaling
- Efficient SQL queries with proper indexing

## Monitoring & Debugging

### Development
- Console logging for all API calls
- Error boundaries in React components
- TypeScript for compile-time error checking
- Hot reload for rapid development

### Production (Future)
- Cloudflare Analytics
- Error tracking and logging
- Performance monitoring
- Database query optimization

---

**Status**: ✅ v0.2 - Next.js Route Handlers deployment complete
**Current Version**: demo v0.2 - Next.js Route Handlers
**Deployment**: Cloudflare Pages with next-on-pages
**Next Steps**: D1 database integration, advanced dashboards, production features

### Recent Updates (v0.2)
- ✅ Migrated from Cloudflare Pages Functions to Next.js Route Handlers
- ✅ Added Edge Runtime compatibility for all API endpoints
- ✅ Unified development experience with single dev server
- ✅ Fixed deployment issues with proper runtime configuration
- ✅ Updated demo accounts to @akiraxtkd.com domain
- ✅ Implemented persistent authentication state
- ✅ Auto-deployment pipeline working correctly
