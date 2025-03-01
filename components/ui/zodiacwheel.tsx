"use client";

import React, { useRef, useEffect } from 'react';

// Planet symbols (unicode)
const PLANET_SYMBOLS = {
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
};

// Zodiac sign symbols (unicode)
const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

// Helper function to convert degrees to radians
const degToRad = (deg: number) => (deg * Math.PI) / 180;

type Planet = {
  name: string; 
  symbol: string;
  longitude: number;
  degree: number;
};

type House = {
  cusp: number;
  name: string;
  symbol: string;
  degree: number;
};

type ZodiacWheelProps = {
  chartData: {
    planets: Record<string, Planet>;
    houses: Record<string, House>;
    ascendant: Planet;
  };
  width?: number;
  height?: number;
};

export function ZodiacWheel({ chartData, width = 600, height = 600 }: ZodiacWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    } catch (error) {
      console.error('Error drawing zodiac wheel:', error);
    }
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
    // Use 0 as the default ascendant degree if it's not available
    const ascendantDegree = chartData.ascendant?.longitude || 0;
    
    // Set up an array of colors for the zodiac signs
    const elementColors = {
      fire: 'rgba(255, 100, 50, 0.3)',  // Orange for Fire signs (Aries, Leo, Sagittarius)
      earth: 'rgba(100, 200, 50, 0.3)', // Green for Earth signs (Taurus, Virgo, Capricorn)
      air: 'rgba(100, 200, 255, 0.3)',  // Blue for Air signs (Gemini, Libra, Aquarius)
      water: 'rgba(150, 100, 255, 0.3)'  // Purple for Water signs (Cancer, Scorpio, Pisces)
    };
    
    for (let i = 0; i < 12; i++) {
      const startAngle = degToRad(i * 30 - 90 - ascendantDegree);
      const endAngle = degToRad((i + 1) * 30 - 90 - ascendantDegree);
      
      // Fill the zodiac segment with the appropriate element color
      const element = ['fire', 'earth', 'air', 'water'][Math.floor(i / 3) % 4];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
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
      
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Ensure the symbol exists in the array
      const symbol = i < ZODIAC_SYMBOLS.length ? ZODIAC_SYMBOLS[i] : '?';
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
      const angle = degToRad(cusp - 90 - ascendantDegree);
      
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
    const planetColors = {
      sun: '#ffcc00',       // Gold
      moon: '#e6e6fa',      // Light purple
      mercury: '#66ccff',   // Light blue
      venus: '#ff99cc',     // Pink
      mars: '#ff3333',      // Red
      jupiter: '#9966ff',   // Purple
      saturn: '#996633',    // Brown
      uranus: '#00cccc',    // Teal
      neptune: '#3366ff',   // Blue
      pluto: '#663333',     // Dark brown
      ascendant: '#ffffff', // White
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
      const angle = degToRad(longitude - 90 - ascendantDegree);
      
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
      const angle = degToRad(longitude - 90 - ascendantDegree);
      
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
    
    // Draw Ascendant marker (at the eastern horizon, 9 o'clock position)
    const ascX = centerX + houseRadius * Math.cos(degToRad(-90));
    const ascY = centerY + houseRadius * Math.sin(degToRad(-90));
    
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
  };
  
  return (
    <div className="relative w-full max-w-full mx-auto flex items-center justify-center">
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={width} 
          height={height}
          className="border border-gray-700 rounded-lg bg-gradient-to-br from-gray-900 to-black shadow-xl"
        />
        <div className="absolute inset-0 rounded-lg pointer-events-none border border-blue-500 border-opacity-30 glow-effect"></div>
      </div>
      <style jsx>{`
        .glow-effect {
          box-shadow: 0 0 20px rgba(0, 100, 255, 0.2);
        }
      `}</style>
    </div>
  );
}