"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react"; // For hamburger and close icons

const LayoutHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-red-800 bg-black p-4">
      <div className="flex items-center justify-between">
        <Image
          src="/image00001.png"
          width={150}
          height={150}
          alt="vtsns-logo"
        />

        {/* Mobile Menu Toggle */}
        <button
          className="text-white focus:outline-none md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-6 text-2xl text-white md:flex">
          <Link href="/" className="font-bold hover:text-red-400">
            Headlines
          </Link>
          <Link href="/FAQ" className="font-bold hover:text-red-400">
            FAQ
          </Link>
          <Link
            href="https://discord.gg/KAnnz5bNRq"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:text-red-400"
          >
            Discord
          </Link>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="mt-4 flex flex-col space-y-4 text-center text-2xl text-white md:hidden">
          <Link
            href="/"
            className="font-bold hover:text-red-400"
            onClick={() => setIsOpen(false)}
          >
            Headlines
          </Link>
          <Link
            href="/FAQ"
            className="font-bold hover:text-red-400"
            onClick={() => setIsOpen(false)}
          >
            FAQ
          </Link>
          <Link
            href="https://discord.gg/KAnnz5bNRq"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:text-red-400"
            onClick={() => setIsOpen(false)}
          >
            Discord
          </Link>
        </nav>
      )}
    </header>
  );
};

export default LayoutHeader;
