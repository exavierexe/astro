"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/ui/navbar";
import { addUser } from "@/actions";
import { Button } from "@/components/ui/button";
import { CardWithForm } from "@/components/ui/cardwithform"
import { SignUpButton } from "@clerk/nextjs"
import { ArrowRightIcon } from "lucide-react";
import { hero } from "@/components/ui/heroimage";
export default function Home() {


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
       
        <section className="min-h-screen flex items-center justify-center text-center text-balance flex-col gap-8 px-9">
        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tacking-tight" >Realize Your Potential</h1>
        <p className="text-lg lg:text-3xl max-w-screen-xl" >Empower yourself with insights and techniques for personal growth.</p>        
        
        <Link href="/astrology"><Button className="text-lg p-6 rounded-xl flex gap-2">Get a reading<ArrowRightIcon className="size-5" /></Button></Link>
        
        </section>
      </main>
      <div className="justify-items-center row-start-4 flex gap-6 flex-wrap items-center justify-center">
      <Link href="https://discord.gg/zcqkTFRn"><Button>Join Discord</Button></Link>
      <Link href="https://www.youtube.com/@exavierx"><Button>YouTube</Button></Link>
        </div>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
       
      </footer>
    </div>
  );
}
