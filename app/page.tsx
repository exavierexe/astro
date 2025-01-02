import Image from "next/image";
import { addUser } from "@/actions";
import { Button } from "@/components/ui/button";
import { CardWithForm } from "@/components/ui/cardwithform"

export default async function Home() {

  async function handleSubmit(formdata: FormData) {
    "use server";
    addUser(formdata.get("uname"), formdata.get("phone"), formdata.get("email"), formdata.get("birthday"), formdata.get("time"), formdata.get("location"), formdata.get("questions"))
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        


        <form action={handleSubmit}>
        <CardWithForm></CardWithForm>
        </form>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
