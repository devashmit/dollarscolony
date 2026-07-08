import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";

function normalizeUserRole(role: unknown): string | undefined {
  if (typeof role === "string") {
    const trimmed = role.trim();
    return trimmed ? trimmed.toLowerCase() : undefined;
  }
  return undefined;
}

function getBackendToken(payload: any): string | undefined {
  const candidates = [
    payload?.token,
    payload?.accessToken,
    payload?.access_token,
    payload?.auth_token,
    payload?.key,
    payload?.access?.token,
    payload?.access?.access_token,
    payload?.access?.accessToken,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return undefined;
}

function getBackendUser(payload: any): any {
  if (payload?.user && typeof payload.user === "object") {
    return payload.user;
  }
  if (payload?.profile && typeof payload.profile === "object") {
    return payload.profile;
  }
  if (payload?.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    if (payload.data.user && typeof payload.data.user === "object") {
      return payload.data.user;
    }
    return payload.data;
  }
  return undefined;
}

function resolveBackendRole(user: any, fallbackRole?: string): string {
  const normalizedRole = normalizeUserRole(user?.role) || normalizeUserRole(fallbackRole);
  if (normalizedRole) {
    return normalizedRole;
  }

  if (user?.is_admin === true || user?.is_superuser === true || user?.admin === true) {
    return "admin";
  }

  if (user?.is_staff === true) {
    return "staff";
  }

  return "user";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
          const res = await fetch(`${backendUrl}/api/auth/login/`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();
          const token = getBackendToken(data);
          const userPayload = getBackendUser(data);

          if (token && userPayload) {
            return {
              id: userPayload.id ?? data.id ?? data.user_id ?? userPayload.user_id,
              email: userPayload.email ?? data.email ?? userPayload.username ?? data.username,
              name: userPayload.name ?? userPayload.full_name ?? userPayload.username ?? userPayload.email,
              role: resolveBackendRole(userPayload, data.role),
              accessToken: token,
            };
          }

          if (token && (data.email || data.username)) {
            return {
              id: data.id ?? data.user_id,
              email: data.email ?? data.username,
              name: data.name ?? data.full_name ?? data.username ?? data.email,
              role: resolveBackendRole(data, data.role),
              accessToken: token,
            };
          }
        } catch (error) {
          console.error("Auth authorization error calling Django backend:", error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  }
});
