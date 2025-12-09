"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
};

const baseStyles =
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 " +
  "focus:outline-none focus:ring-2 focus:ring-wa-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<string, string> = {
  primary:
    "bg-wa-primary text-white hover:bg-emerald-700 border border-wa-primary shadow-sm",
  outline:
    "border border-slate-700 text-slate-100 hover:bg-wa-surface hover:text-white",
  ghost:
    "text-slate-100 hover:bg-wa-surface hover:text-white border border-transparent",
};

const sizes: Record<string, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-4 text-sm",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
