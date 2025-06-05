"use client";

import { ConnectButton, MediaRenderer, useActiveAccount } from "thirdweb/react";
import { client } from "../utils/thirdweb/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { chain } from "@/utils/thirdweb/chain";
import router from "next/router";
import Link from "next/link";
import ConnectEcho from "@/components/ConnectEcho";
import { Button } from "@/components/ui/button";
import AbstractBackground from "@/components/AbstractBackground";
import Image from "next/image";

export default function Home() {
  const account = useActiveAccount();


  return (
    <div className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
      <AbstractBackground />
        <Header />

        <div className="flex flex-col items-center mb-20">
          {account && (
            <div className="mb-4">
              <Button >
                <Link href="/feed" >
                Enter dApp
                </Link>
                
              </Button>
            </div>
          )}
          
          <ConnectEcho />
        </div>

        
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      
      <div className="mx-auto mb-6 flex flex-col items-center justify-center">
            <Image
              src="/logo-transparent.png"
              alt="OpenEcho Logo"
              width={120}
              height={120}
              className="mb-6"
              priority
            />
            <Image 
              src="/logo-text.png" 
              alt="OpenEcho" 
              width={320} 
              height={64} 
              className="mb-2" 
              priority 
            />
          </div>

      <p className="text-zinc-300 text-base">
      Decentralized Social Experience
      </p>

    </header>
  );
}
