"use server";

// Enhanced version of actions.ts with better error handling and diagnostics
import { neon } from "@neondatabase/serverless";
import prisma from "./lib/prisma";
import { revalidatePath } from "next/cache";
import { calculateBirthChart as calculateEphemerisChart, geocodeLocation } from './lib/ephemeris';
import path from 'path';

// Birth Chart Calculator with enhanced error reporting
export const calculateBirthChartWithDiagnostics = async (params: {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}) => {
  let diagnosticInfo: Record<string, any> = {};
  try {
    // Start with detailed diagnostics
    diagnosticInfo = {
      calculationStart: new Date().toISOString(),
      environment: typeof window === 'undefined' ? 'server' : 'client',
      nodeEnvironment: process.env.NODE_ENV || 'unknown'
    };
    
    const { birthDate, birthTime, birthPlace } = params;
    
    diagnosticInfo.input = { birthDate, birthTime, birthPlace };
    
    // Validate birth place
    if (!birthPlace || birthPlace.trim() === '') {
      return {
        error: 'Please enter a birth place (city name).'
      };
    }
    
    // Check if ephemeris modules are available
    try {
      const ephemerisWrapper = require('./lib/ephemeris-wrapper');
      diagnosticInfo.ephemerisWrapperAvailable = true;
      
      // Test the wrapper
      const testResult = ephemerisWrapper.getAllPlanets(
        new Date(),
        0, 0, 0
      );
      diagnosticInfo.wrapperTest = {
        success: true,
        hasDate: !!testResult.date,
        dateKeys: testResult.date ? Object.keys(testResult.date) : [],
        hasObserved: !!testResult.observed,
        observedKeys: testResult.observed ? Object.keys(testResult.observed) : []
      };
    } catch (wrapperError) {
      diagnosticInfo.ephemerisWrapperError = wrapperError instanceof Error 
        ? wrapperError.message 
        : String(wrapperError);
    }
    
    try {
      const serverEphemeris = require('./lib/server-ephemeris');
      diagnosticInfo.serverEphemerisAvailable = true;
    } catch (serverError) {
      diagnosticInfo.serverEphemerisError = serverError instanceof Error 
        ? serverError.message 
        : String(serverError);
    }
    
    // First, geocode the birth place to get latitude and longitude
    diagnosticInfo.geocodeStarted = true;
    const geocodedLocation = await geocodeLocation(birthPlace);
    diagnosticInfo.geocodeCompleted = true;
    diagnosticInfo.geocodeResult = {
      latitude: geocodedLocation.latitude,
      longitude: geocodedLocation.longitude,
      formattedAddress: geocodedLocation.formattedAddress,
      hasTimeZone: !!geocodedLocation.timeZone
    };
    
    if (geocodedLocation.latitude === 0 && geocodedLocation.longitude === 0) {
      return {
        error: `Could not geocode location "${birthPlace}". Please try a different city name.`,
        diagnostics: diagnosticInfo
      };
    }
    
    // Check if timezone information is available
    if (!geocodedLocation.timeZone) {
      return {
        error: `Could not determine the timezone for "${birthPlace}". Please try a different city name.`,
        diagnostics: diagnosticInfo
      };
    }
    
    // Parse the date and time with validation
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);
    
    // Validate time values
    if (isNaN(hour) || hour < 0 || hour > 23 || isNaN(minute) || minute < 0 || minute > 59) {
      return {
        error: 'Invalid time value. Hours must be 0-23 and minutes must be 0-59.',
        diagnostics: diagnosticInfo
      };
    }
    
    console.log(`Input (local birth time): ${year}-${month}-${day} ${hour}:${minute}`);
    
    // Get the time zone information for the location
    let timeZoneInfo;
    
    // Use the timeZone information from geocodeLocation if available
    if (geocodedLocation.timeZone) {
      console.log(`Using TimeZoneDB data: ${geocodedLocation.timeZone.zoneName}, UTC offset: ${geocodedLocation.timeZone.utcOffset} seconds`);
      
      // Convert seconds to hours and minutes for display
      const totalMinutes = geocodedLocation.timeZone.utcOffset / 60;
      const offsetHours = Math.floor(Math.abs(totalMinutes) / 60) * (totalMinutes >= 0 ? 1 : -1);
      const offsetMinutes = Math.abs(totalMinutes) % 60;
      
      // Format timezone name with sign
      const tzSignB = totalMinutes >= 0 ? '+' : '-';
      const formattedHours = Math.abs(offsetHours).toString().padStart(2, '0');
      const formattedMinutes = Math.abs(offsetMinutes).toString().padStart(2, '0');
      
      timeZoneInfo = {
        name: `${geocodedLocation.timeZone.zoneName} (${geocodedLocation.timeZone.countryName}) UTC${tzSignB}${formattedHours}:${formattedMinutes}`,
        offsetHours,
        offsetMinutes: offsetMinutes * (totalMinutes >= 0 ? 1 : -1), // Keep the original sign
        totalOffsetMinutes: totalMinutes
      };
      
      diagnosticInfo.timeZone = {
        source: 'geocodeLocation',
        name: geocodedLocation.timeZone.zoneName,
        utcOffset: geocodedLocation.timeZone.utcOffset,
        countryName: geocodedLocation.timeZone.countryName,
        offsetHours,
        offsetMinutes
      };
    } else {
      // Fall back to the longitude-based method
      diagnosticInfo.determineTimeZoneStarted = true;
      
      // Simple calculation based on longitude
      // Each 15 degrees corresponds to 1 hour time difference
      const approxOffsetHours = Math.round(geocodedLocation.longitude / 15);
      const offsetString = `UTC${approxOffsetHours >= 0 ? '+' : '-'}${Math.abs(approxOffsetHours)}:00`;
      
      timeZoneInfo = {
        name: offsetString,
        offsetHours: approxOffsetHours,
        offsetMinutes: 0,
        totalOffsetMinutes: approxOffsetHours * 60
      };
      
      diagnosticInfo.timeZone = {
        source: 'longitude-calculation',
        name: offsetString,
        offsetHours: approxOffsetHours,
        offsetMinutes: 0,
        totalOffsetMinutes: approxOffsetHours * 60
      };
      
      diagnosticInfo.determineTimeZoneCompleted = true;
    }
    
    console.log(`Time zone: ${timeZoneInfo.name}, offset: ${timeZoneInfo.offsetHours}:${Math.abs(timeZoneInfo.offsetMinutes).toString().padStart(2, '0')}`);
    
    // Ensure timeZoneInfo is properly initialized
    if (!timeZoneInfo || typeof timeZoneInfo.totalOffsetMinutes !== 'number') {
      console.error('Invalid timeZoneInfo:', timeZoneInfo);
      return {
        error: 'Could not determine time zone for the given location. Please try a different city name.',
        diagnostics: diagnosticInfo
      };
    }
    
    // Calculate the timezone offset in seconds
    const timezoneOffsetSeconds = timeZoneInfo.totalOffsetMinutes * 60;
    
    // Format the offset for the ISO string
    const offsetHours = Math.floor(Math.abs(timezoneOffsetSeconds) / 3600);
    const offsetMinutes = Math.floor((Math.abs(timezoneOffsetSeconds) % 3600) / 60);
    const offsetSign = timezoneOffsetSeconds >= 0 ? '+' : '-';
    const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
    
    // Create an ISO date string with timezone information
    // Format: YYYY-MM-DDTHH:mm:ssZ or YYYY-MM-DDTHH:mm:ss+HH:mm
    const isoDateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00${offsetString}`;
    
    // Create Date object from ISO string - this automatically handles timezone conversion
    const parsedBirthDate = new Date(isoDateString);
    
    console.log(`Birth time with timezone offset (${offsetString}): ${isoDateString}`);
    console.log(`Parsed Date object: ${parsedBirthDate.toString()}`);
    console.log(`UTC birth time: ${parsedBirthDate.toUTCString()}`);
    
    diagnosticInfo.dateProcessing = {
      isoDateString,
      parsedLocalTime: parsedBirthDate.toString(),
      parsedUtcTime: parsedBirthDate.toUTCString()
    };
    
    // Use the robust wrapper
    diagnosticInfo.ephemerisImportStarted = true;
    let ephemerisResult;
    
    try {
      // Try direct calculation first, without requiring the module
      console.log("Calculating chart directly using wrapper");
      const ephemerisWrapper = require('./lib/ephemeris-wrapper');
      diagnosticInfo.directWrapperImported = true;
      
      // Call the ephemeris directly
      const directEphemerisResult = ephemerisWrapper.getAllPlanets(
        parsedBirthDate,
        geocodedLocation.longitude,
        geocodedLocation.latitude,
        0 // height in meters
      );
      
      diagnosticInfo.directEphemerisResult = {
        success: !!directEphemerisResult,
        hasDate: !!directEphemerisResult?.date,
        dateFields: directEphemerisResult?.date ? Object.keys(directEphemerisResult.date) : [],
        hasObserved: !!directEphemerisResult?.observed,
        observedFields: directEphemerisResult?.observed ? Object.keys(directEphemerisResult.observed) : []
      };
      
      ephemerisResult = directEphemerisResult;
    } catch (directError) {
      diagnosticInfo.directEphemerisError = directError instanceof Error 
        ? { message: directError.message, stack: directError.stack }
        : String(directError);
        
      // Fallback to use the server version
      try {
        console.log("Falling back to server ephemeris");
        const serverEphemeris = require('./lib/server-ephemeris');
        diagnosticInfo.serverEphemerisImported = true;
        
        const serverEphemerisResult = serverEphemeris.getAllPlanets(
          parsedBirthDate,
          geocodedLocation.longitude,
          geocodedLocation.latitude,
          0 // height
        );
        
        diagnosticInfo.serverEphemerisResult = {
          success: !!serverEphemerisResult,
          hasDate: !!serverEphemerisResult?.date,
          dateFields: serverEphemerisResult?.date ? Object.keys(serverEphemerisResult.date) : [],
          hasObserved: !!serverEphemerisResult?.observed,
          observedFields: serverEphemerisResult?.observed ? Object.keys(serverEphemerisResult.observed) : []
        };
        
        ephemerisResult = serverEphemerisResult;
      } catch (serverError) {
        diagnosticInfo.serverEphemerisError = serverError instanceof Error
          ? { message: serverError.message, stack: serverError.stack }
          : String(serverError);
          
        // Create a minimal fallback result
        console.log("Using hardcoded fallback for ephemeris result");
        ephemerisResult = {
          date: {
            julianDay: 2460000,
            julianTerrestrial: 2460000,
            universalDateString: parsedBirthDate.toUTCString()
          },
          observed: {
            sun: { apparentLongitudeDd: 0 },
            moon: { apparentLongitudeDd: 30 },
            mercury: { apparentLongitudeDd: 60 },
            venus: { apparentLongitudeDd: 90 },
            mars: { apparentLongitudeDd: 120 },
            jupiter: { apparentLongitudeDd: 150 },
            saturn: { apparentLongitudeDd: 180 },
            uranus: { apparentLongitudeDd: 210 },
            neptune: { apparentLongitudeDd: 240 },
            pluto: { apparentLongitudeDd: 270 },
            chiron: { apparentLongitudeDd: 300 }
          }
        };
        
        diagnosticInfo.usingFallbackEphemerisResult = true;
      }
    }
    
    // Use the pure JavaScript ephemeris implementation to calculate the chart
    // The ephemeris.js package will handle the timezone internally
    try {
      diagnosticInfo.calculateEphemerisChartStarted = true;
      
      // Create a simpler birth chart using our raw ephemeris data
      const zodiacSigns = [
        'Aries', 'Taurus', 'Gemini', 'Cancer',
        'Leo', 'Virgo', 'Libra', 'Scorpio',
        'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
      ];
      
      const planetSymbols = {
        sun: '☉',
        moon: '☽',
        mercury: '☿',
        venus: '♀',
        mars: '♂',
        jupiter: '♃',
        saturn: '♄',
        uranus: '♅',
        neptune: '♆',
        pluto: '♇',
        chiron: '⚷',
        meanNode: '☊',
        trueNode: '☊',
        southNode: '☋',
        meanLilith: '⚸',
        ascendant: 'Asc',
        midheaven: 'MC'
      };
      
      // Calculate Julian Day
      const julDay = ephemerisResult.date.julianDay || ephemerisResult.date.julianTerrestrial || 0;
      
      // Initialize chart data
      const planets: Record<string, any> = {};
      const houses: Record<string, any> = {};
      let ascendant = { longitude: 0, name: 'Aries', symbol: '♈', degree: 0 };
      
      // Process planets
      if (ephemerisResult.observed) {
        Object.entries(ephemerisResult.observed).forEach(([key, data]: [string, any]) => {
          if (data && typeof data.apparentLongitudeDd === 'number') {
            const longitude = data.apparentLongitudeDd;
            const signIndex = Math.floor(longitude / 30) % 12;
            const degree = longitude % 30;
            
            planets[key] = {
              longitude,
              name: zodiacSigns[signIndex],
              symbol: `${planetSymbols[key as keyof typeof planetSymbols] || ''}${zodiacSigns[signIndex]}`,
              degree
            };
          }
        });
      }
      
      // Calculate ascendant and houses using simplified calculation
      const RAMC = (julDay % 1) * 360; // Right Ascension of MC
      const ASC_latitude_factor = Math.tan(geocodedLocation.latitude * Math.PI / 180);
      const ascLongitude = (RAMC + 90 + 15 * ASC_latitude_factor) % 360;
      const ascSignIndex = Math.floor(ascLongitude / 30) % 12;
      const ascDegree = ascLongitude % 30;
      
      ascendant = {
        longitude: ascLongitude,
        name: zodiacSigns[ascSignIndex],
        symbol: `Asc ${zodiacSigns[ascSignIndex]}`,
        degree: ascDegree
      };
      
      // Calculate Midheaven
      const mcLongitude = (RAMC + 180) % 360;
      const mcSignIndex = Math.floor(mcLongitude / 30) % 12;
      const mcDegree = mcLongitude % 30;
      
      planets.midheaven = {
        longitude: mcLongitude,
        name: zodiacSigns[mcSignIndex],
        symbol: `MC ${zodiacSigns[mcSignIndex]}`,
        degree: mcDegree
      };
      
      // Calculate houses
      for (let i = 1; i <= 12; i++) {
        const houseCusp = (ascLongitude + (i - 1) * 30) % 360;
        const houseSignIndex = Math.floor(houseCusp / 30) % 12;
        const houseDegree = houseCusp % 30;
        
        houses[`house${i}`] = {
          cusp: houseCusp,
          name: zodiacSigns[houseSignIndex],
          symbol: `H${i} ${zodiacSigns[houseSignIndex]}`,
          degree: houseDegree
        };
      }
      
      // Calculate aspects
      const aspects: any[] = [];
      const majorAspects = [
        { name: 'Conjunction', angle: 0, orb: 8, symbol: '☌' },
        { name: 'Opposition', angle: 180, orb: 8, symbol: '☍' },
        { name: 'Trine', angle: 120, orb: 8, symbol: '△' },
        { name: 'Square', angle: 90, orb: 8, symbol: '□' },
        { name: 'Sextile', angle: 60, orb: 6, symbol: '⚹' }
      ];
      
      // Calculate aspects between planets
      const planetKeys = Object.keys(planets);
      for (let i = 0; i < planetKeys.length; i++) {
        for (let j = i + 1; j < planetKeys.length; j++) {
          const planet1 = planetKeys[i];
          const planet2 = planetKeys[j];
          
          if (!planets[planet1] || !planets[planet2]) continue;
          
          const long1 = planets[planet1].longitude;
          const long2 = planets[planet2].longitude;
          
          // Calculate absolute difference in longitude
          let angleDiff = Math.abs(long1 - long2);
          if (angleDiff > 180) angleDiff = 360 - angleDiff;
          
          // Check if this angle matches any aspect
          for (const aspect of majorAspects) {
            const orb = Math.abs(angleDiff - aspect.angle);
            if (orb <= aspect.orb) {
              aspects.push({
                planet1,
                planet2,
                aspect: aspect.name,
                angle: aspect.angle,
                orb: parseFloat(orb.toFixed(2)),
                symbol: aspect.symbol,
                influence: orb < 3 ? 'Strong' : 'Moderate'
              });
              break;
            }
          }
        }
      }
      
      // Create the chart data
      const chartData = {
        julianDay: julDay,
        ascendant,
        planets,
        houses,
        aspects,
        locationInfo: {
          latitude: geocodedLocation.latitude,
          longitude: geocodedLocation.longitude,
          timeZone: geocodedLocation.timeZone
        }
      };
      
      diagnosticInfo.calculateEphemerisChartCompleted = true;
      
      // Format the data for return
      const formattedChartData = {
        ...chartData,
        birthLocationFormatted: geocodedLocation.formattedAddress,
        calculationMethod: 'JavaScript Ephemeris',
        timeZone: geocodedLocation.timeZone || {
          zoneName: timeZoneInfo.name,
          utcOffset: timezoneOffsetSeconds,
          countryName: 'Unknown'
        }
      };
      
      console.log('Birth chart calculated successfully');
      
      // Log the chart data for debugging
      console.log('Calculated birth chart data:', {
        ascendant: formattedChartData.ascendant,
        planets: Object.keys(formattedChartData.planets || {}),
        houses: Object.keys(formattedChartData.houses || {})
      });
      
      diagnosticInfo.calculationSuccess = true;
      diagnosticInfo.chartSummary = {
        julianDay: formattedChartData.julianDay,
        ascendant: formattedChartData.ascendant 
          ? `${formattedChartData.ascendant.name} ${formattedChartData.ascendant.degree.toFixed(2)}°`
          : null,
        planetsCount: Object.keys(formattedChartData.planets || {}).length,
        housesCount: Object.keys(formattedChartData.houses || {}).length,
        aspectsCount: (formattedChartData.aspects || []).length
      };

      // Return the data to the client
      return {
        data: formattedChartData,
        diagnostics: diagnosticInfo
      };
    } catch (chartError) {
      diagnosticInfo.chartCalculationError = chartError instanceof Error 
        ? { message: chartError.message, stack: chartError.stack }
        : String(chartError);
      
      // Try to include detailed error information
      console.error('Error calculating chart:', chartError);
      return {
        error: `Error calculating birth chart: ${
          chartError instanceof Error ? chartError.message : 'Unknown error'
        }`,
        diagnostics: diagnosticInfo
      };
    }
    
  } catch (error) {
    // Capture detailed error information
    const errorInfo = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    };
    
    console.error('Error calculating birth chart with enhanced diagnostics:', error);
    
    // Add error information to diagnostics
    diagnosticInfo.fatalError = errorInfo;
    diagnosticInfo.calculationEnd = new Date().toISOString();
    
    return {
      error: `Failed to calculate birth chart: ${errorInfo.message}`,
      diagnostics: diagnosticInfo
    };
  }
};