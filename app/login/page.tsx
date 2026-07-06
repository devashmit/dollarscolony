"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [view, setView] = useState<"login" | "forgot" | "reset">("login");

  // Forgot password & reset state
  const [resetEmail, setResetEmail] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error.includes("attempts") || res.error.includes("limit") || res.error.includes("Too many")) {
          setErrorMessage("Too many login attempts. Please try again in 15 minutes.");
        } else {
          setErrorMessage("Invalid email or password.");
        }
        toast.error("Sign in failed");
      } else {
        toast.success("Signed in successfully!");
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setRequestLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/auth/reset-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("If the email exists, a verification code has been sent!");
        setView("reset");
      } else {
        setErrorMessage(data.error || "Failed to request password reset");
      }
    } catch (err) {
      console.error("Forgot password request error:", err);
      setErrorMessage("Network error requesting password reset");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setResetLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/auth/reset-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, code: otpCode, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password reset successfully! Please log in.");
        setView("login");
        setOtpCode("");
        setNewPassword("");
        setConfirmPassword("");
        setResetEmail("");
      } else {
        setErrorMessage(data.error || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password verification error:", err);
      setErrorMessage("Network error resetting password");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0D1F2D] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="relative h-24 w-64 mb-6">
            <Image
              src="/sri-brahmari-logo-transparent.png"
              alt="Sri Brahmari Developers"
              fill
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
          <h2 className="text-center text-xl font-medium tracking-wide text-[#F5F0E8] uppercase">
            Dollars Colony Admin
          </h2>
        </div>

        <div className="bg-[#0F2535] p-8 rounded-xl border border-[rgba(176,120,72,0.25)] shadow-2xl space-y-6">
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 text-[#E05252] text-sm p-3 rounded-lg text-center font-medium">
              {errorMessage}
            </div>
          )}

          {view === "login" && (
            <>
              <h3 className="text-lg font-semibold text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
                Sign In
              </h3>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-[#8A9BB0]">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/40 focus-visible:ring-[#B07848]"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-[#E05252]">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-[#8A9BB0]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setView("forgot");
                        setErrorMessage("");
                      }}
                      className="text-xs text-[#D4A46A] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/40 focus-visible:ring-[#B07848]"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-xs text-[#E05252]">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase mt-6 transition-all duration-200"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </>
          )}

          {view === "forgot" && (
            <>
              <h3 className="text-lg font-semibold text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
                Reset Password
              </h3>

              <form className="space-y-4" onSubmit={handleRequestReset}>
                <p className="text-xs text-[#8A9BB0] leading-relaxed">
                  Enter your registered administrator email address below. If the email is associated with an active admin account, we will send you a 6-digit verification code.
                </p>
                
                <div className="space-y-2">
                  <label htmlFor="resetEmail" className="text-xs font-medium uppercase tracking-wider text-[#8A9BB0]">
                    Email Address
                  </label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="admin@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/40 focus-visible:ring-[#B07848]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={requestLoading}
                  className="w-full bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase mt-6 transition-all duration-200"
                >
                  {requestLoading ? "Sending Code..." : "Send Verification Code"}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setView("login");
                      setErrorMessage("");
                    }}
                    className="text-xs text-[#8A9BB0] hover:text-[#F5F0E8] hover:underline"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            </>
          )}

          {view === "reset" && (
            <>
              <h3 className="text-lg font-semibold text-[#F5F0E8] border-b border-[rgba(176,120,72,0.15)] pb-3">
                Verify Code & Reset
              </h3>

              <form className="space-y-4" onSubmit={handleVerifyAndReset}>
                <p className="text-xs text-[#8A9BB0] leading-relaxed">
                  A verification code has been dispatched. Enter the code and your new password to regain access.
                </p>

                <div className="space-y-2">
                  <label htmlFor="otpCode" className="text-xs font-medium uppercase tracking-wider text-[#8A9BB0]">
                    Verification Code (6-Digits)
                  </label>
                  <Input
                    id="otpCode"
                    type="text"
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/40 focus-visible:ring-[#B07848] font-mono text-center tracking-widest text-lg"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-xs font-medium uppercase tracking-wider text-[#8A9BB0]">
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/40 focus-visible:ring-[#B07848]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-xs font-medium uppercase tracking-wider text-[#8A9BB0]">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#1A3348] border-[rgba(176,120,72,0.25)] text-[#F5F0E8] placeholder:text-[#8A9BB0]/40 focus-visible:ring-[#B07848]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-[#B07848] hover:bg-[#B07848]/90 text-[#F5F0E8] font-medium tracking-wide uppercase mt-6 transition-all duration-200"
                >
                  {resetLoading ? "Resetting Password..." : "Reset Password"}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setErrorMessage("");
                    }}
                    className="text-xs text-[#8A9BB0] hover:text-[#F5F0E8] hover:underline"
                  >
                    ← Back to Request Reset
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
