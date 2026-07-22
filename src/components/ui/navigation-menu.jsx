import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * NavigationMenu — shadcn-ui style navigation component.
 * Simplified for CRA compatibility (no @radix-ui dependency).
 */

const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn(
      "relative z-10 flex items-center",
      className
    )}
    {...props}
  >
    {children}
  </nav>
));
NavigationMenu.displayName = "NavigationMenu";

const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-1",
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("relative", className)} {...props} />
));
NavigationMenuItem.displayName = "NavigationMenuItem";

const NavigationMenuLink = React.forwardRef(
  ({ className, active, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "group inline-flex h-9 w-max items-center justify-center rounded-md px-3 py-2",
        "text-sm font-medium transition-colors",
        "hover:bg-white/10 hover:text-white",
        "focus:bg-white/10 focus:text-white focus:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        active ? "bg-white/15 text-white" : "text-white/80",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
);
NavigationMenuLink.displayName = "NavigationMenuLink";

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
};
