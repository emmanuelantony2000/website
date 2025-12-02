import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
  dir: "content/blog",
  docs: {
    schema: frontmatterSchema.extend({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()).optional(),
      keywords: z.array(z.string()).optional(),
      authors: z.array(z.string()).optional(),
      date: z.string().optional(),
      image: z
        .object({
          src: z.string(),
          alt: z.string(),
        })
        .optional(),
    }),
  },
});

export default defineConfig();
