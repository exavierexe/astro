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
  const swissephPath = path.join(process.cwd());
  const sweTestPath = path.join(swissephPath, 'swetest');
  
  // Check if executable exists
  if (fs.existsSync(sweTestPath)) {
    console.log('Swetest executable found at:', sweTestPath);
    
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
    const output = execSync(command, { 
      env: {
        ...process.env,
        SE_EPHE_PATH: path.join(swissephPath, 'ephe')
      },
      encoding: 'utf8', 
      timeout: 10000 
    });
    
    console.log('Command output:');
    console.log(output);
    console.log('Direct command test completed successfully.');
  } else {
    console.error('Swetest executable not found at:', sweTestPath);
  }
} catch (error) {
  console.error('Error running direct command test:', error);
}

console.log('\nTest completed.');