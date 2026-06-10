import { getCollection } from "astro:content";
import { renderBlogOg } from "../../lib/og/render";

export const prerender = true;

export async function GET() {
  const posts = await getCollection("blog");
  posts.sort((a, b) => {
    const da = a.data.date ? new Date(a.data.date).getTime() : 0;
    const db = b.data.date ? new Date(b.data.date).getTime() : 0;
    return db - da;
  });

  return new Response(
    await renderBlogOg(
      posts.map((post) => ({
        title: post.data.title,
        description: post.data.description,
        tags: post.data.tags,
        date: post.data.date,
      })),
    ),
    {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
