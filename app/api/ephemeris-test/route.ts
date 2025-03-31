import { NextResponse } from 'next/server';

// Add specific version checking to help diagnose issues
export const dynamic = 'force-dynamic'; // Ensure this is not cached

export async function GET() {
  console.log('Ephemeris test endpoint called');
  
  // Return a diagnostic response
  const diagnosticInfo: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: typeof window === 'undefined' ? 'server' : 'client',
    ephemerisStatus: 'checking'
  };
  
  try {
    // Check which version of node is running
    diagnosticInfo.nodeVersion = process.version;
    diagnosticInfo.nodeEnvironment = process.env.NODE_ENV || 'unknown';
    
    // Try to import the server-ephemeris module first (this should work in prod)
    try {
      const serverEphemeris = require('../../../lib/server-ephemeris');
      diagnosticInfo.serverEphemerisImported = true;
      diagnosticInfo.serverEphemerisType = typeof serverEphemeris;
      diagnosticInfo.serverEphemerisFunctions = Object.keys(serverEphemeris);
    } catch (error) {
      // Handle the unknown error type properly
      diagnosticInfo.serverEphemerisError = error instanceof Error ? error.message : String(error);
    }
    
    // Try to import the ephemeris wrapper
    const ephemerisWrapper = require('../../../lib/ephemeris-wrapper');
    diagnosticInfo.wrapperImported = true;
    
    // Try to get the current planetary positions
    const testDate = new Date();
    const result = ephemerisWrapper.getAllPlanets(
      testDate,
      0, // Greenwich longitude
      0, // Equator latitude
      0  // Sea level
    );
    
    // Check if we got valid data
    if (result && result.date && result.observed) {
      diagnosticInfo.ephemerisStatus = 'working';
      diagnosticInfo.julianDay = result.date.julianDay || 'unknown';
      diagnosticInfo.planets = Object.keys(result.observed);
      
      // Sample a few planets
      if (result.observed.sun) {
        diagnosticInfo.sunLongitude = result.observed.sun.apparentLongitudeDd;
      }
      
      if (result.observed.moon) {
        diagnosticInfo.moonLongitude = result.observed.moon.apparentLongitudeDd;
      }
    } else {
      diagnosticInfo.ephemerisStatus = 'incomplete-data';
      diagnosticInfo.resultStructure = JSON.stringify(result).substring(0, 200) + '...';
    }
  } catch (error: unknown) {
    diagnosticInfo.ephemerisStatus = 'error';
    diagnosticInfo.error = error instanceof Error ? error.message : String(error);
    diagnosticInfo.errorStack = error instanceof Error ? error.stack : null;
  }
  
  // Also check if the ephemeris module is globally available
  if (typeof global !== 'undefined') {
    // Use type assertion to avoid TypeScript error
    const globalWithEphemeris = global as any;
    diagnosticInfo.globalEphemerisAvailable = !!globalWithEphemeris.ephemeris;
  }
  
  return NextResponse.json(diagnosticInfo);
}