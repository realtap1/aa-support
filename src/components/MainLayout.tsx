"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { BarChart2, Bell, Home, Mail, Search, User, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { RightSidebar } from "./RightSidebar"
import AbstractBackground from "./AbstractBackground"
import { Button } from "./ui/button"
import { useState } from "react"
import CreatePostModal from "./CreatePostModal"

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)

  const navItems = [
    {
      name: "Feed",
      href: "/feed",
      icon: Home,
    },
    {
      name: "Explore",
      href: "/explore",
      icon: Search,
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
    },
    {
        name: "Rewards",
        href: "/rewards",
        icon: BarChart2,
      },
    {
      name: "Messages",
      href: "/messages",
      icon: Mail,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="flex min-h-screen text-white">
      {/* Main Content Area */}
      <AbstractBackground/>
      <div className="mx-auto flex w-full max-w-7xl gap-4 px-4">
        {/* Side Navigation */}
        <div className="sticky top-4 hidden h-fit w-64 shrink-0 md:block">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
            <Link href="/feed" className="mb-6 flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-gray-800">
                <Image
                  src="/logo-transparent.png"
                  alt="OpenEcho"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </div>
              <Image src="/logo-text.png" alt="OpenEcho" width={120} height={24} className="ml-2" />
            </Link>

            <nav className="mt-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-full p-3 transition-colors hover:bg-gray-800",
                    pathname === item.href ? "bg-gray-800 font-bold" : "font-normal",
                  )}
                >
                  
                    <item.icon className="h-6 w-6" />
                  
                  <span className="ml-4">{item.name}</span>
                </Link>
              ))}
              <div className="pt-6 flex justify-center">
                <Button 
                  className="py-4 w-full flex"
                  onClick={() => setShowCreatePostModal(true)}
                >
                  Post
                </Button>
              </div>
            </nav>

            

          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 z-10 flex w-full justify-around border-t border-gray-800 bg-black/90 p-2 backdrop-blur-md md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center rounded-md p-2",
                pathname === item.href ? "text-blue-400" : "text-gray-400",
              )}
            >
              
                <item.icon className="h-6 w-6" />
             
              <span className="mt-1 text-xs">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-full max-w-xl px-2">{children}</div>

        {/* Right Sidebar - Suggestions */}
        <RightSidebar/>
      </div>
      {showCreatePostModal && (
        <CreatePostModal onClose={() => setShowCreatePostModal(false)} />
      )}
    </div>
  )
}
