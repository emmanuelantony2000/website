import { renderContactOg } from "../../lib/og/render";

export const prerender = true;

export async function GET() {
  return new Response(await renderContactOg(), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
