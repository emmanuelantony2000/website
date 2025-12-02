"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 bottom-4 top-auto z-40 w-full px-4 xl:sticky xl:top-4 xl:bottom-auto">
      <div className="mx-auto flex w-fit items-center justify-center rounded-full border border-border/40 bg-background/40 p-1 backdrop-blur-sm md:p-1.5">
        <NavigationMenu viewport={isMobile}>
          <NavigationMenuList className="flex-wrap justify-center">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "rounded-full px-4 py-1.5",
                  pathname === "/" &&
                    "bg-background/70 text-foreground shadow-sm backdrop-blur-sm",
                )}
              >
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "rounded-full px-4 py-1.5",
                  pathname?.startsWith("/blog") &&
                    "bg-background/70 text-foreground shadow-sm backdrop-blur-sm",
                )}
              >
                <Link href="/blog">Blog</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
