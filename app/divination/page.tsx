"use client";

import { useState, useEffect } from "react";
import { TarotCard } from "@/components/ui/tarotcard";
import Image from "next/image";
import pointblankzodiac from "../../public/tarot/pointblankzodiac.jpg";
import { getTarotReadings, deleteTarotReading } from "@/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Divination() {
  const [savedReadings, setSavedReadings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReadings, setShowReadings] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    const loadReadings = async () => {
      try {
        const readings = await getTarotReadings();
        setSavedReadings(readings);
      } catch (error) {
        console.error("Error loading tarot readings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReadings();
  }, []);

  const handleDelete = async (readingId: number) => {
    try {
      setIsDeleting(readingId);
      const result = await deleteTarotReading(readingId);
      if (result.success) {
        // Filter out the deleted reading
        setSavedReadings(savedReadings.filter(reading => reading.id !== readingId));
      }
    } catch (error) {
      console.error("Error deleting reading:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
        <section>
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
            <>
              {isLoading ? (
                <div className="text-center py-8">Loading your saved readings...</div>
              ) : savedReadings.length === 0 ? (
                <div className="text-center py-8 bg-gray-900 rounded-lg border border-gray-800">
                  <p className="mb-2">You don't have any saved readings yet.</p>
                  <p className="text-sm text-gray-400">Use the tarot card reader above to create and save readings.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedReadings.map(reading => (
                    <Card key={reading.id} className="h-full">
                      <CardHeader>
                        <CardTitle>{reading.name}</CardTitle>
                        <CardDescription>
                          {reading.spreadType.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')} • {formatDate(reading.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {reading.question && (
                          <div>
                            <h4 className="text-sm font-medium">Question:</h4>
                            <p className="text-sm">{reading.question}</p>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="text-sm font-medium">Cards:</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Array.isArray(reading.cards) && reading.cards.map((card: any, i: number) => (
                              <div key={i} className="px-2 py-1 bg-gray-800 rounded text-xs">
                                {card.position}: {card.description.slice(0, 20)}...
                                {card.reversed && ' (R)'}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {reading.notes && (
                          <div>
                            <h4 className="text-sm font-medium">Notes:</h4>
                            <p className="text-sm">{reading.notes}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(reading.id)}
                          disabled={isDeleting === reading.id}
                        >
                          {isDeleting === reading.id ? "Deleting..." : "Delete"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
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
