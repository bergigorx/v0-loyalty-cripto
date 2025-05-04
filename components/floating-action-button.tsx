"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Coins, Gift } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface FloatingActionButtonProps {
  action: "balance" | "reward"
  balance?: number
  onClick?: () => void
}

export function FloatingActionButton({ action, balance, onClick }: FloatingActionButtonProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { profile } = useAuth()

  // Usar o saldo do perfil se não for fornecido como prop
  const displayBalance = balance !== undefined ? balance : profile?.loya_balance || 0

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Esconder quando rolar para baixo, mostrar quando rolar para cima
      if (currentScrollY > lastScrollY) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  return (
    <div
      className={`fixed bottom-6 right-4 z-40 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-24"
      }`}
    >
      <Button
        onClick={onClick}
        className="rounded-full h-14 px-4 shadow-lg bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
      >
        {action === "balance" ? (
          <>
            <Coins className="h-5 w-5 mr-2" />
            <span className="font-medium">{displayBalance} LOYA</span>
          </>
        ) : (
          <>
            <Gift className="h-5 w-5 mr-2" />
            <span className="font-medium">Recompensa</span>
          </>
        )}
      </Button>
    </div>
  )
}
