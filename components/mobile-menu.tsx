"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface MobileMenuProps {
  activeRoute?: string
  onSignOut?: () => Promise<void>
}

export function MobileMenu({ activeRoute, onSignOut }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

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
      <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menu">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm pt-16">
          <div className="container flex flex-col gap-6 p-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`text-lg font-medium ${
                  activeRoute === "home" ? "text-foreground" : "text-muted-foreground"
                } hover:text-foreground transition-colors`}
                onClick={closeMenu}
              >
                Início
              </Link>
              <Link
                href="/marketplace"
                className={`text-lg font-medium ${
                  activeRoute === "marketplace" ? "text-foreground" : "text-muted-foreground"
                } hover:text-foreground transition-colors`}
                onClick={closeMenu}
              >
                Marketplace
              </Link>
              <Link
                href="/buy-tokens"
                className={`text-lg font-medium ${
                  activeRoute === "buy-tokens" ? "text-foreground" : "text-muted-foreground"
                } hover:text-foreground transition-colors`}
                onClick={closeMenu}
              >
                Comprar LOYA
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className={`text-lg font-medium ${
                    activeRoute === "dashboard" ? "text-foreground" : "text-muted-foreground"
                  } hover:text-foreground transition-colors`}
                  onClick={closeMenu}
                >
                  Minha Conta
                </Link>
              )}
              <Link
                href="/business/metrics"
                className={`text-lg font-medium ${
                  activeRoute === "business" ? "text-foreground" : "text-muted-foreground"
                } hover:text-foreground transition-colors`}
                onClick={closeMenu}
              >
                Para Empresas
              </Link>
            </nav>

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
