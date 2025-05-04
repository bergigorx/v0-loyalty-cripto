"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleRouteChangeStart = () => {
      // Mostrar indicador de carregamento
      document.body.classList.add("loading")
    }

    const handleRouteChangeComplete = () => {
      // Esconder indicador de carregamento
      document.body.classList.remove("loading")
    }

    // Adicionar event listeners para navegação
    window.addEventListener("beforeunload", handleRouteChangeStart)
    window.addEventListener("load", handleRouteChangeComplete)

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart)
      window.removeEventListener("load", handleRouteChangeComplete)
    }
  }, [])

  // Adicionar estilos CSS para o indicador de carregamento
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      body.loading::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(to right, #9333ea, #14b8a6);
        z-index: 9999;
        animation: loading 1s infinite linear;
      }
      
      @keyframes loading {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}
