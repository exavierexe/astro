'use client'
import * as React from "react"
import { addUser } from "@/actions"
import { prisma } from "@prisma/client"


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CardWithForm() {
    
  function handleSubmit(){
    console.log(document.getElementById('uname').value);
    addUser( document.getElementById('uname').value,
        document.getElementById('phone').value,
        document.getElementById('email').value,
        document.getElementById('birthday').value,
        document.getElementById('time').value,
        document.getElementById('location').value,
        document.getElementById('questions').value )}
        
          
        
   
       
  
 
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Get a birth chart reading</CardTitle>
        <CardDescription>$325</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="uname">Name</Label>
              <Input id="uname" name="uname" placeholder=""/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" name="phone" placeholder="" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" placeholder="" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="birthday">Date of birth</Label>
              <Input id="birthday" name="birthday" placeholder="12:00 am" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="time">Time of birth</Label>
              <Input id="time" name="time" placeholder="MM/DD/YYYY" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="location">Location of birth</Label>
              <Input id="location" name="location" placeholder="City, State/District, Country"/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="questions">What topics are you interested in?</Label>
              <textarea id="questions" name="questions" ></textarea> 
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-1.5">
        <Button onClick={handleSubmit} >Submit</Button>
      </CardFooter>
    </Card>
  )
}
