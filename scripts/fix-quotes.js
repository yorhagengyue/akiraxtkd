/**
 * Fix quote escaping issues in pattern files
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all pattern page files
const patternFiles = glob.sync('app/patterns/*/page.tsx');

patternFiles.forEach(filePath => {
  console.log(`Fixing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix common quote issues
  content = content.replace(/student's/g, 'student\\\'s');
  content = content.replace(/can't/g, 'can\\\'t');
  content = content.replace(/don't/g, 'don\\\'t');
  content = content.replace(/won't/g, 'won\\\'t');
  content = content.replace(/isn't/g, 'isn\\\'t');
  content = content.replace(/doesn't/g, 'doesn\\\'t');
  content = content.replace(/haven't/g, 'haven\\\'t');
  content = content.replace(/shouldn't/g, 'shouldn\\\'t');
  content = content.replace(/wouldn't/g, 'wouldn\\\'t');
  content = content.replace(/couldn't/g, 'couldn\\\'t');
  
  // Fix any remaining unescaped single quotes inside single-quoted strings
  // This is a more complex regex to handle strings properly
  content = content.replace(/'([^']*)'s([^']*)'(?=,|\]|\})/g, "'$1\\'s$2'");
  
  fs.writeFileSync(filePath, content);
});

console.log('Quote fixing complete!');
