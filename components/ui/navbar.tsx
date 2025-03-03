"use client";
import { useState } from "react";
import { BrandLogo } from "./brandlogo";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="flex py-6 shadow-xl fixed top-0 w-full z-50 bg-gray-950 backdrop-blur-sm">
      <nav className="flex items-center justify-between md:justify-end w-full px-4 container">
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={`flex flex-col md:flex-row md:justify-end gap-4 absolute left-0 right-0 top-full bg-gray-950 shadow-lg md:shadow-none md:static z-50 ${isOpen ? 'flex' : 'hidden md:flex'}`}>
          <Link className="text-lg p-2 ml-8 hover:bg-gray-700 rounded transition-colors" href="/astrology">Astrology</Link>
          <Link className="text-lg p-2 ml-8 md:ml-0 hover:bg-gray-700 rounded transition-colors" href="/divination">Divination</Link>
          <Link className="text-lg p-2 ml-8 md:ml-0 hover:bg-gray-700 rounded transition-colors" href="/magick">Magick</Link>
          <Link className="text-lg p-2 ml-8 md:ml-0 hover:bg-gray-700 rounded transition-colors" href="/alchemy">Alchemy</Link>
          <Link className="text-lg p-2 ml-8 md:ml-0 hover:bg-gray-700 rounded transition-colors" href="/library">Library</Link>
          <Link className="text-lg p-2 ml-8 md:ml-0 hover:bg-gray-700 rounded transition-colors" href="/swisseph">Swiss Eph</Link>
          <span className="text-lg p-2 ml-8 md:ml-0 hover:bg-gray-700 rounded transition-colors">
            <SignedOut>
              <SignInButton>Login</SignInButton>
            </SignedOut>
            <SignedIn>
              <SignOutButton>Logout</SignOutButton>
            </SignedIn>
          </span>
        </div>
      </nav>
    </header>
  );
}