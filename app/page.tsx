import Image from "next/image";
import { NavBar } from "@/components/ui/navbar";
import { addUser } from "@/actions";
import { Button } from "@/components/ui/button";
import { CardWithForm } from "@/components/ui/cardwithform"

export default function Home() {


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <section className="min-h-screen flex items-center justify-center text-center text-balance flex-col gap-8 px-9">
        <h1>Realize Your Potential</h1>
        <p>We empower you with insights and techniques for personal growth in all areas of life.</p>        
        </section>

        <section className="min-h-screen flex items-center justify-center text-center text-balance flex-col gap-8 px-9">
        <form action={addUser}>
        <CardWithForm></CardWithForm>
        </form>
        </section>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
