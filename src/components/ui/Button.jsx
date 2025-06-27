import React from "react";
import { cn } from "@/lib/utils"; // assuming cn is a utility for conditional classNames

export function Button({ className, variant = "default", ...props }) {
  return (
    <button
      className={cn(
        "btn",
        variant === "outline" ? "btn-outline" : "",
        className
      )}
      {...props}
    />
  );
}
