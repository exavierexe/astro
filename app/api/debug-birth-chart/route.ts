import { NextResponse } from 'next/server';

// Add specific version checking to help diagnose issues
export const dynamic = 'force-dynamic'; // Ensure this is not cached
export const maxDuration = 60; // Allow up to 60 seconds for this API route

export async function POST(request: Request) {
  console.log('[DEBUG-BIRTH-CHART] Debug API called');
  
  try {
    // Parse the request body for birth chart parameters
    const body = await request.json();
    const { birthDate, birthTime, birthPlace } = body;
    
    // Create diagnostic info
    const diagnosticInfo: Record<string, any> = {
      timestamp: new Date().toISOString(),
      environment: typeof window === 'undefined' ? 'server' : 'client',
      nodeVersion: process.version,
      nodeEnvironment: process.env.NODE_ENV || 'unknown',
      input: { birthDate, birthTime, birthPlace }
    };
    
    // Step 1: Check if we can import the necessary modules
    let serverEphemeris, ephemerisWrapper, geocodeFunction, calculateChartFunction;
    
    try {
      serverEphemeris = require('../../../lib/server-ephemeris');
      diagnosticInfo.serverEphemerisImported = true;
      diagnosticInfo.serverEphemerisFunctions = Object.keys(serverEphemeris);
    } catch (error) {
      diagnosticInfo.serverEphemerisError = error instanceof Error 
        ? { message: error.message, stack: error.stack } 
        : String(error);
    }
    
    try {
      ephemerisWrapper = require('../../../lib/ephemeris-wrapper');
      diagnosticInfo.ephemerisWrapperImported = true;
      diagnosticInfo.ephemerisWrapperFunctions = Object.keys(ephemerisWrapper);
    } catch (error) {
      diagnosticInfo.ephemerisWrapperError = error instanceof Error 
        ? { message: error.message, stack: error.stack } 
        : String(error);
    }
    
    try {
      const ephemerisModule = require('../../../lib/ephemeris');
      diagnosticInfo.ephemerisModuleImported = true;
      
      // Check if we can access the functions
      geocodeFunction = ephemerisModule.geocodeLocation;
      calculateChartFunction = ephemerisModule.calculateBirthChart;
      
      diagnosticInfo.geocodeFunctionAvailable = typeof geocodeFunction === 'function';
      diagnosticInfo.calculateChartFunctionAvailable = typeof calculateChartFunction === 'function';
    } catch (error) {
      diagnosticInfo.ephemerisModuleError = error instanceof Error 
        ? { message: error.message, stack: error.stack } 
        : String(error);
    }
    
    // Step 2: Try to import the actions
    try {
      const actions = require('../../../actions');
      diagnosticInfo.actionsImported = true;
      diagnosticInfo.calculateBirthChartActionAvailable = 
        typeof actions.calculateBirthChartWithSwissEph === 'function';
    } catch (error) {
      diagnosticInfo.actionsError = error instanceof Error 
        ? { message: error.message, stack: error.stack } 
        : String(error);
    }
    
    // Step 3: Try to geocode the location
    if (geocodeFunction && birthPlace) {
      try {
        const locationResult = await geocodeFunction(birthPlace);
        diagnosticInfo.geocodeResult = {
          success: true,
          latitude: locationResult.latitude,
          longitude: locationResult.longitude,
          formattedAddress: locationResult.formattedAddress,
          hasTimeZone: !!locationResult.timeZone
        };
        
        if (locationResult.timeZone) {
          diagnosticInfo.timeZone = {
            zoneName: locationResult.timeZone.zoneName,
            utcOffset: locationResult.timeZone.utcOffset,
            countryName: locationResult.timeZone.countryName
          };
        }
      } catch (error) {
        diagnosticInfo.geocodeError = error instanceof Error 
          ? { message: error.message, stack: error.stack } 
          : String(error);
      }
    }
    
    // Step 4: Try to test the ephemeris module directly
    if (ephemerisWrapper) {
      try {
        const testDate = new Date();
        const testResult = ephemerisWrapper.getAllPlanets(
          testDate,
          0, // Greenwich longitude
          0, // Equator latitude
          0  // Sea level
        );
        
        diagnosticInfo.ephemerisTest = {
          success: true,
          hasDate: !!testResult.date,
          hasObserved: !!testResult.observed,
          julianDay: testResult.date?.julianDay || 'missing',
          planets: testResult.observed ? Object.keys(testResult.observed) : []
        };
      } catch (error) {
        diagnosticInfo.ephemerisTestError = error instanceof Error 
          ? { message: error.message, stack: error.stack } 
          : String(error);
      }
    }
    
    // Step 5: Try to calculate a birth chart with direct function
    if (calculateChartFunction && birthDate && birthTime) {
      try {
        // Parse date and time
        const [year, month, day] = birthDate.split('-').map(Number);
        const [hour, minute] = birthTime.split(':').map(Number);
        
        // Create Date object - we'll use UTC for testing
        const parsedDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
        
        // For the test, use fixed coordinates (New York)
        const latitude = 40.7128;
        const longitude = -74.0060;
        
        const chartResult = await calculateChartFunction(
          parsedDate,
          latitude,
          longitude
        );
        
        diagnosticInfo.directChartCalculation = {
          success: true,
          julianDay: chartResult.julianDay,
          hasAscendant: !!chartResult.ascendant,
          hasPlanets: !!chartResult.planets,
          planetsCount: Object.keys(chartResult.planets || {}).length,
          housesCount: Object.keys(chartResult.houses || {}).length,
          aspectsCount: (chartResult.aspects || []).length
        };
      } catch (error) {
        diagnosticInfo.directChartCalculationError = error instanceof Error 
          ? { message: error.message, stack: error.stack } 
          : String(error);
      }
    }
    
    // Step 6: Get detailed environment information
    diagnosticInfo.environmentInfo = {
      arch: process.arch,
      platform: process.platform,
      versions: process.versions,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_REGION: process.env.VERCEL_REGION
      }
    };

    // Step 7: Check for module resolution
    try {
      // This will log information about where the module is being loaded from
      require.resolve('ephemeris');
      diagnosticInfo.ephemerisResolved = true;
      diagnosticInfo.ephemerisModulePath = require.resolve('ephemeris');
    } catch (error) {
      diagnosticInfo.ephemerisResolveError = error instanceof Error 
        ? { message: error.message, stack: error.stack } 
        : String(error);
    }
    
    return NextResponse.json(diagnosticInfo);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}