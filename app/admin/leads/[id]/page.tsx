import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import LeadDetailForm from "@/components/admin/LeadDetailForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lead = await db.lead.findUnique({
    where: { id },
  });

  if (!lead) {
    notFound();
  }

  return <LeadDetailForm lead={lead} />;
}
