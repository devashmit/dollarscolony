import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  iconClass?: string; // Tailwind classes for the icon container
  trendline?: React.ReactNode; // SVG path or element for the trendline
  footerText?: string; // e.g., "0% from last 7 days"
  footerTextClass?: string;
}

export default function StatCard({
  title,
  value,
  subtext,
  icon,
  iconClass = "bg-[#1A3348] text-[#D4A46A] border-[rgba(176,120,72,0.20)]",
  trendline,
  footerText,
  footerTextClass = "text-[#8A9BB0]",
}: StatCardProps) {
  return (
    <div className="bg-[#0F2535] p-3.5 sm:p-6 rounded-xl border border-[rgba(176,120,72,0.25)] shadow-lg flex flex-col justify-between min-h-[110px] sm:min-h-[160px] transition-all duration-300 hover:border-[rgba(176,120,72,0.4)]">
      {/* Top Section */}
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        {/* Left Side: Circular Icon (Smaller on mobile) */}
        {icon && (
          <div className={cn("h-8 w-8 sm:h-12 sm:w-12 flex items-center justify-center rounded-full border text-xs sm:text-base shrink-0", iconClass)}>
            {icon}
          </div>
        )}

        {/* Right Side: Trendline (Hidden on mobile) */}
        {trendline && (
          <div className="hidden sm:block w-24 h-6 flex items-center shrink-0">
            {trendline}
          </div>
        )}
      </div>

      {/* Main metrics (Left aligned on mobile, right aligned on desktop) */}
      <div className="mt-2.5 sm:mt-1 space-y-0.5 text-left sm:text-right">
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8A9BB0] block">
          {title}
        </span>
        <span className="text-xl sm:text-3xl font-extrabold text-[#F5F0E8] block tracking-tight leading-none my-0.5">
          {value}
        </span>
        {subtext && (
          <span className="text-[10px] sm:text-xs text-[#D4A46A] font-medium block truncate">
            {subtext}
          </span>
        )}
      </div>

      {/* Footer Text (Tiny on mobile) */}
      {footerText && (
        <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-[rgba(176,120,72,0.06)] sm:border-[rgba(176,120,72,0.1)] flex justify-between items-center">
          <span className={cn("text-[9px] sm:text-[11px] font-medium tracking-wide block truncate", footerTextClass)}>
            {footerText}
          </span>
        </div>
      )}
    </div>
  );
}
