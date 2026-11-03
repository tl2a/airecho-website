const repository = "tl2a/airecho-desktop"
const releasesUrl = `https://api.github.com/repos/${repository}/releases?per_page=100`
const githubReleasesUrl = `https://github.com/${repository}/releases`

interface GitHubAsset {
  name: string
  download_count: number
  browser_download_url: string
}

interface GitHubRelease {
  tag_name: string
  prerelease: boolean
  assets: GitHubAsset[]
}

function isGitHubReleaseList(value: unknown): value is GitHubRelease[] {
  return (
    Array.isArray(value) &&
    value.every(
      (release) =>
        typeof release?.tag_name === "string" &&
        typeof release?.prerelease === "boolean" &&
        Array.isArray(release?.assets) &&
        release.assets.every(
          (asset: unknown) =>
            typeof asset === "object" &&
            asset !== null &&
            "name" in asset &&
            typeof asset.name === "string" &&
            "download_count" in asset &&
            typeof asset.download_count === "number" &&
            "browser_download_url" in asset &&
            typeof asset.browser_download_url === "string"
        )
    )
  )
}

function nextPageUrl(linkHeader: string | null) {
  const nextLink = linkHeader
    ?.split(",")
    .find((link) => link.includes('rel="next"'))
  const nextUrl = nextLink?.match(/<([^>]+)>/)?.[1]

  if (!nextUrl) return null

  const url = new URL(nextUrl)
  if (
    url.protocol !== "https:" ||
    url.hostname !== "api.github.com" ||
    !url.pathname.endsWith(`/repos/${repository}/releases`)
  ) {
    throw new Error("GitHub returned an unexpected releases page URL.")
  }

  return url.toString()
}

export async function GET() {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  })
  const token = process.env.GITHUB_API_TOKEN
  if (token) headers.set("Authorization", `Bearer ${token}`)

  try {
    const releases: GitHubRelease[] = []
    let url: string | null = releasesUrl

    while (url) {
      const response = await fetch(url, {
        headers,
        next: { revalidate: 900 },
      })

      if (!response.ok) {
        return Response.json(
          { error: "GitHub release information is temporarily unavailable." },
          { status: 503 }
        )
      }

      const payload: unknown = await response.json()
      if (!isGitHubReleaseList(payload)) {
        return Response.json(
          { error: "GitHub returned release data in an unexpected format." },
          { status: 502 }
        )
      }

      releases.push(...payload)
      url = nextPageUrl(response.headers.get("link"))
    }

    const latestRelease = releases.find((release) => !release.prerelease)
    if (!latestRelease) {
      return Response.json(
        { error: "No stable AirEcho release is available yet." },
        { status: 404 }
      )
    }

    const assets = latestRelease.assets.map((asset) => ({
      name: asset.name,
      downloadCount: asset.download_count,
      url: asset.browser_download_url,
    }))
    const totalDownloads = releases.reduce(
      (total, release) =>
        total +
        release.assets.reduce(
          (releaseTotal, asset) => releaseTotal + asset.download_count,
          0
        ),
      0
    )

    return Response.json({
      release: latestRelease.tag_name,
      releasesCount: releases.length,
      totalDownloads,
      assets,
      releasesUrl: githubReleasesUrl,
    })
  } catch {
    return Response.json(
      { error: "Could not connect to GitHub. Please try again later." },
      { status: 503 }
    )
  }
}
