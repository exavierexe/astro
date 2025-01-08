import { TarotCard } from "@/components/ui/tarotcard";
import Image from "next/image";
import pointblankzodiac from "../../public/tarot/pointblankzodiac.jpg"
export default function Divination() {


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
     <div className="grid grid-cols-1 shrink-0 gap-4 sm:grid-cols-3">  
    <TarotCard></TarotCard>
    <TarotCard></TarotCard>
    <TarotCard></TarotCard>
        </div>
      
      </main>

      <div className="justify-items-center row-start-4 flex gap-6 flex-wrap items-center justify-center">
        <Image src={pointblankzodiac} alt="Point Blank Zodiac" width={500} height={500} className="mb-5 mt-5 rounded-lg"/>
      </div>
      
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      
      </footer>
    </div>
  );
}
