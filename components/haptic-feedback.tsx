"use client"

import type React from "react"

interface HapticFeedbackProps {
  children: React.ReactNode
  type?: "success" | "error" | "warning" | "light"
}

export function HapticFeedback({ children, type = "light" }: HapticFeedbackProps) {
  const triggerHapticFeedback = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      switch (type) {
        case "success":
          navigator.vibrate([15, 50, 15])
          break
        case "error":
          navigator.vibrate([100, 30, 100, 30, 100])
          break
        case "warning":
          navigator.vibrate([30, 20, 30])
          break
        case "light":
        default:
          navigator.vibrate(15)
          break
      }
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    // Não interferir com o comportamento padrão do elemento filho
    triggerHapticFeedback()
  }

  return <div onClick={handleClick}>{children}</div>
}
