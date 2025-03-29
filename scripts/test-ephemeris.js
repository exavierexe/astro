#!/usr/bin/env node

/**
 * Test script for the Swiss Ephemeris integration
 * Run with: node scripts/test-ephemeris.js
 */

// Use require syntax for simplicity in this test script
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Print environment info
console.log('Environment Information:');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Working directory:', process.cwd());

// Test direct command execution
console.log('\nTesting direct Swiss Ephemeris command:');
try {
  // First try in public/ephemeris
  const rootDir = process.cwd();
  const publicEphePath = path.join(rootDir, 'public', 'ephemeris');
  let sweTestPath = path.join(publicEphePath, 'swetest');
  let ephePath = path.join(publicEphePath, 'ephe');
  
  // If not found in public/ephemeris, try in swisseph-master
  if (!fs.existsSync(sweTestPath)) {
    console.log('Swetest not found in public/ephemeris, checking swisseph-master...');
    const swissephPath = path.join(rootDir);
    sweTestPath = path.join(swissephPath, 'swetest');
    ephePath = path.join(swissephPath, 'ephe');
  }
  
  // Check if executable exists in either location
  if (fs.existsSync(sweTestPath)) {
    console.log('Swetest executable found at:', sweTestPath);
    console.log('Using ephemeris path:', ephePath);
    
    // Make sure it's executable
    try {
      fs.chmodSync(sweTestPath, 0o755);
      console.log('Set executable permissions on swetest');
    } catch (chmodError) {
      console.error('Could not set executable permissions:', chmodError);
    }
    
    // Build a test command
    const testDate = '01.01.2000';
    const testTime = '12:00';
    const command = `${sweTestPath} -b${testDate}greg -ut${testTime} -p0 -head`;
    
    console.log('Running command:', command);
    
    // Set the library path for shared libraries
    const libraryPath = process.env.DYLD_LIBRARY_PATH || '';
    const newLibraryPath = `${path.dirname(sweTestPath)}:${rootDir}:${libraryPath}`;
    
    const output = execSync(command, { 
      env: {
        ...process.env,
        SE_EPHE_PATH: ephePath,
        DYLD_LIBRARY_PATH: newLibraryPath,
        LD_LIBRARY_PATH: newLibraryPath
      },
      encoding: 'utf8', 
      timeout: 10000 
    });
    
    console.log('Command output:');
    console.log(output);
    console.log('Direct command test completed successfully.');
  } else {
    console.error('Swetest executable not found in either location');
  }
} catch (error) {
  console.error('Error running direct command test:', error);
}

console.log('\nTest completed.');