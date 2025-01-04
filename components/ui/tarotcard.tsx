"use client";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import Image from "next/image";

import { useState } from "react";
import Link from "next/link";

export function TarotCard() {
    const [cardImage, setCardImage ]= useState(`/app/tarot/0.png`);
    function Draw() {
        const randomNumber = Math.floor(Math.random() * 56);
        setCardImage(`/app/tarot/${randomNumber}.png`);
    }

    return (
    <Card>
        <CardContent>
            <Image alt="" src={cardImage} width="300" height="600" className="size-24"/>
            <Button onClick={Draw}>Draw Card</Button>
        </CardContent>
    </Card>)
}