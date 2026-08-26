"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "#0F2535",
          "--normal-text": "#F5F0E8",
          "--normal-border": "rgba(176, 120, 72, 0.3)",
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast bg-[#0F2535] text-[#F5F0E8] border border-[rgba(176,120,72,0.3)] shadow-2xl rounded-xl font-outfit text-sm py-3.5 px-4 flex gap-3 items-center w-full",
          title: "text-[#F5F0E8] font-bold",
          description: "text-[#8A9BB0] text-xs",
          actionButton: "bg-[#B07848] text-white",
          cancelButton: "bg-transparent text-[#8A9BB0]",
          success: "text-emerald-400",
          error: "text-rose-400",
          warning: "text-amber-400",
          info: "text-blue-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
