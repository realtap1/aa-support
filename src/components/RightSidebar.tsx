"use client";

import Link from "next/link";
import ConnectEcho from "./ConnectEcho";
import Info from "./Info";

export function RightSidebar() {
  return (
    
    <div className="sticky top-4 hidden h-fit w-64 shrink-0 md:block">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
          <p>Testnet v0.1</p>
          <p>Report bugs here:</p>
          <Link
            href="https://discord.gg/MH6pSBrMkA"
            target="_blank"
            className="underline italic text-blue-500 hover:text-blue-600 transition duration-200"
          >
            discord.gg/f4CPpCYg
          </Link>
        <div className="py-4">
        <ConnectEcho />
        </div>
        <Info/>
        </div>
      </div>
      
      
    
  );
}
