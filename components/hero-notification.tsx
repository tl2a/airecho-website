"use client"

import Image from "next/image"
import { useEffect, useState, type ReactNode } from "react"
import { ClipboardCheck, FileImage, FileText, X } from "lucide-react"

interface Notice {
  title: string
  body: ReactNode
  label: string
  chips: { icon: typeof FileText; text: string }[]
}

// Same shape for both, so the card keeps its size as they alternate.
const notices: Notice[] = [
  {
    title: "Text Received",
    body: "Received text copied to clipboard",
    label: "AirEcho notification: text received and copied to the clipboard",
    chips: [{ icon: ClipboardCheck, text: "“See you at 6?”" }],
  },
  {
    title: "Files Received",
    body: (
      <>
        2 items saved to <code>~/Downloads/AirEcho</code>
      </>
    ),
    label:
      "AirEcho notification: files received, 2 items saved to the Downloads/AirEcho folder",
    chips: [
      { icon: FileImage, text: "photo.jpg" },
      { icon: FileText, text: "notes.pdf" },
    ],
  },
]

const SWITCH_MS = 4500

export function HeroNotification() {
  const [index, setIndex] = useState(0)
  const notice = notices[index]

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % notices.length),
      SWITCH_MS
    )
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="transfer-float" role="img" aria-label={notice.label}>
      <div className="toast-head" aria-hidden="true">
        <Image src="/assets/logo.svg" alt="" width={16} height={16} />
        <span className="toast-app">AirEcho</span>
        <span className="toast-time">Just now</span>
        <span className="toast-close">
          <X />
        </span>
      </div>
      <div className="toast-content" key={notice.title} aria-hidden="true">
        <p className="toast-title">{notice.title}</p>
        <p className="toast-body">{notice.body}</p>
        <div className="toast-files">
          {notice.chips.map(({ icon: Icon, text }) => (
            <span key={text}>
              <Icon />
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
