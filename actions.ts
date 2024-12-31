// app/actions.ts

"use server";
import { neon } from "@neondatabase/serverless";
import prisma from "./lib/prisma";


//export function getData() {
//    const sql = neon(process.env.DATABASE_URL);
 //   const data = await sql`...`;
   // return data;
//}

export const addUser = async (uname: string, phone: string, email: string, birthday: string, time: string, location: string, questions: string) => {
    return await prisma.user.create({
      data: {
        uname,
        phone,
        email,
        birthday,
        time,
        location,
        questions
      },
    });
  };