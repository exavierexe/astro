#!/usr/bin/env node
/**
 * prepare-ephemeris.js
 * 
 * This script creates a minimal Swiss Ephemeris directory with only the
 * essential files needed for birth chart calculations.
 * 
 * It copies required executable, configuration files, and ephemeris data
 * from the main swisseph-master directory to public/ephemeris.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path constants
const SWISS_EPH_PATH = path.join(process.cwd(), 'swisseph-master');
const TARGET_PATH = path.join(process.cwd(), 'public', 'ephemeris');
const TARGET_EPHE_PATH = path.join(TARGET_PATH, 'ephe');

// Ensure target directories exist
console.log('Creating target directories...');
fs.mkdirSync(TARGET_PATH, { recursive: true });
fs.mkdirSync(TARGET_EPHE_PATH, { recursive: true });

// Essential files to copy from the root directory
const essentialRootFiles = [
  { source: 'swetest', dest: 'swetest', executable: true },
  { source: 'libswe.so', dest: 'libswe.so', executable: false },
  { source: 'seleapsec.txt', dest: 'seleapsec.txt', executable: false },
  { source: 'LICENSE', dest: 'LICENSE.txt', executable: false }
];

// Essential files to copy from the ephe directory
const essentialEpheFiles = [
  { source: 'sefstars.txt', dest: 'sefstars.txt' },
  { source: 'seorbel.txt', dest: 'seorbel.txt' }
];

// Ephemeris data files needed for birth chart calculations
// Focus on the modern era (1800-2100)
const ephemerisDataFiles = [
  // Files for 1800-1900 (19th century)
  { source: 'seas_18.se1', dest: 'seas_18.se1' },
  { source: 'semo_18.se1', dest: 'semo_18.se1' },
  { source: 'sepl_18.se1', dest: 'sepl_18.se1' },
  
  // Files for 1900-2000 (20th century)
  { source: 'seas_00.se1', dest: 'seas_00.se1' },
  { source: 'semo_00.se1', dest: 'semo_00.se1' },
  { source: 'sepl_00.se1', dest: 'sepl_00.se1' },
  
  // Files for 2000-2100 (21st century)
  { source: 'seas_24.se1', dest: 'seas_24.se1' },
  { source: 'semo_24.se1', dest: 'semo_24.se1' },
  { source: 'sepl_24.se1', dest: 'sepl_24.se1' }
];

// Function to copy a file with error handling
function copyFile(sourcePath, destPath, makeExecutable = false) {
  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${sourcePath} to ${destPath}`);
    
    if (makeExecutable) {
      try {
        fs.chmodSync(destPath, 0o755);
        console.log(`Made ${destPath} executable`);
      } catch (chmodError) {
        console.error(`Error making ${destPath} executable:`, chmodError);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error copying ${sourcePath}:`, error);
    return false;
  }
}

// Calculate directory size recursively
function getDirectorySize(dirPath) {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  }
  
  return totalSize;
}

// Copy root files
console.log('\nCopying essential root files...');
essentialRootFiles.forEach(file => {
  const sourcePath = path.join(SWISS_EPH_PATH, file.source);
  const destPath = path.join(TARGET_PATH, file.dest);
  copyFile(sourcePath, destPath, file.executable);
});

// Copy ephemeris configuration files
console.log('\nCopying ephemeris configuration files...');
essentialEpheFiles.forEach(file => {
  const sourcePath = path.join(SWISS_EPH_PATH, 'ephe', file.source);
  const destPath = path.join(TARGET_EPHE_PATH, file.dest);
  copyFile(sourcePath, destPath);
});

// Copy ephemeris data files
console.log('\nCopying ephemeris data files for birth chart calculations...');
ephemerisDataFiles.forEach(file => {
  const sourcePath = path.join(SWISS_EPH_PATH, 'ephe', file.source);
  const destPath = path.join(TARGET_EPHE_PATH, file.dest);
  copyFile(sourcePath, destPath);
});

// Create a README.md file in the target directory
console.log('\nCreating README.md...');
const readmeContent = `# Minimal Swiss Ephemeris Files

This directory contains the minimal set of Swiss Ephemeris files required for birth chart calculations in the application.

## Contents

- \`swetest\`: Swiss Ephemeris command-line tool
- \`libswe.so\`: Swiss Ephemeris shared library
- \`seleapsec.txt\`: Leap seconds data
- \`ephe/\`: Directory containing ephemeris data files
  - \`sefstars.txt\`: Fixed stars data
  - \`seorbel.txt\`: Orbital elements data
  - Planetary data files for the period 1800-2100:
    - \`seas_*.se1\`: Asteroids
    - \`semo_*.se1\`: Moon
    - \`sepl_*.se1\`: Planets

## Size Optimization

These files are a minimal subset of the full Swiss Ephemeris library, containing only what's needed for standard birth chart calculations covering dates from 1800 to 2100.

## License

Swiss Ephemeris is licensed under the AGPL license. See the LICENSE.txt file for details.

## Source

These files are derived from the full Swiss Ephemeris package, which can be found at:
https://github.com/aloistr/swisseph

For more information about the Swiss Ephemeris project, visit:
https://www.astro.com/swisseph/
`;

fs.writeFileSync(path.join(TARGET_PATH, 'README.md'), readmeContent);
console.log('Created README.md');

// Calculate and print size difference
const originalSize = getDirectorySize(SWISS_EPH_PATH);
const minimalSize = getDirectorySize(TARGET_PATH);
const sizeDifference = originalSize - minimalSize;
const percentReduction = ((sizeDifference / originalSize) * 100).toFixed(2);

console.log('\n========== Size Comparison ==========');
console.log(`Original Swiss Ephemeris size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Minimal version size: ${(minimalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Size reduction: ${(sizeDifference / 1024 / 1024).toFixed(2)} MB (${percentReduction}% smaller)`);
console.log('=====================================');

// Make the script executable (this will only work on Unix-like systems)
try {
  execSync(`chmod +x "${path.join(process.cwd(), 'scripts', 'prepare-ephemeris.js')}"`);
} catch (error) {
  // Ignore any errors, as this is a nice-to-have
}

console.log('\nDone! The minimal Swiss Ephemeris files are now available in public/ephemeris/');
console.log('You can run birth chart calculations using these files.');
console.log('To exclude the full swisseph-master directory during deployment, ensure it is in .vercelignore');