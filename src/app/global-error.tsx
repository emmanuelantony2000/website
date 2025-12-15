"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // Cloudflare Pages requires html/body here because this renders outside the root layout.
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-lg rounded-2xl border border-border/50 bg-card/80 p-8 text-center shadow-lg backdrop-blur">
          <h1 className="text-3xl font-semibold">Something went wrong</h1>
          <p className="mt-3 text-muted-foreground">
            An unexpected error occurred. You can retry the last action or head
            back home.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:shadow-md"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-full border border-border px-5 py-2 text-sm font-medium transition hover:border-foreground/50"
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
