#!/usr/bin/env node

// Deployment script to work around Render path issues
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Daily Doodle Cat Deployment Script ===');
console.log('Current working directory:', process.cwd());
console.log('Directory contents:');
console.log(fs.readdirSync('.').join(', '));

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('ERROR: package.json not found in current directory');
  console.error('Looking for:', packageJsonPath);
  
  // Try to find package.json in parent directories
  let currentDir = process.cwd();
  let found = false;
  
  for (let i = 0; i < 3; i++) {
    const parentDir = path.dirname(currentDir);
    const parentPackageJson = path.join(parentDir, 'package.json');
    
    if (fs.existsSync(parentPackageJson)) {
      console.log('Found package.json in:', parentDir);
      process.chdir(parentDir);
      found = true;
      break;
    }
    currentDir = parentDir;
  }
  
  if (!found) {
    console.error('Could not locate package.json');
    process.exit(1);
  }
}

console.log('Using directory:', process.cwd());

try {
  console.log('Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });
  
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}