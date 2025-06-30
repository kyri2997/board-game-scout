import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ToggleGroup container styles (optional)
const toggleGroupVariants = cva(
  "inline-flex flex-wrap gap-2 rounded-md bg-muted p-1",
  {
    variants: {
      size: {
        default: "",
        sm: "gap-1",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

// Toggle item styles with color variants and selected state
const toggleItemVariants = cva(
  "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 data-[state=on]:border-black data-[state=on]:border-2",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-8 px-2 text-xs",
        lg: "h-12 px-4 text-base",
      },
      variant: {
        default: "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-black",
        yellow: "bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border border-yellow-300",
        blue: "bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300",
        green: "bg-green-100 hover:bg-green-200 text-green-900 border border-green-300",
        pink: "bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-300",
        purple: "bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const ToggleGroup = React.forwardRef(
  ({ className, size, type = "single", ...props }, ref) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      type={type}
      className={cn(toggleGroupVariants({ size }), className)}
      {...props}
    />
  )
);
ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = React.forwardRef(
  ({ className, size, variant, ...props }, ref) => (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(toggleItemVariants({ size, variant }), className)}
      {...props}
    />
  )
);
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
