"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Pause, Play } from "lucide-react"

export interface ShowcaseDemo {
  label: string
  title: string
  description: string
  video: string
  poster: string
  alt: string
  /** Screen height divided by width, matching the recording. */
  screenRatio: number
}

export function ShowcasePlayer({ demos }: { demos: ShowcaseDemo[] }) {
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  // null until the visitor chooses; autoplay then follows reduced motion.
  const [wantsPlay, setWantsPlay] = useState<boolean | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const demo = demos[active]

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    )
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const autoplay =
      wantsPlay ??
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (inView && autoplay) {
      video.play().catch(() => setIsPlaying(false))
    } else {
      video.pause()
    }
  }, [active, inView, wantsPlay])

  function select(index: number) {
    setActive(index)
    setProgress(0)
    setWantsPlay(true)
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const offsets: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    }
    const offset = offsets[event.key]
    if (offset === undefined) return

    event.preventDefault()
    const next = (active + offset + demos.length) % demos.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="showcase-player">
      <div
        className="showcase-tabs"
        role="tablist"
        aria-label="AirEcho Android demos"
        aria-orientation="vertical"
      >
        {demos.map((item, index) => {
          const selected = index === active

          return (
            <button
              key={item.video}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              className="showcase-tab"
              type="button"
              role="tab"
              id={`showcase-tab-${index}`}
              aria-selected={selected}
              aria-controls="showcase-stage"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={handleTabKeyDown}
            >
              <span className="showcase-label">{item.label}</span>
              <span className="showcase-tab-title">{item.title}</span>
              <span className="showcase-tab-description">
                {item.description}
              </span>
              <span className="showcase-tab-progress" aria-hidden="true">
                <span
                  style={{ transform: `scaleX(${selected ? progress : 0})` }}
                />
              </span>
            </button>
          )
        })}
      </div>

      <div
        ref={stageRef}
        className="showcase-stage"
        id="showcase-stage"
        role="tabpanel"
        aria-labelledby={`showcase-tab-${active}`}
      >
        <div
          className="phone-frame"
          style={{ "--screen-ratio": demo.screenRatio } as React.CSSProperties}
        >
          <span
            className="phone-button phone-button-power"
            aria-hidden="true"
          />
          <span
            className="phone-button phone-button-volume"
            aria-hidden="true"
          />
          <div className="phone-screen">
            <video
              key={demo.video}
              ref={videoRef}
              className="phone-video"
              aria-label={demo.alt}
              muted
              playsInline
              preload="metadata"
              poster={demo.poster}
              onClick={() => setWantsPlay(!isPlaying)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={(event) => {
                const { currentTime, duration } = event.currentTarget
                if (duration) setProgress(currentTime / duration)
              }}
              onEnded={() => select((active + 1) % demos.length)}
            >
              <source src={demo.video} type="video/mp4" />
            </video>
            <span className="phone-camera" aria-hidden="true" />
          </div>
        </div>

        <button
          className="showcase-toggle"
          type="button"
          onClick={() => setWantsPlay(!isPlaying)}
          aria-label={isPlaying ? "Pause demo" : "Play demo"}
        >
          {isPlaying ? (
            <Pause aria-hidden="true" />
          ) : (
            <Play aria-hidden="true" />
          )}
          <span className="showcase-toggle-text">
            {isPlaying ? "Pause" : "Play"}
          </span>
          <span className="showcase-toggle-count" aria-hidden="true">
            {active + 1} / {demos.length}
          </span>
        </button>
      </div>
    </div>
  )
}
