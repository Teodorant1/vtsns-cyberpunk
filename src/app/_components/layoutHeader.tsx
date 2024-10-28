import React from "react";
import Link from "next/link";

const LayoutHeader = () => {
  return (
    <div>
      <div className="flex border-b border-red-800 bg-black p-4">
        <div className="container mx-auto flex">
          <h1
            className="glitch flex text-2xl font-bold tracking-wider text-red-600"
            style={{ textShadow: "2px 2px 4px rgba(255,0,0,0.5)" }}
          >
            VTSNS
            <div className="text-white">-Cyberpunk </div>
          </h1>

          <div className="flex w-fit items-center justify-between text-2xl text-white">
            {" "}
            <Link href="/" className="mx-5 hover:text-red-400">
              <h1 className="font-bold">Headlines</h1>
            </Link>
            <Link href="/FAQ" className="m-5 hover:text-red-400">
              <h1 className="font-bold">FAQ</h1>
            </Link>
            <Link
              href="https://discord.gg/KAnnz5bNRq"
              target="_blank"
              rel="noopener noreferrer"
              className="m-5 hover:text-red-400"
            >
              <h1 className="font-bold">Discord</h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutHeader;
