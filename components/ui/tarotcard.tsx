"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import Image from "next/image";
import tarot0 from "../../public/tarot/tarot0.png";
import tarot1 from "../../public/tarot/tarot1.png";
import tarot2 from "../../public/tarot/tarot2.png";

// Simple TarotCard component with basic functionality
export function TarotCard() {
  const [currentCard, setCurrentCard] = useState(tarot0);
  const cards = [tarot0, tarot1, tarot2];
  const [description, setDescription] = useState("");
  
  const descriptions = [
    "",
    "The individual's vision or perspective. Initiation. Spring.",
    "Someone else's vision or perspective. Reaction."
  ];
  
  function drawCard() {
    const randomIndex = Math.floor(Math.random() * 3);
    setCurrentCard(cards[randomIndex]);
    setDescription(descriptions[randomIndex]);
  }
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tarot Reading</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Image 
            src={currentCard} 
            alt="Tarot Card" 
            width={200} 
            height={350} 
            className="mb-4"
          />
          <p className="mb-4 text-center">{description}</p>
          <Button onClick={drawCard}>Draw Card</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default TarotCard;