# AirEcho website

The AirEcho website introduces the app and links to current Linux, macOS,
Android, and iOS downloads. Download links and counts are retrieved from the public
GitHub Releases API.

## Development

Install dependencies and start the development server:

```bash
bun install
bun run dev
```

Useful checks:

```bash
bun run typecheck
bun run lint
bun run build
```

## GitHub downloads

The site reads release data through its server-side `/api/downloads` route. An
optional `GITHUB_API_TOKEN` can be configured in the deployment environment to
increase the GitHub API rate limit. The site also works without a token because
the release repository is public.

See [docs/GITHUB-API.md](./docs/GITHUB-API.md) for the endpoint response,
platform asset matching, caching, and operational notes.
