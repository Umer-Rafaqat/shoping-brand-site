import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-satoshi font-medium",
  {
    variants: {
      variant: {
        discount: "bg-brand-pink text-brand-red px-2 py-0.5 text-xs",
        dark: "bg-black text-white px-3 py-1 text-xs",
      },
    },
    defaultVariants: { variant: "discount" },
  },
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
