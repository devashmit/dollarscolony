import { auth } from "./auth";

export function hasRole(session: any, role: string): boolean {
  return session?.user?.role === role || (session?.user as any)?.role === role;
}

export async function getAdminSession() {
  return await auth();
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session || !hasRole(session, "admin")) {
    throw new Error("Unauthorized");
  }
  return session;
}
