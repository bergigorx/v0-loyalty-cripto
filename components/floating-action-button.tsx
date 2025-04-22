"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Coins, Gift, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

interface FloatingActionButtonProps {
  action: "reward" | "shop" | "balance"
  onClick?: () => void
  balance?: number
  className?: string
}

export function FloatingActionButton({ action, onClick, balance, className }: FloatingActionButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
      return
    }

    // Ações padrão
    switch (action) {
      case "shop":
        router.push("/marketplace")
        break
      case "balance":
        router.push("/dashboard")
        break
      default:
        break
    }
  }

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-full shadow-lg md:hidden",
        action === "reward" && "bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600",
        action === "shop" && "bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700",
        action === "balance" && "bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600",
        className,
      )}
      size="lg"
    >
      {action === "reward" && <Gift className="h-5 w-5" />}
      {action === "shop" && <ShoppingBag className="h-5 w-5" />}
      {action === "balance" && (
        <div className="flex items-center">
          <Coins className="h-5 w-5 mr-2" />
          <span>{balance || 0}</span>
        </div>
      )}
    </Button>
  )
}
