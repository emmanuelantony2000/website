import { getCollection } from "astro:content";
import { renderPostOg } from "../../../lib/og/render";

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => {
    const slug = post.id.replace(/\/index$/, "").replace(/\//g, "/");
    return {
      params: { slug },
      props: { post },
    };
  });
}

export async function GET({ props }) {
  const { post } = props;

  return new Response(
    await renderPostOg({
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags,
      date: post.data.date,
    }),
    {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
