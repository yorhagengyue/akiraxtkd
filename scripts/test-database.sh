#!/bin/bash

# Database Test Script
# Quick tests to verify database functionality

set -e

echo "🧪 Testing Akira X Taekwondo Database..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Environment setup
ENVIRONMENT=${ENVIRONMENT:-development}
if [ "$ENVIRONMENT" = "production" ]; then
    DB_NAME="akiraxtkd-db"
elif [ "$ENVIRONMENT" = "preview" ]; then
    DB_NAME="akiraxtkd-db-preview"
else
    DB_NAME="akiraxtkd-db-dev"
fi

echo -e "${BLUE}📊 Testing database: ${DB_NAME}${NC}"

# Test 1: Check if database exists
echo -e "${BLUE}🔍 Test 1: Database existence${NC}"
if wrangler d1 list | grep -q "$DB_NAME"; then
    echo -e "${GREEN}✅ Database exists${NC}"
else
    echo -e "${RED}❌ Database not found${NC}"
    exit 1
fi

# Test 2: Check table count
echo -e "${BLUE}🔍 Test 2: Table count${NC}"
TABLE_COUNT=$(wrangler d1 execute "$DB_NAME" --command="SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'" | grep -o '[0-9]\+' | tail -1)
echo -e "${BLUE}📊 Tables found: ${TABLE_COUNT}${NC}"
if [ "$TABLE_COUNT" -gt 20 ]; then
    echo -e "${GREEN}✅ Sufficient tables created${NC}"
else
    echo -e "${RED}❌ Not enough tables found${NC}"
fi

# Test 3: Check development users
echo -e "${BLUE}🔍 Test 3: Development users${NC}"
USER_COUNT=$(wrangler d1 execute "$DB_NAME" --command="SELECT COUNT(*) as count FROM user_accounts WHERE provider='dev'" | grep -o '[0-9]\+' | tail -1)
echo -e "${BLUE}👥 Dev users found: ${USER_COUNT}${NC}"
if [ "$USER_COUNT" -eq 3 ]; then
    echo -e "${GREEN}✅ All development users present${NC}"
else
    echo -e "${RED}❌ Missing development users${NC}"
fi

# Test 4: Check rank system
echo -e "${BLUE}🔍 Test 4: Rank system${NC}"
RANK_COUNT=$(wrangler d1 execute "$DB_NAME" --command="SELECT COUNT(*) as count FROM ranks" | grep -o '[0-9]\+' | tail -1)
echo -e "${BLUE}🥋 Ranks found: ${RANK_COUNT}${NC}"
if [ "$RANK_COUNT" -gt 15 ]; then
    echo -e "${GREEN}✅ Rank system populated${NC}"
else
    echo -e "${RED}❌ Insufficient ranks${NC}"
fi

# Test 5: Check venues
echo -e "${BLUE}🔍 Test 5: Training venues${NC}"
VENUE_COUNT=$(wrangler d1 execute "$DB_NAME" --command="SELECT COUNT(*) as count FROM venues" | grep -o '[0-9]\+' | tail -1)
echo -e "${BLUE}🏢 Venues found: ${VENUE_COUNT}${NC}"
if [ "$VENUE_COUNT" -ge 5 ]; then
    echo -e "${GREEN}✅ Training venues available${NC}"
else
    echo -e "${RED}❌ Not enough venues${NC}"
fi

# Test 6: Check classes
echo -e "${BLUE}🔍 Test 6: Classes${NC}"
CLASS_COUNT=$(wrangler d1 execute "$DB_NAME" --command="SELECT COUNT(*) as count FROM classes" | grep -o '[0-9]\+' | tail -1)
echo -e "${BLUE}📚 Classes found: ${CLASS_COUNT}${NC}"
if [ "$CLASS_COUNT" -ge 5 ]; then
    echo -e "${GREEN}✅ Classes configured${NC}"
else
    echo -e "${RED}❌ Not enough classes${NC}"
fi

# Test 7: Check foreign key constraints
echo -e "${BLUE}🔍 Test 7: Foreign key constraints${NC}"
echo "Testing coach profile reference..."
COACH_PROFILE_TEST=$(wrangler d1 execute "$DB_NAME" --command="SELECT COUNT(*) as count FROM coach_profiles cp JOIN user_accounts ua ON cp.coach_id = ua.user_id WHERE ua.role = 'coach'" | grep -o '[0-9]\+' | tail -1)
if [ "$COACH_PROFILE_TEST" -gt 0 ]; then
    echo -e "${GREEN}✅ Foreign key constraints working${NC}"
else
    echo -e "${RED}❌ Foreign key constraint issues${NC}"
fi

# Test 8: Sample data query
echo -e "${BLUE}🔍 Test 8: Sample data query${NC}"
echo "Querying development users..."
wrangler d1 execute "$DB_NAME" --command="SELECT email, role, display_name FROM user_accounts WHERE provider='dev' ORDER BY role"

echo
echo -e "${BLUE}🔍 Test 9: Class schedule query${NC}"
echo "Querying class schedule..."
wrangler d1 execute "$DB_NAME" --command="SELECT c.name, v.name as venue, c.day_of_week, c.start_time, c.end_time FROM classes c JOIN venues v ON c.venue_id = v.venue_id ORDER BY c.day_of_week, c.start_time LIMIT 5"

echo
echo -e "${GREEN}🎉 Database tests completed!${NC}"
echo
echo -e "${BLUE}📊 Summary:${NC}"
echo "  Database: $DB_NAME"
echo "  Tables: $TABLE_COUNT"
echo "  Dev Users: $USER_COUNT"
echo "  Ranks: $RANK_COUNT"
echo "  Venues: $VENUE_COUNT"
echo "  Classes: $CLASS_COUNT"
echo
echo -e "${BLUE}🔗 Quick Commands:${NC}"
echo "  wrangler d1 execute $DB_NAME --command=\"SELECT * FROM user_accounts LIMIT 3\""
echo "  wrangler d1 execute $DB_NAME --command=\"SELECT * FROM classes LIMIT 3\""
echo "  wrangler d1 execute $DB_NAME --command=\"SELECT * FROM ranks ORDER BY track_id, order_index LIMIT 10\""
