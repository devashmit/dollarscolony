"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Menu, ChevronDown } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
  title: string;
}

export default function Topbar({ onMenuClick, title }: TopbarProps) {
  const { data: session } = useSession();
  const email = session?.user?.email || "devvv0204@gmail.com";
  const initial = email.charAt(0).toUpperCase();

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-[rgba(176,120,72,0.15)] bg-[#081828] px-4 sm:px-6 z-20 relative">
      {/* Left items */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden text-[#8A9BB0] hover:text-[#F5F0E8] transition-colors cursor-pointer shrink-0"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {title !== "Dollars Colony" && (
          <h1 className="text-lg sm:text-xl font-bold tracking-wider text-[#F5F0E8] uppercase truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Absolutely Centered Logo */}
      {title === "Dollars Colony" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-52 sm:h-18 sm:w-60 pointer-events-none flex items-center justify-center">
          <Image
            src="/sri-brahmari-logo-transparent.png"
            alt="Sri Brahmari Developers"
            fill
            priority
            style={{ objectFit: "contain" }}
          />
        </div>
      )}

      {/* Right items */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        {/* User Info & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
          {/* Avatar circle */}
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#1A3348] border border-[rgba(176,120,72,0.25)] text-sm font-bold text-[#D4A46A] shadow-inner shrink-0">
            {initial}
          </div>
          {/* Name & Role */}
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#F5F0E8] tracking-wide leading-tight">
              {email}
            </span>
            <span className="text-[10px] font-medium text-[#8A9BB0]">
              Admin
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-[#8A9BB0] group-hover:text-[#F5F0E8] transition-colors shrink-0" />
        </div>
      </div>
    </header>
  );
}
