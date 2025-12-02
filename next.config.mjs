import { createMDX } from "fumadocs-mdx/next";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
