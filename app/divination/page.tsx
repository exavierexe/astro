"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import Link from "next/link";
import pointblankzodiac from "../../public/tarot/pointblankzodiac.jpg";
// Temporarily removed getTarotReadings and deleteTarotReading imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Import the component directly instead of using dynamic import
import { TarotCard } from "@/components/ui/tarotcard";

export default function Divination() {
  const [showReadings, setShowReadings] = useState(false);

  return (
    <div className="min-h-screen py-8 px-4 space-y-12 max-w-7xl mx-auto">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">Tarot Divination</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Explore insights and guidance through the ancient art of tarot. 
          Select a spread, ask your question, and interpret the cards' wisdom.
        </p>
      </header>

      <main className="space-y-12">
        <section className="flex justify-center">
          <TarotCard />
        </section>
        
        <section className="pt-8 border-t border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Saved Readings</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowReadings(!showReadings)}
            >
              {showReadings ? "Hide Readings" : "Show Readings"}
            </Button>
          </div>
          
          {showReadings && (
            <div className="text-center py-8 bg-gray-900 rounded-lg border border-gray-800">
              <p className="mb-2">Feature coming soon!</p>
              <p className="text-sm text-gray-400">Use the tarot card reader above in the meantime.</p>
            </div>
          )}
        </section>
      </main>

      <div className="pt-8 text-center">
        <Image 
          src={pointblankzodiac} 
          alt="Point Blank Zodiac" 
          width={500} 
          height={500} 
          className="rounded-lg mx-auto"
        />
      </div>
      
      <footer className="text-center text-sm text-gray-500 pt-8">
        <p>All tarot interpretations are based on traditional meanings combined with intuitive insights.</p>
      </footer>
    </div>
  );
}
