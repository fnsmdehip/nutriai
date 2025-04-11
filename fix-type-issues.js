#!/usr/bin/env node

/**
 * This script helps fix common TypeScript issues by:
 * 1. Prefixing unused variables with underscore (_)
 * 2. Adding basic type annotations to common patterns
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Get TypeScript errors
console.log('Running TypeScript to identify errors...');
let tscOutput;
try {
  tscOutput = execSync('npx tsc --noEmit', { encoding: 'utf8' });
} catch (error) {
  tscOutput = error.stdout;
}

// Parse errors from TypeScript output
const unusedVarsRegex = /'(.+)' is defined but never used\./;
const implicitAnyRegex = /Parameter '(.+)' implicitly has an 'any' type\./;

const filesToFix = new Map();

tscOutput.split('\n').forEach(line => {
  if (!line.includes('.tsx:') && !line.includes('.ts:')) return;
  
  const [filePath, lineCol] = line.split(':');
  const lineNumber = parseInt(lineCol, 10);
  if (isNaN(lineNumber)) return;
  
  let fix = null;
  
  if (line.includes('is defined but never used')) {
    const match = line.match(unusedVarsRegex);
    if (match && match[1]) {
      fix = {
        type: 'unused-var',
        varName: match[1],
        line: lineNumber
      };
    }
  } else if (line.includes('implicitly has an \'any\' type')) {
    const match = line.match(implicitAnyRegex);
    if (match && match[1]) {
      fix = {
        type: 'implicit-any',
        varName: match[1],
        line: lineNumber
      };
    }
  }
  
  if (fix) {
    if (!filesToFix.has(filePath)) {
      filesToFix.set(filePath, []);
    }
    filesToFix.get(filePath).push(fix);
  }
});

// Apply fixes to files
console.log(`Found ${filesToFix.size} files with issues to fix.`);

filesToFix.forEach((fixes, filePath) => {
  try {
    console.log(`Fixing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split('\n');
    
    // Sort fixes by line number in descending order to avoid line number shifts
    fixes.sort((a, b) => b.line - a.line);
    
    fixes.forEach(fix => {
      const lineIndex = fix.line - 1; // 0-based index
      
      if (fix.type === 'unused-var') {
        const line = lines[lineIndex];
        // Replace the variable name with a prefixed version
        const newLine = line.replace(
          new RegExp(`\\b${fix.varName}\\b`), 
          `_${fix.varName}`
        );
        lines[lineIndex] = newLine;
      } else if (fix.type === 'implicit-any') {
        const line = lines[lineIndex];
        // Try to add type annotation to function parameter
        if (line.includes(`${fix.varName} =>`)) {
          const newLine = line.replace(
            new RegExp(`\\b${fix.varName}\\b(?= =>)`),
            `${fix.varName}: any`
          );
          lines[lineIndex] = newLine;
        } else if (line.includes(`(${fix.varName}`)) {
          const newLine = line.replace(
            new RegExp(`\\(${fix.varName}\\b`),
            `(${fix.varName}: any`
          );
          lines[lineIndex] = newLine;
        } else if (line.includes(`, ${fix.varName}`)) {
          const newLine = line.replace(
            new RegExp(`, ${fix.varName}\\b`),
            `, ${fix.varName}: any`
          );
          lines[lineIndex] = newLine;
        }
      }
    });
    
    fs.writeFileSync(filePath, lines.join('\n'));
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
  }
});

console.log('\nDone! Fixed common TypeScript issues.');
console.log('Note: "any" types have been added as placeholders. You should replace them with more specific types.');
console.log('Run "npm run typecheck" to see remaining issues.'); 