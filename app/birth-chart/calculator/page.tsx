"use client";

import React from 'react';
import { BirthChartCalculator } from '@/components/ui/birth-chart-calculator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BirthChartCalculatorPage() {
  return (
    <div className="min-h-screen p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/birth-chart">
            <Button variant="outline">← Back to Birth Charts</Button>
          </Link>
        </div>
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            Swiss Ephemeris Birth Chart Calculator
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Calculate your birth chart using the high-precision Swiss Ephemeris astronomical library. 
            Enter your birth details below to generate a detailed astrological chart showing planetary positions.
          </p>
        </div>
        
        <BirthChartCalculator />
        
        <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-medium mb-4 text-blue-400">About This Calculator</h2>
          <p className="text-sm text-gray-300 mb-4">
            This calculator uses the Swiss Ephemeris, a high-precision astronomical library used by professional astrologers worldwide. 
            It calculates the exact positions of the planets at the time of your birth, taking into account your birth location's 
            latitude and longitude.
          </p>
          <p className="text-sm text-gray-300">
            For the most accurate results, you'll need your exact birth time. If you don't know it, the chart will still calculate 
            planetary positions but house placements and the Ascendant will be less accurate.
          </p>
        </div>
      </div>
    </div>
  );
}