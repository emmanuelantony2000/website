# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and blog website built with Astro 5, TypeScript, and Tailwind CSS 4. Static site with near-zero JavaScript. Uses Astro content collections for blog posts and Pagefind for search.

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build static site (outputs to /dist) + generate Pagefind search index
pnpm preview  # Preview production build
```

No testing or linting setup exists in this project.

## Architecture

### Content System
- **Blog posts**: MDX files in `src/content/blog/` with frontmatter (title, description, tags, date, image)
- **Content collections**: Astro content collections with Zod validation in `src/content.config.ts`
- **Content API**: `getCollection('blog')` and `render(entry)` from `astro:content`

### Key Components
- `src/components/Navbar.astro` - Navigation with search trigger + theme toggle (inline SVG icons)
- `src/components/Search.astro` - `<dialog>` with Pagefind integration, Cmd+K shortcut
- `src/components/Toc.astro` - Table of contents with IntersectionObserver sliding thumb
- `src/components/BlogCard.astro` - Card for blog listing
- `src/components/Badge.astro` - Tag badge

### Layouts
- `src/layouts/Base.astro` - HTML shell, theme script, ViewTransitions, canvas bg, navbar
- `src/layouts/Post.astro` - Extends Base, adds TOC sidebar for blog posts

### Pages
- `src/pages/index.astro` - Home/portfolio
- `src/pages/blog/index.astro` - Blog listing
- `src/pages/blog/[...slug].astro` - Blog post (uses Post layout)
- `src/pages/blog/tag/index.astro` - All tags
- `src/pages/blog/tag/[tag].astro` - Posts by tag
- `src/pages/404.astro` - Not found page

### Configuration
- Static output (Astro default)
- Path alias: `@/*` maps to `./src/*`
- PostCSS with `@tailwindcss/postcss`

### Styling
- Tailwind CSS 4 with custom OKLch color theme in `src/styles/globals.css`
- Dark/light mode via vanilla JS (class on `<html>`, localStorage)
- No UI component library — all Astro components

### Canvas Background
- Perlin noise flow field with 4500 particles, inline `<script>` in Base.astro
- Persists across page transitions via `transition:persist`
- Listens for `theme-change` custom event to swap colors

### Search
- Pagefind runs as post-build CLI (`npx pagefind --site dist`)
- Lazy-loaded on first Cmd+K open (~50KB)
- No search index during dev
