import Image from "next/image"
import Link from "next/link"
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  CloudOff,
  FileImage,
  FileText,
  FolderOpen,
  Laptop,
  Network,
  Smartphone,
  Wifi,
  Zap,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ClipboardClip } from "@/components/clipboard-clip"
import { DownloadSection } from "@/components/download-section"
import { HeroNotification } from "@/components/hero-notification"
import { ShowcasePlayer, type ShowcaseDemo } from "@/components/showcase-player"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const sourceUrl = "https://github.com/tl2a/airecho-desktop"

const features = [
  {
    visual: "clipboard",
    title: "Your clipboard, in sync",
    description:
      "Copy text on one device and pick it up on another. No message‑to‑yourself ritual required.",
    link: { label: "See it in action", href: "#clipboard" },
  },
  {
    visual: "files",
    title: "Files without the detour",
    description:
      "Send from your desktop or share from Android. Received files go straight to an AirEcho folder.",
  },
  {
    visual: "local",
    title: "Local by default",
    description:
      "On the same network, transfers use local mode. No account, AirEcho cloud storage, or cable.",
  },
] as const

// Small HTML illustrations for the feature cards; decorative only.
function FeatureVisual({
  visual,
}: {
  visual: (typeof features)[number]["visual"]
}) {
  if (visual === "clipboard") {
    return (
      <div className="feature-visual fv-clipboard" aria-hidden="true">
        <span className="fv-row">
          <Laptop />
          <span className="fv-label">Copied</span>
          <span className="fv-text">“See you at 6?”</span>
        </span>
        <span className="fv-link" />
        <span className="fv-row fv-row-done">
          <Smartphone />
          <span className="fv-label">Ready to paste</span>
          <Check className="fv-check" />
        </span>
      </div>
    )
  }

  if (visual === "files") {
    return (
      <div className="feature-visual fv-files" aria-hidden="true">
        <span className="fv-window">
          <span className="fv-window-bar">
            <FolderOpen />
            AirEcho
          </span>
          <span className="fv-file">
            <FileImage />
            photo.jpg
            <Check className="fv-check" />
          </span>
          <span className="fv-file">
            <FileText />
            notes.pdf
            <Check className="fv-check" />
          </span>
        </span>
      </div>
    )
  }

  return (
    <div className="feature-visual fv-local" aria-hidden="true">
      <span className="fv-path">
        <span className="fv-node">
          <Laptop />
        </span>
        <span className="fv-wire">
          <Wifi />
        </span>
        <span className="fv-node">
          <Smartphone />
        </span>
      </span>
      <span className="fv-nocloud">
        <CloudOff />
        No cloud
      </span>
    </div>
  )
}

const steps = [
  {
    number: "01",
    title: "Join the same network",
    description:
      "Connect your devices to the same Wi‑Fi. AirEcho uses local network mode by default.",
    icon: Wifi,
    details: ["Same Wi‑Fi", "Local mode"],
  },
  {
    number: "02",
    title: "Copy or share",
    description:
      "Copy text, send a file from your desktop, or choose AirEcho from Android’s share menu.",
    icon: Zap,
    details: ["Copy text", "Send a file", "Share menu"],
  },
  {
    number: "03",
    title: "Pick it up on the other device",
    description:
      "Text arrives on the clipboard. Files are saved in a dedicated AirEcho folder.",
    icon: ArrowDownToLine,
    details: ["Clipboard", "~/Downloads/AirEcho"],
  },
]

const clipboardSteps = [
  "Copy text on one device.",
  "AirEcho sends it over your Wi‑Fi.",
  "Paste on the other. It’s already on the clipboard.",
]

const supportedPlatforms = [
  { name: "Linux", logo: "/assets/platforms/linux.png" },
  { name: "macOS", logo: "/assets/platforms/macos.png" },
  { name: "Android", logo: "/assets/platforms/android.png" },
  { name: "iOS", logo: "/assets/platforms/ios.png" },
]

const platformCards = [
  {
    icon: Laptop,
    title: "Desktop",
    description: "Linux & macOS",
    items: [
      "Clipboard sync across devices",
      "Send files from your desktop",
      "Quiet tray menu and notifications",
    ],
  },
  {
    icon: Smartphone,
    title: "Android",
    description: "Android 10 and newer",
    items: [
      "Quick Settings tile to receive",
      "Share menu to send text and files",
      "Keeps listening in the background",
    ],
  },
]

const showcaseDemos: ShowcaseDemo[] = [
  {
    label: "MIUI · QUICK SETTINGS",
    title: "Keep AirEcho one swipe away",
    description:
      "Enable the AirEcho tile in Quick Settings to start receiving in the background.",
    video: "/assets/clips/demo-1.mp4",
    poster: "/assets/showcase/miui-quick-settings.webp",
    alt: "MIUI Quick Settings with AirEcho enabled and waiting to receive",
    screenRatio: 2,
  },
  {
    label: "MIUI · SHARE MENU",
    title: "Share from the screen you’re on",
    description:
      "Select text, choose AirEcho from the Android menu, and send it to your other device.",
    video: "/assets/clips/demo-2.mp4",
    poster: "/assets/showcase/miui-share-menu.webp",
    alt: "MIUI share menu showing AirEcho as an option for selected text",
    screenRatio: 2,
  },
  {
    label: "SAMSUNG ONE UI · QUICK SETTINGS",
    title: "Add AirEcho to your tiles",
    description:
      "Place AirEcho in Quick Settings once, then turn receiving on whenever you need it.",
    video: "/assets/clips/demo-3.mp4",
    poster: "/assets/showcase/samsung-quick-settings.webp",
    alt: "Samsung One UI Quick Settings editor with AirEcho available as a tile",
    screenRatio: 39 / 18,
  },
  {
    label: "SAMSUNG ONE UI · RECEIVING",
    title: "Know when AirEcho is ready",
    description:
      "AirEcho stays ready in the background and shows a notification while it listens for transfers.",
    video: "/assets/clips/demo-4.mp4",
    poster: "/assets/showcase/samsung-receiving.webp",
    alt: "Samsung One UI notification showing AirEcho waiting for files over Wi-Fi",
    screenRatio: 39 / 18,
  },
]

export default function Page() {
  return (
    <>
      <header className="site-header">
        <div className="header-content container">
          <Link className="brand" href="/" aria-label="AirEcho home">
            <Image
              src="/assets/logo.svg"
              alt=""
              width={40}
              height={40}
              priority
            />
            <span>AirEcho</span>
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="#features">Why AirEcho</Link>
            <Link href="#how-it-works">How it works</Link>
            <Link href="#in-action">In action</Link>
            <Link href="#downloads">Downloads</Link>
            <Link href="#platforms">Platforms</Link>
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <a
              className={buttonVariants({ variant: "default", size: "sm" })}
              href="#downloads"
            >
              Downloads
              <ArrowDownToLine data-icon="inline-end" />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-grid container">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-mark" aria-hidden="true" />A little
                closer, device to device
              </div>
              <h1>
                Copy here.
                <br />
                <span>Paste there.</span>
              </h1>
              <p className="hero-description">
                Text and files move between your devices over the same Wi‑Fi. No
                account, no cloud storage, no cable.
              </p>

              <div className="hero-actions">
                <a
                  className={buttonVariants({ variant: "default", size: "lg" })}
                  href="#downloads"
                >
                  Choose your download
                  <ArrowRight data-icon="inline-end" />
                </a>
                <Link
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                  href="#how-it-works"
                >
                  See how it works
                </Link>
              </div>

              <div className="hero-proof" aria-label="AirEcho benefits">
                <span>
                  <Check aria-hidden="true" />
                  No sign-up
                </span>
                <span>
                  <Check aria-hidden="true" />
                  Local by default
                </span>
                <span>
                  <Check aria-hidden="true" />
                  Open source
                </span>
              </div>
            </div>

            <div className="hero-visual" aria-label="AirEcho product preview">
              <div className="visual-echo" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className="desktop-window">
                <div className="window-bar">
                  <div className="window-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="window-title">AirEcho</span>
                  <span className="connection-status">
                    <span aria-hidden="true" />
                    On
                  </span>
                </div>
                <Image
                  className="desktop-screenshot"
                  src="/assets/app.png"
                  alt="AirEcho desktop app showing that receiving is on"
                  width={690}
                  height={610}
                  priority
                />
              </div>

              <div className="network-float">
                <span className="network-icon">
                  <Network aria-hidden="true" />
                </span>
                <span>
                  <strong>Same network</strong>
                  <small>Ready when you are</small>
                </span>
                <span className="network-check" aria-hidden="true">
                  <Check />
                </span>
              </div>

              <HeroNotification />

              <div className="visual-caption">
                <span className="caption-device">
                  <Laptop aria-hidden="true" />
                  Desktop
                </span>
                <span className="caption-line" aria-hidden="true" />
                <span className="caption-device">
                  <Smartphone aria-hidden="true" />
                  Android
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="promise-strip"
          aria-label="How AirEcho keeps things simple"
        >
          <div className="promise-content container">
            <p>Made for the devices you already use.</p>
            <ul className="promise-items">
              {supportedPlatforms.map(({ name, logo }) => (
                <li key={name}>
                  <Image
                    className="promise-logo"
                    src={logo}
                    alt=""
                    width={72}
                    height={72}
                  />
                  {name}
                </li>
              ))}
              <li className="promise-soon">Windows soon</li>
            </ul>
          </div>
        </section>

        <section className="content-section features-section" id="features">
          <div className="container">
            <div className="section-heading">
              <p className="section-kicker">Less forwarding. More flow.</p>
              <h2>The little things should just move.</h2>
              <p>
                AirEcho takes the friction out of moving something from one
                screen to the next.
              </p>
            </div>

            <div className="feature-grid">
              {features.map((feature) => (
                <Card className="feature-card" key={feature.title}>
                  <FeatureVisual visual={feature.visual} />
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                    {"link" in feature && (
                      <Link className="feature-link" href={feature.link.href}>
                        {feature.link.label}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="clipboard-section" id="clipboard">
          <div className="clipboard-panel container">
            <div className="clipboard-copy">
              <p className="section-kicker">Clipboard sync</p>
              <h2>Copied there. Ready here.</h2>
              <p>
                When text arrives, AirEcho puts it straight on your clipboard.
                No app to open, nothing to tap. Just paste.
              </p>

              <ol className="clipboard-steps">
                {clipboardSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>

              <figure className="mac-tile">
                <Image
                  src="/assets/screenshots/text-received-notification.png"
                  alt="macOS notification from AirEcho: Text Received, received text copied to clipboard"
                  width={749}
                  height={158}
                />
                <figcaption>Works both ways, here landing on a Mac.</figcaption>
              </figure>
            </div>

            <ClipboardClip />
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-layout container">
            <div className="how-intro">
              <p className="section-kicker">Three steps. That&apos;s it.</p>
              <h2>A shorter route between your screens.</h2>
              <p>
                AirEcho runs quietly in the background, ready for the moment you
                need to move something.
              </p>
              <Link className="text-link" href="#downloads">
                Find your version
                <ArrowRight aria-hidden="true" />
              </Link>

              <figure className="tray-preview">
                <Image
                  src="/assets/screenshots/tray-menu.png"
                  alt="AirEcho tray menu with options to disable AirEcho, open settings, or quit"
                  width={430}
                  height={270}
                />
                <figcaption>Lives in your system tray</figcaption>
              </figure>
            </div>

            <div className="steps-list">
              {steps.map(
                ({ number, title, description, icon: Icon, details }) => (
                  <article className="step-item" key={number}>
                    <div className="step-icon">
                      <Icon aria-hidden="true" />
                    </div>
                    <div className="step-copy">
                      <span className="step-number">{number}</span>
                      <h3>{title}</h3>
                      <p>{description}</p>
                      <ul className="step-details">
                        {details.map((detail) => (
                          <li
                            key={detail}
                            className={
                              detail.startsWith("~/") ? "step-path" : undefined
                            }
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                )
              )}
            </div>
          </div>
        </section>

        <section className="showcase-section" id="in-action">
          <div className="container">
            <div className="section-heading">
              <p className="section-kicker">The real app, on your phone</p>
              <h2>MIUI and Samsung One UI, in action.</h2>
              <p>
                Watch how AirEcho fits into Quick Settings and the share menu on
                both Android interfaces.
              </p>
            </div>

            <ShowcasePlayer demos={showcaseDemos} />
          </div>
        </section>

        <DownloadSection />

        <section className="platform-section" id="platforms">
          <div className="platform-panel container">
            <div className="platform-copy">
              <p className="section-kicker">Your devices, together</p>
              <h2>A familiar fit on every screen.</h2>
              <p>
                AirEcho is available on Linux and macOS desktop, plus Android
                and iOS. Keep it in your system tray or Android Quick Settings
                and get on with your day.
              </p>
              <a
                className="platform-link"
                href={sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Explore AirEcho on GitHub
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>

            <div className="platform-cards">
              {platformCards.map(
                ({ icon: Icon, title, description, items }) => (
                  <Card className="platform-card" key={title}>
                    <CardHeader>
                      <span className="platform-icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <CardTitle>{title}</CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="platform-list">
                        {items.map((item) => (
                          <li key={item}>
                            <Check aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </section>

        <section className="closing-section">
          <div className="closing-panel container">
            <div className="closing-mark" aria-hidden="true">
              <Image src="/assets/logo.svg" alt="" width={48} height={48} />
            </div>
            <p className="section-kicker">Keep your own things close</p>
            <h2>Make your devices feel like one.</h2>
            <p>
              Start with the same Wi-Fi. Let AirEcho take care of the handoff.
            </p>
            <div className="closing-actions">
              <a
                className={buttonVariants({ variant: "secondary", size: "lg" })}
                href="#downloads"
              >
                Choose your download
                <ArrowDownToLine data-icon="inline-end" />
              </a>
              <a
                className="closing-link"
                href={sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                View source on GitHub
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-content container">
          <Link
            className="brand footer-brand"
            href="/"
            aria-label="AirEcho home"
          >
            <Image src="/assets/logo.svg" alt="" width={32} height={32} />
            <span>AirEcho</span>
          </Link>
          <p>Small transfers. No extra accounts.</p>
          <Separator className="footer-separator" />
          <a href={`${sourceUrl}/releases`} target="_blank" rel="noreferrer">
            Releases
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={sourceUrl} target="_blank" rel="noreferrer">
            Open source
            <ArrowUpRight aria-hidden="true" />
          </a>
          <span className="copyright">
            © {new Date().getFullYear()} AirEcho
          </span>
        </div>
      </footer>
    </>
  )
}
