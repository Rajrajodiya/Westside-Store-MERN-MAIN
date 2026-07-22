import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * DropdownMenu — shadcn-ui style dropdown component.
 * Simplified for CRA compatibility (no @radix-ui dependency).
 */

const DropdownMenu = ({ open, onOpenChange, children }) => {
  return <div className="relative inline-block">{children}</div>;
};

const DropdownMenuTrigger = React.forwardRef(
  ({ className, asChild = false, children, ...props }, ref) => {
    // asChild-compatible: just render the children directly if asChild
    if (asChild) {
      return React.cloneElement(React.Children.only(children), {
        ref,
        ...props,
      });
    }
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2",
          "rounded-md px-3 py-1.5 text-sm font-medium",
          "text-white/80 hover:text-white hover:bg-white/10",
          "transition-colors focus:outline-none",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef(
  ({ className, align = "end", sideOffset = 4, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-xl border",
        "border-white/10 bg-black/90 backdrop-blur-xl",
        "shadow-2xl animate-in fade-in slide-in-from-top-2",
        className
      )}
      style={{
        position: "absolute",
        right: align === "end" ? 0 : "auto",
        left: align === "start" ? 0 : "auto",
        top: "calc(100% + 4px)",
      }}
      {...props}
    />
  )
);
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(
  ({ className, inset, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2",
        "rounded-lg px-3 py-2 text-sm outline-none",
        "text-white/80 hover:text-white hover:bg-white/10",
        "transition-colors cursor-pointer",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-white/10", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// ── Minimal Dropdown Controller Hook ──────────────────────────────
function useDropdown() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  return { open, setOpen, ref };
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  useDropdown,
};
