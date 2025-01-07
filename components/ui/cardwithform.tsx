"use client";
import * as React from "react"



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
import { Textarea } from "@/components/ui/textarea"

export function CardWithForm() {
  
  
    
        
          
        
   
       
  
 
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Get a birth chart reading</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        
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
              <Input id="birthday" name="birthday" placeholder="MM/DD/YYYY" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="time">Time of birth</Label>
              <Input id="time" name="time" placeholder="12:00 pm" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="location">Location of birth</Label>
              <Input id="location" name="location" placeholder="City, State/District, Country"/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="questions">What topics are you interested in?</Label>
              <Textarea id="questions" name="questions" ></Textarea> 
            </div>
            <div className="flex flex-col space-y-1.5">
              <Button type="submit">Submit</Button>
              </div>
          </div>
        
      </CardContent>
      <CardFooter className="flex flex-col space-y-1.5">
      </CardFooter>
    </Card>
  )
}
