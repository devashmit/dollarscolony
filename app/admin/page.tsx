import React from "react";
import { db } from "@/lib/db";
import StatCard from "@/components/admin/StatCard";
import {
  Users,
  UserPlus,
  CalendarDays,
  MapPin,
  Clock,
  Mail,
  Percent,
  Eye,
  Calendar,
  ChevronDown,
  FolderDot,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function DashboardPage() {
  const now = new Date();
  
  // Date calculation for the week
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  // Fetch stats from the consolidated endpoint
  const statsRes = await db.dashboardStats.get();
  const {
    totalLeads,
    newLeads,
    leadsThisWeek,
    availablePlots,
    blockedPlots,
    soldPlots,
    recentLeads,
    dailyCounts,
  } = statsRes.data;

  const maxCount = Math.max(...dailyCounts.map((d) => d.count), 1);
  
  // Calculate SVG line points
  // SVG box size: 500x120. X from 40 to 460. Y from 100 (0 value) to 10 (max value).
  const points = dailyCounts
    .map((d, i) => {
      const x = 40 + i * 70;
      const y = 100 - (d.count / maxCount) * 80;
      return `${x},${y}`;
    })
    .join(" ");

  // Trendline SVGs for mini cards
  const blueTrendline = (
    <svg className="w-full h-full opacity-80" viewBox="0 0 100 30" fill="none">
      <path d="M0 25 C15 23, 30 28, 50 18 C70 8, 85 15, 100 10" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const greenTrendline = (
    <svg className="w-full h-full opacity-80" viewBox="0 0 100 30" fill="none">
      <path d="M0 20 C20 22, 40 10, 60 15 C80 20, 90 8, 100 5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const purpleTrendline = (
    <svg className="w-full h-full opacity-80" viewBox="0 0 100 30" fill="none">
      <path d="M0 28 C20 25, 35 15, 55 12 C75 9, 85 18, 100 8" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const formattedWeekRange = `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-wide text-[#F5F0E8] flex items-center gap-2">
            Good morning, Admin
          </h2>
          <p className="text-sm text-[#8A9BB0] mt-1">
            Here's what's happening with Dollars Colony today.
          </p>
        </div>

        {/* Date Selector Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#0F2535] border border-[rgba(176,120,72,0.25)] rounded-lg px-3 py-2 text-xs font-semibold text-[#F5F0E8] hover:border-[rgba(176,120,72,0.4)] transition-all cursor-pointer shadow-md">
          <Calendar className="h-4 w-4 text-[#D4A46A] shrink-0" />
          <span>{formattedWeekRange}</span>
          <ChevronDown className="h-3 w-3 text-[#8A9BB0] ml-1" />
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          subtext="All-time registrations"
          icon={<Users className="h-5 w-5" />}
          iconClass="bg-blue-900/20 text-blue-400 border-blue-500/20"
          trendline={blueTrendline}
          footerText="0% from last 7 days"
        />
        <StatCard
          title="New Leads"
          value={newLeads}
          subtext="Awaiting response"
          icon={<UserPlus className="h-5 w-5" />}
          iconClass="bg-emerald-900/20 text-emerald-400 border-emerald-500/20"
          trendline={greenTrendline}
          footerText="0% from last 7 days"
        />
        <StatCard
          title="Leads This Week"
          value={leadsThisWeek}
          subtext={`Since ${startOfWeek.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`}
          icon={<CalendarDays className="h-5 w-5" />}
          iconClass="bg-purple-900/20 text-purple-400 border-purple-500/20"
          trendline={purpleTrendline}
          footerText="0% from last 7 days"
        />
        <StatCard
          title="Plot Inventory"
          value={availablePlots}
          subtext="Available"
          icon={<MapPin className="h-5 w-5" />}
          iconClass="bg-amber-900/20 text-amber-500 border-amber-500/20"
          footerText={`${blockedPlots} Blocked · ${soldPlots} Sold`}
          footerTextClass="text-[#D4A46A] font-semibold"
        />
      </div>

      {/* Middle Layout Grid: Chart & Recent Enquiries */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEADS OVERVIEW Chart */}
        <div className="lg:col-span-2 bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-6 flex flex-col justify-between shadow-lg min-h-[360px]">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(176,120,72,0.1)]">
            <h3 className="text-sm font-bold text-[#F5F0E8] uppercase tracking-wider flex items-center gap-2">
              <span className="h-3 w-1 bg-[#D4A46A] rounded-full" />
              Leads Overview
            </h3>
            <div className="flex items-center gap-1 bg-[#0A1D2B] border border-[rgba(176,120,72,0.15)] rounded-md px-2 py-1 text-[11px] font-semibold text-[#8A9BB0] hover:text-[#F5F0E8] cursor-pointer transition-all">
              <span>Last 7 Days</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="flex-1 flex flex-col justify-center my-4 relative">
            <svg className="w-full h-48" viewBox="0 0 500 120">
              {/* Dotted Grid Lines */}
              <line x1="40" y1="20" x2="460" y2="20" stroke="rgba(138, 155, 176, 0.1)" strokeDasharray="3 3" />
              <line x1="40" y1="60" x2="460" y2="60" stroke="rgba(138, 155, 176, 0.1)" strokeDasharray="3 3" />
              <line x1="40" y1="100" x2="460" y2="100" stroke="rgba(138, 155, 176, 0.15)" />

              {/* Y Axis Labels */}
              <text x="15" y="24" fill="#8A9BB0" fontSize="9" fontWeight="bold" textAnchor="middle">{maxCount}</text>
              <text x="15" y="64" fill="#8A9BB0" fontSize="9" fontWeight="bold" textAnchor="middle">{(maxCount / 2).toFixed(1)}</text>
              <text x="15" y="104" fill="#8A9BB0" fontSize="9" fontWeight="bold" textAnchor="middle">0</text>

              {/* Chart Line Path */}
              <polyline
                fill="none"
                stroke="#D4A46A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />

              {/* Chart Data Dots */}
              {dailyCounts.map((d, i) => {
                const x = 40 + i * 70;
                const y = 100 - (d.count / maxCount) * 80;
                return (
                  <g key={i} className="group cursor-pointer">
                    <circle cx={x} cy={y} r="5" fill="#0D1F2D" stroke="#D4A46A" strokeWidth="2.5" />
                    <circle cx={x} cy={y} r="9" fill="#D4A46A" className="opacity-0 group-hover:opacity-20 transition-all" />
                  </g>
                );
              })}

              {/* X Axis Date Labels */}
              {dailyCounts.map((d, i) => {
                const x = 40 + i * 70;
                return (
                  <text key={i} x={x} y="118" fill="#8A9BB0" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {d.label}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold text-[#8A9BB0] pt-2 border-t border-[rgba(176,120,72,0.05)] justify-center">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#D4A46A]" />
              New Leads
            </span>
          </div>
        </div>

        {/* RECENT ENQUIRIES */}
        <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-6 flex flex-col justify-between shadow-lg min-h-[360px]">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(176,120,72,0.1)]">
            <h3 className="text-sm font-bold text-[#F5F0E8] uppercase tracking-wider flex items-center gap-2">
              <span className="h-3 w-1 bg-[#D4A46A] rounded-full" />
              Recent Enquiries
            </h3>
            <Link
              href="/admin/leads"
              className="text-[11px] font-bold text-[#D4A46A] hover:text-[#B07848] transition-colors uppercase tracking-wider"
            >
              View All Leads →
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center my-4 overflow-y-auto max-h-[220px]">
            {recentLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-[#1A3348]/40 border border-[rgba(176,120,72,0.15)] flex items-center justify-center text-[#8A9BB0]">
                  <FolderDot className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F0E8] uppercase tracking-wider">No leads captured yet.</h4>
                  <p className="text-[11px] text-[#8A9BB0] mt-1">New enquiries will appear here.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[rgba(176,120,72,0.1)]">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3 hover:bg-[#1A3348]/20 transition-all p-1.5 rounded-lg">
                    {/* Circle Initial */}
                    <div className="h-8 w-8 rounded-full bg-[#1A3348] border border-[rgba(176,120,72,0.2)] flex items-center justify-center text-xs font-bold text-[#D4A46A] shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <Link href={`/admin/leads/${lead.id}`} className="text-xs font-semibold text-[#F5F0E8] hover:text-[#D4A46A] truncate transition-colors">
                          {lead.name}
                        </Link>
                        <span className="text-[9px] font-medium text-[#8A9BB0] shrink-0">
                          {new Date(lead.submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8A9BB0] truncate mt-0.5">{lead.phone}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] bg-[#1A3348] text-[#D4A46A] px-1.5 py-0.5 rounded font-medium border border-[rgba(176,120,72,0.15)] uppercase">
                          {lead.formName || "Web Form"}
                        </span>
                        {lead.city && (
                          <span className="text-[9px] text-[#8A9BB0] truncate">
                            • {lead.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Bottom row of statistics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* AVG RESPONSE TIME */}
        <div className="bg-[#0F2535] p-4 rounded-xl border border-[rgba(176,120,72,0.20)] shadow-md flex items-center gap-3 transition-all hover:border-[rgba(176,120,72,0.35)] min-w-0">
          <div className="h-9 w-9 rounded-full bg-[#1A3348] border border-[rgba(176,120,72,0.20)] text-[#D4A46A] flex items-center justify-center shrink-0">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9BB0] block truncate">Avg Response Time</span>
            <span className="text-base font-extrabold text-[#F5F0E8] block mt-0.5 leading-none">—</span>
            <span className="text-[10px] text-[#8A9BB0] block mt-0.5 truncate">No data yet</span>
          </div>
        </div>

        {/* UNREAD ENQUIRIES */}
        <div className="bg-[#0F2535] p-4 rounded-xl border border-[rgba(176,120,72,0.20)] shadow-md flex items-center gap-3 transition-all hover:border-[rgba(176,120,72,0.35)] min-w-0">
          <div className="h-9 w-9 rounded-full bg-[#1A3348] border border-[rgba(176,120,72,0.20)] text-[#D4A46A] flex items-center justify-center shrink-0">
            <Mail className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9BB0] block truncate">Unread Enquiries</span>
            <span className="text-base font-extrabold text-[#F5F0E8] block mt-0.5 leading-none">{newLeads}</span>
            <span className="text-[10px] text-[#8A9BB0] block mt-0.5 truncate">{newLeads} unread messages</span>
          </div>
        </div>

        {/* CONVERSION RATE */}
        <div className="bg-[#0F2535] p-4 rounded-xl border border-[rgba(176,120,72,0.20)] shadow-md flex items-center gap-3 transition-all hover:border-[rgba(176,120,72,0.35)] min-w-0">
          <div className="h-9 w-9 rounded-full bg-[#1A3348] border border-[rgba(176,120,72,0.20)] text-[#D4A46A] flex items-center justify-center shrink-0">
            <Percent className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9BB0] block truncate">Conversion Rate</span>
            <span className="text-base font-extrabold text-[#F5F0E8] block mt-0.5 leading-none">0%</span>
            <span className="text-[10px] text-[#8A9BB0] block mt-0.5 truncate">No data yet</span>
          </div>
        </div>

        {/* TOTAL PROJECT VIEWS */}
        <div className="bg-[#0F2535] p-4 rounded-xl border border-[rgba(176,120,72,0.20)] shadow-md flex items-center gap-3 transition-all hover:border-[rgba(176,120,72,0.35)] min-w-0">
          <div className="h-9 w-9 rounded-full bg-[#1A3348] border border-[rgba(176,120,72,0.20)] text-[#D4A46A] flex items-center justify-center shrink-0">
            <Eye className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9BB0] block truncate">Total Project Views</span>
            <span className="text-base font-extrabold text-[#F5F0E8] block mt-0.5 leading-none">—</span>
            <span className="text-[10px] text-[#8A9BB0] block mt-0.5 truncate">No data yet</span>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="text-center text-[10px] font-bold text-[#8A9BB0]/60 pt-6">
        © 2025 Sri Brahmari Developers. All rights reserved.
      </footer>
    </div>
  );
}
