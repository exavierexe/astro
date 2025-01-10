import Image from "next/image";
import { NavBar } from "@/components/ui/navbar";
import { addUser } from "@/actions";
import { Button } from "@/components/ui/button";
import { CardWithForm } from "@/components/ui/cardwithform"
import cityscape from "../../public/visuals/cityscape.jpg";
import desertscape from "../../public/visuals/desertscape.jpg";
import officespace from "../../public/visuals/officespace.jpg";
import secretscroll from "../../public/visuals/secretscroll.jpg";
import venusbeach from "../../public/visuals/venusbeach.jpg";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export default function Astrology() {


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl lg:text-7xl xl:text-8xl font-bold tracking-tight" >Astrology and Tarot</h1> <br/> <br/>
        <p className="text-lg lg:text-3xl max-w-screen-xl" >We provide astrological readings combined with tarot to help you understand your life path. 
         <br/> <br/> Browse this page to see the readings we offer, then fill out the form to get started.
          </p>      <br/><br/>

      </main>


      <section className="min-h-screen flex items-center row-span-2 justify-center text-center text-balance flex-col gap-8 px-9">
          <form action={addUser}>
          <CardWithForm></CardWithForm>
          </form>
      </section>

      <section className="min-h-screen flex items-center row-span-2 justify-center text-center text-balance flex-col gap-8 px-9">
      <Card>
        <CardHeader className="text-4xl">General Reading</CardHeader>
        <CardFooter className="grid grid-cols-1 shrink-0 gap-4 md:grid-cols-2">
        <CardContent>
        <div className="text-left">
          Do you want some general insights about your day to day life and the near future? <br/> <br/>
          Maybe you are new to astrology and wondering how much it can reveal about yourself. <br/> <br/>
          This reading will satisfy your curiosity and give you a lot to explore. <br/> <br/>
          This is the best reading for beginners. It focus on the most practical information that you can take advantage of immediately. <br/> <br/>
          You will recieve a psychoanalysis and a forecast of major events ahead.
          </div>
        </CardContent>
      <Image src={cityscape} alt="Cityscape" width={500} height={500} className="mb-5 mt-5 rounded-lg"/>
      </CardFooter>
      </Card>
      </section>

      <section className="min-h-screen flex items-center row-span-2 justify-center text-center text-balance flex-col gap-8 px-9">
      <Card>
        <CardHeader className="text-4xl">Love Reading and Marriage Prediction</CardHeader>
        <CardFooter className="grid grid-cols-1 shrink-0 gap-4 md:grid-cols-2">
        <Image src={venusbeach} alt="venus beach" width={500} height={500} className="mb-5 mt-5 rounded-lg"/>
        <CardContent>
        <div className="text-left">
          Do you want to know where to find the love of your life and how to attract them? <br/> <br/>
          Maybe you already have multiple options and cant decide which person to choose? <br/> <br/>
          Are you looking to understand your spouse and overcome challenges? <br/> <br/>
          This is reading will help you make informed decisions in your relationships and create a social life of abundance. <br/> <br/> 
          It is also possible to predict the exact days that you are most likely to get married.
        </div>
      </CardContent>
     
      </CardFooter>
      </Card>
      </section>

      <section className="min-h-screen flex items-center row-span-2 justify-center text-center text-balance flex-col gap-8 px-9">
      <Card>
      <CardHeader className="text-4xl">Business and Career Reading</CardHeader>
      <CardFooter className="grid grid-cols-1 shrink-0 gap-4 md:grid-cols-2">
      <CardContent>
        <div className="text-left">
          Do you want to make more money and find your purpose in life? <br/> <br/>
          Do you want to know what career path you should pursue, make the most of your skills, and overcome your unique challenges? <br/> <br/>
          If you have a business, this will help you get the most out of your marketing efforts and find the best people to partner with. <br/> <br/>
          If you have a clear idea of what you want to do, this reading will illustrate how to execute your plan effectively.
        </div>
      </CardContent>
      <Image src={officespace} alt="office space" width={500} height={500} className="mb-5 mt-5 rounded-lg"/>
      </CardFooter>
      </Card>
      </section>

      
      <section className="min-h-screen flex items-center row-span-2 justify-center text-center text-balance flex-col gap-8 px-9">
      <Card>
      <CardHeader className="text-4xl">Occult Mythical Reading</CardHeader>
        <CardFooter className="grid grid-cols-1 shrink-0 gap-4 md:grid-cols-2">
        <Image src={secretscroll} alt="secret scroll" width={500} height={500} className="mb-5 mt-5 rounded-lg"/>
        <CardContent>
          <div className="text-left">
          This reading is intended for mature audiences. <br/> <br/>
          If you want answers about your soul&apos;s journey or your experiences with the supernatural, this reading is for you. <br/> <br/>
          You will get this most out of this if you possess a form of intuition or at least have an understanding of the occult, mythology, and religion. <br/> <br/>
          This will detail the archetypal forces you have access to and how they influence your life. <br/> <br/>
          You will also learn how to balance these forces with occult practices and create your own mythology. 
          </div>
      </CardContent>
      </CardFooter>
      </Card>
      </section>

      <section className="min-h-screen flex items-center row-span-2 justify-center text-center text-balance flex-col gap-8 px-9">
          <form action={addUser}>
          <CardWithForm></CardWithForm>
          </form>
      </section>
      
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
