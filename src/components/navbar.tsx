"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { Moon, Search, SunMedium } from "lucide-react";

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
  const { setOpenSearch } = useSearchContext();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed inset-x-0 bottom-4 top-auto z-40 w-full px-4 xl:sticky xl:top-4 xl:bottom-auto">
      <div className="mx-auto flex w-fit items-center justify-center gap-1 rounded-full border border-border/40 bg-background/40 p-1 backdrop-blur-sm md:p-1.5">
        <NavigationMenu viewport={isMobile}>
          <NavigationMenuList className="flex-wrap justify-center gap-1">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  "flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  pathname === "/" &&
                  "bg-accent text-accent-foreground shadow-sm",
                )}
              >
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  "flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  pathname?.startsWith("/blog") &&
                  "bg-accent text-accent-foreground shadow-sm",
                )}
              >
                <Link href="/blog">Blog</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1 pl-1 md:pl-0">
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            aria-keyshortcuts="Meta+K Control+K"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <span className="hidden rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground/80 sm:inline-block">
              ⌘K
            </span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <SunMedium className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
