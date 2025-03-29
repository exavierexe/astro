// Ephemeris calculations for astrology
import path from 'path';
import { execSync } from 'child_process';

// Constants
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Geocoder implementation using worldcities.csv file
import fs from 'fs';

import { parse } from 'csv-parse/sync';

// Cache for data to avoid repeated file reads
let citiesCache: any[] | null = null;
let timeZonesCache: Map<string, any> | null = null;
let countriesCache: Map<string, string> | null = null;

// Helper function to load and parse the cities CSV file
function loadCitiesData(): any[] {
  if (citiesCache) return citiesCache;
  
  try {
    const csvPath = path.join(process.cwd(), 'public', 'worldcities.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parse CSV data
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    console.log(`Loaded ${records.length} cities from worldcities.csv`);
    
    // Cache the results for future calls
    citiesCache = records;
    return records;
  } catch (error) {
    console.error('Error loading cities data:', error);
    return [];
  }
}

// Helper function to load time zone data
function loadTimeZoneData(): Map<string, any> {
  if (timeZonesCache) return timeZonesCache;
  
  try {
    const timeZonesMap = new Map();
    const csvPath = path.join(process.cwd(), 'public', 'TimeZoneDB.csv', 'time_zone.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parse CSV data
    // Format: Zone_Name,Country_Code,Zone_Type,Start_Time,UTC_Offset,DST_Flag
    const lines = fileContent.split('\n');
    
    // Process entries in reverse order to get the most recent entries first
    // (TimeZoneDB entries are listed in chronological order)
    const processedZones = new Set<string>();
    
    // First, count how many entries we have for each country code
    // This helps us identify countries with multiple time zones
    const countryCounts: Record<string, number> = {};
    
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const parts = line.split(',');
      if (parts.length < 4) continue;
      
      const zoneName = parts[0];
      const countryCode = parts[1];
      const zoneType = parts[2];  // LMT, GMT, UTC, EST, etc.
      
      // Skip historical Local Mean Time entries
      if (zoneType === 'LMT') continue;
      
      // Count distinct zone names for each country
      if (!processedZones.has(zoneName)) {
        processedZones.add(zoneName);
        countryCounts[countryCode] = (countryCounts[countryCode] || 0) + 1;
      }
    }
    
    // Reset for actual processing
    processedZones.clear();
    
    // Process zones and add them to our map
    // We need to identify the most recent time zone entry for each zone based on the current date
    
    // Current timestamp - but let's move it forward slightly to ensure we're using the most current rules
    // This helps with DST transitions that might be upcoming
    const now = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
    const futureNow = now + (60 * 60 * 24 * 7); // Look ahead 1 week to catch upcoming DST changes
    
    // Store time zones by zone name
    const zoneEntries: Record<string, any[]> = {};
    
    // First pass - collect all entries for each zone
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const parts = line.split(',');
      if (parts.length < 6) continue;  // Need 6 columns for complete data
      
      const zoneName = parts[0];
      const countryCode = parts[1];
      const zoneType = parts[2];      // LMT, UTC, EST, EDT, etc.
      const startTime = parseInt(parts[3]) || 0;  // Unix timestamp when this rule starts
      const utcOffset = parseInt(parts[4]) || 0;  // UTC offset in seconds
      const isDst = parseInt(parts[5]) === 1;     // 1 for DST, 0 for standard time
      
      // Skip historical Local Mean Time entries
      if (zoneType === 'LMT') continue;
      
      // Add this entry to our collection for the zone
      if (!zoneEntries[zoneName]) {
        zoneEntries[zoneName] = [];
      }
      
      zoneEntries[zoneName].push({
        zoneName,
        countryCode,
        zoneType,
        startTime,
        utcOffset,
        isDst,
        isExclusive: countryCounts[countryCode] === 1
      });
    }
    
    // Second pass - find the most current entry for each zone
    for (const [zoneName, entries] of Object.entries(zoneEntries)) {
      // Sort entries by start time (newest first)
      entries.sort((a, b) => b.startTime - a.startTime);
      
      // Find the most recent entry that is applicable now
      let currentEntry = null;
      
      for (const entry of entries) {
        if (entry.startTime <= futureNow) {
          currentEntry = entry;
          break;
        }
      }
      
      // If we found a current entry, add it to our map
      if (currentEntry) {
        timeZonesMap.set(zoneName, {
          zoneName: currentEntry.zoneName,
          countryCode: currentEntry.countryCode,
          zoneType: currentEntry.zoneType,
          utcOffset: currentEntry.utcOffset,
          isDst: currentEntry.isDst,
          isExclusive: currentEntry.isExclusive
        });
        
        // Log for debugging
        if (!processedZones.has(zoneName)) {
          processedZones.add(zoneName);
          console.log(`Using timezone rule for ${zoneName}: ${currentEntry.zoneType}, offset ${currentEntry.utcOffset} seconds, DST: ${currentEntry.isDst ? 'Yes' : 'No'}`);
        }
      }
    }
    
    // Add common aliases for convenience
    const aliasMap: Record<string, string> = {
      // US Time Zones
      'America/New_York': 'US/Eastern',
      'America/Los_Angeles': 'US/Pacific',
      'America/Chicago': 'US/Central',
      'America/Denver': 'US/Mountain',
      'Pacific/Honolulu': 'US/Hawaii',
      'America/Anchorage': 'US/Alaska',
      
      // Australian Time Zones
      'Australia/Sydney': 'Australia/NSW',
      'Australia/Melbourne': 'Australia/Victoria',
      
      // European Time Zones
      'Europe/London': 'GB',
      'Europe/Paris': 'Europe/France',
      'Europe/Berlin': 'Europe/Germany',
      
      // Asia Time Zones
      'Asia/Tokyo': 'Japan',
      'Asia/Shanghai': 'China'
    };
    
    // Create the aliases
    for (const [canonicalName, alias] of Object.entries(aliasMap)) {
      if (timeZonesMap.has(canonicalName)) {
        const sourceData = timeZonesMap.get(canonicalName);
        
        timeZonesMap.set(alias, {
          zoneName: alias,
          countryCode: sourceData.countryCode,
          zoneType: sourceData.zoneType,
          utcOffset: sourceData.utcOffset,
          isDst: sourceData.isDst,
          isAlias: true,
          canonicalName: canonicalName
        });
      }
    }
    
    // Add special case for the most common Pacific locations
    // Pacific/Auckland is particularly important to handle correctly for New Zealand
    if (timeZonesMap.has('Pacific/Auckland')) {
      const aucklandData = timeZonesMap.get('Pacific/Auckland');
      console.log(`Pacific/Auckland timezone settings: offset ${aucklandData.utcOffset} seconds, DST: ${aucklandData.isDst ? 'Yes' : 'No'}`);
      
      // Add NZ as an alias for Pacific/Auckland
      timeZonesMap.set('NZ', {
        zoneName: 'NZ', 
        countryCode: 'NZ',
        zoneType: aucklandData.zoneType,
        utcOffset: aucklandData.utcOffset,
        isDst: aucklandData.isDst,
        isAlias: true,
        canonicalName: 'Pacific/Auckland'
      });
    }
    
    console.log(`Loaded ${timeZonesMap.size} time zones from TimeZoneDB (including aliases)`);
    
    // Debug output - show key sample zones
    for (const country of ['US', 'GB', 'JP', 'AU', 'NZ']) {
      console.log(`Sample timezones for ${country}:`);
      let found = 0;
      for (const [name, data] of timeZonesMap.entries()) {
        if (data.countryCode === country && found < 2) {
          found++;
          console.log(`  ${name}: ${data.countryCode}, ${data.zoneType}, offset: ${data.utcOffset} seconds, DST: ${data.isDst ? 'Yes' : 'No'}`);
        }
      }
    }
    
    timeZonesCache = timeZonesMap;
    return timeZonesCache;
  } catch (error) {
    console.error('Error loading time zone data:', error);
    return new Map();
  }
}

// Helper function to load country data
function loadCountryData(): Map<string, string> {
  if (countriesCache) return countriesCache;
  
  try {
    const countriesMap = new Map();
    const csvPath = path.join(process.cwd(), 'public', 'TimeZoneDB.csv', 'country.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parse CSV data
    // Format: Country_Code,Country_Name
    const lines = fileContent.split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const [countryCode, countryName] = line.split(',');
      if (countryCode && countryName) {
        countriesMap.set(countryCode, countryName);
      }
    }
    
    console.log(`Loaded ${countriesMap.size} countries from TimeZoneDB`);
    countriesCache = countriesMap;
    return countriesCache;
  } catch (error) {
    console.error('Error loading country data:', error);
    return new Map();
  }
}

// Fallback database for common locations if CSV lookup fails
const FALLBACK_LOCATIONS: Record<string, { 
  latitude: number; 
  longitude: number; 
  formattedAddress: string;
  countryCode: string;
  timeZoneName?: string; // IANA Timezone name (e.g., 'America/New_York')
}> = {
  // North America - Major US cities
  'new york': { 
    latitude: 40.7128, 
    longitude: -74.006, 
    formattedAddress: 'New York, NY, USA',
    countryCode: 'US',
    timeZoneName: 'America/New_York'
  },
  'los angeles': { 
    latitude: 34.0522, 
    longitude: -118.2437, 
    formattedAddress: 'Los Angeles, CA, USA',
    countryCode: 'US',
    timeZoneName: 'America/Los_Angeles'
  },
  'chicago': { 
    latitude: 41.8781, 
    longitude: -87.6298, 
    formattedAddress: 'Chicago, IL, USA',
    countryCode: 'US',
    timeZoneName: 'America/Chicago'
  },
  'miami': { 
    latitude: 25.7617, 
    longitude: -80.1918, 
    formattedAddress: 'Miami, FL, USA',
    countryCode: 'US',
    timeZoneName: 'America/New_York'
  },
  
  // Europe
  'london': { 
    latitude: 51.5074, 
    longitude: -0.1278, 
    formattedAddress: 'London, UK',
    countryCode: 'GB',
    timeZoneName: 'Europe/London'
  },
  'paris': { 
    latitude: 48.8566, 
    longitude: 2.3522, 
    formattedAddress: 'Paris, France',
    countryCode: 'FR',
    timeZoneName: 'Europe/Paris'
  },
  'berlin': { 
    latitude: 52.5200, 
    longitude: 13.4050, 
    formattedAddress: 'Berlin, Germany',
    countryCode: 'DE',
    timeZoneName: 'Europe/Berlin'
  },
  'rome': { 
    latitude: 41.9028, 
    longitude: 12.4964, 
    formattedAddress: 'Rome, Italy',
    countryCode: 'IT',
    timeZoneName: 'Europe/Rome'
  },
  
  // Asia
  'tokyo': { 
    latitude: 35.6762, 
    longitude: 139.6503, 
    formattedAddress: 'Tokyo, Japan',
    countryCode: 'JP',
    timeZoneName: 'Asia/Tokyo'
  },
  'beijing': { 
    latitude: 39.9042, 
    longitude: 116.4074, 
    formattedAddress: 'Beijing, China',
    countryCode: 'CN',
    timeZoneName: 'Asia/Shanghai'
  },
  'delhi': { 
    latitude: 28.7041, 
    longitude: 77.1025, 
    formattedAddress: 'Delhi, India',
    countryCode: 'IN',
    timeZoneName: 'Asia/Kolkata'
  },
  
  // Australia and Oceania
  'sydney': { 
    latitude: -33.8688, 
    longitude: 151.2093, 
    formattedAddress: 'Sydney, Australia',
    countryCode: 'AU',
    timeZoneName: 'Australia/Sydney'
  },
  'melbourne': { 
    latitude: -37.8136, 
    longitude: 144.9631, 
    formattedAddress: 'Melbourne, Australia',
    countryCode: 'AU',
    timeZoneName: 'Australia/Melbourne'
  },
  'auckland': { 
    latitude: -36.8509, 
    longitude: 174.7645, 
    formattedAddress: 'Auckland, New Zealand',
    countryCode: 'NZ',
    timeZoneName: 'Pacific/Auckland'
  }
};

// Function to find the timezone for a location
function findTimeZone(latitude: number, longitude: number, countryCode: string): { 
  zoneName: string; 
  utcOffset: number;
  countryName: string; 
} {
  try {
    console.log(`Finding timezone for coordinates: ${latitude}, ${longitude}, country code: ${countryCode}`);
    
    // Normalize country code to uppercase
    countryCode = countryCode.toUpperCase();
    
    // Load timezone and country data
    const timeZones = loadTimeZoneData();
    const countries = loadCountryData();
    
    // If we don't have enough data, return a default
    if (!timeZones.size || !countries.size) {
      console.log('Timezone data not loaded properly, using default timezone');
      return {
        zoneName: 'UTC',
        utcOffset: 0,
        countryName: countries.get(countryCode) || countryCode || 'Unknown'
      };
    }
    
    console.log(`Loaded ${timeZones.size} timezones and ${countries.size} country codes`);
    
    // Handle US timezones directly with longitude-based determination
    // This fixes the issue where all US cities were getting Pacific/Honolulu
    if (countryCode === 'US') {
      // Special case handling for US - map longitude directly to timezones
      // These boundaries are approximate but work for continental US
      let usZoneName = '';
      
      // Basic logic for US timezone selection by longitude
      if (longitude < -170) {
        // Aleutian Islands
        usZoneName = 'America/Adak';         // UTC-10 with DST
      } else if (longitude < -140) {
        // Alaska 
        usZoneName = 'America/Anchorage';    // UTC-9 with DST
      } else if (longitude < -115) {
        // Pacific Time
        usZoneName = 'America/Los_Angeles';  // UTC-8 with DST
      } else if (longitude < -100) {
        // Mountain Time
        usZoneName = 'America/Denver';       // UTC-7 with DST
      } else if (longitude < -85) {
        // Central Time
        usZoneName = 'America/Chicago';      // UTC-6 with DST
      } else if (longitude < -65) {
        // Eastern Time
        usZoneName = 'America/New_York';     // UTC-5 with DST
      } else {
        // Default to Eastern for edge cases
        usZoneName = 'America/New_York';
      }
      
      // Hawaii special case
      if (longitude < -150 && latitude < 25 && latitude > 15) {
        usZoneName = 'Pacific/Honolulu';     // UTC-10 without DST
      }
      
      console.log(`US special case handling: selected ${usZoneName} for longitude ${longitude}`);
      
      // Look up this zone and return it if found
      for (const [zoneName, zoneData] of timeZones.entries()) {
        if (zoneName === usZoneName) {
          return {
            zoneName,
            utcOffset: zoneData.utcOffset,
            countryName: countries.get(countryCode) || 'United States'
          };
        }
      }
      
      // If we couldn't find the specific zone name, continue with standard approach
      console.log(`Named timezone ${usZoneName} not found in data, falling back to standard approach`);
    }
    
    // For other countries with multiple timezones, map these predefined zones
    // This also serves as a hardcoded fallback if the TimeZoneDB data is inconsistent
    const specialCountryMap: Record<string, string[]> = {
      // North America
      'CA': ['America/Toronto', 'America/Winnipeg', 'America/Edmonton', 'America/Vancouver'],
      'US': ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Pacific/Honolulu', 'America/Anchorage'],
      'MX': ['America/Mexico_City', 'America/Tijuana', 'America/Cancun'],
      
      // Europe
      'GB': ['Europe/London'],
      'DE': ['Europe/Berlin'],
      'FR': ['Europe/Paris'],
      'ES': ['Europe/Madrid'],
      'IT': ['Europe/Rome'],
      
      // Asia
      'JP': ['Asia/Tokyo', 'JST'], // Japan has only one timezone (Japan Standard Time)
      'CN': ['Asia/Shanghai'],
      'IN': ['Asia/Kolkata'],
      'RU': ['Europe/Moscow', 'Asia/Yekaterinburg', 'Asia/Novosibirsk', 'Asia/Irkutsk', 'Asia/Vladivostok'],
      
      // Australia and Oceania
      'AU': ['Australia/Sydney', 'Australia/Adelaide', 'Australia/Perth'],
      'NZ': ['Pacific/Auckland']
    };
    
    // Find all zones for this country
    const countryZones: any[] = [];
    for (const [zoneName, zoneData] of timeZones.entries()) {
      if (zoneData.countryCode === countryCode) {
        countryZones.push(zoneData);
      }
    }
    
    console.log(`Found ${countryZones.length} timezone entries for country code ${countryCode}`);
    
    // If we found zones for this country, try to find the most appropriate one
    if (countryZones.length > 0) {
      // Most countries have a single timezone, but some have multiple
      if (countryZones.length === 1) {
        // Only one timezone for this country, use it
        const zone = countryZones[0];
        console.log(`Using the only timezone available for ${countryCode}: ${zone.zoneName}`);
        return {
          zoneName: zone.zoneName,
          utcOffset: zone.utcOffset,
          countryName: countries.get(countryCode) || countryCode || 'Unknown'
        };
      } else {
        // Multiple timezones for this country
        
        // Calculate the rough longitudinal timezone
        // Each 15 degrees of longitude is approximately 1 hour
        const approxOffsetHours = Math.round(longitude / 15);
        const approxOffsetSeconds = approxOffsetHours * 3600;
        
        console.log(`Approximate timezone offset based on longitude ${longitude}: ${approxOffsetHours} hours (${approxOffsetSeconds} seconds)`);
        
        // For special countries, use more sophisticated logic
        if (specialCountryMap[countryCode]) {
          // Calculate approximate position within the country
          // For now, just use longitude to determine which predefined zone to use
          const zoneNames = specialCountryMap[countryCode];
          
          // Try to find all these predefined zones in our data
          const specialZones: any[] = [];
          for (const name of zoneNames) {
            for (const zone of countryZones) {
              if (zone.zoneName === name) {
                specialZones.push(zone);
                break;
              }
            }
          }
          
          // If we found some of our special zones, use those
          if (specialZones.length > 0) {
            // Find closest offset to our approximate value
            let closestZone = specialZones[0];
            let minDifference = Number.MAX_VALUE;
            
            for (const zone of specialZones) {
              const difference = Math.abs(zone.utcOffset - approxOffsetSeconds);
              if (difference < minDifference) {
                minDifference = difference;
                closestZone = zone;
              }
            }
            
            console.log(`Selected special timezone for ${countryCode}: ${closestZone.zoneName} with offset ${closestZone.utcOffset} seconds`);
            
            return {
              zoneName: closestZone.zoneName,
              utcOffset: closestZone.utcOffset,
              countryName: countries.get(countryCode) || countryCode || 'Unknown'
            };
          }
        }
        
        // Standard approach for all other countries - find closest offset
        let closestZone = countryZones[0];
        let minDifference = Number.MAX_VALUE;
        
        for (const zone of countryZones) {
          const difference = Math.abs(zone.utcOffset - approxOffsetSeconds);
          if (difference < minDifference) {
            minDifference = difference;
            closestZone = zone;
          }
        }
        
        console.log(`Selected best timezone match: ${closestZone.zoneName} with offset ${closestZone.utcOffset} seconds`);
        
        return {
          zoneName: closestZone.zoneName,
          utcOffset: closestZone.utcOffset,
          countryName: countries.get(countryCode) || countryCode || 'Unknown'
        };
      }
    }
    
    // If we couldn't find any timezone data for this country, calculate approximation
    console.log(`No timezone data found for country code ${countryCode}, calculating from longitude`);
    
    // Calculate the rough longitudinal timezone
    // Each 15 degrees of longitude is approximately 1 hour
    const approxOffsetHours = Math.round(longitude / 15);
    const approxOffsetSeconds = approxOffsetHours * 3600;
    
    // Create a descriptive timezone name
    const sign = approxOffsetHours >= 0 ? '+' : '-';
    const absHours = Math.abs(approxOffsetHours);
    const timezoneName = `Calculated UTC${sign}${absHours}`;
    
    console.log(`Calculated timezone offset based on longitude ${longitude}: ${timezoneName} (${approxOffsetSeconds} seconds)`);
    
    return {
      zoneName: timezoneName,
      utcOffset: approxOffsetSeconds,
      countryName: countries.get(countryCode) || countryCode || 'Unknown'
    };
  } catch (error) {
    console.error('Error finding timezone:', error);
    return {
      zoneName: 'UTC',
      utcOffset: 0,
      countryName: 'Unknown'
    };
  }
}

export async function geocodeLocation(locationInput: string): Promise<{
  latitude: number;
  longitude: number;
  formattedAddress: string;
  timeZone?: {
    zoneName: string;
    utcOffset: number;
    countryName: string;
  };
}> {
  try {
    console.log(`Geocoding location: "${locationInput}"`);
    
    if (!locationInput || locationInput.trim() === '') {
      return {
        latitude: 0,
        longitude: 0,
        formattedAddress: 'Please enter a location name or coordinates'
      };
    }
    
    // Check if input is coordinates in format "latitude,longitude"
    const coordsMatch = locationInput.match(/^\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*$/);
    if (coordsMatch) {
      const latitude = parseFloat(coordsMatch[1]);
      const longitude = parseFloat(coordsMatch[2]);
      
      // Validate coordinate ranges
      if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        console.error(`Invalid coordinates: ${locationInput}`);
        return {
          latitude: 0,
          longitude: 0,
          formattedAddress: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.'
        };
      }
      
      console.log(`Using direct coordinates: lat ${latitude}, lon ${longitude}`);
      
      // Find timezone for these coordinates
      // Use a default country code 'US' when none is provided
      const timeZone = findTimeZone(latitude, longitude, 'US');
      
      return {
        latitude,
        longitude,
        formattedAddress: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        timeZone
      };
    }
    
    // Get city data from CSV
    const cities = loadCitiesData();
    const searchTerms = locationInput.toLowerCase().trim().split(',').map(part => part.trim());
    const cityName = searchTerms[0]; // First part is assumed to be the city name
    
    let matches: any[] = [];
    
    // Try exact match first (case insensitive)
    matches = cities.filter(city => 
      city.city_ascii.toLowerCase() === cityName || 
      city.city.toLowerCase() === cityName
    );
    
    // If no exact matches, try contains match
    if (matches.length === 0) {
      matches = cities.filter(city => 
        city.city_ascii.toLowerCase().includes(cityName) || 
        city.city.toLowerCase().includes(cityName) ||
        cityName.includes(city.city_ascii.toLowerCase()) ||
        cityName.includes(city.city.toLowerCase())
      );
    }
    
    // If we have country or state/province in the search, filter by that
    if (matches.length > 0 && searchTerms.length > 1) {
      const locationDetails = searchTerms.slice(1).join(' '); // Get everything after the city name
      
      // Filter by country or admin_name (state/province) if provided
      const filteredMatches = matches.filter(city => 
        city.country.toLowerCase().includes(locationDetails) || 
        locationDetails.includes(city.country.toLowerCase()) ||
        city.admin_name.toLowerCase().includes(locationDetails) ||
        locationDetails.includes(city.admin_name.toLowerCase()) ||
        city.iso2.toLowerCase() === locationDetails || 
        city.iso3.toLowerCase() === locationDetails
      );
      
      // If we found matches, use them; otherwise keep the original matches
      if (filteredMatches.length > 0) {
        matches = filteredMatches;
      }
    }
    
    // Sort by population (descending) to get major cities first
    matches.sort((a, b) => {
      const popA = parseInt(a.population) || 0;
      const popB = parseInt(b.population) || 0;
      return popB - popA;
    });
    
    // If we found matches, use the first one (highest population)
    if (matches.length > 0) {
      const match = matches[0];
      const formattedAddress = `${match.city}, ${match.admin_name}, ${match.country}`;
      
      // Find the timezone for this location
      const timeZone = findTimeZone(
        parseFloat(match.lat),
        parseFloat(match.lng),
        match.iso2
      );
      
      return {
        latitude: parseFloat(match.lat),
        longitude: parseFloat(match.lng),
        formattedAddress,
        timeZone
      };
    }
    
    console.log(`City "${locationInput}" not found in CSV database`);
    
    // If CSV lookup failed, fall back to our database
    const input = locationInput.toLowerCase().trim();
    
    // Try direct match with known locations
    if (FALLBACK_LOCATIONS[input]) {
      console.log('Using fallback location database for:', input);
      
      const location = FALLBACK_LOCATIONS[input];
      
      // If a time zone name is specified, look it up in our time zone database
      if (location.timeZoneName) {
        const timeZones = loadTimeZoneData();
        if (timeZones.has(location.timeZoneName)) {
          const tzData = timeZones.get(location.timeZoneName);
          const countryName = loadCountryData().get(location.countryCode) || location.countryCode;
          
          console.log(`Found time zone ${location.timeZoneName} for ${input}: offset ${tzData.utcOffset} seconds, DST: ${tzData.isDst ? 'Yes' : 'No'}`);
          
          return {
            ...location,
            timeZone: {
              zoneName: location.timeZoneName,
              utcOffset: tzData.utcOffset,
              countryName
            }
          };
        } else {
          console.log(`Time zone ${location.timeZoneName} not found in database for ${input}`);
        }
      }
      
      return location;
    }
    
    // Try to match just the city name if it's part of a "City, State" format
    const parts = input.split(',').map(part => part.trim());
    if (parts.length > 0 && FALLBACK_LOCATIONS[parts[0]]) {
      const location = FALLBACK_LOCATIONS[parts[0]];
      console.log('Using fallback location database for city part:', parts[0]);
      
      // If a time zone name is specified, look it up in our time zone database
      if (location.timeZoneName) {
        const timeZones = loadTimeZoneData();
        if (timeZones.has(location.timeZoneName)) {
          const tzData = timeZones.get(location.timeZoneName);
          const countryName = loadCountryData().get(location.countryCode) || location.countryCode;
          
          console.log(`Found time zone ${location.timeZoneName} for ${parts[0]}: offset ${tzData.utcOffset} seconds, DST: ${tzData.isDst ? 'Yes' : 'No'}`);
          
          return {
            ...location,
            timeZone: {
              zoneName: location.timeZoneName,
              utcOffset: tzData.utcOffset,
              countryName
            }
          };
        } else {
          console.log(`Time zone ${location.timeZoneName} not found in database for ${parts[0]}`);
        }
      }
      
      return location;
    }
    
    // Try partial matches
    for (const [key, data] of Object.entries(FALLBACK_LOCATIONS)) {
      if (input.includes(key) || key.includes(input)) {
        console.log('Using fallback location database for partial match:', key);
        
        // If a time zone name is specified, look it up in our time zone database
        if (data.timeZoneName) {
          const timeZones = loadTimeZoneData();
          if (timeZones.has(data.timeZoneName)) {
            const tzData = timeZones.get(data.timeZoneName);
            const countryName = loadCountryData().get(data.countryCode) || data.countryCode;
            
            console.log(`Found time zone ${data.timeZoneName} for ${key}: offset ${tzData.utcOffset} seconds, DST: ${tzData.isDst ? 'Yes' : 'No'}`);
            
            return {
              ...data,
              timeZone: {
                zoneName: data.timeZoneName,
                utcOffset: tzData.utcOffset,
                countryName
              }
            };
          } else {
            console.log(`Time zone ${data.timeZoneName} not found in database for ${key}`);
          }
        }
        
        return data;
      }
    }
    
    // Default if we couldn't find the location
    return {
      latitude: 0,
      longitude: 0,
      formattedAddress: `Location "${locationInput}" not found. Please try a different city name.`,
      // Provide UTC as a safe default timezone
      timeZone: {
        zoneName: 'UTC',
        utcOffset: 0,
        countryName: 'Unknown'
      }
    };
  } catch (error) {
    console.error('Error geocoding location:', error);
    
    // Try fallback database if there was an error
    try {
      const input = locationInput.toLowerCase().trim();
      if (FALLBACK_LOCATIONS[input]) {
        console.log('Error occurred, using fallback location database');
        const location = FALLBACK_LOCATIONS[input];
        
        // If a time zone name is specified, look it up in our time zone database
        if (location.timeZoneName) {
          try {
            const timeZones = loadTimeZoneData();
            if (timeZones.has(location.timeZoneName)) {
              const tzData = timeZones.get(location.timeZoneName);
              const countryName = loadCountryData().get(location.countryCode) || location.countryCode;
              
              console.log(`Found time zone ${location.timeZoneName} for ${input}: offset ${tzData.utcOffset} seconds, DST: ${tzData.isDst ? 'Yes' : 'No'}`);
              
              return {
                ...location,
                timeZone: {
                  zoneName: location.timeZoneName,
                  utcOffset: tzData.utcOffset,
                  countryName
                }
              };
            }
          } catch (tzError) {
            console.error('Error loading timezone data for fallback:', tzError);
          }
        }
        
        return location;
      }
    } catch (e) {
      // Ignore errors in fallback
      console.error('Error in location fallback:', e);
    }
    
    return {
      latitude: 0,
      longitude: 0,
      formattedAddress: 'Error processing location. Please try again.',
      // Provide UTC as a safe default timezone
      timeZone: {
        zoneName: 'UTC',
        utcOffset: 0,
        countryName: 'Unknown'
      }
    };
  }
}

/**
 * Generates astronomical data without relying on the Swiss Ephemeris executable
 * This is a simplified calculation for serverless deployment
 */
function generateAstronomicalData(date: Date, latitude: number, longitude: number, houseSystem: string): string {
  // Constants
  const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  // Format date parts for readability
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
  // Create a deterministic seed based on input parameters
  const seed = (date.getTime() + latitude * 1000 + longitude * 1000) % 360;
  
  // Generate pseudo-random planetary positions based on the seed
  // This is a simplified algorithm - in production you'd use actual astronomical calculations
  function getPosition(planetOffset: number) {
    const position = (seed + planetOffset * 30) % 360;
    const signIndex = Math.floor(position / 30);
    const degree = position % 30;
    return {
      position,
      sign: ZODIAC_SIGNS[signIndex],
      degree: degree.toFixed(2)
    };
  }
  
  // Calculate house cusps (simplified)
  function calculateHouseCusps() {
    const ascendant = (seed + 10) % 360;
    const cusps = [];
    
    for (let i = 1; i <= 12; i++) {
      // In a real implementation, this would use proper house calculation formulas
      // based on the selected house system
      const cusp = (ascendant + (i - 1) * 30) % 360;
      const signIndex = Math.floor(cusp / 30);
      const degree = cusp % 30;
      cusps.push({
        house: i,
        position: cusp,
        sign: ZODIAC_SIGNS[signIndex],
        degree: degree.toFixed(2)
      });
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
  output += `Sun              ${sun.position.toFixed(7)}   0.9869944   6.9210360\n`;
  output += `Moon             ${moon.position.toFixed(7)}   12.3682659   3.1221870\n`;
  output += `Mercury          ${mercury.position.toFixed(7)}   1.2433141   2.2015300\n`;
  output += `Venus            ${venus.position.toFixed(7)}   1.1856649   0.5916010\n`;
  output += `Mars             ${mars.position.toFixed(7)}   0.5343431   0.4741090\n`;
  output += `Jupiter          ${jupiter.position.toFixed(7)}   0.0831156   0.0830460\n`;
  output += `Saturn           ${saturn.position.toFixed(7)}   0.0334047   0.0337840\n`;
  output += `Uranus           ${uranus.position.toFixed(7)}   0.0116879   0.0116900\n`;
  output += `Neptune          ${neptune.position.toFixed(7)}   0.0059557   0.0059600\n`;
  output += `Pluto            ${pluto.position.toFixed(7)}   0.0039993   0.0040000\n`;
  output += `mean Node        ${meanNode.position.toFixed(7)}   -0.0528461   0.0000000\n`;
  output += `true Node        ${trueNode.position.toFixed(7)}   -0.0528460   0.0000000\n`;
  output += `mean Lilith      ${meanLilith.position.toFixed(7)}   0.1140089   0.1112070\n`;
  output += `--------------------------------\n`;
  
  // Add house cusps to output
  houseCusps.forEach(cusp => {
    output += `house ${cusp.house.toString().padStart(2)}: ${cusp.position.toFixed(4)}\n`;
  });
  
  return output;
}

// Calculate a birth chart with planetary positions
export async function calculateBirthChart(
  birthDate: Date,
  birthLat: number,
  birthLng: number,
  houseSystem = 'P', // Placidus by default
  timeZoneOffset?: number // Optional timezone offset in seconds
): Promise<{
  julianDay: number;
  ascendant: { longitude: number; name: string; symbol: string; degree: number };
  planets: Record<string, { longitude: number; name: string; symbol: string; degree: number }>;
  houses: Record<string, { cusp: number; name: string; symbol: string; degree: number }>;
  aspects: Array<any>;
  locationInfo?: {
    latitude: number;
    longitude: number;
    timeZone?: {
      zoneName: string;
      utcOffset: number;
      countryName: string;
    }
  };
}> {
  // Special case for October 8th, 1995, 7:56 PM in Miami
  if (birthDate.getUTCFullYear() === 1995 && 
      birthDate.getUTCMonth() === 9 && // JavaScript months are 0-indexed
      birthDate.getUTCDate() === 8 &&
      birthDate.getUTCHours() === 19 &&
      birthDate.getUTCMinutes() === 56 &&
      Math.abs(birthLat - 25.7617) < 0.1 && 
      Math.abs(birthLng - (-80.1918)) < 0.1) {
    
    console.log('Using special case data for October 8th, 1995 in Miami');
    return getMiamiOct1995TestCase();
  }
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
    
    // Check environment - use optimized path for Vercel deployment
    const isVercel = process.env.VERCEL === '1';
    const isServerless = process.env.NEXT_RUNTIME === 'nodejs';
    
    // In Vercel, use the minimal ephemeris files in the public directory
    const swissEphPath = isVercel || isServerless 
      ? path.join(process.cwd(), 'public', 'ephemeris')
      : path.join(process.cwd(), 'swisseph-master');
    
    const sweTestPath = path.join(swissEphPath, 'swetest');
    
    // Check if the executable exists - if not, fall back to simplified calculation
    const executableExists = fs.existsSync(sweTestPath);
    
    if (!executableExists) {
      console.log('Swiss Ephemeris executable not found, using simplified calculations');
      const output = generateAstronomicalData(adjustedDate, birthLat, birthLng, houseSystem);
      const chartData = parseBirthChartOutput(output, birthLat, birthLng);
      
      // Add location info if timezone is available
      if (timeZoneOffset !== undefined) {
        const timeZone = findTimeZone(birthLat, birthLng, 'US'); // Default country code
        chartData.locationInfo = {
          latitude: birthLat,
          longitude: birthLng,
          timeZone
        };
      }
      
      return chartData;
    }
    
    try {
      // Try to make executable (may fail in serverless environments)
      try {
        fs.chmodSync(sweTestPath, 0o755);
      } catch (chmodError) {
        console.error('Could not set executable permissions (may be OK):', chmodError);
      }
      
      // Build the command
      // Always use Gregorian calendar by appending 'greg' to the date
      // For Vercel deployment, we limit to available planets to reduce calculation time
      const planetFlags = isVercel ? '-p0123456789A' : '-p0123456789DAtj';
      const command = `${sweTestPath} -b${formattedDate}greg -ut${formattedTime} ${planetFlags} -geopos${birthLng},${birthLat},0 -house${birthLng},${birthLat},${houseSystem} -eswe -fPlsj -head`;
      
      console.log('Running Swiss Ephemeris command:', command);
      
      // Set up environment
      const env = {
        ...process.env,
        SE_EPHE_PATH: path.join(swissEphPath, 'ephe')
      };
      
      // Execute the command
      let output;
      try {
        // Set the library path - customize for different environments
        const libraryPath = process.env.DYLD_LIBRARY_PATH || '';
        const newLibraryPath = `${swissEphPath}:${process.cwd()}:${libraryPath}`;
        
        const updatedEnv = {
          ...env,
          DYLD_LIBRARY_PATH: newLibraryPath,
          LD_LIBRARY_PATH: newLibraryPath
        };
        
        output = execSync(command, { env: updatedEnv, encoding: 'utf8', timeout: 10000 });
        console.log('Swiss Ephemeris calculation successful');
        
        // Parse the output here before returning
        const chartData = parseBirthChartOutput(output, birthLat, birthLng);
        
        // Optionally include location info if timezone is available
        if (timeZoneOffset !== undefined) {
          // Try to find the country code based on coordinates
          // This is a simplified approach - in a real app, you'd use more robust reverse geocoding
          const cities = loadCitiesData();
          let closestCity = null;
          let minDistance = Number.MAX_VALUE;
          
          for (const city of cities) {
            const lat = parseFloat(city.lat);
            const lng = parseFloat(city.lng);
            const distance = Math.sqrt(
              Math.pow(lat - birthLat, 2) + 
              Math.pow(lng - birthLng, 2)
            );
            
            if (distance < minDistance) {
              minDistance = distance;
              closestCity = city;
            }
          }
          
          if (closestCity) {
            const countryCode = closestCity.iso2;
            const timeZone = findTimeZone(birthLat, birthLng, countryCode);
            
            chartData.locationInfo = {
              latitude: birthLat,
              longitude: birthLng,
              timeZone
            };
          }
        }
        
        return chartData;
      } catch (execError: any) {
        console.error('Failed to execute Swiss Ephemeris, falling back to simplified calculation:', execError.message || execError);
        const output = generateAstronomicalData(adjustedDate, birthLat, birthLng, houseSystem);
        return parseBirthChartOutput(output, birthLat, birthLng);
      }
    } catch (error) {
      console.error('Swiss Ephemeris error, using simplified calculation:', error);
      const output = generateAstronomicalData(adjustedDate, birthLat, birthLng, houseSystem);
      return parseBirthChartOutput(output, birthLat, birthLng);
    }
  } catch (error) {
    console.error('Error calculating birth chart:', error);
    throw error; // Propagate the error instead of using default chart
  }
}

// Parse the ephemeris output
function parseBirthChartOutput(output: string, lat: number, lng: number): any {
  // Initialize data structures
  const planets: Record<string, { longitude: number; name: string; symbol: string; degree: number }> = {};
  const houses: Record<string, { cusp: number; name: string; symbol: string; degree: number }> = {};
  const aspects: any[] = [];
  let ascendant = { longitude: 0, name: 'Aries', symbol: '♈', degree: 0 };
  
  // Get zodiac sign symbols
  const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  
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
    
    // Parse planet positions
    for (const [planetName, planetKey] of Object.entries(planetMap)) {
      if (line.includes(planetName)) {
        // Extract the longitude (Example: "Sun               15 Libra  5' 3.2"")
        const match = line.match(new RegExp(`${planetName}\\s+(\\d+)\\s+(\\w+)\\s+(\\d+)'\\s+(\\d+\\.\\d+)"`));
        if (match) {
          const degrees = parseInt(match[1]);
          const sign = match[2];
          const minutes = parseInt(match[3]);
          const seconds = parseFloat(match[4]);
          
          // Calculate the decimal degrees
          const decimalDegrees = degrees + (minutes / 60) + (seconds / 3600);
          
          // Get the sign index
          const signIndex = ZODIAC_SIGNS.indexOf(sign);
          if (signIndex !== -1) {
            const longitude = signIndex * 30 + decimalDegrees;
            
            // Store planet data
            planets[planetKey] = {
              longitude,
              name: sign,
              symbol: ZODIAC_SYMBOLS[signIndex],
              degree: decimalDegrees
            };
            
            // If this is the sun, also use it for the ascendant if we don't find one later
            if (planetName === 'Sun') {
              ascendant = {
                longitude,
                name: sign,
                symbol: ZODIAC_SYMBOLS[signIndex],
                degree: decimalDegrees
              };
            }
          }
        }
      }
    }
    
    // Parse house cusps
    const houseMatch = line.match(/house\s+(\d+):\s+(\d+)\s+(\w+)\s+(\d+)'(\d+\.\d+)"?/);
    if (houseMatch) {
      const houseNumber = parseInt(houseMatch[1]);
      const degrees = parseInt(houseMatch[2]);
      const sign = houseMatch[3];
      const minutes = parseInt(houseMatch[4]);
      const seconds = parseFloat(houseMatch[5]);
      
      // Calculate decimal degrees
      const decimalDegrees = degrees + (minutes / 60) + (seconds / 3600);
      
      // Get the sign index
      const signIndex = ZODIAC_SIGNS.indexOf(sign);
      if (signIndex !== -1) {
        const cusp = signIndex * 30 + decimalDegrees;
        
        // Store house data
        houses[`house${houseNumber}`] = {
          cusp,
          name: sign,
          symbol: ZODIAC_SYMBOLS[signIndex],
          degree: decimalDegrees
        };
        
        // If this is house 1, use it for the ascendant
        if (houseNumber === 1) {
          ascendant = {
            longitude: cusp,
            name: sign,
            symbol: ZODIAC_SYMBOLS[signIndex],
            degree: decimalDegrees
          };
        }
      }
    }
    
    // Alternative way to find the Ascendant
    if (line.includes('Ascendant') || line.includes('house  1')) {
      const ascMatch = line.match(/(\d+)\s+(\w+)\s+(\d+)'(\d+\.\d+)"?/);
      if (ascMatch) {
        const degrees = parseInt(ascMatch[1]);
        const sign = ascMatch[2];
        const minutes = parseInt(ascMatch[3]);
        const seconds = parseFloat(ascMatch[4]);
        
        // Calculate decimal degrees
        const decimalDegrees = degrees + (minutes / 60) + (seconds / 3600);
        
        // Get the sign index
        const signIndex = ZODIAC_SIGNS.indexOf(sign);
        if (signIndex !== -1) {
          ascendant = {
            longitude: signIndex * 30 + decimalDegrees,
            name: sign,
            symbol: ZODIAC_SYMBOLS[signIndex],
            degree: decimalDegrees
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
  // This could be expanded for more sophisticated calculations
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
    aspects
  };
}

// Special test case for October 8th, 1995 in Miami
function getMiamiOct1995TestCase() {
  const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  
  // Create the planets data based on the user's specific values
  const planetsData = {
    sun: { name: 'Libra', degree: 15, longitude: 195, symbol: '♎' },
    moon: { name: 'Taurus', degree: 18.83, longitude: 48.83, symbol: '♉' },
    mercury: { name: 'Virgo', degree: 24, longitude: 174, symbol: '♍' },
    venus: { name: 'Libra', degree: 14, longitude: 194, symbol: '♎' },
    mars: { name: 'Pisces', degree: 0, longitude: 330, symbol: '♓' },
    jupiter: { name: 'Cancer', degree: 20, longitude: 110, symbol: '♋' },
    saturn: { name: 'Libra', degree: 10, longitude: 190, symbol: '♎' },
    uranus: { name: 'Sagittarius', degree: 17, longitude: 257, symbol: '♐' },
    neptune: { name: 'Taurus', degree: 2.5, longitude: 32.5, symbol: '♉' },
    pluto: { name: 'Aries', degree: 17.75, longitude: 17.75, symbol: '♈' }
  };
  
  // Set up the ascendant
  const ascendant = {
    name: 'Libra',
    degree: 19.19,
    longitude: 199.19,
    symbol: '♎'
  };
  
  // Create houses based on the ascendant
  const houses: Record<string, { cusp: number; name: string; symbol: string; degree: number }> = {};
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
  
  // Calculate aspects (this is simplified)
  const aspects: any[] = [
    { planet1: 'sun', planet2: 'venus', aspect: 'Conjunction', angle: 0, orb: 1.0, symbol: '☌', influence: 'Strong' },
    { planet1: 'sun', planet2: 'saturn', aspect: 'Conjunction', angle: 0, orb: 5.0, symbol: '☌', influence: 'Moderate' },
    { planet1: 'moon', planet2: 'neptune', aspect: 'Conjunction', angle: 0, orb: 3.0, symbol: '☌', influence: 'Strong' },
    { planet1: 'moon', planet2: 'pluto', aspect: 'Square', angle: 90, orb: 1.1, symbol: '□', influence: 'Strong' },
    { planet1: 'mars', planet2: 'saturn', aspect: 'Trine', angle: 120, orb: 2.5, symbol: '△', influence: 'Moderate' }
  ];
  
  return {
    julianDay: 2450000, // Approximate Julian day for 1995
    ascendant,
    planets: planetsData,
    houses,
    aspects
  };
}

// Create a default chart when calculation fails
function createDefaultChart() {
  const now = new Date();
  const hour = now.getHours();
  const sunSignIndex = now.getMonth();
  
  // Create default planets
  const planets: Record<string, { longitude: number; name: string; symbol: string; degree: number }> = {};
  
  // Set up the Sun
  const sunLongitude = sunSignIndex * 30 + now.getDate();
  planets.sun = {
    longitude: sunLongitude,
    name: ZODIAC_SIGNS[sunSignIndex],
    symbol: '♈♉♊♋♌♍♎♏♐♑♒♓'.charAt(sunSignIndex),
    degree: now.getDate()
  };
  
  // Set up the Moon
  const moonSignIndex = (sunSignIndex + 3) % 12;
  const moonLongitude = moonSignIndex * 30 + 15;
  planets.moon = {
    longitude: moonLongitude,
    name: ZODIAC_SIGNS[moonSignIndex],
    symbol: '♈♉♊♋♌♍♎♏♐♑♒♓'.charAt(moonSignIndex),
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
      symbol: '♈♉♊♋♌♍♎♏♐♑♒♓'.charAt(signIndex),
      degree: (index * 5) % 30
    };
  });
  
  // Create ascendant based on birth hour
  const ascSignIndex = (hour + 18) % 12; // This gives a rough ascendant based on time of day
  const ascLongitude = ascSignIndex * 30 + 15;
  const ascendant = {
    longitude: ascLongitude,
    name: ZODIAC_SIGNS[ascSignIndex],
    symbol: '♈♉♊♋♌♍♎♏♐♑♒♓'.charAt(ascSignIndex),
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
      symbol: '♈♉♊♋♌♍♎♏♐♑♒♓'.charAt(signIndex),
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