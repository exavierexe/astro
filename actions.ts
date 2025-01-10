// app/actions.ts

"use server";
import { neon } from "@neondatabase/serverless";
import prisma from "./lib/prisma";


//export function getData() {
//    const sql = neon(process.env.DATABASE_URL);
 //   const data = await sql`...`;
   // return data;
//}

export const addUser = async (formData: FormData) => {
    const uname = formData.get("uname") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const birthday = formData.get("birthday") as string;
    const time = formData.get("time") as string;
    const location = formData.get("location") as string;
    const questions = formData.get("questions") as string;
    const rtype = formData.get("rtype") as string;
    const price = formData.get("price") as string;
    
    await prisma.user.create({
      data: {
        uname: uname as string,
        phone: phone as string,
        email: email as string,
        birthday: birthday as string,
        time: time as string,
        location: location as string,
        questions: questions as string,
        rtype: rtype as string,
        price: price as string
      },
    });
    

  };