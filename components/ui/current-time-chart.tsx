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
  
  // Function to parse the Swiss Ephemeris output
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
      'Ascendant': 'ascendant'
    };
    
    // Extract planet positions
    const lines = output.split('\n');
    for (const line of lines) {
      // Skip empty lines
      if (!line.trim()) continue;
      
      // Check for planet data
      for (const [planetName, planetKey] of Object.entries(planetMap)) {
        if (line.includes(planetName)) {
          const match = line.match(/(\d+\.\d+)/);
          if (match) {
            const longitude = parseFloat(match[1]);
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
      
      // Check for house cusps
      const houseMatch = line.match(/house\s+(\d+):\s+(\d+\.\d+)/);
      if (houseMatch) {
        const houseNumber = parseInt(houseMatch[1]);
        const cusp = parseFloat(houseMatch[2]);
        const signIndex = Math.floor(cusp / 30) % 12;
        
        houses[`house${houseNumber}`] = {
          cusp,
          name: ZODIAC_SIGNS[signIndex],
          symbol: '',
          degree: cusp % 30
        };
      }
    }
    
    // Format current date and time in UTC
    const now = new Date();
    const dateStr = now.toLocaleDateString(undefined, { timeZone: 'UTC' });
    const timeStr = now.toLocaleTimeString(undefined, { timeZone: 'UTC' });
    
    return {
      planets,
      houses,
      ascendant,
      date: dateStr,
      time: `${timeStr} UTC`,
      location: 'Greenwich, London, UK',
      title: 'Current Sky Chart (UTC)'
    };
  };
  
  // Calculate the current chart on component mount
  useEffect(() => {
    const calculateCurrentChart = async () => {
      try {
        setLoading(true);
        
        // Format the current date and time in UTC
        const now = new Date();
        
        // Get UTC components
        const utcDate = `${now.getUTCDate().toString().padStart(2, '0')}.${(now.getUTCMonth() + 1).toString().padStart(2, '0')}.${now.getUTCFullYear()}`;
        const utcTime = `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')}`;
        
        // Use Greenwich as location since we're using UTC time
        const location = 'Greenwich, London, UK'; // Default location for UTC
        
        // Query the Swiss Ephemeris with UTC time
        const response = await querySwissEph({
          date: utcDate,
          time: utcTime,
          location
        });
        
        if (response.error) {
          setError(response.error);
          return;
        }
        
        // Parse the output
        if (response.output) {
          const parsedData = parseSwissEphOutput(response.output);
          setChartData(parsedData);
        }
      } catch (err) {
        console.error('Error calculating current chart:', err);
        setError('Failed to calculate the current chart. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    calculateCurrentChart();
  }, []);
  
  // Handle viewing the full chart
  const handleViewFullChart = () => {
    router.push('/swisseph');
  };
  
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
      <h2 className="text-2xl font-bold mb-4">Current Planetary Positions (UTC)</h2>
      <div className="mb-4 w-full max-w-4xl flex justify-center">
        <ZodiacWheel 
          chartData={chartData || {
            planets: {
              sun: { name: 'Aries', symbol: '♈', longitude: 15, degree: 15 }
            },
            houses: {} as Record<string, { cusp: number; name: string; symbol: string; degree: number }>,
            ascendant: { name: 'Aries', symbol: '♈', longitude: 0, degree: 0 },
            title: 'Current Sky Chart (UTC)'
          }}
          width={600}
          height={600}
          hideControls={true}
        />
      </div>
      
      <div className="mt-4">
        <Button onClick={handleViewFullChart} className="w-full">
          View Full Birth Chart Calculator
        </Button>
      </div>
    </div>
  );
}