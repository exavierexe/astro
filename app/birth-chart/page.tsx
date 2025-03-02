"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function BirthChartPage() {
  return (
    <div className="min-h-screen p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            Astrological Birth Charts
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Discover the cosmic blueprint of your personality, strengths, challenges, and life path through the
            ancient wisdom of astrology. Our birth chart calculator uses the high-precision Swiss Ephemeris to provide
            you with accurate planetary positions at the moment of your birth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700 shadow-lg overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src="/visuals/rainbowstars.jpg"
                alt="Birth Chart Calculator"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Swiss Ephemeris Calculator</CardTitle>
              <CardDescription>
                Generate a highly accurate birth chart using Swiss Ephemeris
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Our advanced calculator directly uses the Swiss Ephemeris astronomical library to calculate the exact
                positions of all planets, houses, and aspects at the time of your birth. Simply enter your birth date,
                time, and location to receive an instant reading.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/birth-chart/calculator" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                  Calculate Birth Chart
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700 shadow-lg overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src="/visuals/secretscroll.jpg"
                alt="Birth Chart Interpretation"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Professional Reading</CardTitle>
              <CardDescription>
                Get a personalized interpretation from an experienced astrologer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Take your birth chart to the next level with a professional reading. Our astrologers will provide in-depth
                insights into your chart's unique patterns, including planetary aspects, house placements, and how these
                celestial influences shape your life path.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/astrology" className="w-full">
                <Button variant="outline" className="w-full border-blue-500 text-blue-400 hover:bg-blue-950">
                  Book a Reading
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 mb-12">
          <h2 className="text-2xl font-medium mb-4 text-blue-400 text-center">What is a Birth Chart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 mb-4">
                A birth chart, also known as a natal chart, is a celestial snapshot of the sky at the exact moment of your birth.
                It shows where the sun, moon, planets, and other important astronomical points were positioned in relation to the
                earth and to each other.
              </p>
              <p className="text-gray-300 mb-4">
                This cosmic blueprint is unique to you—even twins born minutes apart will have subtle differences in their charts.
                Astrologers use this map to interpret how these celestial bodies influence your personality, behavior patterns,
                relationships, career path, and life events.
              </p>
              <p className="text-gray-300">
                To create an accurate birth chart, you need three essential pieces of information:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                <li>Your exact date of birth</li>
                <li>Your exact time of birth (as precise as possible)</li>
                <li>Your place of birth (city and country)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-3 text-purple-400">Key Elements of a Birth Chart</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-blue-300">Planets</h4>
                  <p className="text-sm text-gray-300">Represent different facets of your personality and life experiences</p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-300">Zodiac Signs</h4>
                  <p className="text-sm text-gray-300">Show how these planetary energies are expressed in your life</p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-300">Houses</h4>
                  <p className="text-sm text-gray-300">Indicate which areas of life these energies will most strongly manifest</p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-300">Aspects</h4>
                  <p className="text-sm text-gray-300">Reveal the relationships between planets, creating harmonies or tensions</p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-300">Ascendant (Rising Sign)</h4>
                  <p className="text-sm text-gray-300">The sign rising on the eastern horizon at your birth, representing your outward personality and appearance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
            Start Your Astrological Journey
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/birth-chart/calculator">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 h-auto">
                Calculate Your Birth Chart
              </Button>
            </Link>
            <Link href="/astrology">
              <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-950 px-6 py-2.5 h-auto">
                Explore Astrology
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}