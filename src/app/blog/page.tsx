import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { source } from "@/lib/source";

export const metadata: Metadata = {
  title: "Emmanuel Antony | Blog",
  description: "Thoughts on systems engineering, tooling, and writing.",
};

export default function BlogPage() {
  const pages = source.getPages();

  if (pages.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {pages.map((page, index) => {
        const isLatest = index === 0;
        const tags = page.data.tags ?? [];
        const cover = page.data.image?.src
          ? "/blog/" + page.slugs.join("/") + "/" + page.data.image.src
          : undefined;

        return (
          <Card
            key={page.url}
            className={cn(
              "group relative overflow-hidden transition-[backdrop-filter] hover:backdrop-blur-xl bg-white/10 dark:bg-black/30 backdrop-blur-xs border border-white/20 dark:border-white/10 shadow-lg",
              isLatest && "md:col-span-2",
            )}
          >
            <div
              className={cn(
                "flex h-full flex-col gap-6 p-6",
                isLatest && "md:flex-row",
              )}
            >
              {cover && (
                <div
                  className={cn(
                    "relative aspect-video w-full overflow-hidden rounded-xl",
                    isLatest
                      ? "md:order-last md:w-1/2 md:aspect-auto"
                      : "aspect-[1.6]",
                  )}
                >
                  <img
                    src={cover}
                    alt={page.data.image?.alt ?? "Blog cover"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              <div
                className={cn(
                  "flex flex-1 flex-col gap-4",
                  isLatest && "md:w-1/2 md:justify-center",
                )}
              >
                <div className="space-y-2">
                  <h2
                    className={cn(
                      "font-semibold tracking-tight",
                      isLatest ? "text-3xl md:text-4xl" : "text-2xl",
                    )}
                  >
                    <Link
                      href={page.url}
                      className="after:absolute after:inset-0 focus:outline-none"
                    >
                      {page.data.title}
                    </Link>
                  </h2>
                  {page.data.description && (
                    <p className="text-muted-foreground md:text-lg text-base line-clamp-3">
                      {page.data.description}
                    </p>
                  )}
                </div>

                {tags.length > 0 && (
                  <div className="relative z-10 mt-auto flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${encodeURIComponent(tag)}`}
                      >
                        <Badge
                          variant="secondary"
                          className="hover:bg-secondary/80 px-2.5 py-0.5"
                        >
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
