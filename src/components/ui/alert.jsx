import * as React from "react";
import { cn } from "../../lib/utils";

const variantStyles = {
  default: "border border-white/10 bg-white/5 text-white",
  success: "border border-green-500/20 bg-green-500/10 text-green-400",
  error: "border border-red-500/20 bg-red-500/10 text-red-400",
  warning: "border border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  info: "border border-blue-500/20 bg-blue-500/10 text-blue-400",
};

const Alert = React.forwardRef(
  ({ className, variant = "default", children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "rounded-xl px-4 py-3 text-sm text-center",
        "transition-all duration-200",
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Alert.displayName = "Alert";

export { Alert };
