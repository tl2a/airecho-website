# GitHub Releases API

The website's download section gets current platform builds and download
statistics from the public AirEcho desktop repository:

- Repository: [`tl2a/airecho-desktop`](https://github.com/tl2a/airecho-desktop)
- Releases API: `https://api.github.com/repos/tl2a/airecho-desktop/releases`
- Download endpoint: `/api/downloads`

## Request flow

`GET /api/downloads` runs on the server and requests releases from GitHub with
`per_page=100`. It follows GitHub's `Link` header until all pages are retrieved.
GitHub requests use the `application/vnd.github+json` media type and API version
`2022-11-28`.

The upstream fetch is revalidated every 15 minutes. The download section in
`components/download-section.tsx` calls the local endpoint and renders the
returned release details and asset URLs.

## Response

On success, the endpoint returns:

```json
{
  "release": "v0.4.2",
  "releasesCount": 6,
  "totalDownloads": 35,
  "assets": [
    {
      "name": "AirEcho_Desktop-0.4.2-x86_64.AppImage",
      "downloadCount": 4,
      "url": "https://github.com/tl2a/airecho-desktop/releases/download/..."
    }
  ],
  "releasesUrl": "https://github.com/tl2a/airecho-desktop/releases"
}
```

The numbers above are an example, not fixed values. `release` and `assets`
describe the latest non-prerelease release. `totalDownloads` sums GitHub's
`download_count` for every asset on every release returned by the API, including
checksums and prereleases. `releasesCount` is the number of releases returned.

Errors return a JSON object with an `error` message. The endpoint uses `503`
when GitHub is unavailable, `502` for an unexpected GitHub response shape, and
`404` when no stable release exists. The UI provides a link to GitHub Releases
when its request fails.

## Platform asset matching

The UI matches filenames from the latest stable release:

| Platform | Asset selection |
| --- | --- |
| Linux x86_64 | Filename contains `x86_64` and ends in `.AppImage` |
| Linux ARM64 | Filename contains `aarch64` or `arm64` and ends in `.AppImage` |
| macOS Intel | Filename contains `x86_64` and ends in `.dmg` |
| macOS Apple Silicon | Filename contains `aarch64` or `arm64` and ends in `.dmg` |
| Android | First asset ending in `.apk` |
| iOS | First asset ending in `.ipa` |

Windows is labeled “Coming soon” and does not have asset matching.

The Android and iOS cards display the app version extracted from the filename,
for example `AirEcho-v1.3.0.apk` becomes `v1.3.0` and
`AirEcho-v2.0.0-unsigned.ipa` becomes `v2.0.0` (an `-unsigned` suffix is
ignored). The Android card says “Tested on Android 10+”; do not infer mobile
versions from the desktop release tag.

## Install prerequisites

The section below the platform cards explains what each build needs. Update it
when these requirements change:

- **Desktop (Linux, macOS, Windows):** requires
  [croc](https://github.com/schollz/croc#install). Commands shown: `brew install
  croc`, `curl https://getcroc.com | bash`, and `scoop install croc`.
- **iOS:** the IPA is unsigned and must be sideloaded with a tool such as
  Sideloadly or AltStore, using the visitor's Apple ID.

When publishing releases, keep the platform and architecture identifiers in
asset names consistent with these matching rules. The direct URLs are GitHub's
`browser_download_url` values.

## Token configuration and security

`GITHUB_API_TOKEN` is optional because the repository and releases are public.
When configured, the route sends it as a bearer token in the server-to-GitHub
request to raise the API rate limit.

Configure the token as a server-side environment secret in the hosting
environment. Never use a `NEXT_PUBLIC_` variable for it, return it from the
endpoint, include it in a URL, or log it. Do not commit credentials or
environment files. Do not add a token to the browser's request to `/api/downloads`.

## Troubleshooting

- **No download button for a platform:** check that the latest stable release
  has an asset whose filename matches the platform patterns above.
- **Android or iOS version is missing:** check that the file ends in `.apk` or
  `.ipa` and contains a version such as `v1.3.0` immediately before the
  extension (or before `-unsigned.ipa`).
- **GitHub returns an error:** verify that the public releases endpoint is
  available and, if configured, that the server-side token is valid and within
  its rate limit.
- **Counts look higher than installer downloads:** the displayed aggregate
  includes every release asset, including checksum files.
