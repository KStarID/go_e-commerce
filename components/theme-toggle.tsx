"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="fixed bottom-5 right-5 z-50 rounded-full w-11 h-11 p-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur border-slate-200 dark:border-slate-700"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" />
      )}
    </Button>
  )
}
