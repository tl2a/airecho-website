"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Info,
  Store,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"

interface DownloadAsset {
  name: string
  downloadCount: number
  url: string
}

interface DownloadsResponse {
  release: string
  releasesCount: number
  totalDownloads: number
  assets: DownloadAsset[]
  releasesUrl: string
}

interface PlatformDownload {
  label: string
  asset: DownloadAsset
}

function findAsset(assets: DownloadAsset[], pattern: RegExp) {
  const asset = assets.find((item) => pattern.test(item.name))
  return asset
    ? {
        name: asset.name,
        downloadCount: asset.downloadCount,
        url: asset.url,
      }
    : null
}

// Mobile builds carry the app version in the filename, e.g. AirEcho-v2.0.0.apk
// or AirEcho-v2.0.0-unsigned.ipa.
function getMobileAppVersion(assetName: string | undefined) {
  const version = assetName
    ?.replace(/-unsigned(?=\.ipa$)/i, "")
    .match(
      /(?:^|[-_])v?(\d+\.\d+\.\d+(?:[-+][\w.-]+)?)(?=\.(?:apk|ipa)$)/i
    )?.[1]

  return version ? `v${version}` : undefined
}

function formatDownloads(count: number) {
  return new Intl.NumberFormat("en-US").format(count)
}

function PlatformCard({
  title,
  description,
  logo,
  downloads,
  release,
  releaseLabel = "Latest release",
  releaseFallback = "Free · Open source",
  requirement,
  loading = false,
  error = false,
}: {
  title: string
  description: string
  logo: string
  downloads?: PlatformDownload[]
  release?: string
  releaseLabel?: string
  releaseFallback?: string
  requirement?: { label: string; href: string }
  loading?: boolean
  error?: boolean
}) {
  return (
    <Card className="download-card">
      <CardHeader className="download-card-header">
        <div className="download-card-top">
          <span className="download-icon">
            <Image
              alt=""
              className="download-platform-logo"
              height={72}
              src={logo}
              width={72}
            />
          </span>
          {downloads?.length ? (
            <Badge className="download-available" variant="outline">
              <Check data-icon="inline-start" />
              Available
            </Badge>
          ) : null}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {requirement && (
          <a className="download-requirement" href={requirement.href}>
            <Info aria-hidden="true" />
            {requirement.label}
          </a>
        )}
      </CardHeader>
      <CardContent className="download-card-content">
        {downloads?.length ? (
          <div className="download-actions">
            <a
              className={buttonVariants({ size: "default" })}
              href={downloads[0].asset.url}
              rel="noreferrer"
              target="_blank"
            >
              <Download data-icon="inline-start" />
              Download {downloads[0].label}
            </a>
            {downloads.slice(1).map(({ label, asset }) => (
              <a
                className="download-alternative"
                href={asset.url}
                key={asset.name}
                rel="noreferrer"
                target="_blank"
              >
                <ArrowDownToLine aria-hidden="true" />
                {label} build
              </a>
            ))}
            {downloads.length === 1 && (
              <span
                aria-hidden="true"
                className="download-alternative-spacer"
              />
            )}
          </div>
        ) : (
          <p className="download-unavailable">
            {loading
              ? "Checking latest release…"
              : error
                ? "Release details are unavailable."
                : "No current build found. Check the release page for updates."}
          </p>
        )}
      </CardContent>
      <CardFooter className="download-card-footer">
        <span>
          {release ? `${releaseLabel} · ${release}` : releaseFallback}
        </span>
      </CardFooter>
    </Card>
  )
}

function ComingSoonCard({
  title,
  description,
  logo,
  icon: Icon,
  badge = "Coming soon",
}: {
  title: string
  description: string
  logo?: string
  icon?: typeof Store
  badge?: string
}) {
  return (
    <Card className="download-coming-card">
      <CardContent className="download-coming-content">
        <span className="download-coming-icon">
          {logo ? (
            <Image
              alt=""
              className="download-platform-logo"
              height={72}
              src={logo}
              width={72}
            />
          ) : (
            Icon && <Icon aria-hidden="true" />
          )}
        </span>
        <div className="download-coming-copy">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Badge variant="secondary">{badge}</Badge>
      </CardContent>
    </Card>
  )
}

const crocInstall = [
  {
    os: "macOS",
    command: "brew install croc",
    note: "Uses Homebrew. MacPorts works too: sudo port install croc",
  },
  {
    os: "Linux",
    command: "curl https://getcroc.com | bash",
    note: "Runs croc’s official install script.",
  },
  {
    os: "Windows",
    command: "scoop install croc",
    note: "For when the Windows build arrives. Chocolatey: choco install croc",
  },
]

const sideloadSteps = [
  <>
    Download the <strong>unsigned IPA</strong> above to your computer.
  </>,
  <>
    Install a sideloading tool such as{" "}
    <a href="https://sideloadly.io" target="_blank" rel="noreferrer">
      Sideloadly
    </a>{" "}
    or{" "}
    <a href="https://altstore.io" target="_blank" rel="noreferrer">
      AltStore
    </a>
    .
  </>,
  <>
    Connect your iPhone, open the IPA in the tool, and sign in with your Apple
    ID. It signs and installs AirEcho for your device.
  </>,
  <>
    On iOS 16 or later, turn on <strong>Developer Mode</strong> in Settings →
    Privacy &amp; Security, then restart.
  </>,
  <>
    If iOS asks, trust your Apple ID in Settings → General → VPN &amp; Device
    Management.
  </>,
]

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="setup-command">
      <code>{command}</code>
      <button
        type="button"
        onClick={() =>
          navigator.clipboard.writeText(command).then(() => {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1600)
          })
        }
        aria-label={copied ? "Copied" : `Copy command: ${command}`}
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </button>
    </div>
  )
}

function InstallGuide() {
  const [os, setOs] = useState(0)
  const active = crocInstall[os]

  return (
    <div className="setup-grid">
      <Card className="setup-card" id="setup-desktop">
        <CardHeader>
          <p className="setup-kicker">Desktop · Linux, macOS &amp; Windows</p>
          <CardTitle>Install croc first</CardTitle>
          <CardDescription>
            AirEcho Desktop needs{" "}
            <a
              href="https://github.com/schollz/croc"
              target="_blank"
              rel="noreferrer"
            >
              croc
            </a>
            , a free, open-source transfer tool. Install it once, then open
            AirEcho.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="setup-tabs" role="tablist" aria-label="Your system">
            {crocInstall.map((item, index) => (
              <button
                key={item.os}
                type="button"
                role="tab"
                aria-selected={index === os}
                onClick={() => setOs(index)}
              >
                {item.os}
              </button>
            ))}
          </div>
          <div role="tabpanel" aria-label={active.os}>
            <CopyCommand command={active.command} />
            <p className="setup-note">{active.note}</p>
          </div>
          <a
            className="setup-link"
            href="https://github.com/schollz/croc#install"
            target="_blank"
            rel="noreferrer"
          >
            More install options
            <ArrowUpRight aria-hidden="true" />
          </a>
        </CardContent>
      </Card>

      <Card className="setup-card" id="setup-ios">
        <CardHeader>
          <p className="setup-kicker">iOS · Unsigned IPA</p>
          <CardTitle>Sideload the app</CardTitle>
          <CardDescription>
            AirEcho for iOS isn&apos;t on the App Store yet, so it&apos;s
            installed with your own Apple ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="setup-steps">
            {sideloadSteps.map((step, index) => (
              <li key={index}>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="setup-note">
            With a free Apple ID, the app has to be refreshed in your
            sideloading tool every 7 days.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function DownloadSection() {
  const [data, setData] = useState<DownloadsResponse | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    fetch("/api/downloads", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Download information unavailable")
        return (await response.json()) as DownloadsResponse
      })
      .then(setData)
      .catch(() => {
        if (!controller.signal.aborted) setError(true)
      })

    return () => controller.abort()
  }, [])

  const linuxX64 = data ? findAsset(data.assets, /x86_64.*\.AppImage$/i) : null
  const linuxArm = data
    ? findAsset(data.assets, /(?:aarch64|arm64).*\.AppImage$/i)
    : null
  const macIntel = data ? findAsset(data.assets, /x86_64.*\.dmg$/i) : null
  const macAppleSilicon = data
    ? findAsset(data.assets, /(?:aarch64|arm64).*\.dmg$/i)
    : null
  const android = data ? findAsset(data.assets, /\.apk$/i) : null
  const ios = data ? findAsset(data.assets, /\.ipa$/i) : null

  const linuxDownloads = [
    ...(linuxX64 ? [{ label: "x86_64", asset: linuxX64 }] : []),
    ...(linuxArm ? [{ label: "ARM64", asset: linuxArm }] : []),
  ]
  const macDownloads = [
    ...(macAppleSilicon
      ? [{ label: "Apple Silicon", asset: macAppleSilicon }]
      : []),
    ...(macIntel ? [{ label: "Intel", asset: macIntel }] : []),
  ]
  const androidDownloads = android ? [{ label: "APK", asset: android }] : []
  const iosDownloads = ios ? [{ label: "IPA", asset: ios }] : []

  return (
    <section className="download-section" id="downloads">
      <div className="container">
        <div className="download-heading">
          <div className="download-heading-copy">
            <p className="section-kicker">Downloads</p>
            <h2>One less step between your devices.</h2>
            <p>
              Pick your platform and start sharing over your local network.
              Free, private, and ready when you are.
            </p>
          </div>
          <div className="download-total" aria-live="polite">
            <span className="download-total-icon">
              <Download aria-hidden="true" />
            </span>
            <span className="download-total-copy">
              <strong>
                {data
                  ? formatDownloads(data.totalDownloads)
                  : error
                    ? "—"
                    : "…"}
              </strong>
              <span>Total downloads</span>
              <small>
                {data
                  ? `Across ${data.releasesCount} ${
                      data.releasesCount === 1 ? "release" : "releases"
                    }`
                  : error
                    ? "From GitHub Releases"
                    : "Updating from GitHub"}
              </small>
            </span>
          </div>
        </div>

        <div className="download-release-bar">
          <div className="download-release-info">
            <Badge variant="secondary">Latest stable</Badge>
            <span>
              {data
                ? `${data.release} · ${data.releasesCount} published ${
                    data.releasesCount === 1 ? "release" : "releases"
                  }`
                : error
                  ? "Release details are unavailable"
                  : "Checking for the latest release…"}
            </span>
          </div>
          <a
            className="download-release-link"
            href={
              data?.releasesUrl ??
              "https://github.com/tl2a/airecho-desktop/releases"
            }
            rel="noreferrer"
            target="_blank"
          >
            View all releases
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        <div className="download-grid">
          <PlatformCard
            description="AppImage"
            downloads={linuxDownloads}
            logo="/assets/platforms/linux.png"
            release={data?.release}
            requirement={{ label: "Requires croc", href: "#setup-desktop" }}
            loading={!data && !error}
            error={error}
            title="Linux"
          />
          <PlatformCard
            description="DMG installer"
            downloads={macDownloads}
            logo="/assets/platforms/macos.png"
            release={data?.release}
            requirement={{ label: "Requires croc", href: "#setup-desktop" }}
            loading={!data && !error}
            error={error}
            title="macOS"
          />
          <PlatformCard
            description="APK · Tested on Android 10+"
            downloads={androidDownloads}
            logo="/assets/platforms/android.png"
            release={getMobileAppVersion(android?.name)}
            releaseFallback={
              android ? "Version is listed in the APK filename" : undefined
            }
            releaseLabel="App version"
            loading={!data && !error}
            error={error}
            title="Android"
          />
          <PlatformCard
            description="Unsigned IPA"
            downloads={iosDownloads}
            logo="/assets/platforms/ios.png"
            release={getMobileAppVersion(ios?.name)}
            releaseFallback={
              ios ? "Version is listed in the IPA filename" : undefined
            }
            releaseLabel="App version"
            requirement={{
              label: "Requires sideloading",
              href: "#setup-ios",
            }}
            loading={!data && !error}
            error={error}
            title="iOS"
          />
        </div>

        <div className="download-setup">
          <p className="download-coming-label">Before you install</p>
          <InstallGuide />
        </div>

        <div className="download-coming">
          <p className="download-coming-label">On the way</p>
          <div className="download-coming-grid">
            <ComingSoonCard
              description="Desktop"
              logo="/assets/platforms/windows.png"
              title="Windows"
            />
            <ComingSoonCard
              badge="Planned"
              description="Official listings, no sideloading or APK needed"
              icon={Store}
              title="App Store & Google Play"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
