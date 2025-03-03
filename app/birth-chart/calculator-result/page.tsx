"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ZodiacWheel } from '@/components/ui/zodiacwheel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Planet symbols for the result page
const PLANET_SYMBOLS: Record<string, string> = {
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
  ascendant: 'Asc',
  meanNode: '☊',       // North Node
  trueNode: '☊',       // True North Node
  meanLilith: '⚸',     // Lilith
  chiron: '⚷',         // Chiron
};

function ChartContent() {
  const searchParams = useSearchParams();
  const [chartData, setChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [wheelData, setWheelData] = useState<any>(null);

  useEffect(() => {
    try {
      // Get the chart data from the URL
      const encodedData = searchParams.get('data');
      if (!encodedData) {
        setError('No chart data found. Please calculate a birth chart first.');
        return;
      }

      // Parse the data
      const decodedData = JSON.parse(decodeURIComponent(encodedData));
      setChartData(decodedData);

      // Format the data for the zodiac wheel component
      const planets: Record<string, any> = {};
      const houses: Record<string, any> = {};

      // Process planets
      Object.entries(decodedData.planets).forEach(([key, value]: [string, any]) => {
        planets[key] = {
          name: value.name,
          symbol: value.symbol || '',
          longitude: value.longitude,
          degree: value.degree
        };
      });

      // Process houses
      Object.entries(decodedData.houses).forEach(([key, value]: [string, any]) => {
        houses[key] = {
          cusp: value.cusp,
          name: value.name,
          symbol: value.symbol || '',
          degree: value.degree
        };
      });

      // Prepare data for the wheel
      setWheelData({
        planets,
        houses,
        ascendant: decodedData.ascendant || planets.ascendant || {
          name: 'Unknown',
          symbol: '',
          longitude: 0,
          degree: 0
        },
        aspects: decodedData.aspects || []
      });
    } catch (err) {
      console.error('Error parsing chart data:', err);
      setError('Error parsing chart data. Please try again.');
    }
  }, [searchParams]);

  // Helper function to format dates
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
            <Link href="/birth-chart/calculator">
              <Button>Calculate a Birth Chart</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!chartData || !wheelData) {
    return (
      <div className="min-h-screen p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded-md mb-4 w-64 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded-md mb-2 w-48 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded-md mb-8 w-32 mx-auto"></div>
              <div className="h-64 w-64 bg-gray-700 rounded-full mx-auto mb-8"></div>
              <div className="h-4 bg-gray-700 rounded-md w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pt-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/birth-chart/calculator">
            <Button variant="outline">← Back to Calculator</Button>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
            Birth Chart Results
          </h1>
          <p className="text-gray-300">
            {chartData.birthLocationFormatted || 'Unknown Location'} • 
            {chartData.calculationMethod ? ` Calculated with ${chartData.calculationMethod}` : ' Calculated with Swiss Ephemeris'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Zodiac Wheel - Takes up the left side (or top on mobile) */}
          <div className="flex flex-col items-center lg:col-span-2">
            <Card className="w-full bg-gradient-to-br from-gray-900 to-black border-gray-700 overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
                <CardTitle className="text-xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Interactive Birth Chart Wheel
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <div className="w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] lg:w-[600px] lg:h-[600px]">
                  <ZodiacWheel
                    chartData={wheelData}
                    width={600}
                    height={600}
                  />
                </div>
              </CardContent>
              <div className="px-6 pb-4 text-center text-xs text-gray-500">
                Hover over the chart to see detailed positions • Click planets for more information
              </div>
            </Card>

            {/* Aspects Table - Under the wheel on larger screens */}
            {wheelData.aspects && wheelData.aspects.length > 0 && (
              <Card className="w-full mt-6 bg-gradient-to-br from-gray-900 to-black border-gray-700">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
                  <CardTitle className="text-xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Planetary Aspects
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wheelData.aspects.slice(0, 8).map((aspect: any, index: number) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-800/50 border border-gray-700"
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-lg">
                            {PLANET_SYMBOLS[aspect.planet1] || aspect.planet1.charAt(0).toUpperCase()}
                          </span>
                          <span className="text-lg mx-1">{aspect.symbol}</span>
                          <span className="text-lg">
                            {PLANET_SYMBOLS[aspect.planet2] || aspect.planet2.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-300">
                          <span 
                            className={aspect.influence === 'Strong' ? 'text-blue-400' : 'text-gray-400'}
                          >
                            {aspect.aspect} ({aspect.orb.toFixed(1)}°)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {wheelData.aspects.length > 8 && (
                    <div className="mt-2 text-center text-sm text-gray-400">
                      + {wheelData.aspects.length - 8} more aspects
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Side - Planetary Positions and Chart Info */}
          <div className="space-y-6">
            {/* Calculation Method */}
            {chartData.calculationMethod && (
              <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3 text-center text-sm">
                <span className="text-blue-400">Calculation Method:</span> 
                <span className="text-gray-300 ml-2">{chartData.calculationMethod}</span>
              </div>
            )}
            
            {/* Planetary Positions Card */}
            <Card className="w-full bg-gradient-to-br from-gray-900 to-black border-gray-700">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
                <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Planetary Positions
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="space-y-5">
                  <div>
                    <h3 className="text-md font-medium mb-2 pb-1 border-b border-gray-800 text-blue-400 flex items-center">
                      <span className="mr-2">Personal Planets</span>
                      <span className="text-xs text-gray-500">(Inner Solar System)</span>
                    </h3>
                    <div className="space-y-2">
                      {['ascendant', 'sun', 'moon', 'mercury', 'venus', 'mars'].map((planet) => {
                        const planetData = chartData.planets[planet];
                        if (!planetData) return null;
                        
                        // Get planet symbol and color
                        const symbol = PLANET_SYMBOLS[planet] || planet.charAt(0).toUpperCase();
                        let symbolColorClass = 'text-white';
                        if (planet === 'sun') symbolColorClass = 'text-yellow-400';
                        if (planet === 'moon') symbolColorClass = 'text-gray-300';
                        if (planet === 'mercury') symbolColorClass = 'text-blue-400';
                        if (planet === 'venus') symbolColorClass = 'text-green-400';
                        if (planet === 'mars') symbolColorClass = 'text-red-500';
                        if (planet === 'ascendant') symbolColorClass = 'text-yellow-400';
                        
                        return (
                          <div key={planet} className="flex justify-between items-center border-b border-gray-800 border-opacity-30 pb-1">
                            <span className="flex items-center">
                              <span className={`text-lg mr-2 ${symbolColorClass}`}>{symbol}</span>
                              <span className="capitalize">{planet}:</span>
                            </span>
                            <span className="font-medium text-gray-300">
                              {planetData.name} {planetData.degree.toFixed(2)}°
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-2 pb-1 border-b border-gray-800 text-blue-400 flex items-center">
                      <span className="mr-2">Outer Planets</span>
                      <span className="text-xs text-gray-500">(Transpersonal)</span>
                    </h3>
                    <div className="space-y-2">
                      {['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].map((planet) => {
                        const planetData = chartData.planets[planet];
                        if (!planetData) return null;
                        
                        // Get planet symbol and color
                        const symbol = PLANET_SYMBOLS[planet] || planet.charAt(0).toUpperCase();
                        let symbolColorClass = 'text-white';
                        if (planet === 'jupiter') symbolColorClass = 'text-purple-400';
                        if (planet === 'saturn') symbolColorClass = 'text-gray-500';
                        if (planet === 'uranus') symbolColorClass = 'text-teal-400';
                        if (planet === 'neptune') symbolColorClass = 'text-blue-600';
                        if (planet === 'pluto') symbolColorClass = 'text-gray-600';
                        
                        return (
                          <div key={planet} className="flex justify-between items-center border-b border-gray-800 border-opacity-30 pb-1">
                            <span className="flex items-center">
                              <span className={`text-lg mr-2 ${symbolColorClass}`}>{symbol}</span>
                              <span className="capitalize">{planet}:</span>
                            </span>
                            <span className="font-medium text-gray-300">
                              {planetData.name} {planetData.degree.toFixed(2)}°
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Only show if we have at least one of these points */}
                  {(['meanNode', 'trueNode', 'meanLilith'].some(point => chartData.planets[point])) && (
                    <div>
                      <h3 className="text-md font-medium mb-2 pb-1 border-b border-gray-800 text-blue-400 flex items-center">
                        <span className="mr-2">Special Points</span>
                        <span className="text-xs text-gray-500">(Lunar Nodes & Lilith)</span>
                      </h3>
                      <div className="space-y-2">
                        {['meanNode', 'trueNode', 'meanLilith'].map((point) => {
                          const pointData = chartData.planets[point];
                          if (!pointData) return null;
                          
                          // Get point symbol and color
                          const symbol = PLANET_SYMBOLS[point] || '•';
                          let symbolColorClass = 'text-white';
                          if (point.includes('Node')) symbolColorClass = 'text-green-400';
                          if (point.includes('Lilith')) symbolColorClass = 'text-pink-400';
                          
                          return (
                            <div key={point} className="flex justify-between items-center border-b border-gray-800 border-opacity-30 pb-1">
                              <span className="flex items-center">
                                <span className={`text-lg mr-2 ${symbolColorClass}`}>{symbol}</span>
                                <span>{point.replace(/([A-Z])/g, ' $1').trim()}:</span>
                              </span>
                              <span className="font-medium text-gray-300">
                                {pointData.name} {pointData.degree.toFixed(2)}°
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Chart Legend */}
                  <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 text-blue-400">Elements & Modalities</h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>Fire: Aries, Leo, Sagittarius</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Earth: Taurus, Virgo, Capricorn</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Air: Gemini, Libra, Aquarius</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Water: Cancer, Scorpio, Pisces</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4 space-x-3">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={() => window.print()}
                    >
                      Print Chart
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-blue-600 text-blue-500"
                      onClick={() => window.location.href = '/birth-chart/calculator'}
                    >
                      New Chart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Chart Interpretation */}
            <Card className="w-full bg-gradient-to-br from-gray-900 to-black border-gray-700">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
                <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Chart Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <p className="text-sm text-gray-300 mb-3">
                  Your chart shows {chartData.planets.ascendant?.name || 'Unknown'} Rising, with 
                  your {chartData.planets.sun?.name || 'Unknown'} Sun and {chartData.planets.moon?.name || 'Unknown'} Moon.
                  This combination indicates:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
                  <li>A {chartData.planets.ascendant?.name || 'Unknown'} appearance and first impression</li>
                  <li>{chartData.planets.sun?.name || 'Unknown'} core identity and purpose</li>
                  <li>{chartData.planets.moon?.name || 'Unknown'} emotional nature and needs</li>
                </ul>
                <p className="text-sm text-gray-300">
                  The houses show which areas of life these planetary energies will manifest 
                  most strongly. Your chart's aspects reveal the relationships between different 
                  parts of your personality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-medium mb-4 text-blue-400">About Your Chart</h2>
          <p className="text-sm text-gray-300 mb-4">
            This birth chart was calculated using the Swiss Ephemeris, one of the most accurate astronomical calculation 
            libraries available. The planetary positions shown reflect the exact locations of celestial bodies at your 
            birth time and location.
          </p>
          <p className="text-sm text-gray-300">
            The ascendant (rising sign) and house cusps are calculated based on your birth time and location. If you want to 
            save this chart or perform a more detailed analysis, you can create an account and save your chart for future reference.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BirthChartResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded-md mb-4 w-64 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded-md mb-2 w-48 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded-md mb-8 w-32 mx-auto"></div>
              <div className="h-64 w-64 bg-gray-700 rounded-full mx-auto mb-8"></div>
              <div className="h-4 bg-gray-700 rounded-md w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ChartContent />
    </Suspense>
  );
}