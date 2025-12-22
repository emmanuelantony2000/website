import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { source } from "@/lib/source";

export const metadata: Metadata = {
  title: "Emmanuel Antony | Blog by tag",
  description: "Browse blog posts filtered by tags.",
};

export default function TagPage() {
  const pages = source.getPages();
  const tagCounts = pages.reduce<Record<string, number>>((acc, page) => {
    (page.data.tags ?? []).forEach((tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
    });
    return acc;
  }, {});

  const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-3xl font-bold">All Tags</h1>
      <div className="flex flex-wrap gap-4">
        {tags.map(([tag, count]) => (
          <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
            <Badge className="text-lg px-4 py-2 hover:scale-105 transition-transform">
              {tag} ({count})
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
