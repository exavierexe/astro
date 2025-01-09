"use client";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import Image from "next/image";
import globe from "../../public/globe.svg";
import tarot1 from "../../public/tarot/tarot1.png"


export function HeroImage() {
    return (
        <div className="relative flex items-center justify-center min-h-screen p-8">
            <Image alt="" src={tarot1} width="1920" height="1080" className="object-cover"/>
        </div>
    )
}