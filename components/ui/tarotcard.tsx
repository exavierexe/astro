"use client";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import Image from "next/image";
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

export function TarotCard() {
    const [tarotcard, setTarotcard]  = useState(tarot0);
    const cards = [tarot0, tarot1, tarot2, tarot3, tarot4, tarot5, tarot6, tarot7, tarot8, tarot9, tarot10, tarot11, tarot12, tarot13, tarot14,
        tarot15, tarot16, tarot17, tarot18, tarot19, tarot20, tarot21, tarot22, tarot23, tarot24, tarot25, tarot26, tarot27, tarot28, tarot29, tarot30, tarot31, tarot32, tarot33, tarot34, tarot35, tarot36, tarot37, tarot38, tarot39, tarot40, tarot41, tarot42, tarot43, tarot44, tarot45, tarot46, tarot47, tarot48, tarot49, tarot50, tarot51, tarot52, tarot53, tarot54,
        tarot55];
    const [description, setDescription] = useState(description0);
    const descriptions = [description0, description1, description2, description3, description4, description5, description6, description7, description8, description9, description10, description11, description12, description13, description14, description15, description16, description17, description18, description19, description20, description21,
        description22, description23, description24, description25, description26, description27, description28, description29, description30, description31, description32, description33, description34, description35, description36, description37, description38, description39, description40, description41, description42, description43, description44, description45, description46, description47, description48, description49, description50, description51, description52, description53, description54, description55];
    
    
    function Draw() {
        const randomNumber = Math.floor(Math.random() * 55) + 1;
        const tarot = cards[randomNumber];
        setTarotcard(tarot);
        const tarotdescription = descriptions[randomNumber];
        setDescription(tarotdescription);
    }

    return (
        <>
    <div className="grid grid-cols-1 gap-4">
    <Card className="col-span-1">
        <CardContent className="justify-items-center">
            <Image src={tarotcard} alt="" width="330" height="680" className="mb-5 mt-5 rounded-lg"/>
            <Button onClick={Draw}>Draw Card</Button>
        </CardContent>
    </Card>
    <br/>
    <div>
    <p className="text-wrap text-balance text-pretty max-w-65 col-span-1">
        {description}
    </p>
    </div>
    <br/>
    </div>
    </>)
}