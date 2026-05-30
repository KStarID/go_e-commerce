"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"

interface Props {
  className?: string
}

export default function ThemeToggle({ className = "" }: Props) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className={`rounded-full w-10 h-10 p-0 text-white hover:bg-white/10 ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-300" />
      ) : (
        <Moon className="w-5 h-5 text-white" />
      )}
    </Button>
  )
}
