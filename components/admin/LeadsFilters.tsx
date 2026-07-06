"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";

export default function LeadsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchVal, setSearchVal] = useState(searchParams.get("search") || "");

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "" || val === "All") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchVal !== (searchParams.get("search") || "")) {
        updateFilters({ search: searchVal });
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchVal]);

  const handleExport = () => {
    const params = new URLSearchParams(searchParams.toString());
    window.location.href = `/api/admin/leads/export?${params.toString()}`;
  };

  const handleReset = () => {
    setSearchVal("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="bg-[#0F2535] p-5 rounded-xl border border-[rgba(176,120,72,0.25)] space-y-4 shadow-md">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <div className="space-y-1.5 lg:col-span-2">
          <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8A9BB0]" />
            <Input
              placeholder="Search by name or phone..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="pl-9 bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/40 focus-visible:ring-[#B07848]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Status</label>
          <Select
            value={searchParams.get("status") || "All"}
            onValueChange={(val) => updateFilters({ status: val })}
          >
            <SelectTrigger className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus:ring-[#B07848]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-[#0F2535] border-[rgba(176,120,72,0.25)] text-[#F5F0E8]">
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="CONTACTED">Contacted</SelectItem>
              <SelectItem value="SITE_VISIT_SCHEDULED">Site Visit</SelectItem>
              <SelectItem value="NEGOTIATING">Negotiating</SelectItem>
              <SelectItem value="BOOKED">Booked</SelectItem>
              <SelectItem value="DROPPED">Dropped</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">Form Source</label>
          <Select
            value={searchParams.get("form") || "All"}
            onValueChange={(val) => updateFilters({ form: val })}
          >
            <SelectTrigger className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus:ring-[#B07848]">
              <SelectValue placeholder="All Forms" />
            </SelectTrigger>
            <SelectContent className="bg-[#0F2535] border-[rgba(176,120,72,0.25)] text-[#F5F0E8]">
              <SelectItem value="All">All Forms</SelectItem>
              <SelectItem value="Contact Form">Contact Form</SelectItem>
              <SelectItem value="Brochure Download">Brochure Download</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">From Date</label>
          <Input
            type="date"
            value={searchParams.get("from") || ""}
            onChange={(e) => updateFilters({ from: e.target.value })}
            className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider">To Date</label>
          <Input
            type="date"
            value={searchParams.get("to") || ""}
            onChange={(e) => updateFilters({ to: e.target.value })}
            className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus-visible:ring-[#B07848]"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[rgba(176,120,72,0.10)]">
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-[rgba(176,120,72,0.25)] text-[#8A9BB0] hover:text-[#F5F0E8] hover:bg-[#1A3348]/40"
        >
          Reset Filters
        </Button>

        <Button
          onClick={handleExport}
          className="bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>
    </div>
  );
}
