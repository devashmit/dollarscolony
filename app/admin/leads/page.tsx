import React from "react";
import { db } from "@/lib/db";
import { LeadStatus } from "@/lib/types-prisma-mock";
import LeadsFilters from "@/components/admin/LeadsFilters";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    form?: string;
    status?: string;
    from?: string;
    to?: string;
  }>;
}

export const revalidate = 0;

export default async function LeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 50;
  const search = params.search || "";
  const form = params.form || "";
  const status = params.status || "";
  const fromStr = params.from || "";
  const toStr = params.to || "";

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  if (form && form !== "All") {
    where.formName = form;
  }

  if (status && status !== "All") {
    where.status = status as LeadStatus;
  }

  if (fromStr || toStr) {
    where.submittedAt = {};
    if (fromStr) {
      where.submittedAt.gte = new Date(fromStr);
    }
    if (toStr) {
      const toDate = new Date(toStr);
      toDate.setHours(23, 59, 59, 999);
      where.submittedAt.lte = toDate;
    }
  }

  const [total, leads] = await db.$transaction([
    db.lead.count({ where }),
    db.lead.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const getPageUrl = (targetPage: number) => {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (form) q.set("form", form);
    if (status) q.set("status", status);
    if (fromStr) q.set("from", fromStr);
    if (toStr) q.set("to", toStr);
    q.set("page", String(targetPage));
    return `?${q.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wide text-[#F5F0E8] uppercase">
            Leads Directory
          </h2>
          <p className="text-sm text-[#8A9BB0] mt-1">
            Browse and manage client registrations, brochure requests, and site visit queries.
          </p>
        </div>
      </div>

      <LeadsFilters />

      <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] overflow-hidden shadow-lg">
        {leads.length === 0 ? (
          <div className="p-16 text-center text-[#8A9BB0] space-y-2">
            <p className="text-base font-medium">No leads found.</p>
            <p className="text-sm text-[#8A9BB0]/60">Adjust your filters or modify your search terms and try again.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#0A1D2B]">
                  <TableRow className="border-b border-[rgba(176,120,72,0.15)] hover:bg-transparent">
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Name</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Phone</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Email</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">City</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Form Source</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Interest</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Budget</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">UTM Source</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11">Status</TableHead>
                    <TableHead className="text-[#8A9BB0] font-semibold text-xs uppercase tracking-wider h-11 text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => {
                    const statusColorMap: Record<string, string> = {
                      NEW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      CONTACTED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                      SITE_VISIT_SCHEDULED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                      NEGOTIATING: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
                      BOOKED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      DROPPED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                    };

                    return (
                      <TableRow
                        key={lead.id}
                        className="border-b border-[rgba(176,120,72,0.10)] hover:bg-[#1A3348]/20 transition-colors"
                      >
                        <TableCell className="font-medium text-[#F5F0E8] py-3">
                          <Link href={`/admin/leads/${lead.id}`} className="hover:text-[#D4A46A] transition-colors">
                            {lead.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-[#8A9BB0] py-3 font-mono text-xs">{lead.phone}</TableCell>
                        <TableCell className="text-[#8A9BB0] py-3 max-w-[150px] truncate">{lead.email || "—"}</TableCell>
                        <TableCell className="text-[#8A9BB0] py-3">{lead.city || "—"}</TableCell>
                        <TableCell className="py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#1A3348] text-[#D4A46A] border border-[rgba(176,120,72,0.15)] whitespace-nowrap">
                            {lead.formName || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-[#8A9BB0] py-3">{lead.customerInterest || "—"}</TableCell>
                        <TableCell className="text-[#8A9BB0] py-3 whitespace-nowrap">{lead.budget || "—"}</TableCell>
                        <TableCell className="text-[#8A9BB0] py-3">{lead.utmSource || "—"}</TableCell>
                        <TableCell className="py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${statusColorMap[lead.status] || "bg-[#1A3348] text-[#8A9BB0]"}`}>
                            {lead.status.replace(/_/g, " ")}
                          </span>
                        </TableCell>
                        <TableCell className="text-[#8A9BB0] py-3 text-right text-xs whitespace-nowrap">
                          {new Date(lead.submittedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-[rgba(176,120,72,0.15)] bg-[#0A1D2B]">
              <span className="text-xs text-[#8A9BB0]">
                Showing <span className="font-semibold text-[#F5F0E8]">{(page - 1) * limit + 1}</span> to{" "}
                <span className="font-semibold text-[#F5F0E8]">{Math.min(page * limit, total)}</span> of{" "}
                <span className="font-semibold text-[#F5F0E8]">{total}</span> leads
              </span>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  {page > 1 ? (
                    <Link
                      href={getPageUrl(page - 1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded bg-[#1A3348] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] hover:bg-[#B07848] hover:text-[#F5F0E8] transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-[#102436] border border-[rgba(176,120,72,0.10)] text-[#8A9BB0]/40 cursor-not-allowed">
                      <ChevronLeft className="h-4 w-4" />
                    </span>
                  )}

                  <span className="text-xs text-[#8A9BB0]">
                    Page <span className="font-semibold text-[#F5F0E8]">{page}</span> of {totalPages}
                  </span>

                  {page < totalPages ? (
                    <Link
                      href={getPageUrl(page + 1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded bg-[#1A3348] border border-[rgba(176,120,72,0.25)] text-[#F5F0E8] hover:bg-[#B07848] hover:text-[#F5F0E8] transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-[#102436] border border-[rgba(176,120,72,0.10)] text-[#8A9BB0]/40 cursor-not-allowed">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
