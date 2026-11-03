<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Guidelines

## Project

AirEcho's marketing site is built with Next.js App Router, React, Tailwind CSS v4, and shadcn/ui. Use Bun for project scripts.

## GitHub downloads

- Keep GitHub API requests and `GITHUB_API_TOKEN` server-side. Never expose the token through client code, `NEXT_PUBLIC_*`, rendered props, URLs, or logs.
- The token is optional for the public releases endpoint. Never read or inspect environment files.
- When changing download behavior, asset matching, caching, or error handling, update and follow [docs/GITHUB-API.md](./docs/GITHUB-API.md).

## Validation

- Run `bun run typecheck`, `bun run lint`, and `bun run build` for application code changes.
- Keep project documentation concise and update it when behavior or setup changes.
