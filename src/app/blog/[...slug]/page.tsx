import { source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";

export default async function Page(props: PageProps<"/blog/[...slug]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const meta = page.data;
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

      {meta.image?.src && (
        <img
          src={meta.image.src}
          alt={meta.image.alt ?? meta.title}
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

  return {
    title: meta.title,
    description: meta.description,
    openGraph: meta.image?.src
      ? {
          title: meta.title,
          description: meta.description,
          images: [
            {
              url: meta.image?.src,
              alt: meta.image?.alt ?? meta.title,
            },
          ],
        }
      : undefined,
  };
}
