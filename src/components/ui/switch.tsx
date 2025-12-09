"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked = false, onCheckedChange, className, ...props }, ref) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200",
          checked ? "bg-wa-accent" : "bg-slate-700",
          "border border-slate-600 hover:border-wa-accent/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wa-accent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-slate-900 transform transition-all duration-200 shadow",
            checked ? "translate-x-4" : "translate-x-1"
          )}
        />
        <input
          ref={ref}
          {...props}
          type="checkbox"
          className="hidden"
          checked={checked}
          readOnly
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";
