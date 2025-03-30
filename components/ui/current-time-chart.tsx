'use client';

import { useState, useEffect } from 'react';
import { ZodiacWheel, type ChartData, exportChartAsImage } from './zodiacwheel';
import { querySwissEph } from '@/actions';
import { Button } from './button';
import { useRouter } from 'next/navigation';

export function CurrentTimeChart() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Get ephemeris command and output from response data if available
  const [ephemerisCommand, setEphemerisCommand] = useState<string>('');
  const [ephemerisOutput, setEphemerisOutput] = useState<string>('');
  const [locationDetails, setLocationDetails] = useState<{
    localTime: string;
    utcTime: string;
    longitude: string;
    latitude: string;
    timezone: string;
    command: string;
  }>({
    localTime: '',
    utcTime: '',
    longitude: '',
    latitude: '',
    timezone: '',
    command: ''
  });
  // State for user's location
  const [userLocation, setUserLocation] = useState<string | null>(null);
  
  // Function to parse the JavaScript Ephemeris output
  const parseSwissEphOutput = (output: string): ChartData => {
    // This is a simplified version - the full parser is in the swisseph page
    const planets: Record<string, any> = {};
    const houses: Record<string, any> = {};
    let ascendant = { name: 'Aries', symbol: '♈', longitude: 0, degree: 0 };
    
    // Basic zodiac signs
    const ZODIAC_SIGNS = [
      'Aries', 'Taurus', 'Gemini', 'Cancer',
      'Leo', 'Virgo', 'Libra', 'Scorpio',
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    
    // Planet map for parsing
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
      'Mean Node': 'meanNode', 
      'True Node': 'trueNode',
      'Ascendant': 'ascendant',
      'Midheaven': 'midheaven'
    };
    
    // Extract planet positions
    const lines = output.split('\n');
    for (const line of lines) {
      // Skip empty lines
      if (!line.trim()) continue;
      
      // Check for planet data - with the new JavaScript Ephemeris output format
      // Format example: "Sun         15° Libra 5' 3.1""
      for (const [planetName, planetKey] of Object.entries(planetMap)) {
        if (line.startsWith(planetName)) {
          // Match format like: "15° Libra 5' 3.1"" 
          const match = line.match(/(\d+)°\s+(\w+)\s+(\d+)'\s+(\d+\.?\d*)"/);
          if (match) {
            const degrees = parseInt(match[1]);
            const signName = match[2];
            const minutes = parseInt(match[3]);
            const seconds = parseFloat(match[4]);
            
            // Find the sign index
            const signIndex = ZODIAC_SIGNS.findIndex(s => s === signName);
            if (signIndex !== -1) {
              // Calculate precise degree within the sign
              const degreeInSign = degrees + (minutes / 60) + (seconds / 3600);
              // Calculate total longitude
              const longitude = signIndex * 30 + degreeInSign;
              
              planets[planetKey] = {
                name: signName,
                symbol: '',
                longitude,
                degree: degreeInSign
              };
              
              // If this is the Ascendant, store it separately
              if (planetName === 'Ascendant') {
                ascendant = planets[planetKey];
              }
            }
          } else {
            // Try alternative format - sometimes format might vary
            const altMatch = line.match(/(\d+\.\d+)/);
            if (altMatch) {
              const longitude = parseFloat(altMatch[1]);
              const signIndex = Math.floor(longitude / 30) % 12;
              const degreeInSign = longitude % 30;
              
              planets[planetKey] = {
                name: ZODIAC_SIGNS[signIndex],
                symbol: '',
                longitude,
                degree: degreeInSign
              };
              
              // If this is the Ascendant, store it separately
              if (planetName === 'Ascendant') {
                ascendant = planets[planetKey];
              }
            }
          }
        }
      }
      
      // Check for house cusps
      // Format example: "house 1     15° Libra 5' 3.1""
      const houseMatch = line.match(/house\s+(\d+)\s+(\d+)°\s+(\w+)\s+(\d+)'\s+(\d+\.?\d*)"/);
      if (houseMatch) {
        const houseNumber = parseInt(houseMatch[1]);
        const degrees = parseInt(houseMatch[2]);
        const signName = houseMatch[3];
        const minutes = parseInt(houseMatch[4]);
        const seconds = parseFloat(houseMatch[5]);
        
        // Find the sign index
        const signIndex = ZODIAC_SIGNS.findIndex(s => s === signName);
        if (signIndex !== -1) {
          // Calculate precise degree within the sign
          const degreeInSign = degrees + (minutes / 60) + (seconds / 3600);
          // Calculate total cusp value
          const cusp = signIndex * 30 + degreeInSign;
          
          houses[`house${houseNumber}`] = {
            cusp,
            name: signName,
            symbol: '',
            degree: degreeInSign
          };
        }
      } else {
        // Try alternative format
        const altHouseMatch = line.match(/house\s+(\d+):\s+(\d+\.\d+)/);
        if (altHouseMatch) {
          const houseNumber = parseInt(altHouseMatch[1]);
          const cusp = parseFloat(altHouseMatch[2]);
          const signIndex = Math.floor(cusp / 30) % 12;
          
          houses[`house${houseNumber}`] = {
            cusp,
            name: ZODIAC_SIGNS[signIndex],
            symbol: '',
            degree: cusp % 30
          };
        }
      }
    }
    
    // Format current date and time in local time
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    
    // If no houses were found, create default equal houses
    if (Object.keys(houses).length === 0) {
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
    
    // Ensure there's a minimum set of planets for the chart to display correctly
    const requiredPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'trueNode'];
    
    for (const planet of requiredPlanets) {
      if (!planets[planet]) {
        // Create a placeholder planet in Aries at 0 degrees
        planets[planet] = {
          name: 'Aries',
          symbol: '♈',
          longitude: 0,
          degree: 0
        };
      }
    }
    
    // Add south node if it doesn't exist
    if (!planets.southNode && planets.trueNode) {
      const trueNodeLong = planets.trueNode.longitude;
      const southNodeLong = (trueNodeLong + 180) % 360;
      const southNodeSignIndex = Math.floor(southNodeLong / 30);
      const southNodeDegree = southNodeLong % 30;
      
      planets.southNode = {
        name: ZODIAC_SIGNS[southNodeSignIndex],
        symbol: '☋',
        longitude: southNodeLong,
        degree: southNodeDegree
      };
    }
    
    // For debugging
    console.log("Final chart data:", {
      planets: Object.keys(planets),
      houses: Object.keys(houses),
      ascendant
    });
    
    return {
      planets,
      houses,
      ascendant,
      date: dateStr,
      time: timeStr,
      location: userLocation || 'Your Location',
      title: `Current Sky Chart (${userLocation ? userLocation.split(',')[0] : 'Local'} Time)`,
      rawOutput: output // Store the raw output for displaying later
    };
  };
  
  // Calculate the current chart on component mount
  useEffect(() => {
    // Get user's location first, then calculate chart
    const getUserLocationAndCalculateChart = async () => {
      try {
        setLoading(true);
        
        // Format current date/time in local timezone
        // The querySwissEph function handles the conversion to UTC
        const now = new Date();
        // Format date as DD.MM.YYYY
        const localDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
        // Format time as HH:MM including seconds for more precision
        const localTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        let ephemerisResponse;
        
        // Get user's location using browser geolocation
        try {
          // Wrap geolocation in a promise for easier async/await handling
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            } else {
              reject(new Error("Geolocation not supported"));
            }
          });
          
          // Extract coordinates
          const { latitude, longitude } = position.coords;
          
          // Get city name using reverse geocoding just for display purposes
          const geocodeResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          
          let locationStr = '';
          
          if (geocodeResponse.ok) {
            const data = await geocodeResponse.json();
            
            if (data.address) {
              // Get only city, state, and country (explicitly avoiding county)
              const city = data.address.city || data.address.town || data.address.village || '';
              const state = data.address.state || '';
              const country = data.address.country || '';
              
              // Build location string with just these three parts
              if (city) locationStr += city;
              if (state) locationStr += locationStr ? `, ${state}` : state;
              if (country) locationStr += locationStr ? `, ${country}` : country;
              
              console.log("Current chart location for display:", locationStr);
              setUserLocation(locationStr);
            }
          }
          
          // Create a coordinates-based location string for the Swiss Ephemeris
          // Format: "latitude,longitude" (e.g. "40.7128,-74.0060")
          // Add precision to ensure accurate calculations
          const coordLocation = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
          console.log("Using exact coordinates for calculation:", coordLocation);
          
          // First, find the nearest city and time zone using worldcities.csv and TimeZoneDB
          // This will be done in the querySwissEph function, which will properly handle 
          // the conversion of local time to UTC based on the detected timezone
          
          // Query the Swiss Ephemeris with local time and exact coordinates
          ephemerisResponse = await querySwissEph({
            date: localDate,
            time: localTime,
            location: coordLocation
          });
        } catch (error) {
          console.error("Error getting user location:", error);
          // Continue with default location (New York)
          console.log("Falling back to default location: New York, NY, USA");
          setUserLocation("New York, NY, USA");
          
          // Default coordinates for New York City (40.7128° N, 74.0060° W)
          const defaultCoordinates = "40.7128,-74.0060";
          console.log("Using default coordinates for New York:", defaultCoordinates);
          
          // The querySwissEph function will handle timezone lookup and UTC conversion
          // based on these coordinates using worldcities.csv and TimeZoneDB
          ephemerisResponse = await querySwissEph({
            date: localDate,
            time: localTime,
            location: defaultCoordinates
          });
        }
        
        if (ephemerisResponse.error) {
          setError(ephemerisResponse.error);
          return;
        }
        
        // Parse the output
        if (ephemerisResponse.output) {
          const parsedData = parseSwissEphOutput(ephemerisResponse.output);
          
          // Always include True Node (add a placeholder if missing)
          if (!parsedData.planets.trueNode) {
            console.log("True Node not found in ephemeris data, adding placeholder");
            // Add a placeholder True Node in Cancer as a fallback
            parsedData.planets.trueNode = {
              name: 'Cancer',
              symbol: '', // Will be populated from the zodiac symbols
              longitude: 105,
              degree: 15
            };
          }
          
          // Calculate South Node from True Node
          const trueNodeLong = parsedData.planets.trueNode.longitude;
          const southNodeLong = (trueNodeLong + 180) % 360;
          const southNodeSignIndex = Math.floor(southNodeLong / 30);
          const southNodeDegree = southNodeLong % 30;
          
          // Get opposite sign name using zodiac wheel logic
          const zodiacSigns = [
            'Aries', 'Taurus', 'Gemini', 'Cancer',
            'Leo', 'Virgo', 'Libra', 'Scorpio',
            'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
          ];
          const oppositeSignIndex = (southNodeSignIndex) % 12;
          
          parsedData.planets.southNode = {
            name: zodiacSigns[oppositeSignIndex],
            symbol: '', // Will be populated from the zodiac symbols
            longitude: southNodeLong,
            degree: southNodeDegree
          };
          
          // Add Midheaven (MC) if not present
          if (!parsedData.planets.midheaven) {
            console.log("Midheaven not found in ephemeris data, adding placeholder");
            // Add a placeholder Midheaven in Pisces as a fallback
            parsedData.planets.midheaven = {
              name: 'Pisces',
              symbol: '', // Will be populated from the zodiac symbols
              longitude: 350,
              degree: 20
            };
          }
          
          setChartData(parsedData);
        }
      } catch (err) {
        console.error('Error calculating current chart:', err);
        setError('Failed to calculate the current chart. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    getUserLocationAndCalculateChart();
  }, []);
  
  // Handle viewing the full chart
  const handleViewFullChart = () => {
    router.push('/swisseph');
  };
  
  // Update chart information when chartData changes
  useEffect(() => {
    if (chartData) {
      // Get current location details 
      const now = new Date();
      const localTimeStr = now.toLocaleString();
      const utcTimeStr = now.toUTCString();

      // Parse latitude and longitude from the query output if available
      let latitude = '';
      let longitude = '';
      let timezone = '';
      let command = '';

      // Navigate through the output to find location info
      if (chartData?.rawOutput) {
        const lines = chartData.rawOutput.split('\n');
        for (const line of lines) {
          if (line.includes('Latitude:')) {
            latitude = line.trim();
          } else if (line.includes('Longitude:')) {
            longitude = line.trim();
          } else if (line.includes('Time Zone:')) {
            timezone = line.trim();
          } else if (line.includes('Running Swiss Ephemeris command:')) {
            command = line.replace('Running Swiss Ephemeris command:', '').trim();
          }
        }

        // Find the output section - using the JavaScript Ephemeris marker
        const outputMatch = chartData.rawOutput.match(/---- JAVASCRIPT EPHEMERIS OUTPUT ----\n([\s\S]*)/);
        if (outputMatch && outputMatch[1]) {
          // We found the JavaScript Ephemeris output section
          setEphemerisOutput(outputMatch[1].trim());
        } else {
          // Fallback: try to extract the planets section
          const planetsSectionMatch = chartData.rawOutput.match(/Planets:\n([\s\S]*?)(?:\n\n|$)/);
          if (planetsSectionMatch && planetsSectionMatch[1]) {
            setEphemerisOutput(planetsSectionMatch[1].trim());
          } else {
            // Just use the whole output if we can't identify sections
            setEphemerisOutput(chartData.rawOutput);
          }
        }
      }

      setLocationDetails({
        localTime: localTimeStr,
        utcTime: utcTimeStr,
        longitude: longitude || 'Unknown',
        latitude: latitude || 'Unknown',
        timezone: timezone || 'Unknown',
        command: command || 'Unknown'
      });
    }
  }, [chartData]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center p-6 rounded-lg bg-gray-900 border border-gray-800">
        <div className="h-64 w-64 rounded-full animate-pulse bg-gray-800"></div>
        <p className="mt-4 text-gray-400">Calculating current planetary positions...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 rounded-lg bg-red-900/20 border border-red-800">
        <h3 className="text-xl font-semibold mb-2">Error Loading Chart</h3>
        <p className="text-red-300">{error}</p>
        <Button onClick={handleViewFullChart} className="mt-4">
          Try Full Chart Calculator
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Current Planetary Positions{userLocation ? ` (${userLocation.split(',')[0]})` : ' (Local Time)'}</h2>
      <div className="mb-4 w-full max-w-4xl flex justify-center">
        <ZodiacWheel 
          chartData={chartData || {
            planets: {
              sun: { name: 'Aries', symbol: '♈', longitude: 15, degree: 15 },
              moon: { name: 'Taurus', symbol: '♉', longitude: 45, degree: 15 },
              mercury: { name: 'Gemini', symbol: '♊', longitude: 75, degree: 15 },
              venus: { name: 'Cancer', symbol: '♋', longitude: 105, degree: 15 },
              mars: { name: 'Leo', symbol: '♌', longitude: 135, degree: 15 },
              jupiter: { name: 'Virgo', symbol: '♍', longitude: 165, degree: 15 },
              saturn: { name: 'Libra', symbol: '♎', longitude: 195, degree: 15 },
              uranus: { name: 'Scorpio', symbol: '♏', longitude: 225, degree: 15 },
              neptune: { name: 'Sagittarius', symbol: '♐', longitude: 255, degree: 15 },
              pluto: { name: 'Capricorn', symbol: '♑', longitude: 285, degree: 15 },
              trueNode: { name: 'Cancer', symbol: '♋', longitude: 105, degree: 15 },
              southNode: { name: 'Capricorn', symbol: '♑', longitude: 285, degree: 15 },
              midheaven: { name: 'Pisces', symbol: '♓', longitude: 350, degree: 20 }
            },
            houses: {} as Record<string, { cusp: number; name: string; symbol: string; degree: number }>,
            ascendant: { name: 'Aries', symbol: '♈', longitude: 0, degree: 0 },
            title: 'Current Sky Chart (Local Time)'
          }}
          width={600}
          height={600}
          hideControls={true}
        />
      </div>
      
      {/* Chart information details */}
      <div className="w-full max-w-4xl mt-6 mb-6 bg-gray-900/50 rounded-lg p-4 text-sm font-mono">
        <h3 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-2">Chart Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-semibold">Local Time:</span> {locationDetails.localTime}</p>
            <p><span className="font-semibold">UTC Time:</span> {locationDetails.utcTime}</p>
            <p><span className="font-semibold">Time Zone:</span> {locationDetails.timezone.replace('Time Zone: ', '')}</p>
          </div>
          <div>
            <p><span className="font-semibold">Latitude:</span> {locationDetails.latitude.replace('Latitude: ', '')}</p>
            <p><span className="font-semibold">Longitude:</span> {locationDetails.longitude.replace('Longitude: ', '')}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-1 border-b border-gray-700 pb-1">Ephemeris Command</h4>
          <pre className="bg-black/30 p-3 rounded text-xs overflow-x-auto mb-4">
            {locationDetails.command !== 'Unknown' ? locationDetails.command : 'Command not available'}
          </pre>
          
          <h4 className="font-semibold mb-1 border-b border-gray-700 pb-1">Ephemeris Output</h4>
          <pre className="bg-black/30 p-3 rounded text-xs overflow-x-auto max-h-32 overflow-y-auto">
            {ephemerisOutput || 'No output data available'}
          </pre>
        </div>
      </div>
      
      <div className="mt-4">
        <Button onClick={handleViewFullChart} className="w-full">
          View Full Birth Chart Calculator
        </Button>
      </div>
    </div>
  );
}