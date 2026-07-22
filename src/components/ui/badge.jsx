import * as React from "react";
import { cn } from "../../lib/utils";

const variantStyles = {
  default: "bg-gray-100 text-gray-800 border border-gray-200",
  primary: "bg-blue-100 text-blue-700 border border-blue-200",
  success: "bg-green-100 text-green-700 border border-green-200",
  warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  danger: "bg-red-100 text-red-700 border border-red-200",
  info: "bg-cyan-100 text-cyan-700 border border-cyan-200",
};

const Badge = React.forwardRef(
  ({ className, variant = "default", children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        "transition-colors duration-200",
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
);
Badge.displayName = "Badge";

export { Badge };
