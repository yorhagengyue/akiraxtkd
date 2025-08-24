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
- **Deployment**: Cloudflare Pages (Static Export)

### Backend
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **API**: REST endpoints with TypeScript
- **Authentication**: Development mode with demo accounts

### Development Environment
- **Local Frontend**: http://localhost:3000 (Next.js)
- **Local API**: http://localhost:8787 (Wrangler)
- **Database**: Local + Remote D1 sync

## Project Structure

```
akiraxtkd.com/
├── app/                    # Next.js App Router
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── SimpleAuthButton.tsx # Authentication UI
│   └── [Other components] # Homepage sections
├── functions/             # Cloudflare Workers
│   ├── _worker.js         # Main worker entry
│   └── api/               # API endpoints
│       ├── auth.ts        # Authentication API
│       ├── env-info.ts    # Environment info
│       └── students.ts    # Student management
├── hooks/                 # React hooks
│   └── useSimpleAuth.tsx  # Authentication hook
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
| Admin | admin@dev.local | admin123 | Full system access |
| Coach | coach@dev.local | coach123 | Manage classes/students |
| Student | student@dev.local | student123 | View classes/progress |

### Authentication Flow
1. **Development Mode**: Direct login with demo accounts
2. **Session Management**: JWT-like tokens in localStorage
3. **API Protection**: Bearer token authentication
4. **Role-based Access**: Admin/Coach/Student permissions

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user info
- `GET /api/auth/dev-users` - Development users list

### System
- `GET /api/env-info` - Environment information
- `GET /api/students` - Student management (example)

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

### ✅ Completed
- Professional login/register pages
- Demo account system with visible credentials
- Consistent header/footer across all pages
- Responsive design (desktop + mobile)
- Development environment with hot reload
- Database with complete schema and seed data
- API endpoints with proper error handling
- TypeScript throughout the stack

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
# Frontend development
npm run dev                    # Start Next.js (port 3000)

# Backend development  
npm run dev:workers           # Start Cloudflare Workers (port 8787)

# Database management
npm run db:schema             # Apply schema to remote DB
npm run db:seed               # Apply seed data to remote DB
npm run db:query -- "SELECT * FROM users"  # Run SQL query

# Deployment
npm run deploy:preview        # Deploy to preview environment
npm run deploy:production     # Deploy to production
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

**Status**: ✅ Development environment fully functional
**Next Steps**: Production setup, Google Auth integration, advanced features
