"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LeadStatus, Lead } from "@/lib/types-prisma-mock";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface LeadDetailFormProps {
  lead: Lead;
}

export default function LeadDetailForm({ lead }: LeadDetailFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes || "");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(newStatus);
        toast.success("Lead status updated successfully!");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Notes saved successfully!");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to save notes");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSavingNotes(false);
    }
  };

  const details = [
    { label: "Full Name", value: lead.name },
    { label: "Phone Number", value: lead.phone, mono: true },
    { label: "Email Address", value: lead.email || "—" },
    { label: "City / Location", value: lead.city || "—" },
    { label: "Form Source", value: lead.formName || "—" },
    { label: "Customer Interest", value: lead.customerInterest || "—" },
    { label: "Buyer Type", value: lead.buyerType || "—" },
    { label: "Plot Size Preference", value: lead.plotSize || "—" },
    { label: "Budget Range", value: lead.budget || "—" },
    { label: "Purchase Purpose", value: lead.purpose || "—" },
    { label: "CTA Clicked", value: lead.ctaClicked || "—" },
    { label: "UTM Source", value: lead.utmSource || "—" },
    { label: "UTM Campaign", value: lead.utmCampaign || "—" },
    {
      label: "Submitted Date",
      value: new Date(lead.submittedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A9BB0] hover:text-[#D4A46A] transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Leads
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-6 shadow-md">
            <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider border-b border-[rgba(176,120,72,0.15)] pb-3 mb-4">
              Lead Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {details.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider block">
                    {item.label}
                  </span>
                  <span className={`text-sm text-[#F5F0E8] block ${item.mono ? "font-mono font-medium" : ""}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {lead.enquiry && (
              <div className="mt-6 pt-4 border-t border-[rgba(176,120,72,0.10)] space-y-2">
                <span className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider block">
                  Customer Enquiry / Message
                </span>
                <p className="text-sm text-[#F5F0E8] bg-[#1A3348]/40 p-3 rounded-lg border border-[rgba(176,120,72,0.10)] leading-relaxed">
                  {lead.enquiry}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-6 shadow-md space-y-4">
            <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider border-b border-[rgba(176,120,72,0.15)] pb-3">
              Lead Status
            </h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#8A9BB0] uppercase tracking-wider">
                Select Status
              </label>
              <Select
                value={status}
                onValueChange={(val) => val && handleStatusChange(val as LeadStatus)}
                disabled={savingStatus}
              >
                <SelectTrigger className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] focus:ring-[#B07848]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F2535] border-[rgba(176,120,72,0.25)] text-[#F5F0E8]">
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="SITE_VISIT_SCHEDULED">Site Visit Scheduled</SelectItem>
                  <SelectItem value="NEGOTIATING">Negotiating</SelectItem>
                  <SelectItem value="BOOKED">Booked</SelectItem>
                  <SelectItem value="DROPPED">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-[#0F2535] rounded-xl border border-[rgba(176,120,72,0.25)] p-6 shadow-md space-y-4">
            <h3 className="text-base font-semibold text-[#F5F0E8] uppercase tracking-wider border-b border-[rgba(176,120,72,0.15)] pb-3">
              Internal Notes
            </h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Add notes about conversations, site visits, or buyer preferences..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[160px] bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/30 focus-visible:ring-[#B07848]"
              />
              <Button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="w-full bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {savingNotes ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
