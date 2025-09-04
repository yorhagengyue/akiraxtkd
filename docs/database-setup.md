# Akira X Taekwondo Database Setup Guide

## Overview

This guide explains how to set up the Cloudflare D1 database for the Akira X Taekwondo management system.

## Database Schema

The database consists of the following main tables:

### Core Tables
- `user_accounts` - Authentication and user management
- `students` - Student information and profiles
- `instructors` - Instructor details and qualifications
- `locations` - Training locations and facilities
- `classes` - Class schedules and information
- `belt_levels` - Taekwondo belt progression system

### Relationship Tables
- `class_enrollments` - Student-class registrations
- `attendance_records` - Class attendance tracking
- `belt_promotions` - Belt promotion history

## Setup Instructions

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create D1 Database

```bash
# Create the database
wrangler d1 create akiraxtkd-db

# Note the database ID from the output and update wrangler.toml
```

### 4. Update wrangler.toml

Add the database configuration to your `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "akiraxtkd-db"
database_id = "your-database-id-here"
```

### 5. Initialize Database Schema

```bash
# Apply the schema
wrangler d1 execute akiraxtkd-db --file=./scripts/init-database.sql
```

### 6. Load Seed Data (Optional)

```bash
# Load sample data for development
wrangler d1 execute akiraxtkd-db --file=./scripts/seed-data.sql
```

### 7. Verify Setup

```bash
# Check tables were created
wrangler d1 execute akiraxtkd-db --command="SELECT name FROM sqlite_master WHERE type='table';"

# Check sample data
wrangler d1 execute akiraxtkd-db --command="SELECT COUNT(*) as student_count FROM students;"
```

## Database Schema Details

### Students Table
```sql
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_code TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
    phone TEXT,
    email TEXT,
    address TEXT,
    postal_code TEXT,
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    emergency_contact_relationship TEXT NOT NULL,
    joined_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive', 'Suspended')) DEFAULT 'Active',
    current_belt_id INTEGER NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (current_belt_id) REFERENCES belt_levels(id)
);
```

### Classes Table
```sql
CREATE TABLE classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_name TEXT NOT NULL,
    description TEXT,
    instructor_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
    age_group TEXT,
    belt_requirements TEXT,
    monthly_fee DECIMAL(10,2) NOT NULL CHECK (monthly_fee >= 0),
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id),
    FOREIGN KEY (location_id) REFERENCES locations(id),
    CHECK (start_time < end_time)
);
```

## Environment Configuration

### Development
- Uses local D1 database
- Mock data for testing
- Debug logging enabled

### Production
- Uses Cloudflare D1 production database
- Real authentication required
- Performance monitoring enabled

## Performance Optimizations

### Indexes
The schema includes optimized indexes for:
- Student searches by code, status, belt level
- Class queries by day, time, instructor, location
- Attendance records by student, class, and date
- Belt promotions by student and date

### Query Patterns
Common query patterns are optimized:
```sql
-- Student list with belt information
SELECT s.*, b.belt_name, b.belt_color 
FROM students s 
LEFT JOIN belt_levels b ON s.current_belt_id = b.id 
WHERE s.status = 'Active'
ORDER BY s.joined_date DESC;

-- Class attendance for a specific date
SELECT ar.*, s.student_code, s.first_name, s.last_name
FROM attendance_records ar
JOIN students s ON ar.student_id = s.id
WHERE ar.class_id = ? AND ar.attendance_date = ?
ORDER BY s.first_name, s.last_name;
```

## Backup and Migration

### Backup
```bash
# Export database
wrangler d1 export akiraxtkd-db --output=backup.sql
```

### Migration
Database migrations should be:
1. Backward compatible when possible
2. Applied incrementally
3. Tested in preview environment first

Example migration:
```sql
-- Add new column
ALTER TABLE students ADD COLUMN preferred_name TEXT;

-- Update existing records if needed
UPDATE students SET preferred_name = first_name WHERE preferred_name IS NULL;
```

## Security Considerations

### Data Protection
- Personal information is encrypted at rest
- Access controlled via JWT authentication
- Role-based permissions enforced

### API Security
- All write operations require authentication
- Input validation on all endpoints
- SQL injection protection via prepared statements

### Compliance
- GDPR compliance for data handling
- Data retention policies implemented
- Audit logging for sensitive operations

## Monitoring and Maintenance

### Health Checks
- Database connection monitoring
- Query performance tracking
- Storage usage alerts

### Regular Maintenance
- Weekly backup verification
- Monthly performance review
- Quarterly security audit

## Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check database binding
wrangler d1 list

# Verify wrangler.toml configuration
cat wrangler.toml
```

#### Schema Migration Failed
```bash
# Check current schema
wrangler d1 execute akiraxtkd-db --command="PRAGMA table_info(students);"

# Rollback if needed
wrangler d1 execute akiraxtkd-db --file=./scripts/rollback.sql
```

#### Performance Issues
```bash
# Analyze query performance
wrangler d1 execute akiraxtkd-db --command="EXPLAIN QUERY PLAN SELECT * FROM students WHERE status = 'Active';"

# Check index usage
wrangler d1 execute akiraxtkd-db --command="PRAGMA index_list(students);"
```

## Development Workflow

### Local Development
1. Use `wrangler dev` for local testing
2. Database changes in preview environment first
3. Test with seed data

### Deployment
1. Apply schema changes to preview
2. Run integration tests
3. Deploy to production
4. Verify functionality

## Support

For database-related issues:
1. Check the troubleshooting section
2. Review Cloudflare D1 documentation
3. Contact the development team

## References

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
