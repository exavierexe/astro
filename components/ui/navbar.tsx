import { BrandLogo } from "./brandlogo"
import Link from "next/link" 
import { SignedIn, SignedOut, SignInButton  } from "@clerk/nextjs"




export function NavBar() {
    return (
    <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
        <nav className="flex items-center gap-10 container font-semibold">
            <Link href="/" className="mr-auto">
                <BrandLogo />
            </Link>
            <Link className="text-lg" href="/astrology">   
                Astrology
            </Link>
            <Link className="text-lg" href="/divination">   
                Divination
            </Link>
            <Link className="text-lg" href="/magick">   
                Magick
            </Link> 
            <Link className="text-lg" href="/alchemy">   
                Alchemy
            </Link>
            <Link className="text-lg" href="/library">   
                Library
            </Link>
            <span className="text-lg">
            <SignedIn>
                <Link href="">Space</Link>
                <Link href="">Time</Link>
            </SignedIn>
            <SignedOut>
                <SignInButton>Login</SignInButton>
            </SignedOut>
            </span>

        </nav>
    </header>
    )
}