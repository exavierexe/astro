"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { calculateBirthChartWithSwissEph } from "@/actions";

export function BirthChartCalculator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setChartData(null);

    const formData = new FormData(e.currentTarget);
    const birthDate = formData.get('birthDate') as string;
    const birthTime = formData.get('birthTime') as string;
    const birthPlace = formData.get('birthPlace') as string;

    if (!birthDate || !birthTime || !birthPlace) {
      setError('Please fill out all fields');
      setIsLoading(false);
      return;
    }

    try {
      const result = await calculateBirthChartWithSwissEph({
        birthDate,
        birthTime,
        birthPlace
      });
      
      if (result.error) {
        setError(result.error);
      } else {
        setChartData(result.data);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred. Please try again.';
      setError(`Error: ${errorMessage}`);
      console.error('Error calculating birth chart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 to-black border-gray-700 shadow-lg">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Birth Chart Calculator
        </CardTitle>
        <CardDescription className="text-gray-300">
          Calculate your birth chart using Swiss Ephemeris for accurate planetary positions
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-600 rounded-md text-white">
              <p className="font-medium mb-1">Error</p>
              <p className="text-sm">{error}</p>
              {error.includes('Swiss Ephemeris') && (
                <p className="text-xs mt-2 text-gray-300">
                  The Swiss Ephemeris calculation engine encountered an error. This might be due to missing libraries or configuration issues.
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-sm font-medium text-blue-300">
              Birth Date
            </Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              className="w-full p-3 border border-gray-700 rounded-md bg-black text-white shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthTime" className="text-sm font-medium text-blue-300">
              Birth Time
            </Label>
            <Input
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
            <Label htmlFor="birthPlace" className="text-sm font-medium text-blue-300">
              Birth Place
            </Label>
            <Input
              id="birthPlace"
              name="birthPlace"
              className="w-full p-3 border border-gray-700 rounded-md bg-black text-white shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="City, State/Province, Country"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter a city name like "Miami" or "Miami, Florida" - try to use major cities for better accuracy
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all py-2.5 h-auto text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Calculating..." : "Calculate Birth Chart"}
          </Button>
        </form>

        {chartData && (
          <div className="mt-6 bg-gray-900 p-4 rounded-lg border border-gray-800">
            <h3 className="text-lg font-medium mb-3 text-blue-400">Planetary Positions</h3>
            
            {chartData.calculationMethod && (
              <div className="mb-3 text-xs bg-blue-900/30 p-2 rounded border border-blue-800">
                <span className="font-medium">Calculation Method:</span> {chartData.calculationMethod}
              </div>
            )}
            
            <div className="space-y-2 text-sm">
              {Object.entries(chartData.planets).map(([planet, data]: [string, any]) => (
                <div key={planet} className="flex justify-between items-center border-b border-gray-800 border-opacity-50 pb-2">
                  <span className="capitalize">{planet}:</span>
                  <span className="font-medium text-gray-300">{data.name} {data.degree.toFixed(2)}°</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => window.location.href = `/birth-chart/calculator-result?data=${encodeURIComponent(JSON.stringify(chartData))}`}
              >
                View Full Chart
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}