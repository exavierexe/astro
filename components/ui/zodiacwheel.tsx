"use client";

import React, { useRef, useEffect, useState } from 'react';

// Planet symbols (unicode)
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

// Zodiac sign symbols (unicode)
const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Helper function to convert degrees to radians
const degToRad = (deg: number) => (deg * Math.PI) / 180;

export type Planet = {
  name: string; 
  symbol: string;
  longitude: number;
  degree: number;
};

export type House = {
  cusp: number;
  name: string;
  symbol: string;
  degree: number;
};

export type Aspect = {
  planet1: string;
  planet2: string;
  aspect: string;
  angle: number;
  orb: number;
  symbol: string;
  influence: string;
};

export type ChartData = {
  planets: Record<string, Planet>;
  houses: Record<string, House>;
  ascendant: Planet;
  aspects?: Aspect[];
};

type ZodiacWheelProps = {
  chartData: ChartData;
  width?: number;
  height?: number;
};

export function ZodiacWheel({ chartData, width = 600, height = 600 }: ZodiacWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{ x: number; y: number; text: string } | null>(null);
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Radius settings
  const outerRadius = Math.min(width, height) * 0.45;
  const zodiacWidth = outerRadius * 0.15;
  const houseRadius = outerRadius - zodiacWidth;
  const planetRadius = houseRadius * 0.7;
  
  useEffect(() => {
    if (!canvasRef.current || !chartData) return;
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw the wheel
      drawZodiacWheel(ctx);
      
      // Draw houses
      drawHouses(ctx);
      
      // Draw planets
      drawPlanets(ctx);
      
      // Draw aspects
      if (chartData.aspects && chartData.aspects.length > 0) {
        drawAspects(ctx);
      }
    } catch (error) {
      console.error('Error drawing zodiac wheel:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, width, height]);
  
  const drawZodiacWheel = (ctx: CanvasRenderingContext2D) => {
    // Draw zodiac ring
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw inner circle (zodiac inner boundary)
    ctx.beginPath();
    ctx.arc(centerX, centerY, houseRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw zodiac signs divisions (30 degrees each)
    // Use the ascendant degree to position the wheel
    const ascendantDegree = chartData?.ascendant?.longitude || 0;
    
    // Set up an array of colors for the zodiac signs
    const elementColors: Record<string, string> = {
      fire: 'rgba(255, 100, 50, 0.3)',  // Orange for Fire signs (Aries, Leo, Sagittarius)
      earth: 'rgba(100, 200, 50, 0.3)', // Green for Earth signs (Taurus, Virgo, Capricorn)
      air: 'rgba(100, 200, 255, 0.3)',  // Blue for Air signs (Gemini, Libra, Aquarius)
      water: 'rgba(150, 100, 255, 0.3)'  // Purple for Water signs (Cancer, Scorpio, Pisces)
    };
    
    // For counterclockwise progression
    for (let i = 0; i < 12; i++) {
      // Reverse the angle calculation for counterclockwise rotation
      // Add 90 degrees to start with Aries at the 3 o'clock position
      const startAngle = degToRad(90 - (i + 1) * 30 - ascendantDegree);
      const endAngle = degToRad(90 - i * 30 - ascendantDegree);
      
      // Determine element based on traditional elemental order
      // Aries (fire), Taurus (earth), Gemini (air), Cancer (water), etc.
      const elements = ['fire', 'earth', 'air', 'water'];
      const element = elements[i % 4];
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle, false);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = elementColors[element];
      ctx.fill();
      
      // Draw segment line
      ctx.beginPath();
      ctx.moveTo(
        centerX + houseRadius * Math.cos(startAngle),
        centerY + houseRadius * Math.sin(startAngle)
      );
      ctx.lineTo(
        centerX + outerRadius * Math.cos(startAngle),
        centerY + outerRadius * Math.sin(startAngle)
      );
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      
      // Draw zodiac symbol in the middle of the segment
      const symbolAngle = (startAngle + endAngle) / 2;
      const symbolX = centerX + (houseRadius + zodiacWidth / 2) * Math.cos(symbolAngle);
      const symbolY = centerY + (houseRadius + zodiacWidth / 2) * Math.sin(symbolAngle);
      
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Ensure the symbol exists in the array - reverse the index for counterclockwise
      const symbolIndex = (12 - i) % 12;
      const symbol = ZODIAC_SYMBOLS[symbolIndex];
      ctx.fillText(symbol, symbolX, symbolY);
    }
  };
  
  const drawHouses = (ctx: CanvasRenderingContext2D) => {
    if (!chartData || !chartData.houses) return;
    
    const ascendantDegree = chartData.ascendant?.longitude || 0;
    
    // Draw inner wheel for houses
    ctx.beginPath();
    ctx.arc(centerX, centerY, houseRadius * 0.5, 0, 2 * Math.PI);
    ctx.strokeStyle = '#444';
    ctx.stroke();
    
    // Draw house divisions
    for (let i = 1; i <= 12; i++) {
      const house = chartData.houses[`house${i}`];
      if (!house) continue;
      
      // Make sure cusp is a number
      const cusp = typeof house.cusp === 'number' ? house.cusp : (i - 1) * 30;
      // Adjust angle calculation for counterclockwise rotation
      const angle = degToRad(90 - cusp - ascendantDegree);
      
      // Draw house line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + houseRadius * Math.cos(angle),
        centerY + houseRadius * Math.sin(angle)
      );
      
      // Make house cusps 1, 4, 7, 10 (angular houses) stand out
      if (i === 1 || i === 4 || i === 7 || i === 10) {
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1;
      }
      ctx.stroke();
      ctx.lineWidth = 1; // Reset line width
      
      // Draw house number near the center
      const numberRadius = houseRadius * 0.25;
      const numberAngle = angle + (i === 1 ? degToRad(-10) : (i === 7 ? degToRad(10) : 0));
      const numberX = centerX + numberRadius * Math.cos(numberAngle);
      const numberY = centerY + numberRadius * Math.sin(numberAngle);
      
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i.toString(), numberX, numberY);
    }
  };
  
  const drawPlanets = (ctx: CanvasRenderingContext2D) => {
    if (!chartData || !chartData.planets) return;
    
    const ascendantDegree = chartData.ascendant?.longitude || 0;
    
    // Define colors for planets
    const planetColors: Record<string, string> = {
      sun: '#ffcc00',       // Gold
      moon: '#e6e6fa',      // Light lavender
      mercury: '#66ccff',   // Light blue
      venus: '#ff99cc',     // Pink
      mars: '#ff3333',      // Red
      jupiter: '#9966ff',   // Purple
      saturn: '#996633',    // Brown
      uranus: '#00cccc',    // Teal
      neptune: '#3366ff',   // Blue
      pluto: '#663333',     // Dark brown
      ascendant: '#ffffff', // White
      meanNode: '#99cc66',  // Light green
      trueNode: '#99cc66',  // Light green
      meanLilith: '#cc33ff', // Magenta
      chiron: '#66ffcc'     // Mint
    };
    
    // Filter valid planets with longitude data
    const planetEntries = Object.entries(chartData.planets)
      .filter(([_, planet]) => planet && typeof planet.longitude === 'number');
    
    // Skip if no valid planets
    if (planetEntries.length === 0) return;
    
    // Sort planets by longitude to handle overlaps
    planetEntries.sort(([_, a], [__, b]) => a.longitude - b.longitude);
    
    // Draw lines from each planet to the edge to show their position
    for (const [name, planet] of planetEntries) {
      if (name === 'ascendant') continue;
      
      const longitude = planet.longitude;
      // Adjust angle calculation for counterclockwise rotation
      const angle = degToRad(90 - longitude - ascendantDegree);
      
      // Draw guiding line to edge
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + outerRadius * Math.cos(angle),
        centerY + outerRadius * Math.sin(angle)
      );
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();
    }
    
    // Track positions to avoid overlaps
    const placedPositions: {angle: number, radius: number}[] = [];
    
    // Place all planets
    for (const [name, planet] of planetEntries) {
      // Skip the Ascendant as it's already positioned at the eastern horizon
      if (name === 'ascendant') continue;
      
      // Calculate base angle and position
      const longitude = planet.longitude;
      // Adjust angle calculation for counterclockwise rotation
      const angle = degToRad(90 - longitude - ascendantDegree);
      
      // Base radius is where we'd normally place the planet
      let radius = planetRadius;
      
      // Check for collisions with previously placed planets
      for (const pos of placedPositions) {
        const angleDiff = Math.abs(angle - pos.angle);
        // If planets are too close, adjust the radius
        if (angleDiff < degToRad(10)) {
          radius = pos.radius - 20; // Place it inward
        }
      }
      
      // Store this planet's position
      placedPositions.push({ angle, radius });
      
      // Calculate final position
      const planetX = centerX + radius * Math.cos(angle);
      const planetY = centerY + radius * Math.sin(angle);
      
      // Draw planet background
      ctx.beginPath();
      ctx.fillStyle = planetColors[name] || '#ffffff';
      ctx.arc(planetX, planetY, 14, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw planet border
      ctx.beginPath();
      ctx.arc(planetX, planetY, 14, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw planet symbol
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(PLANET_SYMBOLS[name] || name.charAt(0).toUpperCase(), planetX, planetY);
      
      // Draw degree text near the planet
      const degreeX = planetX + 25 * Math.cos(angle);
      const degreeY = planetY + 25 * Math.sin(angle);
      ctx.font = '10px Arial';
      ctx.fillStyle = '#fff';
      ctx.fillText(`${planet.name} ${planet.degree.toFixed(1)}°`, degreeX, degreeY);
    }
    
    // Draw Ascendant marker (at the eastern horizon, position depends on chart orientation)
    // Find the ascendant in the planets
    const ascendant = chartData.planets.ascendant || chartData.ascendant;
    if (ascendant) {
      // Adjust angle for counterclockwise rotation
      const ascAngle = degToRad(90 - ascendant.longitude - ascendantDegree);
      const ascX = centerX + houseRadius * Math.cos(ascAngle);
      const ascY = centerY + houseRadius * Math.sin(ascAngle);
      
      // Draw a bright golden circle for the Ascendant
      ctx.beginPath();
      ctx.fillStyle = '#ffcc00';
      ctx.arc(ascX, ascY, 14, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(ascX, ascY, 14, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ASC', ascX, ascY);
      ctx.lineWidth = 1;
    }
  };
  
  const drawAspects = (ctx: CanvasRenderingContext2D) => {
    if (!chartData || !chartData.aspects || !chartData.planets) return;
    
    const aspectColors: Record<string, string> = {
      'Conjunction': 'rgba(255, 255, 255, 0.3)',
      'Opposition': 'rgba(255, 50, 50, 0.3)',
      'Trine': 'rgba(50, 255, 50, 0.3)',
      'Square': 'rgba(255, 150, 50, 0.3)',
      'Sextile': 'rgba(100, 100, 255, 0.3)',
      'Quincunx': 'rgba(200, 100, 200, 0.3)',
      'Semi-Square': 'rgba(200, 200, 200, 0.3)',
      'Semi-Sextile': 'rgba(150, 150, 150, 0.3)'
    };
    
    const ascendantDegree = chartData.ascendant?.longitude || 0;
    
    // Draw aspect lines between planets
    for (const aspect of chartData.aspects) {
      const planet1 = chartData.planets[aspect.planet1];
      const planet2 = chartData.planets[aspect.planet2];
      
      if (!planet1 || !planet2) continue;
      
      // Calculate angles for both planets
      const angle1 = degToRad(90 - planet1.longitude - ascendantDegree);
      const angle2 = degToRad(90 - planet2.longitude - ascendantDegree);
      
      // Use a smaller radius to draw the aspect lines inside the chart
      const aspectRadius = houseRadius * 0.4;
      
      // Calculate positions
      const x1 = centerX + aspectRadius * Math.cos(angle1);
      const y1 = centerY + aspectRadius * Math.sin(angle1);
      const x2 = centerX + aspectRadius * Math.cos(angle2);
      const y2 = centerY + aspectRadius * Math.sin(angle2);
      
      // Draw the aspect line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = aspectColors[aspect.aspect] || 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = aspect.influence === 'Strong' ? 2 : 1;
      ctx.stroke();
      ctx.lineWidth = 1; // Reset line width
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartData || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate distance from center
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If outside the chart area, hide tooltip
    if (distance > outerRadius) {
      setTooltipInfo(null);
      return;
    }
    
    // Calculate angle in degrees
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    
    // Adjust to start from top (90 degrees)
    angle = (90 - angle + 360) % 360;
    
    // Adjust for ascendant
    const ascendantDegree = chartData.ascendant?.longitude || 0;
    angle = (angle + ascendantDegree) % 360;
    
    // Find which sign this is
    const signIndex = Math.floor(angle / 30);
    const degreesInSign = angle % 30;
    
    // Find nearby planets (within 5 degrees)
    const nearbyPlanets = Object.entries(chartData.planets)
      .filter(([_, planet]) => {
        const planetAngle = planet.longitude % 360;
        const angleDiff = Math.min(
          Math.abs(angle - planetAngle),
          Math.abs(angle - planetAngle + 360),
          Math.abs(angle - planetAngle - 360)
        );
        return angleDiff < 5;
      });
    
    // Create tooltip text
    let tooltipText = `${ZODIAC_SIGNS[signIndex]} ${degreesInSign.toFixed(1)}°`;
    
    if (nearbyPlanets.length > 0) {
      tooltipText += '\n' + nearbyPlanets
        .map(([name, planet]) => `${name}: ${planet.name} ${planet.degree.toFixed(1)}°`)
        .join('\n');
    }
    
    setTooltipInfo({ x, y, text: tooltipText });
  };
  
  const handleMouseLeave = () => {
    setTooltipInfo(null);
  };
  
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="border border-gray-700 rounded-lg bg-gradient-to-br from-gray-900 to-black shadow-xl cursor-crosshair"
      />
      
      {tooltipInfo && (
        <div 
          className="absolute bg-black bg-opacity-80 text-white text-xs p-2 rounded pointer-events-none z-10 whitespace-pre-wrap max-w-[200px]"
          style={{ 
            left: tooltipInfo.x + 10, 
            top: tooltipInfo.y + 10,
            transform: tooltipInfo.x > width - 100 ? 'translateX(-100%)' : 'none'
          }}
        >
          {tooltipInfo.text}
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 rounded-md p-2 text-xs">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-red-500 bg-opacity-60 mr-2"></div>
          <span className="text-white">Fire Signs</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-green-500 bg-opacity-60 mr-2"></div>
          <span className="text-white">Earth Signs</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-500 bg-opacity-60 mr-2"></div>
          <span className="text-white">Air Signs</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-500 bg-opacity-60 mr-2"></div>
          <span className="text-white">Water Signs</span>
        </div>
      </div>
    </div>
  );
}