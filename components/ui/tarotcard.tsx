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




import { useState } from "react";
import Link from "next/link";

export function TarotCard() {
    const [tarotcard, setTarotcard]  = useState(tarot0);
    const cards = [tarot0, tarot1, tarot2, tarot3, tarot4, tarot5, tarot6, tarot7, tarot8, tarot9, tarot10, tarot11, tarot12, tarot13, tarot14,
        tarot15, tarot16, tarot17, tarot18, tarot19, tarot20, tarot21, tarot22, tarot23, tarot24, tarot25, tarot26, tarot27, tarot28, tarot29, tarot30, tarot31, tarot32, tarot33, tarot34, tarot35, tarot36, tarot37, tarot38, tarot39, tarot40, tarot41, tarot42, tarot43, tarot44, tarot45, tarot46, tarot47, tarot48, tarot49, tarot50, tarot51, tarot52, tarot53, tarot54,
        tarot55];
    
    function Draw() {
        const randomNumber = Math.floor(Math.random() * 55) + 1;
        const tarot = cards[randomNumber];
        setTarotcard(tarot);
        
    }

    return (
    <Card className="bg-white light">
        <CardContent className="justify-items-center">
            <Image src={tarotcard} alt="" width="330" height="680" className="mb-5 mt-5 rounded-lg"/>
            <Button onClick={Draw}>Draw Card</Button>
        </CardContent>
    </Card>)
}