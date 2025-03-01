"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

type BirthChartProps = {
  chart: {
    id: number;
    name: string;
    birthDate: string | Date;
    birthTime: string;
    birthPlace: string;
    ascendant?: string;
    sun?: string;
    moon?: string;
    mercury?: string;
    venus?: string;
    mars?: string;
    jupiter?: string;
    saturn?: string;
    uranus?: string;
    neptune?: string;
    pluto?: string;
    notes?: string;
  };
};

export function BirthChart({ chart }: BirthChartProps) {
  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  // Determine planet element colors
  const getElementColor = (sign: string | undefined) => {
    if (!sign) return "text-white";
    
    const fireSign = ["Aries", "Leo", "Sagittarius"];
    const earthSign = ["Taurus", "Virgo", "Capricorn"];
    const airSign = ["Gemini", "Libra", "Aquarius"];
    const waterSign = ["Cancer", "Scorpio", "Pisces"];
    
    const signName = sign.split(' ')[0];
    
    if (fireSign.includes(signName)) return "text-red-400";
    if (earthSign.includes(signName)) return "text-green-400";
    if (airSign.includes(signName)) return "text-blue-400";
    if (waterSign.includes(signName)) return "text-purple-400";
    
    return "text-white";
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-black border-gray-700 shadow-lg">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          {chart.name}&apos;s Birth Chart
        </CardTitle>
        <CardDescription className="text-gray-300">
          {formatDate(chart.birthDate)} at {chart.birthTime} in {chart.birthPlace}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <h3 className="text-lg font-medium border-b border-gray-800 pb-2">Personal Planets</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                <span className="flex items-center gap-2">
                  <span className="text-lg text-yellow-400">○</span>
                  <span>Ascendant:</span>
                </span>
                <span className={`font-medium ${getElementColor(chart.ascendant)}`}>
                  {chart.ascendant || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                <span className="flex items-center gap-2">
                  <span className="text-lg text-yellow-400">☉</span>
                  <span>Sun:</span>
                </span>
                <span className={`font-medium ${getElementColor(chart.sun)}`}>
                  {chart.sun || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                <span className="flex items-center gap-2">
                  <span className="text-lg text-gray-300">☽</span>
                  <span>Moon:</span>
                </span>
                <span className={`font-medium ${getElementColor(chart.moon)}`}>
                  {chart.moon || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                <span className="flex items-center gap-2">
                  <span className="text-lg text-blue-400">☿</span>
                  <span>Mercury:</span>
                </span>
                <span className={`font-medium ${getElementColor(chart.mercury)}`}>
                  {chart.mercury || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                <span className="flex items-center gap-2">
                  <span className="text-lg text-green-400">♀</span>
                  <span>Venus:</span>
                </span>
                <span className={`font-medium ${getElementColor(chart.venus)}`}>
                  {chart.venus || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                <span className="flex items-center gap-2">
                  <span className="text-lg text-red-500">♂</span>
                  <span>Mars:</span>
                </span>
                <span className={`font-medium ${getElementColor(chart.mars)}`}>
                  {chart.mars || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-5">
            <h3 className="text-lg font-medium border-b border-gray-800 pb-2">Outer Planets</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                <span className="flex items-center gap-2">
                  <span className="text-lg text-purple-400">♃</span>
                  <span>Jupiter:</span>
                </span>
                <span className={`font-medium ${getElementColor(chart.jupiter)}`}>
                  {chart.jupiter || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                <span className="flex items-center gap-2">
                  <span className="text-lg text-gray-500">♄</span>
                  <span>Saturn:</span>
                </span>
                <span className={`font-medium ${getElementColor(chart.saturn)}`}>
                  {chart.saturn || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                <span className="flex items-center gap-2">
                  <span className="text-lg text-teal-400">♅</span>
                  <span>Uranus:</span>
                </span>
                <span className={`font-medium ${getElementColor(chart.uranus)}`}>
                  {chart.uranus || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                <span className="flex items-center gap-2">
                  <span className="text-lg text-blue-600">♆</span>
                  <span>Neptune:</span>
                </span>
                <span className={`font-medium ${getElementColor(chart.neptune)}`}>
                  {chart.neptune || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                <span className="flex items-center gap-2">
                  <span className="text-lg text-gray-600">♇</span>
                  <span>Pluto:</span>
                </span>
                <span className={`font-medium ${getElementColor(chart.pluto)}`}>
                  {chart.pluto || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {chart.notes && (
          <div className="mt-6 bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-blue-400">Notes</h3>
            <p className="text-sm text-gray-300 italic">{chart.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end border-t border-gray-800 pt-4">
        <Link href={`/birth-chart/${chart.id}`}>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            View Full Chart
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

import { ZodiacWheel } from './zodiacwheel';
import { useEffect } from 'react';

type ChartDataType = {
  planets: Record<string, {
    name: string;
    symbol: string;
    longitude: number;
    degree: number;
  }>;
  houses: Record<string, {
    cusp: number;
    name: string;
    symbol: string;
    degree: number;
  }>;
  ascendant: {
    name: string;
    symbol: string;
    longitude: number;
    degree: number;
  };
  aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    angle: number;
    orb: number;
    symbol: string;
    influence: string;
  }>;
};

export function BirthChartFull({ chart }: BirthChartProps) {
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  
  useEffect(() => {
    // Process chart data for the ZodiacWheel component
    if (chart && chart.houses && typeof chart.houses === 'object') {
      try {
        // Convert stored string sign positions to objects with longitude
        const planetPositions: Record<string, any> = {};
        const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'ascendant'];
        
        // Mock planet data conversion
        // In a real implementation, this would parse the stored data in the correct format
        planets.forEach(planet => {
          const position = chart[planet];
          if (position) {
            const [sign, degStr] = position.split(' ');
            const deg = parseFloat(degStr.replace('°', ''));
            
            // Get base longitude for the sign
            const signIndex = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                              'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
                              .findIndex(s => s === sign);
            
            const baseLongitude = signIndex * 30;
            const longitude = baseLongitude + deg;
            
            planetPositions[planet] = {
              name: sign,
              symbol: '♈♉♊♋♌♍♎♏♐♑♒♓'.charAt(signIndex),
              longitude,
              degree: deg
            };
          }
        });
        
        // Parse house data
        let houseData = {};
        if (typeof chart.houses === 'string') {
          // If it's a string, try to parse it as JSON
          houseData = JSON.parse(chart.houses);
        } else {
          // If it's already an object, use it directly
          houseData = chart.houses;
        }
        
        // Create chart data for the wheel
        setChartData({
          planets: planetPositions,
          houses: houseData,
          ascendant: planetPositions.ascendant,
          aspects: typeof chart.aspects === 'string' ? JSON.parse(chart.aspects) : chart.aspects || []
        });
      } catch (error) {
        console.error('Error processing chart data:', error);
      }
    }
  }, [chart]);

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    });
  };
  
  // Determine planet element colors
  const getElementColor = (sign: string | undefined) => {
    if (!sign) return "text-white";
    
    const fireSign = ["Aries", "Leo", "Sagittarius"];
    const earthSign = ["Taurus", "Virgo", "Capricorn"];
    const airSign = ["Gemini", "Libra", "Aquarius"];
    const waterSign = ["Cancer", "Scorpio", "Pisces"];
    
    const signName = sign.split(' ')[0];
    
    if (fireSign.includes(signName)) return "text-red-400";
    if (earthSign.includes(signName)) return "text-green-400";
    if (airSign.includes(signName)) return "text-blue-400";
    if (waterSign.includes(signName)) return "text-purple-400";
    
    return "text-white";
  };
  
  // Get planet symbol
  const getPlanetSymbol = (planet: string) => {
    const symbols: Record<string, string> = {
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
      ascendant: '○'
    };
    
    return symbols[planet] || '';
  };
  
  // Get planet symbol color
  const getPlanetColor = (planet: string) => {
    const colors: Record<string, string> = {
      sun: 'text-yellow-400',
      moon: 'text-gray-300',
      mercury: 'text-blue-400',
      venus: 'text-green-400',
      mars: 'text-red-500',
      jupiter: 'text-purple-400',
      saturn: 'text-gray-500',
      uranus: 'text-teal-400',
      neptune: 'text-blue-600',
      pluto: 'text-gray-600',
      ascendant: 'text-yellow-400'
    };
    
    return colors[planet] || 'text-white';
  };

  // Get aspect symbol color
  const getAspectColor = (aspect: string) => {
    const colors: Record<string, string> = {
      'Conjunction': 'text-yellow-400',
      'Opposition': 'text-red-400',
      'Trine': 'text-green-400',
      'Square': 'text-orange-400',
      'Sextile': 'text-blue-400',
      'Quincunx': 'text-purple-400',
      'Semi-Square': 'text-gray-400',
      'Semi-Sextile': 'text-gray-300'
    };
    
    return colors[aspect] || 'text-white';
  };

  return (
    <Card className="w-full max-w-5xl mx-auto bg-gradient-to-br from-gray-900 to-black border-gray-700 shadow-lg">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          {chart.name}&apos;s Birth Chart
        </CardTitle>
        <CardDescription className="text-gray-300 text-lg">
          {formatDate(chart.birthDate)} at {chart.birthTime} in {chart.birthPlace}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-8">
          {/* Zodiac Wheel */}
          <div className="w-full flex justify-center">
            {chartData ? (
              <div className="glow-container">
                <ZodiacWheel chartData={chartData} width={560} height={560} />
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center bg-gray-900 rounded-lg border border-gray-800">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-16 w-16 bg-gray-700 rounded-full mb-4"></div>
                  <div className="h-4 w-32 bg-gray-700 rounded"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black bg-opacity-40 p-6 rounded-lg border border-gray-800">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-3 pb-2 border-b border-gray-800 text-blue-400">Personal Planets</h3>
                <div className="space-y-3">
                  {['ascendant', 'sun', 'moon', 'mercury', 'venus', 'mars'].map(planet => (
                    <div key={planet} className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                      <span className="flex items-center gap-2">
                        <span className={`text-lg ${getPlanetColor(planet)}`}>{getPlanetSymbol(planet)}</span>
                        <span>{planet.charAt(0).toUpperCase() + planet.slice(1)}:</span>
                      </span>
                      <span className={`font-medium ${getElementColor(chart[planet])}`}>
                        {chart[planet] || 'Unknown'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-3 pb-2 border-b border-gray-800 text-blue-400">Outer Planets</h3>
                <div className="space-y-3">
                  {['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].map(planet => (
                    <div key={planet} className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                      <span className="flex items-center gap-2">
                        <span className={`text-lg ${getPlanetColor(planet)}`}>{getPlanetSymbol(planet)}</span>
                        <span>{planet.charAt(0).toUpperCase() + planet.slice(1)}:</span>
                      </span>
                      <span className={`font-medium ${getElementColor(chart[planet])}`}>
                        {chart[planet] || 'Unknown'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <h3 className="text-xl font-medium mb-3 pb-2 border-b border-gray-800 text-blue-400">Chart Interpretation</h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  This birth chart represents the cosmic snapshot of the heavens at the moment of birth. 
                  The positions of the planets, the Sun, and the Moon relative to the zodiac signs and houses 
                  offer insights into personality traits, challenges, and potentials.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2 text-purple-400">Key Aspects:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-gray-300">
                    <li>Sun in <span className={getElementColor(chart.sun)}>{chart.sun?.split(' ')[0]}</span> represents your core identity and life purpose</li>
                    <li>Moon in <span className={getElementColor(chart.moon)}>{chart.moon?.split(' ')[0]}</span> reflects your emotional nature and subconscious patterns</li>
                    <li>Ascendant in <span className={getElementColor(chart.ascendant)}>{chart.ascendant?.split(' ')[0]}</span> shows how you present yourself to the world</li>
                    <li>Mercury in <span className={getElementColor(chart.mercury)}>{chart.mercury?.split(' ')[0]}</span> indicates your communication and thinking style</li>
                    <li>Venus in <span className={getElementColor(chart.venus)}>{chart.venus?.split(' ')[0]}</span> reveals how you express love and what you value</li>
                  </ul>
                </div>
              </div>
              
              {chartData?.aspects && chartData.aspects.length > 0 && (
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-medium mb-3 pb-2 border-b border-gray-800 text-blue-400">Major Aspects</h3>
                  <div className="space-y-2">
                    {chartData.aspects.slice(0, 6).map((aspect, i) => (
                      <div key={i} className="flex justify-between items-center text-sm border-b border-gray-800 border-opacity-30 pb-2">
                        <span className="flex items-center gap-1">
                          <span className={getPlanetColor(aspect.planet1)}>
                            {getPlanetSymbol(aspect.planet1)}
                          </span>
                          <span className={getAspectColor(aspect.aspect)}>
                            {aspect.symbol}
                          </span>
                          <span className={getPlanetColor(aspect.planet2)}>
                            {getPlanetSymbol(aspect.planet2)}
                          </span>
                        </span>
                        <span className="text-gray-400">
                          <span className={getAspectColor(aspect.aspect)}>{aspect.aspect}</span> 
                          <span className="text-gray-500"> (orb: {aspect.orb}°)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {chart.notes && (
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-medium mb-3 pb-2 border-b border-gray-800 text-blue-400">Personal Notes</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-300">{chart.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <style jsx>{`
        .glow-container {
          position: relative;
        }
        .glow-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 0.5rem;
          box-shadow: 0 0 40px rgba(0, 100, 255, 0.1);
          z-index: -1;
        }
      `}</style>
    </Card>
  );
}

export function BirthChartForm() {
  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 to-black border-gray-700 shadow-lg">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Create Birth Chart
        </CardTitle>
        <CardDescription className="text-gray-300">
          Enter birth details to generate an astrological chart
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-blue-300">
              Chart Name/Title
            </label>
            <input
              id="name"
              name="name"
              className="w-full p-3 border border-gray-700 rounded-md bg-black text-white shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. My Birth Chart or John's Chart"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="birthDate" className="text-sm font-medium text-blue-300">
              Birth Date
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="w-full p-3 border border-gray-700 rounded-md bg-black text-white shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="birthTime" className="text-sm font-medium text-blue-300">
              Birth Time (as exact as possible)
            </label>
            <input
              id="birthTime"
              name="birthTime"
              type="time"
              className="w-full p-3 border border-gray-700 rounded-md bg-black text-white shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              For the most accurate chart, use the exact birth time from a birth certificate or hospital record
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="birthPlace" className="text-sm font-medium text-blue-300">
              Birth Place
            </label>
            <input
              id="birthPlace"
              name="birthPlace"
              className="w-full p-3 border border-gray-700 rounded-md bg-black text-white shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="City, State/Province, Country"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter a city name like &quot;Miami&quot; or &quot;Miami, Florida&quot; - try to use major cities for better accuracy
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="houseSystem" className="text-sm font-medium text-blue-300">
              House System
            </label>
            <select
              id="houseSystem"
              name="houseSystem"
              className="w-full p-3 border border-gray-700 rounded-md bg-black text-white shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              defaultValue="P"
            >
              <option value="P">Placidus</option>
              <option value="K">Koch</option>
              <option value="O">Porphyrius</option>
              <option value="R">Regiomontanus</option>
              <option value="C">Campanus</option>
              <option value="E">Equal</option>
              <option value="W">Whole Sign</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Placidus is the most commonly used house system in Western astrology
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-blue-300">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              className="w-full p-3 border border-gray-700 rounded-md bg-black text-white shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all h-24"
              placeholder="Any additional information or questions about this chart..."
            />
          </div>
          
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all py-2.5 h-auto text-lg">
            Calculate Birth Chart
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}