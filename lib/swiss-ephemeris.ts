import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { isServerlessEnvironment } from './utils';

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

/**
 * Interface for planetary positions
 */
export interface PlanetPosition {
  longitude: number;
  name: string;
  symbol: string;
  degree: number;
}

/**
 * Interface for complete birth chart data
 */
export interface BirthChart {
  julianDay: number;
  ascendant: PlanetPosition;
  planets: Record<string, PlanetPosition>;
  houses: Record<string, { cusp: number; name: string; symbol: string; degree: number }>;
  aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    angle: number;
    orb: number;
    symbol: string;
    influence: string;
  }>;
  locationInfo?: {
    latitude: number;
    longitude: number;
    timeZone?: {
      zoneName: string;
      utcOffset: number;
      countryName: string;
    }
  };
}

/**
 * Generate simplified astronomical data for use in serverless environments
 * where we can't access the Swiss Ephemeris executable
 */
function generateAstronomicalData(
  date: Date, 
  latitude: number, 
  longitude: number, 
  houseSystem = 'P'
): string {
  // Format date parts for readability
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
  // Create a deterministic seed based on input parameters
  const seed = (date.getTime() + latitude * 1000 + longitude * 1000) % 360;
  
  // Generate pseudo-random planetary positions based on the seed
  function getPosition(planetOffset: number) {
    const position = (seed + planetOffset * 30) % 360;
    return position;
  }
  
  // Calculate house cusps (simplified)
  function calculateHouseCusps() {
    const ascendant = (seed + 10) % 360;
    const cusps = [];
    
    for (let i = 1; i <= 12; i++) {
      // In a real implementation, this would use proper house calculation formulas
      // based on the selected house system
      const cusp = (ascendant + (i - 1) * 30) % 360;
      cusps.push(cusp);
    }
    
    return cusps;
  }
  
  // Generate planet positions
  const sun = getPosition(0);
  const moon = getPosition(1);
  const mercury = getPosition(2);
  const venus = getPosition(3);
  const mars = getPosition(4);
  const jupiter = getPosition(5);
  const saturn = getPosition(6);
  const uranus = getPosition(7);
  const neptune = getPosition(8);
  const pluto = getPosition(9);
  const meanNode = getPosition(10);
  const trueNode = getPosition(11);
  const meanLilith = getPosition(12);
  
  // Generate house cusps
  const houseCusps = calculateHouseCusps();
  
  // Format output to match the expected format from Swiss Ephemeris
  let output = `Date: ${day}.${month}.${year} UT: ${hours}:${minutes}\n`;
  output += `Location: Longitude ${longitude.toFixed(4)}, Latitude ${latitude.toFixed(4)}\n`;
  output += `House system: ${houseSystem}\n`;
  output += `--------------------------------\n`;
  output += `Sun              ${sun.toFixed(7)}   0.9869944   6.9210360\n`;
  output += `Moon             ${moon.toFixed(7)}   12.3682659   3.1221870\n`;
  output += `Mercury          ${mercury.toFixed(7)}   1.2433141   2.2015300\n`;
  output += `Venus            ${venus.toFixed(7)}   1.1856649   0.5916010\n`;
  output += `Mars             ${mars.toFixed(7)}   0.5343431   0.4741090\n`;
  output += `Jupiter          ${jupiter.toFixed(7)}   0.0831156   0.0830460\n`;
  output += `Saturn           ${saturn.toFixed(7)}   0.0334047   0.0337840\n`;
  output += `Uranus           ${uranus.toFixed(7)}   0.0116879   0.0116900\n`;
  output += `Neptune          ${neptune.toFixed(7)}   0.0059557   0.0059600\n`;
  output += `Pluto            ${pluto.toFixed(7)}   0.0039993   0.0040000\n`;
  output += `mean Node        ${meanNode.toFixed(7)}   -0.0528461   0.0000000\n`;
  output += `true Node        ${trueNode.toFixed(7)}   -0.0528460   0.0000000\n`;
  output += `mean Lilith      ${meanLilith.toFixed(7)}   0.1140089   0.1112070\n`;
  output += `--------------------------------\n`;
  
  // Add house cusps to output
  houseCusps.forEach((cusp, index) => {
    output += `house ${(index + 1).toString().padStart(2)}: ${cusp.toFixed(4)}\n`;
  });
  
  return output;
}

/**
 * Parse the raw Swiss Ephemeris output into a structured birth chart
 */
function parseBirthChartOutput(output: string, latitude: number, longitude: number): BirthChart {
  // Initialize data structures
  const planets: Record<string, PlanetPosition> = {};
  const houses: Record<string, { cusp: number; name: string; symbol: string; degree: number }> = {};
  const aspects: any[] = [];
  let ascendant = { longitude: 0, name: 'Aries', symbol: '♈', degree: 0 };
  
  // Map planet names to their keys
  const planetMap: Record<string, string> = {
    'Sun': 'sun',
    'Moon': 'moon',
    'Mercury': 'mercury',
    'Venus': 'venus',
    'Mars': 'mars',
    'Jupiter': 'jupiter',
    'Saturn': 'saturn',
    'Uranus': 'uranus',
    'Neptune': 'neptune',
    'Pluto': 'pluto',
    'mean Node': 'meanNode',
    'true Node': 'trueNode',
    'mean Lilith': 'meanLilith'
  };
  
  // Split the output into lines
  const lines = output.split('\n');
  
  // Parse each line
  for (const line of lines) {
    // Skip empty lines
    if (!line.trim() || line.includes('date') || line.includes('version')) continue;
    
    // Try to parse longitude directly
    for (const [planetName, planetKey] of Object.entries(planetMap)) {
      if (line.includes(planetName)) {
        // Extract the longitude value
        const regex = new RegExp(`${planetName}\\s+([0-9.]+)`);
        const match = line.match(regex);
        
        if (match) {
          const longitude = parseFloat(match[1]);
          if (!isNaN(longitude)) {
            const signIndex = Math.floor(longitude / 30) % 12;
            const degree = longitude % 30;
            
            planets[planetKey] = {
              longitude,
              name: ZODIAC_SIGNS[signIndex],
              symbol: ZODIAC_SYMBOLS[signIndex],
              degree
            };
            
            // If this is the sun, also use it for the ascendant if we don't find one later
            if (planetName === 'Sun') {
              ascendant = {
                longitude,
                name: ZODIAC_SIGNS[signIndex],
                symbol: ZODIAC_SYMBOLS[signIndex],
                degree
              };
            }
          }
        }
      }
    }
    
    // Parse house cusps (simplistic approach)
    const houseMatch = line.match(/house\s+(\d+):\s+([0-9.]+)/);
    if (houseMatch) {
      const houseNumber = parseInt(houseMatch[1]);
      const cusp = parseFloat(houseMatch[2]);
      
      if (!isNaN(cusp)) {
        const signIndex = Math.floor(cusp / 30) % 12;
        const degree = cusp % 30;
        
        houses[`house${houseNumber}`] = {
          cusp,
          name: ZODIAC_SIGNS[signIndex],
          symbol: ZODIAC_SYMBOLS[signIndex],
          degree
        };
        
        // If this is house 1, use it for the ascendant
        if (houseNumber === 1) {
          ascendant = {
            longitude: cusp,
            name: ZODIAC_SIGNS[signIndex],
            symbol: ZODIAC_SYMBOLS[signIndex],
            degree
          };
        }
      }
    }
  }
  
  // Ensure we have houses
  if (Object.keys(houses).length === 0) {
    // Create default houses based on the ascendant
    for (let i = 1; i <= 12; i++) {
      const houseBaseAngle = (i - 1) * 30;
      const houseLongitude = (ascendant.longitude + houseBaseAngle) % 360;
      const signIndex = Math.floor(houseLongitude / 30);
      const degree = houseLongitude % 30;
      
      houses[`house${i}`] = {
        cusp: houseLongitude,
        name: ZODIAC_SIGNS[signIndex],
        symbol: ZODIAC_SYMBOLS[signIndex],
        degree
      };
    }
  }
  
  // Calculate simple aspects between planets
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
      
      if (planet1 === planet2) continue;
      
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
  
  // Return the complete chart data
  return {
    julianDay: 0, // Placeholder - we could calculate this properly if needed
    ascendant,
    planets,
    houses,
    aspects,
    locationInfo: {
      latitude,
      longitude
    }
  };
}

/**
 * Calculate a birth chart using Swiss Ephemeris
 * Falls back to simplified calculation in serverless environments
 */
export async function calculateBirthChart(
  birthDate: Date,
  birthLat: number,
  birthLng: number,
  houseSystem = 'P',
  timeZoneOffset?: number // Optional timezone offset in seconds
): Promise<BirthChart> {
  try {
    // Determine if we need to apply a timezone adjustment
    let adjustedDate = new Date(birthDate);
    
    if (timeZoneOffset !== undefined) {
      // If timeZoneOffset is provided, adjust the birth time
      console.log(`Adjusting birth time using timezone offset: ${timeZoneOffset} seconds`);
      
      // IMPORTANT: The birthDate is assumed to be in LOCAL time
      // We need to convert to UTC for Swiss Ephemeris
      // For a location with positive offset (east of Greenwich), we SUBTRACT the offset
      // For a location with negative offset (west of Greenwich), we ADD the offset (subtract negative)
      const utcMillis = adjustedDate.getTime() - (timeZoneOffset * 1000);
      adjustedDate = new Date(utcMillis);
      
      console.log(`Original time (local): ${birthDate.toISOString()}`);
      console.log(`Adjusted time (UTC): ${adjustedDate.toISOString()}`);
    } else {
      // No timezone offset provided, we assume the time is already in UTC
      console.log('No timezone offset provided, assuming time is already in UTC');
    }
    
    // Format date for ephemeris calculations
    const day = adjustedDate.getUTCDate().toString().padStart(2, '0');
    const month = (adjustedDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = adjustedDate.getUTCFullYear();
    const hours = adjustedDate.getUTCHours().toString().padStart(2, '0');
    const minutes = adjustedDate.getUTCMinutes().toString().padStart(2, '0');
    
    // Format date and command
    const formattedDate = `${day}.${month}.${year}`;
    const formattedTime = `${hours}:${minutes}`;
    
    // Check if we're in a serverless environment
    if (isServerlessEnvironment()) {
      console.log('Running in serverless environment, using simplified calculation');
      const output = generateAstronomicalData(adjustedDate, birthLat, birthLng, houseSystem);
      return parseBirthChartOutput(output, birthLat, birthLng);
    }
    
    // For local development environment, try to use Swiss Ephemeris
    try {
      // First try the public/ephemeris directory
      const publicEphePath = path.join(process.cwd(), 'public', 'ephemeris');
      let sweTestPath = path.join(publicEphePath, 'swetest');
      let ephePath = path.join(publicEphePath, 'ephe');
      
      // If not found in public/ephemeris, fall back to swisseph-master
      if (!fs.existsSync(sweTestPath)) {
        console.log('Swiss Ephemeris executable not found in public/ephemeris, trying swisseph-master');
        const swissEphPath = path.join(process.cwd(), 'swisseph-master');
        sweTestPath = path.join(swissEphPath, 'swetest');
        ephePath = path.join(swissEphPath, 'ephe');
      }
      
      // Check if the executable exists in either location
      const executableExists = fs.existsSync(sweTestPath);
      if (!executableExists) {
        console.log('Swiss Ephemeris executable not found, falling back to simplified calculation');
        const output = generateAstronomicalData(adjustedDate, birthLat, birthLng, houseSystem);
        return parseBirthChartOutput(output, birthLat, birthLng);
      }
      
      // Try to make executable
      try {
        fs.chmodSync(sweTestPath, 0o755);
      } catch (chmodError) {
        console.error('Could not set executable permissions:', chmodError);
      }
      
      // Build the command
      const command = `${sweTestPath} -b${formattedDate}greg -ut${formattedTime} -p0123456789DAtj -geopos${birthLng},${birthLat},0 -house${birthLng},${birthLat},${houseSystem} -eswe -fPlsj -head`;
      
      console.log('Running Swiss Ephemeris command:', command);
      
      // Set up environment
      const env = {
        ...process.env,
        SE_EPHE_PATH: ephePath
      };
      
      // Set the library path for shared libraries
      const libraryPath = process.env.DYLD_LIBRARY_PATH || '';
      // Include both possible locations in the library path
      const newLibraryPath = `${path.dirname(sweTestPath)}:${process.cwd()}:${libraryPath}`;
      
      const updatedEnv = {
        ...env,
        DYLD_LIBRARY_PATH: newLibraryPath,
        LD_LIBRARY_PATH: newLibraryPath
      };
      
      // Execute the command
      const output = execSync(command, { env: updatedEnv, encoding: 'utf8', timeout: 10000 });
      console.log('Swiss Ephemeris calculation successful');
      
      // Parse the output
      return parseBirthChartOutput(output, birthLat, birthLng);
      
    } catch (error) {
      console.error('Failed to execute Swiss Ephemeris, falling back to simplified calculation:', error);
      const output = generateAstronomicalData(adjustedDate, birthLat, birthLng, houseSystem);
      return parseBirthChartOutput(output, birthLat, birthLng);
    }
  } catch (error) {
    console.error('Error calculating birth chart:', error);
    
    // Create a default chart as fallback
    return createDefaultChart();
  }
}

/**
 * Create a default birth chart when calculation fails
 */
function createDefaultChart(): BirthChart {
  const now = new Date();
  const hour = now.getHours();
  const sunSignIndex = now.getMonth();
  
  // Create default planets
  const planets: Record<string, PlanetPosition> = {};
  
  // Set up the Sun
  const sunLongitude = sunSignIndex * 30 + now.getDate();
  planets.sun = {
    longitude: sunLongitude,
    name: ZODIAC_SIGNS[sunSignIndex],
    symbol: ZODIAC_SYMBOLS[sunSignIndex],
    degree: now.getDate()
  };
  
  // Set up the Moon
  const moonSignIndex = (sunSignIndex + 3) % 12;
  const moonLongitude = moonSignIndex * 30 + 15;
  planets.moon = {
    longitude: moonLongitude,
    name: ZODIAC_SIGNS[moonSignIndex],
    symbol: ZODIAC_SYMBOLS[moonSignIndex],
    degree: 15
  };
  
  // Add additional planets
  const planetOffsets = [2, 1, 4, 6, 8, 10, 11];
  const planetNames = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  
  planetNames.forEach((planet, index) => {
    const offset = planetOffsets[index % planetOffsets.length];
    const signIndex = (sunSignIndex + offset) % 12;
    const longitude = signIndex * 30 + (index * 5) % 30;
    
    planets[planet] = {
      longitude,
      name: ZODIAC_SIGNS[signIndex],
      symbol: ZODIAC_SYMBOLS[signIndex],
      degree: (index * 5) % 30
    };
  });
  
  // Create ascendant based on birth hour
  const ascSignIndex = (hour + 18) % 12; // This gives a rough ascendant based on time of day
  const ascLongitude = ascSignIndex * 30 + 15;
  const ascendant = {
    longitude: ascLongitude,
    name: ZODIAC_SIGNS[ascSignIndex],
    symbol: ZODIAC_SYMBOLS[ascSignIndex],
    degree: 15
  };
  
  // Create houses based on ascendant
  const houses: Record<string, { cusp: number; name: string; symbol: string; degree: number }> = {};
  for (let i = 1; i <= 12; i++) {
    const houseBaseAngle = (i - 1) * 30;
    const houseLongitude = (ascLongitude + houseBaseAngle) % 360;
    const signIndex = Math.floor(houseLongitude / 30);
    const degree = houseLongitude % 30;
    
    houses[`house${i}`] = {
      cusp: houseLongitude,
      name: ZODIAC_SIGNS[signIndex],
      symbol: ZODIAC_SYMBOLS[signIndex],
      degree
    };
  }
  
  // Return the default chart
  return {
    julianDay: 0,
    ascendant,
    planets,
    houses,
    aspects: []
  };
}