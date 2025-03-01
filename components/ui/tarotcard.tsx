"use client";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import Image from "next/image";
import { saveTarotReading } from "@/actions";
import globe from "../../public/globe.svg";
import tarot0 from "../../public/tarot/tarot0.png"
import tarot1 from "../../public/tarot/tarot1.png"
import tarot2 from "../../public/tarot/tarot2.png"
import tarot3 from "../../public/tarot/tarot3.png"
import tarot4 from "../../public/tarot/tarot4.png"
import tarot5 from "../../public/tarot/tarot5.png"
import tarot6 from "../../public/tarot/tarot6.png"
import tarot7 from "../../public/tarot/tarot7.png"
import tarot8 from "../../public/tarot/tarot8.png"
import tarot9 from "../../public/tarot/tarot9.png"
import tarot10 from "../../public/tarot/tarot10.png"
import tarot11 from "../../public/tarot/tarot11.png"
import tarot12 from "../../public/tarot/tarot12.png"
import tarot13 from "../../public/tarot/tarot13.png"
import tarot14 from "../../public/tarot/tarot14.png"
import tarot15 from "../../public/tarot/tarot15.png"
import tarot16 from "../../public/tarot/tarot16.png"
import tarot17 from "../../public/tarot/tarot17.png"
import tarot18 from "../../public/tarot/tarot18.png"
import tarot19 from "../../public/tarot/tarot19.png"
import tarot20 from "../../public/tarot/tarot20.png"
import tarot21 from "../../public/tarot/tarot21.png"
import tarot22 from "../../public/tarot/tarot22.png"
import tarot23 from "../../public/tarot/tarot23.png"
import tarot24 from "../../public/tarot/tarot24.png"
import tarot25 from "../../public/tarot/tarot25.png"
import tarot26 from "../../public/tarot/tarot26.png"
import tarot27 from "../../public/tarot/tarot27.png"
import tarot28 from "../../public/tarot/tarot28.png"
import tarot29 from "../../public/tarot/tarot29.png"
import tarot30 from "../../public/tarot/tarot30.png"
import tarot31 from "../../public/tarot/tarot31.png"
import tarot32 from "../../public/tarot/tarot32.png"
import tarot33 from "../../public/tarot/tarot33.png"
import tarot34 from "../../public/tarot/tarot34.png"
import tarot35 from "../../public/tarot/tarot35.png"
import tarot36 from "../../public/tarot/tarot36.png"
import tarot37 from "../../public/tarot/tarot37.png"
import tarot38 from "../../public/tarot/tarot38.png"
import tarot39 from "../../public/tarot/tarot39.png"
import tarot40 from "../../public/tarot/tarot40.png"
import tarot41 from "../../public/tarot/tarot41.png"
import tarot42 from "../../public/tarot/tarot42.png"
import tarot43 from "../../public/tarot/tarot43.png"
import tarot44 from "../../public/tarot/tarot44.png"
import tarot45 from "../../public/tarot/tarot45.png"
import tarot46 from "../../public/tarot/tarot46.png"
import tarot47 from "../../public/tarot/tarot47.png"
import tarot48 from "../../public/tarot/tarot48.png"
import tarot49 from "../../public/tarot/tarot49.png"
import tarot50 from "../../public/tarot/tarot50.png"
import tarot51 from "../../public/tarot/tarot51.png"
import tarot52 from "../../public/tarot/tarot52.png"
import tarot53 from "../../public/tarot/tarot53.png"
import tarot54 from "../../public/tarot/tarot54.png"
import tarot55 from "../../public/tarot/tarot55.png"

const description0 = ""
const description1 = "The individual's vision or perspective. Initiation. Spring."
const description2 = "Someone else's vision or perspective. Reaction."
const description3 = "Subjective perception of the surroundings. Confrontation."
const description4 = "Conceptualized vision. Labels and judgements. Self image and identification."
const description5 = "Character. Emoting passion. Personal flair. Creativity."
const description6 = "Glamorous vision or provocative expression. Magnetism and attraction."
const description7 = "Honest expression. Accuracy. Detachment. Sudden inspiration."
const description8 = "Focus. Holding onto a vision. Unchanging perspective."
const description9 = "Culminating vision. Wise perspective. Seeing potential."
const description10 = "Primal expression. Transformative experience."
const description11 = "All kinds of visions. Multiple perspectives. Sagittarius."
const description12 = "Receiving lots of visions. Internal fire. Self interest. Aries."
const description13 = "Giving lots of visions. Expressing oneself completely. Leo."
const description14 = "The individual's emotion or feeling. Internal reflection. Summer."
const description15 = "Someone else's emotion. Emotional relationship. Emotional balance."
const description16 = "Vibe of a situation. Emotional subtext. Spatial harmony."
const description17 = "Secluded emotions. Privacy. Sorting out feelings. Home and family."
const description18 = "Volatile emotions. Inner transformation."
const description19 = "Revealing emotions. Resurfacing memories. Empathy."
const description20 = "Intuitive messages. Internal cleansing."
const description21 = "Emotional fixation. Fractal experiences. Emotional cycles."
const description22 = "Intuitive wisdom. Emotional fulfillment. Natural flow."
const description23 = "Spiritual connection. Transcendent emotions. Dissolution."
const description24 = "All kinds of emotions. Dreams and illusions. Pisces."
const description25 = "Receiving emotional support. Feminine energy. Cancer."
const description26 = "Giving emotional support. Manipulating emotions. Scorpio."
const description27 = "The individual's thought or idea. Fall/autumn."
const description28 = "Someone else's thought or idea. Mental relationship. Mental balance."
const description29 = "Conversation. Socializing. Abstract surroundings."
const description30 = "Mentality. Mental condition. Narrative."
const description31 = "Tone and vibration. Colorful language. Music."
const description32 = "Popular idea. Spreading ideas. Many options."
const description33 = "Honest communication. Travel. Scientific thinking."
const description34 = "Thought patterns. Recurring thoughts. Lingering spirits."
const description35 = "Wise thoughts or communication. Mental stimulation. Decisiveness."
const description36 = "Mental boundaries. Mental expansion or contraction. Mental stress."
const description37 = "All kinds of thoughts and ideas. Mental flexibility. Changing affiliations. Gemini."
const description38 = "Receiving lots of communication. Partnerships. Libra."
const description39 = "Giving lots of communication. Acquaintances. Masculine energy. Mental programming. Aquarius."
const description40 = "The individual's object or task. Winter."
const description41 = "Someone else's object or task. Exchanging value. Material balance."
const description42 = "Objective surroundings. Physical environment."
const description43 = "Organizing reality. Construction. Compartmentalization."
const description44 = "Sentimental object. Priorities. Hierarchies."
const description45 = "Beautiful object. Practical risk. Business venture."
const description46 = "Forensic evidence. Analyzing reality. Skepticism. Caution."
const description47 = "Spending time. Time cycles. Extended time periods."
const description48 = "Material abundance. Practical wisdom. Fruition."
const description49 = "Spiritual objects. Material transformation. Ancestral roots."
const description50 = "All kinds of materials. Diligence and maintenance. Virgo."
const description51 = "Receiving lots of materials. Status and reputation. Capricorn."
const description52 = "Giving lots of materials. Confidence and self worth. Stability. Taurus."
const description53 = "Internal epiphany. Internal paradigm shift."
const description54 = "External epiphany. External paradigm shift."
const description55 = "Internal and external epiphany. Internal and external paradigm shift."




import { useState } from "react";
import Link from "next/link";

type TarotCardData = {
    id: number;
    image: any;
    description: string;
    position?: string;
    reversed?: boolean;
}

type Spread = {
    id: string;
    name: string;
    positions: string[];
    description: string;
}

const SPREADS: Spread[] = [
    {
        id: 'single',
        name: 'Single Card',
        positions: ['The Card'],
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
        positions: ['Present Situation', 'Challenge/Obstacle', 'Above (Conscious)', 'Below (Unconscious)'],
        description: 'A four-card spread providing insight into your situation, challenges, conscious and unconscious influences.'
    },
    {
        id: 'five-card',
        name: 'Five Card Spread',
        positions: ['Present', 'Past', 'Future', 'Reason', 'Potential'],
        description: 'A comprehensive spread showing the present situation, past influences, future outcome, underlying cause, and potential.'
    }
];

export function TarotCard() {
    const allCards = [tarot0, tarot1, tarot2, tarot3, tarot4, tarot5, tarot6, tarot7, tarot8, tarot9, tarot10, tarot11, tarot12, tarot13, tarot14,
        tarot15, tarot16, tarot17, tarot18, tarot19, tarot20, tarot21, tarot22, tarot23, tarot24, tarot25, tarot26, tarot27, tarot28, tarot29, tarot30, tarot31, tarot32, tarot33, tarot34, tarot35, tarot36, tarot37, tarot38, tarot39, tarot40, tarot41, tarot42, tarot43, tarot44, tarot45, tarot46, tarot47, tarot48, tarot49, tarot50, tarot51, tarot52, tarot53, tarot54,
        tarot55];
    
    const allDescriptions = [description0, description1, description2, description3, description4, description5, description6, description7, description8, description9, description10, description11, description12, description13, description14, description15, description16, description17, description18, description19, description20, description21,
        description22, description23, description24, description25, description26, description27, description28, description29, description30, description31, description32, description33, description34, description35, description36, description37, description38, description39, description40, description41, description42, description43, description44, description45, description46, description47, description48, description49, description50, description51, description52, description53, description54, description55];
    
    // State for the spread and drawn cards
    const [selectedSpread, setSelectedSpread] = useState<Spread>(SPREADS[0]);
    const [drawnCards, setDrawnCards] = useState<TarotCardData[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [question, setQuestion] = useState('');
    const [notes, setNotes] = useState('');
    const [showSaveForm, setShowSaveForm] = useState(false);
    const [readingName, setReadingName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    
    // Draw a new set of cards for the selected spread
    const drawSpread = () => {
        setIsComplete(false);
        setSaveSuccess(false);
        
        // Generate the appropriate number of unique cards
        const newCards: TarotCardData[] = [];
        const numCards = selectedSpread.positions.length;
        const usedIndices = new Set<number>();
        
        for (let i = 0; i < numCards; i++) {
            let randomNumber;
            // Ensure we don't get duplicate cards
            do {
                randomNumber = Math.floor(Math.random() * 55) + 1;
            } while (usedIndices.has(randomNumber));
            
            usedIndices.add(randomNumber);
            
            // Random chance for reversed cards
            const reversed = Math.random() > 0.75;
            
            newCards.push({
                id: randomNumber,
                image: allCards[randomNumber],
                description: allDescriptions[randomNumber],
                position: selectedSpread.positions[i],
                reversed
            });
        }
        
        setDrawnCards(newCards);
        setIsComplete(true);
    };
    
    // Handle saving the reading
    const saveReading = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);
        
        if (!readingName.trim()) {
            setSaveError("Please give your reading a name");
            setIsSaving(false);
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append("name", readingName);
            formData.append("spreadType", selectedSpread.id);
            formData.append("cards", JSON.stringify(drawnCards));
            formData.append("question", question);
            formData.append("notes", notes);
            
            // Call the server action to save the reading
            const result = await saveTarotReading(formData);
            
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
    };
    
    // Clear the current reading
    const resetReading = () => {
        setDrawnCards([]);
        setIsComplete(false);
        setQuestion('');
        setNotes('');
        setReadingName('');
        setSaveSuccess(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Tarot Card Reading</CardTitle>
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
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">{selectedSpread.description}</p>
                        <div className="space-y-3 mb-4">
                            <div>
                                <label htmlFor="question" className="block text-sm font-medium mb-1">
                                    Your Question (optional)
                                </label>
                                <input
                                    id="question"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    className="w-full p-2 rounded-md border bg-black text-white"
                                    placeholder="What would you like to know?"
                                />
                            </div>
                        </div>
                        <Button onClick={drawSpread} className="w-full" disabled={isSaving}>
                            Draw {selectedSpread.name}
                        </Button>
                    </div>
                    
                    {isComplete && (
                        <div className="space-y-6">
                            <div className={`grid gap-4 ${
                                drawnCards.length === 1 ? 'grid-cols-1 justify-items-center' : 
                                drawnCards.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                            }`}>
                                {drawnCards.map((card, i) => (
                                    <div key={i} className="space-y-2 flex flex-col items-center">
                                        <div className="relative">
                                            <Image 
                                                src={card.image} 
                                                alt="" 
                                                width={150}
                                                height={250}
                                                className={`rounded-lg ${card.reversed ? 'transform rotate-180' : ''}`}
                                            />
                                            <div className="absolute top-0 left-0 bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded-tl-lg rounded-br-lg">
                                                {card.position}
                                            </div>
                                        </div>
                                        <div className="text-center text-sm max-w-[150px]">
                                            <p>{card.description}</p>
                                            {card.reversed && <p className="italic mt-1 text-orange-500">Reversed</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-3 mt-6">
                                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                                    Notes & Interpretation
                                </label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full p-2 h-24 rounded-md border bg-black text-white"
                                    placeholder="Record your thoughts and interpretations about this reading..."
                                />
                            </div>
                            
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={resetReading} disabled={isSaving}>
                                    Clear Reading
                                </Button>
                                <Button onClick={() => setShowSaveForm(true)} disabled={isSaving}>
                                    Save Reading
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {showSaveForm && (
                        <div className="mt-6 p-4 border rounded-md">
                            <h3 className="text-lg font-medium mb-4">Save Your Reading</h3>
                            {saveError && (
                                <div className="p-3 mb-4 text-sm bg-red-900 text-white rounded-md">
                                    {saveError}
                                </div>
                            )}
                            <form onSubmit={saveReading} className="space-y-4">
                                <div>
                                    <label htmlFor="readingName" className="block text-sm font-medium mb-1">
                                        Reading Name*
                                    </label>
                                    <input
                                        id="readingName"
                                        value={readingName}
                                        onChange={(e) => setReadingName(e.target.value)}
                                        className="w-full p-2 rounded-md border bg-black text-white"
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
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSaving}>
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
}