"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Logo } from "@/components/logo"

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = "Carregando..." }: LoadingScreenProps) {
  const [showDelayedMessage, setShowDelayedMessage] = useState(false)

  // Mostrar mensagem adicional se o carregamento demorar muito
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDelayedMessage(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Logo size="lg" />
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-lg font-medium">{message}</p>
        </div>

        {showDelayedMessage && (
          <p className="text-sm text-muted-foreground max-w-xs text-center mt-4">
            Isso está demorando mais do que o esperado. Por favor, verifique sua conexão com a internet.
          </p>
        )}
      </div>
    </div>
  )
}
