import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
