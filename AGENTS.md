<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Drivers Hub website

Public marketing site for Drivers Hub (drivershub.lk).
Read PROJECT.md first.

## Stack

Next.js 16 App Router, TypeScript, Tailwind v4. Read the installed docs in `node_modules/next/dist/docs/` before adding APIs.

## Rules

- Marketing site only. Do not build booking, auth, or admin.
- Server Components by default. `"use client"` only for header menu, form UX, sticky WhatsApp.
- One H1 per page. Unique metadata on every route.
- Copy and prices come from `content/*`. Do not hardcode prices in random components.
- Visual system: marble + liquid glass from PROJECT.md. Do not use the old WordPress dark theme as the layout.
- Brand name: Drivers Hub. Do not use DriveElite on the public site.
- Format money as LKR. Phone links use +94771410588.
- Keep diffs small. Finish the asked session only.
- Prefer `next/image` and `next/font`. No new animation libraries unless asked.
