#!/usr/bin/env node

/**
 * This script updates Theme imports to use ThemeCompat.
 * It scans app components and screens to convert usages of the Theme object to ThemeCompat.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const APP_DIR = path.join(process.cwd(), 'app');
const THEME_PATH_REGEX = /from ['"].*\/(theme)['"];?$/;
const THEME_IMPORT_REGEX = /import\s+{\s*Theme\s*}.*['"].*\/(theme)['"];?$/;
const THEME_USAGE_REGEX = /Theme\.(spacing|typography)/g;

/**
 * Recursively find all .ts and .tsx files
 */
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Update Theme imports and usages in a file
 */
function updateFile(filePath) {
  console.log(`Processing ${path.relative(process.cwd(), filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if file is using Theme
  if (content.includes('Theme.')) {
    // Check if there's a Theme import
    const hasThemeImport = THEME_IMPORT_REGEX.test(content);
    
    if (hasThemeImport) {
      // Replace Theme import with ThemeCompat
      content = content.replace(
        THEME_IMPORT_REGEX,
        (match) => match.replace('Theme', 'ThemeCompat').replace('/theme', '/themeMapping')
      );
      
      // Replace Theme usage with ThemeCompat
      content = content.replace(THEME_USAGE_REGEX, 'ThemeCompat.$1');
      
      modified = true;
    } else if (THEME_USAGE_REGEX.test(content)) {
      // Theme is used but not imported directly - need to add import
      const importSection = content.match(/import.*from.*/g) || [];
      const lastImport = importSection[importSection.length - 1];
      
      if (lastImport) {
        const newImport = `import { ThemeCompat } from '../utils/themeMapping';`;
        content = content.replace(
          lastImport,
          `${lastImport}\n${newImport}`
        );
      } else {
        // No imports found, add at the top
        content = `import { ThemeCompat } from '../utils/themeMapping';\n\n${content}`;
      }
      
      // Replace Theme usage with ThemeCompat
      content = content.replace(THEME_USAGE_REGEX, 'ThemeCompat.$1');
      
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${path.relative(process.cwd(), filePath)}`);
    }
  }
  
  return modified;
}

// Main execution
console.log('Scanning for Theme usages...');
const files = findFiles(APP_DIR);
console.log(`Found ${files.length} .ts/.tsx files.`);

let updatedFiles = 0;

files.forEach(file => {
  if (updateFile(file)) {
    updatedFiles++;
  }
});

console.log(`\nUpdated ${updatedFiles} files to use ThemeCompat.`);
console.log('Run "npm run typecheck" to verify the updates fixed TypeScript errors.'); 