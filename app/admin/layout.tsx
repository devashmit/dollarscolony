import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { isAdminSession } from "@/lib/auth-helpers";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  if (!session || !isAdminSession(session)) {
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
