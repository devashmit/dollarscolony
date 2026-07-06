"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Map,
  Images,
  FileText,
  Bell,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/plots", label: "Plots", icon: Map },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/updates", label: "Project Updates", icon: Bell },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-[#081828] border-r border-[rgba(176,120,72,0.15)] transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header with Logo */}
      <div className="flex h-24 items-center justify-between px-6 border-b border-[rgba(176,120,72,0.15)] relative">
        <Link href="/admin" className="relative h-20 w-48 mx-auto" onClick={onClose}>
          <Image
            src="/sri-brahmari-logo-transparent.png"
            alt="Sri Brahmari Developers"
            fill
            priority
            style={{ objectFit: "contain" }}
          />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden text-[#8A9BB0] hover:text-[#F5F0E8] transition-colors absolute right-4 top-9"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all duration-200 group border-l-4",
                isActive
                  ? "bg-gradient-to-r from-[#D4A46A]/15 to-transparent text-[#D4A46A] border-[#D4A46A]"
                  : "text-[#8A9BB0] hover:bg-[#1C2C3C]/40 hover:text-[#F5F0E8] border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0 transition-colors",
                  isActive ? "text-[#D4A46A]" : "text-[#8A9BB0] group-hover:text-[#F5F0E8]"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Sign Out */}
      <div className="p-4 border-t border-[rgba(176,120,72,0.15)] bg-[#05111D]">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#E05252] hover:bg-[#E05252]/10 transition-all duration-200 group"
        >
          <LogOut className="h-4 w-4 shrink-0 text-[#E05252] group-hover:scale-105 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
