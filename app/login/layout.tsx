import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Dollars Colony",
  description: "Secure administrator sign in for Dollars Colony",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
