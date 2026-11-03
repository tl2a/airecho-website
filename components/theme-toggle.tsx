"use client"

import { SunMoon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      aria-label="Toggle color theme"
      title="Toggle light and dark theme"
      onClick={toggleTheme}
    >
      <SunMoon aria-hidden="true" />
    </Button>
  )
}
