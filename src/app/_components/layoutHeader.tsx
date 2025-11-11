"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react"; // For hamburger and close icons

const LayoutHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="border-b border-red-800 bg-black p-4">
      <div className="flex items-start justify-between">
        <Image
          src="/image00001.png"
          width={150}
          height={150}
          alt="vtsns-logo"
        />

        {/* <button
          className="text-white"
          onClick={() => {
            console.log(session);
          }}
        >
          PRINT SESSION
        </button> */}

        {/* Mobile Menu Toggle */}
        <button
          className="text-white focus:outline-none md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-6 text-2xl text-white md:ml-[10%] md:mr-[50%] md:flex">
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
          <Link href="/intel" className="font-bold hover:text-red-400">
            INTEL
          </Link>
          <Link href="/submit_intel" className="font-bold hover:text-red-400">
            SUBMIT_INTEL
          </Link>
          <Link
            href="https://multiversal-mishaps.vercel.app/about-creator"
            className="whitespace-nowrap font-bold hover:text-red-400"
          >
            About creator (different website)
          </Link>

          <div className="flex items-start space-x-6">
            {session?.user ? (
              <>
                <Link href="/profile" className="font-bold hover:text-red-400">
                  {session.user.username ?? "error can't read username"}
                </Link>
                <button
                  onClick={() => void signOut()}
                  className="w-fit font-bold hover:text-red-400"
                >
                  Sign_Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/api/auth/signin"
                  className="font-bold hover:text-red-400"
                >
                  Sign In
                </Link>
                <Link href="/register" className="font-bold hover:text-red-400">
                  Register
                </Link>
              </>
            )}
          </div>
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
          <Link
            onClick={() => setIsOpen(false)}
            href="/intel"
            className="font-bold hover:text-red-400"
          >
            INTEL
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            href="/submit_intel"
            className="font-bold hover:text-red-400"
          >
            SUBMIT_INTEL
          </Link>
          <Link
            href="https://multiversal-mishaps.vercel.app/about-creator"
            className="font-bold hover:text-red-400"
          >
            About creator (different website)
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/profile"
                className="font-bold hover:text-red-400"
                onClick={() => setIsOpen(false)}
              >
                {session.user.username ?? session.user.email}
              </Link>
              <button
                onClick={() => {
                  void signOut();
                  setIsOpen(false);
                }}
                className="font-bold hover:text-red-400"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/api/auth/signin"
                className="font-bold hover:text-red-400"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="font-bold hover:text-red-400"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default LayoutHeader;
