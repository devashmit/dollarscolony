import { auth } from "./auth";

export function normalizeUserRole(role: unknown): string | undefined {
  if (typeof role === "string") {
    const trimmed = role.trim();
    return trimmed ? trimmed.toLowerCase() : undefined;
  }
  return undefined;
}

export function isAdminRole(role: unknown): boolean {
  const normalizedRole = normalizeUserRole(role);
  if (!normalizedRole) {
    return false;
  }

  return ["admin", "administrator", "superuser", "super_admin", "super-admin", "staff"].includes(normalizedRole);
}

export function isAdminSession(session: any): boolean {
  if (!session?.user) {
    return false;
  }

  if (isAdminRole(session.user.role)) {
    return true;
  }

  return session.user.is_superuser === true || session.user.is_staff === true;
}

export function hasRole(session: any, role: string): boolean {
  const normalizedRequestedRole = normalizeUserRole(role);
  if (!normalizedRequestedRole) {
    return false;
  }

  if (normalizedRequestedRole === "admin") {
    return isAdminSession(session);
  }

  return normalizeUserRole(session?.user?.role) === normalizedRequestedRole;
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
