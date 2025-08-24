/**
 * 批量修复Dashboard中的硬编码API URL
 * 将localhost:8787替换为配置化的API端点
 */

const fs = require('fs');
const path = require('path');

// 需要修复的文件列表
const filesToFix = [
  'app/dashboard/admin/page.tsx',
  'app/dashboard/coach/page.tsx',
  'app/dashboard/student/page.tsx',
  'app/login/page.tsx',
  'app/register/page.tsx',
];

// URL映射规则
const urlMappings = {
  // Admin Dashboard
  'http://localhost:8787/api/dashboard/admin/kpis': 'API_ENDPOINTS.dashboard.admin.kpis()',
  'http://localhost:8787/api/dashboard/admin/risks': 'API_ENDPOINTS.dashboard.admin.risks()',
  'http://localhost:8787/api/dashboard/admin/activities': 'API_ENDPOINTS.dashboard.admin.activities()',
  'http://localhost:8787/api/dashboard/admin/students-overview': 'API_ENDPOINTS.dashboard.admin.studentsOverview()',
  
  // Coach Dashboard
  'http://localhost:8787/api/dashboard/coach/kpis': 'API_ENDPOINTS.dashboard.coach.kpis()',
  'http://localhost:8787/api/dashboard/coach/sessions': 'API_ENDPOINTS.dashboard.coach.sessions()',
  'http://localhost:8787/api/dashboard/coach/students': 'API_ENDPOINTS.dashboard.coach.students()',
  
  // Student Dashboard
  'http://localhost:8787/api/dashboard/student/overview': 'API_ENDPOINTS.dashboard.student.overview()',
  'http://localhost:8787/api/dashboard/student/classes': 'API_ENDPOINTS.dashboard.student.classes()',
  'http://localhost:8787/api/dashboard/student/events': 'API_ENDPOINTS.dashboard.student.events()',
  
  // Auth
  'http://localhost:8787/api/auth/login': 'API_ENDPOINTS.auth.login()',
  'http://localhost:8787/api/auth/dev-users': 'API_ENDPOINTS.auth.devUsers()',
  
  // Students
  'http://localhost:8787/api/students': 'API_ENDPOINTS.students.list()',
  
  // Environment
  'http://localhost:8787/api/env-info': 'API_ENDPOINTS.envInfo()',
};

function fixFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // 检查是否已经导入了API_ENDPOINTS
  const hasImport = content.includes("import { API_ENDPOINTS }") || 
                   content.includes("await import('@/lib/config')");
  
  // 如果没有导入，添加导入语句
  if (!hasImport && Object.keys(urlMappings).some(url => content.includes(url))) {
    // 找到第一个import语句的位置
    const importMatch = content.match(/import.*from.*['"][^'"]*['"];?\n/);
    if (importMatch) {
      const insertPos = content.indexOf(importMatch[0]) + importMatch[0].length;
      content = content.slice(0, insertPos) + 
                "import { API_ENDPOINTS } from '@/lib/config';\n" + 
                content.slice(insertPos);
      hasChanges = true;
      console.log('  ✅ Added API_ENDPOINTS import');
    }
  }
  
  // 替换URL
  let replacements = 0;
  for (const [oldUrl, newEndpoint] of Object.entries(urlMappings)) {
    if (content.includes(`'${oldUrl}'`) || content.includes(`"${oldUrl}"`)) {
      content = content.replace(new RegExp(`['"]${oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g'), newEndpoint);
      replacements++;
      hasChanges = true;
    }
  }
  
  if (replacements > 0) {
    console.log(`  ✅ Replaced ${replacements} URL(s)`);
  }
  
  // 处理动态URL (带参数的)
  const dynamicPatterns = [
    {
      pattern: /(['"]http:\/\/localhost:8787\/api\/dashboard\/coach\/sessions\?[^'"]*['"])/g,
      replacement: 'API_ENDPOINTS.dashboard.coach.sessions("$1")'
    }
  ];
  
  dynamicPatterns.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, (match, p1) => {
        const params = p1.split('?')[1]?.replace(/['"]/g, '');
        return `API_ENDPOINTS.dashboard.coach.sessions("${params}")`;
      });
      hasChanges = true;
      console.log('  ✅ Fixed dynamic URL pattern');
    }
  });
  
  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ℹ️  No changes needed for ${filePath}`);
  }
}

function main() {
  console.log('🔧 Fixing hardcoded API URLs...\n');
  
  filesToFix.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    fixFile(fullPath);
    console.log('');
  });
  
  console.log('✅ All files processed!');
  console.log('\n📝 Next steps:');
  console.log('1. Update lib/config.ts with your actual Workers URLs');
  console.log('2. Test the application locally');
  console.log('3. Deploy to Cloudflare Pages');
}

if (require.main === module) {
  main();
}

module.exports = { fixFile, urlMappings };
