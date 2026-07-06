"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Map, Images, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getTitle = () => {
    return "Dollars Colony";
  };

  const mobileNavItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/leads", label: "Leads", icon: Users },
    { href: "/admin/plots", label: "Plots", icon: Map },
    { href: "/admin/gallery", label: "Gallery", icon: Images },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0D1F2D]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Watermark Logo Background (Centered in content area viewport, fixed, non-scrolling) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.06] z-0">
          <div className="relative w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px]">
            <img
              src="/sri-brahmari-logo-transparent.png"
              alt="Watermark Logo"
              className="w-full h-full object-contain filter grayscale invert"
            />
          </div>
        </div>

        <Topbar onMenuClick={() => setSidebarOpen(true)} title={getTitle()} />

        {/* Main Content Area: Added pb-20 on mobile to clear bottom navigation */}
        <main className="flex-1 overflow-y-auto bg-transparent p-6 pb-24 lg:p-8 relative z-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar (Visible only on mobile/tablet) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#081828] border-t border-[rgba(176,120,72,0.15)] flex justify-around items-center z-30 px-2 shadow-2xl">
          {mobileNavItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200",
                  isActive ? "text-[#D4A46A]" : "text-[#8A9BB0] active:text-[#F5F0E8]"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
              </Link>
            );
          })}

          {/* More button to toggle sidebar menu */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-[#8A9BB0] active:text-[#F5F0E8] transition-all duration-200 cursor-pointer"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-bold tracking-wide">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
