import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";

export default function BlogLayout({ children }: LayoutProps<"/blog">) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions()}
      sidebar={{ enabled: false }}
    >
      {children}
    </DocsLayout>
  );
}
