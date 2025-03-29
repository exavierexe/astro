#!/usr/bin/env node

/**
 * This script prepares a minimal ephemeris directory for serverless deployments
 * by copying only the necessary files from the full Swiss Ephemeris package.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define paths
const rootDir = process.cwd();
const swissephPath = path.join(rootDir); // Already in swisseph-master directory
const publicEphePath = path.join(rootDir, 'public', 'ephemeris');

// Create the public ephemeris directory if it doesn't exist
if (!fs.existsSync(publicEphePath)) {
  console.log(`Creating directory: ${publicEphePath}`);
  fs.mkdirSync(publicEphePath, { recursive: true });
}

// Function to copy a file
function copyFile(source, dest) {
  console.log(`Copying ${source} to ${dest}`);
  fs.copyFileSync(source, dest);
}

// Copy essential configuration files
const essentialFiles = [
  'sefstars.txt',   // Fixed star definitions
  'seleapsec.txt',  // Leap seconds table
  'seorbel.txt'     // Orbital elements
];

essentialFiles.forEach(file => {
  const sourcePath = path.join(swissephPath, 'ephe', file);
  const destPath = path.join(publicEphePath, file);
  
  if (fs.existsSync(sourcePath)) {
    copyFile(sourcePath, destPath);
  } else {
    console.warn(`Warning: Essential file not found: ${sourcePath}`);
  }
});

// Copy the main Swiss Ephemeris executable and library
try {
  // Copy the executable (platform-dependent)
  if (process.platform === 'darwin') {
    // macOS
    copyFile(
      path.join(swissephPath, 'swetest'),
      path.join(publicEphePath, 'swetest')
    );
    
    // Set executable permissions
    execSync(`chmod +x ${path.join(publicEphePath, 'swetest')}`);
    
    // Copy shared libraries
    copyFile(
      path.join(swissephPath, 'libswe.so'),
      path.join(publicEphePath, 'libswe.so')
    );
  } else if (process.platform === 'win32') {
    // Windows
    copyFile(
      path.join(swissephPath, 'windows', 'programs', 'swetest.exe'),
      path.join(publicEphePath, 'swetest.exe')
    );
  } else {
    // Linux/Unix
    copyFile(
      path.join(swissephPath, 'swetest'),
      path.join(publicEphePath, 'swetest')
    );
    
    // Set executable permissions
    execSync(`chmod +x ${path.join(publicEphePath, 'swetest')}`);
    
    // Copy shared libraries
    copyFile(
      path.join(swissephPath, 'libswe.so'),
      path.join(publicEphePath, 'libswe.so')
    );
  }
} catch (error) {
  console.error('Error copying executables:', error);
}

// Create a minimal set of ephemeris files directory
const minimalEpheDir = path.join(publicEphePath, 'ephe');
if (!fs.existsSync(minimalEpheDir)) {
  fs.mkdirSync(minimalEpheDir, { recursive: true });
}

// Copy a subset of ephemeris files (sufficient for most calculations)
const epheFilesToCopy = [
  'seas_18.se1',    // Asteroid ephemeris
  'semo_18.se1',    // Moon ephemeris
  'sepl_18.se1'     // Planets ephemeris
];

epheFilesToCopy.forEach(file => {
  const sourcePath = path.join(swissephPath, 'ephe', file);
  const destPath = path.join(minimalEpheDir, file);
  
  if (fs.existsSync(sourcePath)) {
    copyFile(sourcePath, destPath);
  } else {
    console.warn(`Warning: Ephemeris file not found: ${sourcePath}`);
  }
});

// Create a README file in the public ephemeris directory
const readmeContent = `# Minimal Swiss Ephemeris Files

This directory contains a minimal set of files from the Swiss Ephemeris package
that are sufficient for basic astrological calculations. The full package can be
found at https://www.astro.com/swisseph/.

These files are used for calculating planetary positions and astronomical data
in the application. In serverless environments, the application will fall back
to simplified calculations.

## Files Included

- swetest: The Swiss Ephemeris command-line calculator
- libswe.so: The Swiss Ephemeris shared library
- Configuration files: sefstars.txt, seleapsec.txt, seorbel.txt
- Ephemeris files in the ephe/ subdirectory

## License

The Swiss Ephemeris is licensed under either the AGPL or a commercial license.
See the original package for full license details.
`;

fs.writeFileSync(path.join(publicEphePath, 'README.md'), readmeContent);

console.log('Ephemeris preparation complete.');