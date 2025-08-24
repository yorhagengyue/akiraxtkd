# Cloudflare D1 Database Setup Guide

## 🚀 Quick Setup Steps

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
# Create production database
wrangler d1 create akiraxtkd-db

# Create preview database
wrangler d1 create akiraxtkd-db-preview
```

### 4. Update wrangler.toml
After creating databases, copy the database_id from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "akiraxtkd-db"
database_id = "your-production-database-id-here"

[env.production.d1_databases]
binding = "DB"
database_name = "akiraxtkd-db"
database_id = "your-production-database-id-here"

[env.preview.d1_databases]
binding = "DB"
database_name = "akiraxtkd-db-preview"
database_id = "your-preview-database-id-here"
```

### 5. Initialize Database Schema
```bash
# Apply schema to production database
wrangler d1 execute akiraxtkd-db --file=./database/schema.sql

# Apply schema to preview database
wrangler d1 execute akiraxtkd-db-preview --file=./database/schema.sql
```

### 6. Seed Initial Data
```bash
# Seed production database
wrangler d1 execute akiraxtkd-db --file=./database/seed.sql

# Seed preview database (optional)
wrangler d1 execute akiraxtkd-db-preview --file=./database/seed.sql
```

### 7. Test Database Connection
```bash
# Query students from production
wrangler d1 execute akiraxtkd-db --command="SELECT COUNT(*) as student_count FROM students"

# Query from preview
wrangler d1 execute akiraxtkd-db-preview --command="SELECT COUNT(*) as student_count FROM students"
```

## 🔧 Development Workflow

### Local Development
```bash
# Start local development with D1 binding
wrangler pages dev --d1=DB:akiraxtkd-db

# Or with preview database
wrangler pages dev --d1=DB:akiraxtkd-db-preview
```

### Database Management
```bash
# View all databases
wrangler d1 list

# Execute SQL commands
wrangler d1 execute akiraxtkd-db --command="SELECT * FROM students LIMIT 5"

# Execute SQL file
wrangler d1 execute akiraxtkd-db --file=./path/to/query.sql

# Backup database (export)
wrangler d1 export akiraxtkd-db --output=backup.sql

# Check database info
wrangler d1 info akiraxtkd-db
```

### Schema Updates
When updating the schema:

1. Create migration file:
```sql
-- migrations/001_add_new_column.sql
ALTER TABLE students ADD COLUMN new_field VARCHAR(100);
```

2. Apply migration:
```bash
wrangler d1 execute akiraxtkd-db --file=./migrations/001_add_new_column.sql
```

## 📊 Monitoring & Analytics

### Query Performance
```bash
# Check query performance
wrangler d1 execute akiraxtkd-db --command="EXPLAIN QUERY PLAN SELECT * FROM students WHERE status = 'Active'"
```

### Database Size
```bash
# Check database size and usage
wrangler d1 info akiraxtkd-db
```

## 🔐 Security Considerations

### Access Control
- Database is automatically secured by Cloudflare's infrastructure
- Only your Workers/Pages can access the database
- No direct external access to D1 databases

### Data Protection
- All data is encrypted at rest
- Automatic backups by Cloudflare
- Point-in-time recovery available

## 🚨 Troubleshooting

### Common Issues

1. **Database not found error**
   ```bash
   # Verify database exists
   wrangler d1 list
   ```

2. **Schema errors**
   ```bash
   # Check table structure
   wrangler d1 execute akiraxtkd-db --command=".schema students"
   ```

3. **Binding errors**
   ```bash
   # Verify wrangler.toml configuration
   cat wrangler.toml
   ```

4. **Permission errors**
   ```bash
   # Re-authenticate
   wrangler logout
   wrangler login
   ```

### Testing Database
```bash
# Test basic CRUD operations
wrangler d1 execute akiraxtkd-db --command="
  INSERT INTO students (student_code, first_name, last_name, date_of_birth, gender, joined_date) 
  VALUES ('TEST001', 'Test', 'Student', '2010-01-01', 'Male', '2024-12-19')
"

wrangler d1 execute akiraxtkd-db --command="SELECT * FROM students WHERE student_code = 'TEST001'"

wrangler d1 execute akiraxtkd-db --command="DELETE FROM students WHERE student_code = 'TEST001'"
```

## 📈 Performance Optimization

### Indexing
Our schema includes optimized indexes for:
- Student status queries
- Date-based queries
- Attendance lookups
- Payment searches

### Query Optimization Tips
1. Use LIMIT for large result sets
2. Index frequently queried columns
3. Use prepared statements (automatically done in our API)
4. Avoid SELECT * when possible

## 🔄 Backup & Recovery

### Manual Backup
```bash
# Export full database
wrangler d1 export akiraxtkd-db --output=backup-$(date +%Y%m%d).sql
```

### Automated Backups
Cloudflare automatically maintains backups, but for additional safety:

1. Set up scheduled exports
2. Store critical data exports in external storage
3. Test recovery procedures regularly

## 🌐 Production Deployment

### Final Steps
1. Update production database IDs in `wrangler.toml`
2. Deploy to Cloudflare Pages: `wrangler pages deploy`
3. Verify API endpoints work
4. Test data operations
5. Monitor performance

### Environment Variables
Set in Cloudflare Dashboard or via Wrangler:
```bash
wrangler pages secret put ENVIRONMENT production
wrangler pages secret put APP_NAME "Akira X Taekwondo"
wrangler pages secret put CONTACT_EMAIL "teamakiraxtaekwondo@gmail.com"
```

Your database is now ready for the Akira X Taekwondo management system! 🥋
