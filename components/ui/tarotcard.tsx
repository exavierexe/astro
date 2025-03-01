"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./card";
import { Button } from "./button";
import Image from "next/image";
import tarot0 from "../../public/tarot/tarot0.png";
import tarot1 from "../../public/tarot/tarot1.png";
import tarot2 from "../../public/tarot/tarot2.png";
import tarot3 from "../../public/tarot/tarot3.png";
import tarot4 from "../../public/tarot/tarot4.png";
import tarot5 from "../../public/tarot/tarot5.png";
import tarot6 from "../../public/tarot/tarot6.png";
import tarot7 from "../../public/tarot/tarot7.png";
import tarot8 from "../../public/tarot/tarot8.png";
import tarot9 from "../../public/tarot/tarot9.png";
import tarot10 from "../../public/tarot/tarot10.png";

type SpreadType = {
  id: string;
  name: string;
  positions: string[];
  description: string;
};

type CardData = {
  id: number;
  image: any;
  description: string;
  position: string;
  reversed: boolean;
};

type TarotCardProps = {
  onSaveReading?: (reading: {
    name: string;
    spreadType: string;
    cards: CardData[];
    question: string;
    notes: string;
  }) => Promise<{ success: boolean; error?: string }>;
};

// TarotCard component with multiple spread types and save functionality
export function TarotCard({ onSaveReading }: TarotCardProps) {
  // Available spreads
  const SPREADS: SpreadType[] = [
    {
      id: 'single-card',
      name: 'Single Card',
      positions: ['Card'],
      description: 'A simple one-card spread for quick insights or daily guidance.'
    },
    {
      id: 'three-card',
      name: 'Three Card Spread',
      positions: ['Past', 'Present', 'Future'],
      description: 'Classic three-card spread showing past influences, present situation, and future possibilities.'
    },
    {
      id: 'cross',
      name: 'Simple Cross',
      positions: ['Situation', 'Challenge', 'Advice', 'Outcome'],
      description: 'A four-card spread providing insight into your situation, challenges, advice, and outcome.'
    },
    {
      id: 'five-card',
      name: 'Five Card Spread',
      positions: ['Present', 'Past', 'Future', 'Reason', 'Potential'],
      description: 'A comprehensive spread showing the present situation, past influences, future outcome, underlying cause, and potential.'
    }
  ];
  
  // All available tarot cards
  const allCards = [tarot0, tarot1, tarot2, tarot3, tarot4, tarot5, tarot6, tarot7, tarot8, tarot9, tarot10];
  
  // All card descriptions
  const allDescriptions = [
    "",
    "The individual's vision or perspective. Initiation. Spring.",
    "Someone else's vision or perspective. Reaction.",
    "Subjective perception of the surroundings. Confrontation.",
    "Conceptualized vision. Labels and judgements. Self image and identification.",
    "Character. Emoting passion. Personal flair. Creativity.",
    "Glamorous vision or provocative expression. Magnetism and attraction.",
    "Honest expression. Accuracy. Detachment. Sudden inspiration.",
    "Focus. Holding onto a vision. Unchanging perspective.",
    "Culminating vision. Wise perspective. Seeing potential.",
    "Primal expression. Transformative experience."
  ];
  
  // State
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>(SPREADS[0]);
  const [drawnCards, setDrawnCards] = useState<CardData[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [question, setQuestion] = useState('');
  const [notes, setNotes] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [readingName, setReadingName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Draw cards for the selected spread
  function drawSpread() {
    setIsComplete(false);
    setSaveSuccess(false);
    
    // Generate the appropriate number of unique cards
    const newCards: CardData[] = [];
    const numCards = selectedSpread.positions.length;
    const usedIndices = new Set<number>();
    
    for (let i = 0; i < numCards; i++) {
      let randomIndex;
      // Ensure we don't get duplicate cards
      do {
        randomIndex = Math.floor(Math.random() * allCards.length);
      } while (usedIndices.has(randomIndex));
      
      usedIndices.add(randomIndex);
      
      // Random chance for reversed cards
      const reversed = Math.random() > 0.75;
      
      newCards.push({
        id: randomIndex,
        image: allCards[randomIndex],
        description: allDescriptions[randomIndex] || "Mystery card.",
        position: selectedSpread.positions[i],
        reversed
      });
    }
    
    setDrawnCards(newCards);
    setIsComplete(true);
  }
  
  // Handle saving the reading
  async function saveReading(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    
    if (!readingName.trim()) {
      setSaveError("Please give your reading a name");
      setIsSaving(false);
      return;
    }
    
    if (!onSaveReading) {
      setSaveError("Save functionality is not available");
      setIsSaving(false);
      return;
    }
    
    try {
      const reading = {
        name: readingName,
        spreadType: selectedSpread.id,
        cards: drawnCards,
        question,
        notes
      };
      
      const result = await onSaveReading(reading);
      
      if (result.success) {
        setSaveSuccess(true);
        setShowSaveForm(false);
      } else {
        setSaveError(result.error || "Error saving reading");
      }
    } catch (error) {
      setSaveError("An unexpected error occurred");
      console.error("Error saving reading:", error);
    } finally {
      setIsSaving(false);
    }
  }
  
  // Reset the reading
  function resetReading() {
    setDrawnCards([]);
    setIsComplete(false);
    setQuestion('');
    setNotes('');
    setReadingName('');
    setSaveSuccess(false);
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="w-full bg-gradient-to-br from-gray-900 to-black border border-gray-700">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
            Tarot Reading
          </CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {SPREADS.map(spread => (
              <Button 
                key={spread.id}
                variant={selectedSpread.id === spread.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedSpread(spread);
                  setDrawnCards([]);
                  setIsComplete(false);
                }}
                className="text-sm"
              >
                {spread.name}
              </Button>
            ))}
          </div>
          <CardDescription className="mt-2 text-gray-400">
            {selectedSpread.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="space-y-3 mb-4">
              <div>
                <label htmlFor="question" className="block text-sm font-medium mb-1 text-gray-300">
                  Your Question (optional)
                </label>
                <input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-700 bg-black text-white focus:border-purple-500 outline-none"
                  placeholder="What would you like to know?"
                />
              </div>
            </div>
            <Button 
              onClick={drawSpread} 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isSaving}
            >
              Draw {selectedSpread.name}
            </Button>
          </div>
          
          {isComplete && (
            <div className="space-y-6">
              <div className={`grid gap-6 ${
                drawnCards.length === 1 ? 'grid-cols-1 justify-items-center' : 
                drawnCards.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
              }`}>
                {drawnCards.map((card, i) => (
                  <div key={i} className="space-y-2 flex flex-col items-center">
                    <div className="relative">
                      <Image 
                        src={card.image} 
                        alt={card.position}
                        width={150}
                        height={250}
                        className={`rounded-lg border border-gray-700 shadow-lg ${card.reversed ? 'transform rotate-180' : ''}`}
                      />
                      <div className="absolute top-0 left-0 bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded-tl-lg rounded-br-lg">
                        {card.position}
                      </div>
                    </div>
                    <div className="text-center text-sm max-w-[150px]">
                      <p className="text-gray-300">{card.description}</p>
                      {card.reversed && <p className="italic mt-1 text-orange-500">Reversed</p>}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mt-6">
                <label htmlFor="notes" className="block text-sm font-medium mb-1 text-gray-300">
                  Notes & Interpretation
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 h-24 rounded-md border border-gray-700 bg-black text-white focus:border-purple-500 outline-none"
                  placeholder="Record your thoughts and interpretations about this reading..."
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={resetReading} 
                  disabled={isSaving}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Clear Reading
                </Button>
                {onSaveReading && (
                  <Button 
                    onClick={() => setShowSaveForm(true)} 
                    disabled={isSaving}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Save Reading
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {showSaveForm && (
            <div className="mt-6 p-4 border rounded-md border-gray-700 bg-black bg-opacity-50">
              <h3 className="text-lg font-medium mb-4 text-purple-400">Save Your Reading</h3>
              {saveError && (
                <div className="p-3 mb-4 text-sm bg-red-900 text-white rounded-md">
                  {saveError}
                </div>
              )}
              <form onSubmit={saveReading} className="space-y-4">
                <div>
                  <label htmlFor="readingName" className="block text-sm font-medium mb-1 text-gray-300">
                    Reading Name*
                  </label>
                  <input
                    id="readingName"
                    value={readingName}
                    onChange={(e) => setReadingName(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-700 bg-black text-white focus:border-purple-500 outline-none"
                    placeholder="e.g. Career Decision Reading"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowSaveForm(false)}
                    disabled={isSaving}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isSaving ? "Saving..." : "Save Reading"}
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {saveSuccess && (
            <div className="mt-4 p-3 bg-green-900 text-white rounded-md">
              Reading saved successfully!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TarotCard;