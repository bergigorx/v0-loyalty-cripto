"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function BusinessLoginPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Logo />
            <nav className="hidden md:flex gap-6">
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Início
              </Link>
              <Link
                href="/marketplace"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Marketplace
              </Link>
              <Link href="/business/login" className="flex items-center text-sm font-medium text-foreground">
                Para Empresas
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-12">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Área de Empresas</CardTitle>
              <CardDescription>Esta funcionalidade foi temporariamente desativada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Aviso
                </h3>
                <p className="text-sm text-muted-foreground">
                  O acesso à área de empresas está temporariamente indisponível. Por favor, entre em contato com o
                  suporte para mais informações.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                Voltar para a página inicial
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="w-full border-t bg-background">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Logo size="sm" />
            <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
              &copy; {new Date().getFullYear()} Loyalty Cripto. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
