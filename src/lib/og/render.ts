import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const require = createRequire(import.meta.url);

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

type OgChild = string | number | OgNode | OgChild[] | null | undefined | false;
type OgStyle = Record<string, string | number | undefined>;
type OgNode = {
  type: string;
  props: Record<string, unknown>;
};

export type OgPost = {
  title: string;
  description?: string;
  tags?: string[];
  date?: string;
};

const colors = {
  bg: "#090b0b",
  bgSoft: "#151819",
  fg: "#f5f5f5",
  fgDim: "#d8d8d8",
  muted: "#a3a4ad",
  faint: "#777984",
  border: "rgba(255,255,255,0.12)",
  borderStrong: "rgba(255,255,255,0.18)",
  surface: "rgba(255,255,255,0.045)",
  surfaceStrong: "rgba(255,255,255,0.075)",
  primary: "#ebebec",
  primaryFg: "#202123",
  green: "#41c777",
};

let fontPromise:
  | Promise<
      Array<{
        name: string;
        data: Buffer;
        weight: 400 | 600 | 700;
        style: "normal";
      }>
    >
  | undefined;
let portraitPromise: Promise<string> | undefined;

function h(
  type: string,
  props: Record<string, unknown> = {},
  ...children: OgChild[]
): OgNode {
  const flatChildren = children
    .flat(Infinity)
    .filter(
      (child) => child !== null && child !== undefined && child !== false,
    );
  const nextProps = { ...props };
  if (type === "div") {
    const style = (nextProps.style as OgStyle | undefined) ?? {};
    nextProps.style = {
      ...style,
      display: style.display ?? "flex",
    };
  }
  return {
    type,
    props: {
      ...nextProps,
      children: flatChildren.length === 1 ? flatChildren[0] : flatChildren,
    },
  };
}

function loadFonts() {
  fontPromise ??= Promise.all([
    readFile(
      require.resolve("@fontsource/inter/files/inter-latin-400-normal.woff"),
    ),
    readFile(
      require.resolve("@fontsource/inter/files/inter-latin-600-normal.woff"),
    ),
    readFile(
      require.resolve("@fontsource/inter/files/inter-latin-700-normal.woff"),
    ),
  ]).then(([regular, semibold, bold]) => [
    { name: "Inter", data: regular, weight: 400, style: "normal" },
    { name: "Inter", data: semibold, weight: 600, style: "normal" },
    { name: "Inter", data: bold, weight: 700, style: "normal" },
  ]);
  return fontPromise;
}

async function loadPortraitDataUri() {
  portraitPromise ??= readFile(
    join(process.cwd(), "src/assets/home.jpeg"),
  ).then((buffer) => {
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  });
  return portraitPromise;
}

function absoluteFill(style: OgStyle = {}) {
  return {
    position: "absolute",
    ...style,
  };
}

function root(children: OgChild) {
  return h(
    "div",
    {
      style: {
        position: "relative",
        display: "flex",
        width: `${OG_WIDTH}px`,
        height: `${OG_HEIGHT}px`,
        overflow: "hidden",
        backgroundColor: colors.bg,
        color: colors.fg,
        fontFamily: "Inter",
      },
    },
    backgroundTexture(),
    h("div", { style: absoluteFill({ inset: 0, display: "flex" }) }, children),
  );
}

function backgroundTexture() {
  const rings = Array.from({ length: 17 }, (_, index) =>
    h("div", {
      style: absoluteFill({
        right: -250 + index * 28,
        top: -255 + index * 20,
        width: 760 + index * 34,
        height: 760 + index * 34,
        borderRadius: 9999,
        border: "1px solid rgba(255,255,255,0.035)",
      }),
    }),
  );

  const threads = Array.from({ length: 34 }, (_, index) =>
    h("div", {
      style: absoluteFill({
        left: 80 + index * 34,
        top: -80 + index * 12,
        width: 1,
        height: 920,
        backgroundColor: "rgba(255,255,255,0.018)",
        transform: "rotate(-24deg)",
      }),
    }),
  );

  return h(
    "div",
    {
      style: absoluteFill({
        inset: 0,
        display: "flex",
        backgroundColor: colors.bg,
      }),
    },
    h("div", {
      style: absoluteFill({
        inset: 0,
        backgroundColor: colors.bgSoft,
        opacity: 0.38,
      }),
    }),
    rings,
    threads,
    h("div", {
      style: absoluteFill({
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.28)",
      }),
    }),
  );
}

function badge(label: string, dot = false) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderRadius: 999,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
        padding: "8px 17px",
        color: colors.muted,
        fontSize: 16,
        fontWeight: 400,
      },
    },
    dot &&
      h("div", {
        style: {
          width: 8,
          height: 8,
          borderRadius: 999,
          backgroundColor: colors.green,
        },
      }),
    label,
  );
}

function tag(label: string, fontSize = 15) {
  return h(
    "div",
    {
      style: {
        borderRadius: 999,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.surfaceStrong,
        color: colors.fgDim,
        padding: "6px 14px",
        fontSize,
        fontWeight: 400,
      },
    },
    label,
  );
}

function mark() {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        color: colors.muted,
        fontSize: 17,
      },
    },
    h(
      "div",
      {
        style: {
          width: 34,
          height: 34,
          borderRadius: 999,
          border: `1px solid ${colors.borderStrong}`,
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontWeight: 600,
        },
      },
      "ea",
    ),
    "emmanuelantony.com",
  );
}

type SocialIcon = "email" | "github" | "x" | "linkedin";

const socialIconPaths: Record<Exclude<SocialIcon, "email">, string> = {
  github:
    "M12 1.5A10.5 10.5 0 0 0 8.7 22a.55.55 0 0 0 .73-.53v-1.9c-2.9.63-3.52-1.4-3.52-1.4-.48-1.2-1.16-1.53-1.16-1.53-.95-.65.07-.64.07-.64 1.05.07 1.6 1.08 1.6 1.08.94 1.6 2.45 1.14 3.05.87.1-.68.37-1.14.66-1.4-2.32-.27-4.76-1.16-4.76-5.16 0-1.14.41-2.07 1.07-2.8-.1-.27-.46-1.33.1-2.77 0 0 .88-.28 2.88 1.07a9.9 9.9 0 0 1 5.24 0c2-1.35 2.87-1.07 2.87-1.07.57 1.44.21 2.5.1 2.77.67.73 1.07 1.66 1.07 2.8 0 4.01-2.44 4.88-4.77 5.14.38.33.71.97.71 1.96v2.9c0 .29.2.62.74.52A10.5 10.5 0 0 0 12 1.5Z",
  x: "M17.5 3h3l-7 8 8.2 10h-6.4l-5-6.1L7.8 21H4.7l7.4-8.5L4.2 3h6.5l4.5 5.6L17.5 3Zm-1.1 16h1.7L8.3 4.8H6.5L16.4 19Z",
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9V9Z",
};

function socialIcon(name: SocialIcon, size: number, color: string) {
  if (name === "email") {
    return h(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
      h("rect", { x: 2.5, y: 4.5, width: 19, height: 15, rx: 2.5 }),
      h("path", { d: "m3 6 9 6 9-6" }),
    );
  }
  return h(
    "svg",
    { width: size, height: size, viewBox: "0 0 24 24", fill: color },
    h("path", { d: socialIconPaths[name] }),
  );
}

function titleSize(title: string) {
  if (title.length > 76) return 60;
  if (title.length > 54) return 68;
  return 84;
}

function postCard(post: OgPost) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 22,
        borderRadius: 20,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
      },
    },
    h(
      "div",
      {
        style: {
          color: colors.fg,
          fontSize: 22,
          fontWeight: 600,
          lineHeight: 1.18,
        },
      },
      post.title,
    ),
    h(
      "div",
      { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
      (post.tags ?? []).slice(0, 3).map((item) => tag(item, 13)),
    ),
  );
}

async function render(node: OgNode) {
  const svg = await satori(node, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: await loadFonts(),
  });
  return new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: OG_WIDTH,
    },
  })
    .render()
    .asPng();
}

export async function renderHomeOg() {
  const portrait = await loadPortraitDataUri();
  return render(
    root(
      h(
        "div",
        {
          style: {
            display: "flex",
            width: OG_WIDTH,
            height: OG_HEIGHT,
            padding: 72,
            gap: 48,
            alignItems: "center",
          },
        },
        h(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              flex: 1,
            },
          },
          badge("Systems Engineer", true),
          h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "flex-end",
                marginTop: 28,
              },
            },
            h(
              "div",
              {
                style: {
                  fontSize: 74,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                },
              },
              "Emmanuel",
            ),
          ),
          h(
            "div",
            {
              style: {
                marginTop: 22,
                maxWidth: 560,
                fontSize: 27,
                lineHeight: 1.4,
                color: colors.muted,
              },
            },
            "I build resilient systems and thoughtful developer tooling.",
          ),
          h("div", { style: { marginTop: 44 } }, mark()),
        ),
        h(
          "div",
          {
            style: {
              width: 450,
              height: 450,
              borderRadius: 24,
              overflow: "hidden",
              border: `1px solid ${colors.borderStrong}`,
              display: "flex",
            },
          },
          h("img", {
            src: portrait,
            width: 450,
            height: 450,
            style: {
              width: 450,
              height: 450,
              objectFit: "cover",
            },
          }),
        ),
      ),
    ),
  );
}

export async function renderBlogOg(posts: OgPost[]) {
  return render(
    root(
      h(
        "div",
        {
          style: {
            display: "flex",
            width: OG_WIDTH,
            height: OG_HEIGHT,
            padding: 72,
            gap: 48,
            alignItems: "center",
          },
        },
        h(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              height: "100%",
              flex: 1,
            },
          },
          badge("Writing"),
          h(
            "div",
            { style: { display: "flex", flexDirection: "column" } },
            h(
              "div",
              {
                style: {
                  fontSize: 76,
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                },
              },
              "The Blog",
            ),
            h(
              "div",
              {
                style: {
                  marginTop: 18,
                  maxWidth: 500,
                  fontSize: 25,
                  lineHeight: 1.4,
                  color: colors.muted,
                },
              },
              "Notes on Rust, distributed systems & developer tooling.",
            ),
          ),
          mark(),
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 16,
              width: 520,
            },
          },
          posts.slice(0, 3).map((post) => postCard(post)),
        ),
      ),
    ),
  );
}

export async function renderPostOg(post: OgPost) {
  const portrait = await loadPortraitDataUri();
  return render(
    root(
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: OG_WIDTH,
            height: OG_HEIGHT,
            padding: 72,
          },
        },
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: 14 } },
          badge("Blog", true),
          h(
            "div",
            { style: { display: "flex", gap: 9, flexWrap: "wrap" } },
            (post.tags ?? []).slice(0, 4).map((item) => tag(item, 16)),
          ),
        ),
        h(
          "div",
          {
            style: {
              maxWidth: 800,
              fontSize: titleSize(post.title),
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
              color: colors.fg,
            },
          },
          post.title,
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 14,
              width: "100%",
            },
          },
          h("img", {
            src: portrait,
            width: 46,
            height: 46,
            style: {
              width: 46,
              height: 46,
              borderRadius: 999,
              objectFit: "cover",
              border: `1px solid ${colors.borderStrong}`,
            },
          }),
          h(
            "div",
            {
              style: {
                fontSize: 20,
                color: colors.fgDim,
                fontWeight: 600,
              },
            },
            "Emmanuel Antony",
          ),
          h("div", { style: { flex: 1 } }),
          mark(),
        ),
      ),
    ),
  );
}

export async function renderContactOg() {
  const portrait = await loadPortraitDataUri();
  const links: Array<{ label: string; icon: SocialIcon }> = [
    { label: "hello@emmanuelantony.com", icon: "email" },
    { label: "github.com/emmanuelantony2000", icon: "github" },
    { label: "@emmanuelantony5", icon: "x" },
    { label: "in/emmanuel-antony", icon: "linkedin" },
  ];
  return render(
    root(
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: OG_WIDTH,
            height: OG_HEIGHT,
            padding: 72,
          },
        },
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: 24 } },
          h("img", {
            src: portrait,
            width: 92,
            height: 92,
            style: {
              width: 92,
              height: 92,
              borderRadius: 999,
              objectFit: "cover",
              border: `1px solid ${colors.borderStrong}`,
            },
          }),
          h(
            "div",
            { style: { display: "flex", flexDirection: "column" } },
            h(
              "div",
              { style: { fontSize: 30, fontWeight: 700, color: colors.fg } },
              "Emmanuel Antony",
            ),
            h(
              "div",
              { style: { marginTop: 6, fontSize: 20, color: colors.muted } },
              "Systems Engineer",
            ),
          ),
        ),
        h(
          "div",
          {
            style: {
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: colors.fg,
            },
          },
          "Get in touch.",
        ),
        h(
          "div",
          { style: { display: "flex", flexWrap: "wrap", gap: 12 } },
          links.map((link) =>
            h(
              "div",
              {
                style: {
                  alignItems: "center",
                  gap: 10,
                  borderRadius: 999,
                  border: `1px solid ${colors.borderStrong}`,
                  backgroundColor: colors.surface,
                  color: colors.fgDim,
                  padding: "12px 20px",
                  fontSize: 18,
                },
              },
              socialIcon(link.icon, 20, colors.fgDim),
              link.label,
            ),
          ),
        ),
      ),
    ),
  );
}
