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
    <div className="bg-[#0F2535] p-6 rounded-xl border border-[rgba(176,120,72,0.25)] shadow-lg flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:border-[rgba(176,120,72,0.4)]">
      {/* Top Section */}
      <div className="flex items-start justify-between gap-4">
        {/* Left Side: Circular Icon */}
        {icon && (
          <div className={cn("h-12 w-12 flex items-center justify-center rounded-full border text-base shrink-0", iconClass)}>
            {icon}
          </div>
        )}

        {/* Right Side: Titles and Numbers */}
        <div className="flex-1 text-right space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9BB0] block">
            {title}
          </span>
          <span className="text-3xl font-extrabold text-[#F5F0E8] block tracking-tight">
            {value}
          </span>
          {subtext && (
            <span className="text-xs text-[#D4A46A] font-medium block">
              {subtext}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Section: Trendline and/or Footer Text */}
      {(trendline || footerText) && (
        <div className="flex items-end justify-between mt-4 pt-3 border-t border-[rgba(176,120,72,0.1)]">
          {/* Trendline */}
          <div className="w-24 h-6 flex items-center">
            {trendline || <div className="h-px w-full bg-transparent" />}
          </div>

          {/* Footer Text */}
          {footerText && (
            <span className={cn("text-[11px] font-medium tracking-wide", footerTextClass)}>
              {footerText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
