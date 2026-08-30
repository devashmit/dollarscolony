import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { isAdminSession } from "@/lib/auth-helpers";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Admin Portal | Dollars Colony",
  description: "Dollars Colony Management and Administration Portal",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  if (!session || !isAdminSession(session)) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
