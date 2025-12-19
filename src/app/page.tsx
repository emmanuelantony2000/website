import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col gap-10 p-6 xl:px-10 lg:flex-row lg:items-center">
      <div className="flex-1 space-y-6">
        <div className="inline-flex items-center gap-3 rounded-full border border-border/50 bg-background/70 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Systems Engineer
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Emmanuel{" "}
            <span className="text-muted-foreground text-2xl sm:text-3xl">
              /ɛˈmænjuːəl/
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            I build resilient systems and thoughtful developer tooling.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:shadow-md"
          >
            Read the blog
          </Link>
          <a
            href="#contact"
            className="rounded-full border border-border px-5 py-2 text-sm font-medium transition hover:border-foreground/50"
          >
            Contact me
          </a>
        </div>
      </div>

      <div className="relative flex-1">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-transparent to-emerald-200/30 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_40%)]" />
          <img
            src="/home.jpeg"
            alt="Portrait of Emmanuel"
            className="relative aspect-square w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
