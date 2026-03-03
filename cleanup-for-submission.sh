#!/bin/bash
# cleanup-for-submission.sh
# สคริปต์ลบไฟล์ที่ไม่ต้องการก่อนส่งหัวหน้า

echo "🧹 Cleaning up Playwright project for submission..."
echo ""

# สีสำหรับ output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# นับจำนวนไฟล์ก่อนลบ
BEFORE_COUNT=$(find . -type f ! -path "./node_modules/*" ! -path "./.git/*" | wc -l)
echo "📊 Files before cleanup: $BEFORE_COUNT"
echo ""

# ⚠️ ลบไฟล์ที่มี credentials (สำคัญ!)
if [ -f ".env" ]; then
    echo "${RED}🚨 Removing .env (contains credentials)${NC}"
    rm -f .env
fi

# 🗑️ ลบโฟลเดอร์ที่ใหญ่/ชั่วคราว
echo "${YELLOW}🗑️  Removing temporary folders...${NC}"
rm -rf node_modules/
rm -rf test-results/
rm -rf playwright-report/
rm -rf playwright/.auth/
rm -rf .DS_Store

# 🗑️ ลบไฟล์ชั่วคราว
echo "${YELLOW}🗑️  Removing temporary files...${NC}"
rm -f recorded-login.spec.ts
rm -f test-setup.js
rm -f package-lock.json
rm -f .DS_Store

# 🗑️ ลบ debug files (เก็บไว้แค่ production tests)
echo "${YELLOW}🗑️  Removing debug files...${NC}"
rm -f tests/auth/diagnostic.spec.ts
rm -f tests/auth/login-debug.spec.ts
rm -f LOGIN_DEBUG_REPORT.md
rm -f LOGIN_TEST_LOG.md
rm -f QUICKSTART.md

# นับจำนวนไฟล์หลังลบ
AFTER_COUNT=$(find . -type f ! -path "./.git/*" | wc -l)

# แสดงผลลัพธ์
echo ""
echo "${GREEN}✅ Cleanup complete!${NC}"
echo "📊 Files after cleanup: $AFTER_COUNT"
echo ""

# แสดงโครงสร้างไฟล์ที่เหลือ
echo "📁 Remaining structure:"
echo ""
tree -L 3 -I 'node_modules|test-results|playwright-report|.git' 2>/dev/null || find . -maxdepth 2 -type f ! -path "./.git/*" | head -30

echo ""
echo "${GREEN}📦 Project ready for submission!${NC}"
echo ""
echo "📝 Important files to review:"
echo "   - README.md"
echo "   - PROJECT_DOCUMENTATION.md"
echo "   - CHANGELOG.md"
echo ""
