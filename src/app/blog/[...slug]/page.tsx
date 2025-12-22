import { source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";

export default async function Page(props: PageProps<"/blog/[...slug]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const meta = page.data;
  const image = meta.image?.src
    ? "/blog/" + page.slugs.join("/") + "/" + meta.image.src
    : undefined;
  const MDX = meta.body;

  return (
    <DocsPage
      toc={meta.toc}
      full={meta.full}
      tableOfContent={{
        style: "clerk",
      }}
    >
      <DocsTitle>{meta.title}</DocsTitle>
      <DocsDescription>{meta.description}</DocsDescription>

      {meta.tags && meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {meta.tags.map((tag) => (
            <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
              <Badge variant="secondary" className="hover:bg-secondary/80">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {image && (
        <img
          src={image}
          alt={meta.image?.alt ?? meta.title}
          className="rounded-xl w-full mb-8"
        />
      )}

      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/blog/[...slug]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  const meta = page.data;
  const image = meta.image?.src
    ? "/blog/" + page.slugs.join("/") + "/" + meta.image.src
    : undefined;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: image
      ? {
          title: meta.title,
          description: meta.description,
          images: [
            {
              url: image,
              alt: meta.image?.alt ?? meta.title,
            },
          ],
        }
      : undefined,
  };
}
