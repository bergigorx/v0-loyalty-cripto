"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Home, ShoppingBag, Coins, Store } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"

interface MobileMenuProps {
  activeRoute?: string
  onSignOut?: () => Promise<void>
}

export function MobileMenu({ activeRoute, onSignOut }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, profile } = useAuth()
  const { walletAddress, walletProvider } = useWeb3()
  const router = useRouter()

  // Prevenir scroll quando o menu está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleSignOut = async () => {
    if (onSignOut) {
      await onSignOut()
    }
    closeMenu()
  }

  const handleProfileClick = () => {
    router.push("/dashboard")
    closeMenu()
  }

  const handleLoginClick = () => {
    router.push("/?login=true")
    closeMenu()
  }

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menu" className="focus:outline-none">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background shadow-lg">
          <div className="container flex flex-col gap-6 p-4 pt-16 touch-none">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`flex items-center text-lg font-medium ${
                  activeRoute === "home" ? "text-foreground" : "text-muted-foreground"
                } hover:text-foreground transition-colors`}
                onClick={closeMenu}
              >
                <Home className="h-5 w-5 mr-3" />
                Início
              </Link>
              <Link
                href="/marketplace"
                className={`flex items-center text-lg font-medium ${
                  activeRoute === "marketplace" ? "text-foreground" : "text-muted-foreground"
                } hover:text-foreground transition-colors`}
                onClick={closeMenu}
              >
                <ShoppingBag className="h-5 w-5 mr-3" />
                Marketplace
              </Link>
              <Link
                href="/buy-tokens"
                className={`flex items-center text-lg font-medium ${
                  activeRoute === "buy-tokens" ? "text-foreground" : "text-muted-foreground"
                } hover:text-foreground transition-colors`}
                onClick={closeMenu}
              >
                <Coins className="h-5 w-5 mr-3" />
                Comprar LOYA
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className={`flex items-center text-lg font-medium ${
                    activeRoute === "dashboard" ? "text-foreground" : "text-muted-foreground"
                  } hover:text-foreground transition-colors`}
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5 mr-3" />
                  Minha Conta
                </Link>
              )}
              <Link
                href="/business/metrics"
                className={`flex items-center text-lg font-medium ${
                  activeRoute === "business" ? "text-foreground" : "text-muted-foreground"
                } hover:text-foreground transition-colors`}
                onClick={closeMenu}
              >
                <Store className="h-5 w-5 mr-3" />
                Para Empresas
              </Link>
            </nav>

            {profile && (
              <div className="flex items-center justify-center bg-purple-100 dark:bg-purple-900/20 px-4 py-3 rounded-lg my-2">
                <Coins className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-base font-medium">{profile.loya_balance || 0} LOYA</span>
              </div>
            )}

            {walletAddress && (
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">Carteira Conectada:</p>
                <p className="text-muted-foreground break-all">
                  {walletProvider}: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-2">
              {user ? (
                <>
                  <Button className="w-full" onClick={handleProfileClick}>
                    <User className="h-4 w-4 mr-2" />
                    Minha Conta
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <Button className="w-full" onClick={handleLoginClick}>
                  <User className="h-4 w-4 mr-2" />
                  Entrar / Registrar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
