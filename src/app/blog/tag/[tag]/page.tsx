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
            <div className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <h2 className="text-xl font-semibold group-hover:underline">
                {page.data.title}
              </h2>
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
        tags.add(tag);
      }
    }
  }
  return Array.from(tags).map((tag) => ({
    tag: tag,
  }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  return params.then((p) => ({
    title: `Posts tagged with ${decodeURIComponent(p.tag)}`,
    description: `Browse blog posts tagged with ${decodeURIComponent(p.tag)}`,
  }));
}
