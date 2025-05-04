"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function PageLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true)
    }

    const handleComplete = () => {
      setIsLoading(false)
    }

    // Adicionar event listeners para navegação
    window.addEventListener("beforeunload", handleStart)
    window.addEventListener("load", handleComplete)

    return () => {
      window.removeEventListener("beforeunload", handleStart)
      window.removeEventListener("load", handleComplete)
    }
  }, [])

  // Reset loading state quando a rota muda
  useEffect(() => {
    setIsLoading(false)
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-purple-600"></div>
        <p className="mt-4 text-lg font-medium">Carregando...</p>
      </div>
    </div>
  )
}
