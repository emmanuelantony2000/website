import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function Page(props: {
  params: Promise<{ tag: string }>;
}) {
  const params = await props.params;
  const tag = decodeURIComponent(params.tag);

  const pages = source.getPages().filter((page) => {
    return page.data.tags?.includes(tag);
  });

  if (pages.length === 0) notFound();

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-3xl font-bold">Posts tagged with "{tag}"</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {pages.map((page) => (
          <Link key={page.url} href={page.url} className="group">
            <div className="flex flex-col gap-2 rounded-lg p-4 transition-[backdrop-filter] hover:backdrop-blur-xl bg-white/10 dark:bg-black/30 backdrop-blur-xs border border-white/20 dark:border-white/10 shadow-lg">
              <h2 className="text-xl font-semibold">{page.data.title}</h2>
              <p className="text-muted-foreground line-clamp-2">
                {page.data.description}
              </p>
              <div className="mt-2 flex gap-2">
                {page.data.tags?.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  const tags = new Set<string>();
  for (const page of source.getPages()) {
    if (page.data.tags) {
      for (const tag of page.data.tags) {
        tags.add(encodeURIComponent(tag));
      }
    }
  }
  return Array.from(tags).map((tag) => ({
    tag: tag,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;

  return {
    title: `Posts tagged with ${decodeURIComponent(tag)}`,
    description: `Browse blog posts tagged with ${decodeURIComponent(tag)}`,
  };
}
