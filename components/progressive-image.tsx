"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProgressiveImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  placeholderClassName?: string
  priority?: boolean
}

export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className,
  placeholderClassName,
  priority = false,
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Gerar um placeholder de baixa qualidade
  const placeholderSrc = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#f3f4f6"/></svg>`,
  ).toString("base64")}`

  useEffect(() => {
    // Resetar estado quando a src mudar
    setIsLoading(true)
    setError(false)
  }, [src])

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      {/* Placeholder ou fallback em caso de erro */}
      {(isLoading || error) && (
        <div className={cn("absolute inset-0 bg-muted flex items-center justify-center", placeholderClassName)}>
          {error ? <span className="text-xs text-muted-foreground">Erro ao carregar imagem</span> : null}
        </div>
      )}

      {/* Imagem real */}
      <Image
        src={error ? placeholderSrc : src}
        alt={alt}
        width={width}
        height={height}
        className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", className)}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setError(true)
        }}
        priority={priority}
      />
    </div>
  )
}
