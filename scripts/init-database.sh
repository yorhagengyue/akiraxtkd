#!/bin/bash

# Akira X Taekwondo Database Initialization Script
# This script sets up the Cloudflare D1 database for development

set -e  # Exit on any error

echo "🚀 Initializing Akira X Taekwondo Database..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI is not installed. Please install it first:${NC}"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  You are not logged in to Cloudflare. Please login first:${NC}"
    echo "wrangler login"
    exit 1
fi

# Environment setup
ENVIRONMENT=${ENVIRONMENT:-development}
echo -e "${BLUE}📋 Environment: ${ENVIRONMENT}${NC}"

# Database names based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    DB_NAME="akiraxtkd-db"
elif [ "$ENVIRONMENT" = "preview" ]; then
    DB_NAME="akiraxtkd-db-preview"
else
    DB_NAME="akiraxtkd-db-dev"
fi

echo -e "${BLUE}📊 Database name: ${DB_NAME}${NC}"

# Check if database already exists
echo -e "${BLUE}🔍 Checking if database exists...${NC}"
if wrangler d1 list | grep -q "$DB_NAME"; then
    echo -e "${YELLOW}⚠️  Database ${DB_NAME} already exists.${NC}"
    read -p "Do you want to recreate it? This will delete all existing data! (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🗑️  Deleting existing database...${NC}"
        # Note: D1 doesn't have a direct delete command, so we'll just proceed with recreation
        echo -e "${YELLOW}⚠️  Please manually delete the database from Cloudflare Dashboard if needed${NC}"
    else
        echo -e "${GREEN}✅ Using existing database${NC}"
        SKIP_CREATE=true
    fi
fi

# Create database if it doesn't exist or user chose to recreate
if [ "$SKIP_CREATE" != "true" ]; then
    echo -e "${BLUE}📊 Creating database: ${DB_NAME}${NC}"
    wrangler d1 create "$DB_NAME"
    
    # Get the database ID
    echo -e "${BLUE}🔍 Getting database ID...${NC}"
    DB_ID=$(wrangler d1 list | grep "$DB_NAME" | awk '{print $2}')
    
    if [ -z "$DB_ID" ]; then
        echo -e "${RED}❌ Failed to get database ID${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Database created with ID: ${DB_ID}${NC}"
    echo -e "${YELLOW}📝 Please update your wrangler.toml with this database ID:${NC}"
    echo "database_id = \"$DB_ID\""
else
    # Get existing database ID
    DB_ID=$(wrangler d1 list | grep "$DB_NAME" | awk '{print $2}')
    echo -e "${BLUE}📊 Using existing database ID: ${DB_ID}${NC}"
fi

# Apply schema
echo -e "${BLUE}🏗️  Applying database schema...${NC}"
if [ -f "database/schema-v2.sql" ]; then
    wrangler d1 execute "$DB_NAME" --file=database/schema-v2.sql
    echo -e "${GREEN}✅ Schema applied successfully${NC}"
else
    echo -e "${RED}❌ Schema file not found: database/schema-v2.sql${NC}"
    exit 1
fi

# Apply seed data
echo -e "${BLUE}🌱 Inserting seed data...${NC}"
if [ -f "database/seed-v2.sql" ]; then
    wrangler d1 execute "$DB_NAME" --file=database/seed-v2.sql
    echo -e "${GREEN}✅ Seed data inserted successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Seed file not found: database/seed-v2.sql${NC}"
    echo -e "${YELLOW}⚠️  Skipping seed data insertion${NC}"
fi

# Verify database setup
echo -e "${BLUE}🔍 Verifying database setup...${NC}"

# Check if tables were created
TABLE_COUNT=$(wrangler d1 execute "$DB_NAME" --command="SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'" | grep -o '[0-9]\+' | tail -1)
echo -e "${BLUE}📊 Tables created: ${TABLE_COUNT}${NC}"

# Check if development users were created
if [ "$ENVIRONMENT" = "development" ]; then
    USER_COUNT=$(wrangler d1 execute "$DB_NAME" --command="SELECT COUNT(*) as count FROM user_accounts WHERE provider='dev'" | grep -o '[0-9]\+' | tail -1)
    echo -e "${BLUE}👥 Development users created: ${USER_COUNT}${NC}"
    
    if [ "$USER_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Development users available:${NC}"
        wrangler d1 execute "$DB_NAME" --command="SELECT email, role, display_name FROM user_accounts WHERE provider='dev'"
    fi
fi

# Display connection information
echo -e "${GREEN}🎉 Database initialization complete!${NC}"
echo
echo -e "${BLUE}📋 Database Information:${NC}"
echo "  Name: $DB_NAME"
echo "  ID: $DB_ID"
echo "  Environment: $ENVIRONMENT"
echo
echo -e "${BLUE}🔧 Next Steps:${NC}"
echo "1. Update your wrangler.toml with the database ID above"
echo "2. Start your development server: npm run dev"
echo "3. Test the API endpoints"
echo

if [ "$ENVIRONMENT" = "development" ]; then
    echo -e "${BLUE}🧪 Development Mode:${NC}"
    echo "  - Authentication is disabled by default"
    echo "  - Development users are available"
    echo "  - Use ?dev_user=dev-admin|dev-coach|dev-student to switch users"
    echo
fi

echo -e "${BLUE}🔗 Useful Commands:${NC}"
echo "  List databases: wrangler d1 list"
echo "  Query database: wrangler d1 execute $DB_NAME --command=\"SELECT * FROM user_accounts LIMIT 5\""
echo "  Database info: wrangler d1 info $DB_NAME"
echo

echo -e "${GREEN}✨ Happy coding!${NC}"
