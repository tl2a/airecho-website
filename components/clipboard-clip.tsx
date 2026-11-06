"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"

export function ClipboardClip() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)
  // null until the visitor chooses; autoplay then follows reduced motion.
  const [wantsPlay, setWantsPlay] = useState<boolean | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 }
    )
    observer.observe(video)
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
  }, [inView, wantsPlay])

  return (
    <figure className="clipboard-clip">
      <div className="clipboard-clip-media">
        <video
          ref={videoRef}
          aria-label="An Android phone receives text from AirEcho: the keyboard's clipboard suggestion changes to the new text with a Copied message, then the Text received notification appears"
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/showcase/clipboard-sync.jpg"
          onClick={() => setWantsPlay(!isPlaying)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="/assets/clips/clipboard-sync.mp4" type="video/mp4" />
        </video>

        <span className="clipboard-clip-badge">
          <span aria-hidden="true" />
          Real recording
        </span>

        <button
          className="clipboard-clip-toggle"
          type="button"
          onClick={() => setWantsPlay(!isPlaying)}
          aria-label={isPlaying ? "Pause recording" : "Play recording"}
        >
          {isPlaying ? (
            <Pause aria-hidden="true" />
          ) : (
            <Play aria-hidden="true" />
          )}
        </button>
      </div>

      <figcaption>
        Text arrives on Android and is already on the keyboard&apos;s clipboard.
      </figcaption>
    </figure>
  )
}
