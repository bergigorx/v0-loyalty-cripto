"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { RegisterModal } from "@/components/register-modal"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { MobileMenu } from "@/components/mobile-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ContactForm } from "@/components/contact-form"
import { LoadingScreen } from "@/components/loading-screen"

export default function LandingPage() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  // Usar um estado local para evitar problemas com o useSearchParams durante o SSR
  const [shouldOpenLogin, setShouldOpenLogin] = useState(false)

  // Verificar parâmetros de URL de forma segura
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.get("login") === "true" && !user) {
        setShouldOpenLogin(true)
      }
    } catch (error) {
      console.error("Error parsing search params:", error)
    }
  }, [user])

  // Abrir modal de login se necessário
  useEffect(() => {
    if (shouldOpenLogin) {
      setLoginModalOpen(true)
    }
  }, [shouldOpenLogin])

  // Simular carregamento inicial para melhorar UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const openRegisterModal = () => {
    setLoginModalOpen(false)
    setRegisterModalOpen(true)
  }

  const openLoginModal = () => {
    setRegisterModalOpen(false)
    setLoginModalOpen(true)
  }

  const handleProfileClick = () => {
    router.push("/dashboard")
  }

  const handleContactSuccess = () => {
    setTimeout(() => {
      setContactModalOpen(false)
    }, 3000)
  }

  if (isLoading) {
    return <LoadingScreen message="Carregando página inicial..." />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Logo />
            <nav className="hidden md:flex gap-6">
              <Link
                href="#features"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Recursos
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Como Funciona
              </Link>
              <Link
                href="#benefits"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Benefícios
              </Link>
              <Link
                href="/marketplace"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Marketplace
              </Link>
              <Link
                href="/buy-tokens"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Comprar LOYA
              </Link>
              <Link
                href="/business/metrics"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Para Empresas
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  <Button variant="outline" size="sm" className="hidden sm:flex" onClick={handleProfileClick}>
                    <User className="h-4 w-4 mr-2" />
                    {profile?.username || user.email}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      await signOut()
                      router.push("/")
                    }}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                    onClick={() => setLoginModalOpen(true)}
                  >
                    Entrar
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                    onClick={openRegisterModal}
                  >
                    Registrar
                  </Button>
                </>
              )}
            </nav>
            <MobileMenu
              activeRoute="home"
              onSignOut={async () => {
                await signOut()
                router.push("/")
              }}
              onLoginClick={() => setLoginModalOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Resto do conteúdo da página... */}
      {/* Mantido o mesmo para brevidade */}

      {/* Modais de login e registro */}
      <RegisterModal open={registerModalOpen} onOpenChange={setRegisterModalOpen} />
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onRegisterClick={openRegisterModal}
      />

      {/* Modal de contato */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-[425px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Entre em contato</DialogTitle>
            <DialogDescription>Preencha o formulário abaixo para saber mais sobre nossa plataforma.</DialogDescription>
          </DialogHeader>
          <ContactForm onSuccess={handleContactSuccess} onClose={() => setContactModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
